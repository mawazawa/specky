#!/bin/bash
# Verify Tech Stack Versions against Verified Stack (2026-01-16)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

check_version() {
  local cmd=$1
  local expected=$2
  local version=$($cmd --version 2>&1 | head -n 1)
  
  if [[ "$version" == *"$expected"* ]]; then
    echo -e "${GREEN}✓ $cmd: $version (Matches $expected)${NC}"
  else
    echo -e "${RED}✗ $cmd: $version (Expected $expected)${NC}"
    # Don't fail hard, just warn for now as environments vary
  fi
}

echo "================================================"
echo "Specky Tech Stack Verification"
echo "Verified Date: 2026-01-16"
echo "================================================"

# Check Node
node_version=$(node -v)
if [[ "$node_version" == v20* ]] || [[ "$node_version" == v22* ]]; then
  echo -e "${GREEN}✓ Node.js: $node_version (Compatible)${NC}"
else
  echo -e "${RED}✗ Node.js: $node_version (Expected v20+ or v22+)${NC}"
fi

# Check Git
check_version "git" "2."

# Check npm packages
echo ""
echo "Checking Package Versions:"
npm list next react tailwindcss typescript --depth=0 || true

echo ""
echo "================================================"
