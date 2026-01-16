# Ralph Wiggum Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search

---

## Overview

**Name**: Ralph Wiggum Plugin
**Type**: Official Anthropic Claude Code Plugin
**Purpose**: Autonomous iteration loops until task completion

## What It Does

Ralph Wiggum is a persistent iteration plugin that uses Claude Code's **Stop hook** pattern to automatically re-prompt until a completion promise is met.

## Key Mechanism

```
User Request → Claude executes → Stop hook fires →
Check: Is promise met?
  No  → Re-prompt with context → Continue
  Yes → Exit loop → Report completion
```

## Core Pattern: Stop Hook

The Stop hook intercepts Claude Code's natural completion behavior and evaluates whether the user's original intent has been satisfied. If not, it generates a continuation prompt.

### Implementation Approach

1. **Promise Extraction**: Parse user's original request for success criteria
2. **State Tracking**: Monitor what has been accomplished
3. **Gap Analysis**: Compare current state vs promised state
4. **Continuation Logic**: Generate next action if gap exists

## Relevance to Specky

**Patterns to Adopt**:
- Iterative refinement until specification is complete
- Automatic re-prompting when quality gates not met
- State persistence across iteration loops

**Integration Points**:
- Use for spec refinement loops (keep iterating until all questions answered)
- Apply to validation loops (keep fixing until all tests pass)
- Leverage for research loops (keep searching until all claims verified)

## Sources

- Anthropic Claude Code documentation
- Stop hook pattern implementation guides
- Community implementations on GitHub
