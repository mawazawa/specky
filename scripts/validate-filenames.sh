#!/bin/bash
# Filename Validation Script for Specky
# Enforces YYYY-MM-DD_ prefix on docs, research, and plans folders
#
# Usage: ./scripts/validate-filenames.sh [files...]
# If no files provided, checks all .md files in docs/, research/, plans/

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Regex pattern: YYYY-MM-DD_kebab-case-name.md
# Allows optional numeric prefix after date (e.g., 01-, 02-)
DATE_PATTERN='^[0-9]{4}-[0-9]{2}-[0-9]{2}_([0-9]+-)?[a-z0-9]+(-[a-z0-9]+)*\.md$'

# Exempt files (root config files that don't need dates)
EXEMPT_FILES=(
    "CLAUDE.md"
    "AGENTS.md"
    "README.md"
    "CHANGELOG.md"
    "CONTRIBUTING.md"
    "LICENSE.md"
)

errors=0
checked=0

is_exempt() {
    local filename="$1"
    for exempt in "${EXEMPT_FILES[@]}"; do
        if [[ "$filename" == "$exempt" ]]; then
            return 0
        fi
    done
    return 1
}

validate_file() {
    local filepath="$1"
    local filename=$(basename "$filepath")
    local dir=$(dirname "$filepath")

    # Skip if exempt
    if is_exempt "$filename"; then
        return 0
    fi

    # Only validate files in docs/, research/, plans/ folders
    if [[ ! "$dir" =~ ^\.?/?(docs|research|plans) && ! "$dir" =~ (docs|research|plans) ]]; then
        return 0
    fi

    ((checked++))

    if [[ "$filename" =~ $DATE_PATTERN ]]; then
        echo -e "${GREEN}✓${NC} $filepath"
        return 0
    else
        echo -e "${RED}✗${NC} $filepath"
        echo -e "  ${YELLOW}Expected format: YYYY-MM-DD_descriptive-name.md${NC}"
        echo -e "  ${YELLOW}Example: 2026-01-15_my-research-topic.md${NC}"
        ((errors++))
        return 1
    fi
}

echo "================================================"
echo "Specky Filename Convention Validator"
echo "Pattern: YYYY-MM-DD_descriptive-name.md"
echo "================================================"
echo ""

# If files provided as arguments, validate those
if [ $# -gt 0 ]; then
    for file in "$@"; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            validate_file "$file" || true
        fi
    done
else
    # Otherwise, find all .md files in target directories
    for dir in docs research plans; do
        if [ -d "$dir" ]; then
            while IFS= read -r -d '' file; do
                validate_file "$file" || true
            done < <(find "$dir" -name "*.md" -type f -print0 2>/dev/null)
        fi
    done
fi

echo ""
echo "================================================"
echo "Results: $checked files checked, $errors errors"
echo "================================================"

if [ $errors -gt 0 ]; then
    echo -e "${RED}FAILED: $errors file(s) do not follow naming convention${NC}"
    exit 1
else
    echo -e "${GREEN}PASSED: All files follow naming convention${NC}"
    exit 0
fi
