# DEEPSHAFT Research

> **Research Date**: January 15, 2026
> **Source**: v0-justice-os-ai repository analysis

---

## Overview

**Name**: DEEPSHAFT
**Origin**: v0-justice-os-ai repository
**Purpose**: Micro-iteration with lane-based parallel development
**Key Benefit**: Eliminates git worktrees complexity

## The Problem DEEPSHAFT Solves

Git worktrees (used by AutoClaude) have issues:
- Complex setup and mental overhead
- Disk space multiplication (2-3x)
- Merge conflicts still occur
- Tracking which worktree you're in

## Core Concept

```
SINGLE BRANCH (main)
│
├── Lane A: Feature 1    (owns: src/feature1/**)
├── Lane B: Feature 2    (owns: src/feature2/**)
└── Lane C: Feature 3    (owns: src/feature3/**)

RULE: No lane writes to another lane's files.
```

### Territorial Discipline

Each lane "owns" specific file paths. Violations are blocked:
- Lane A can write to `src/feature1/**`
- Lane A can READ (not write) `src/feature2/**`
- Cross-lane changes require explicit coordination

## Micro-Loop (60-120 seconds)

```
1. Edit Cell (≤300 lines in your lane)
      ↓
2. Hot Reload (Turbopack/Vite)
      ↓
3. Scoped Smoke Test (your lane only)
      ↓
4. Commit (if passes)
      ↓
5. Push (CI runs deeper tests async)
```

## Key Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Max lines per change | 300 | Cognitive limit for review |
| Max files per task | 3 | Reduces merge surface |
| Loop duration | 60-120s | Fast feedback |
| Smoke test scope | Lane only | Speed over breadth |

## CI Tiers

| Tier | When | What | Duration |
|------|------|------|----------|
| 0 | Every push | Lint, secrets, types | 30s |
| 1 | Every push | Smoke tests (all lanes) | 60s |
| 2 | Every push | Build | 90s |
| 3 | Every push | Full E2E | 5min |
| 4 | Nightly | Visual, a11y, perf | 20min |

## Comparison

| Approach | Complexity | Merge Pain | Disk Usage |
|----------|------------|------------|------------|
| Git worktrees | High | Medium | 2-3x |
| Feature branches | Medium | High | 1x |
| **DEEPSHAFT** | **Low** | **None** | **1x** |

## Relevance to Specky

**Adopt for development workflow**:
- Lane A: Spec Engine (`src/lib/spec/**`)
- Lane B: UI Components (`src/components/**`)
- Lane C: AI Integrations (`src/lib/ai/**`)

**Benefits**:
- Fast iteration on focused changes
- No worktree complexity
- Clear ownership boundaries
- Parallel work without merge hell

## Implementation Commands

```bash
# Check for lane overlap violations
npm run deepshaft:check

# Run smoke tests for specific lane
npm run smoke:spec-engine
npm run smoke:ui
npm run smoke:ai

# Claim a lane (for multi-person teams)
npm run deepshaft:claim -- --lane spec-engine --owner "me"
```

## Sources

- v0-justice-os-ai repository analysis
- DEEPSHAFT implementation documentation
- Micro-iteration methodology papers
