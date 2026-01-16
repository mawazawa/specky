#!/bin/bash
# PreToolUse Hook for Specky
# Provides targeted reminders for high-risk operations
#
# DESIGN: Only fires for write operations to preserve attention budget
# Per Anthropic context engineering: "Find smallest set of high-signal tokens"

# Colors for output
DIM='\033[2m'
BOLD='\033[1m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"

# Helper function for separator
separator() {
    local width=${1:-50}
    printf '%*s\n' "$width" '' | tr ' ' '─'
}

# Only remind on WRITE operations (high-risk, rule-sensitive)
case "$TOOL_NAME" in
    Write|Edit|MultiEdit|Create|Bash|mcp__supabase__apply_migration)
        separator 50
        echo -e "${BOLD}${CYAN}PRE-WRITE CHECKS:${RESET}"
        echo -e "  ${DIM}•${RESET} File naming: YYYY-MM-DD_name.md for docs/research/plans"
        echo -e "  ${DIM}•${RESET} Run npm run lint:filenames before commit"
        echo -e "  ${DIM}•${RESET} Check Memory MCP for existing solutions"
        separator 50
        ;;
    mcp__exa__web_search_exa|WebSearch)
        # Research tools - remind about date inclusion
        echo -e "${YELLOW}📅 Include '$(date '+%B %Y')' in search query for temporal grounding!${RESET}"
        ;;
    *)
        # Silent for read-only tools (Glob, Grep, Read, WebFetch, etc.)
        ;;
esac

exit 0
