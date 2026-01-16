#!/bin/bash
# SessionStart Hook for Specky
# Runs when a new session begins to provide context

# Colors
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}${CYAN}  🐦 SPECKY - AI Specification Generator${RESET}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "  ${BOLD}Date:${RESET} $(date '+%B %d, %Y')"
echo -e "  ${BOLD}Key Rules:${RESET}"
echo -e "    • File naming: YYYY-MM-DD_descriptive-name.md"
echo -e "    • Temporal grounding: Include current date in searches"
echo -e "    • Tool-aware defaults: Supabase, Vercel, Lefthook"
echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════════${RESET}"
echo ""

exit 0
