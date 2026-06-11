#!/usr/bin/env bash
# Bisection script to find which test creates unwanted files/state
# Usage: ./find-polluter.sh <file_or_dir_to_check> <test_pattern>
# Example: ./find-polluter.sh '.git' 'src/**/*.test.ts'

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <file_to_check> <test_pattern>"
  echo "Example: $0 '.git' 'src/**/*.test.ts'"
  exit 1
fi

POLLUTION_CHECK="$1"
TEST_PATTERN="$2"

echo "🔍 Searching for test that creates: $POLLUTION_CHECK"
echo "Test pattern: $TEST_PATTERN"
echo ""

# Get list of test files. Translate common recursive globs such as
# src/**/*.test.ts into find-compatible path patterns, and keep results in an
# array so spaces are safe.
FIND_PATTERN="${TEST_PATTERN#./}"
FIND_PATTERN="${FIND_PATTERN//\*\*\//}"

TEST_FILES=()
while IFS= read -r -d '' TEST_FILE; do
  TEST_FILES+=("$TEST_FILE")
done < <(find . -path "./$FIND_PATTERN" -print0)
TOTAL=${#TEST_FILES[@]}

echo "Found $TOTAL test files"
echo ""

COUNT=0
for TEST_FILE in "${TEST_FILES[@]}"; do
  COUNT=$((COUNT + 1))

  # Skip if pollution already exists
  if [ -e "$POLLUTION_CHECK" ]; then
    echo "⚠️  Pollution already exists before test $COUNT/$TOTAL"
    echo "   Skipping: $TEST_FILE"
    continue
  fi

  echo "[$COUNT/$TOTAL] Testing: $TEST_FILE"

  # Run the test
  npm test "$TEST_FILE" > /dev/null 2>&1 || true

  # Check if pollution appeared
  if [ -e "$POLLUTION_CHECK" ]; then
    echo ""
    echo "🎯 FOUND POLLUTER!"
    echo "   Test: $TEST_FILE"
    echo "   Created: $POLLUTION_CHECK"
    echo ""
    echo "Pollution details:"
    ls -la "$POLLUTION_CHECK"
    echo ""
    echo "To investigate:"
    printf "  npm test %q    # Run just this test\n" "$TEST_FILE"
    printf "  cat %q         # Review test code\n" "$TEST_FILE"
    exit 1
  fi
done

echo ""
echo "✅ No polluter found - all tests clean!"
exit 0
