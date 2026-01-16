# Specificity Repository Analysis

> **Research Date**: January 15, 2026
> **Source**: Direct repository exploration via Task agent

---

## Overview

**Repository**: Specificity (original broken repo)
**Score**: 7.5/10 - Production ready with caveats
**Purpose**: Multi-agent debate for specification generation

## Architecture

```
specificity/
├── src/
│   ├── components/      # React UI components
│   ├── lib/            # Core logic
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript types
├── tests/              # E2E tests (398 tests)
└── supabase/           # Backend
```

## Tech Stack (As Found)

| Technology | Version | Current Version | Status |
|------------|---------|-----------------|--------|
| Vite | 7.3.0 | 7.x | OK |
| React | 18.3.1 | 19.2.3 | **OUTDATED** |
| TypeScript | 5.8.3 | 5.9 | OK |
| Tailwind | 3.4.17 | 4.1.18 | **OUTDATED** |

## Critical Issues Found

### Issue 1: Credentials Leaked in Git History

**Severity**: CRITICAL
**Details**: Supabase ANON_KEY found in git history
**Impact**: Security vulnerability, key should be rotated
**Recommendation**:
1. Rotate the exposed key immediately
2. Use `.env` files properly
3. Add pre-commit hooks to prevent future leaks

### Issue 2: TypeScript Strict Mode Disabled

**Severity**: MEDIUM
**Details**: `strict: false` in tsconfig.json
**Impact**: Type safety compromised, potential runtime errors
**Recommendation**: Enable strict mode, fix resulting type errors

### Issue 3: Outdated Dependencies

**Severity**: LOW-MEDIUM
**Details**: React 18.x, Tailwind 3.x
**Impact**: Missing features, potential security patches
**Recommendation**: Upgrade to React 19.x, Tailwind 4.x

## Good Patterns to Preserve

| Pattern | Description | Keep? |
|---------|-------------|-------|
| **E2E Test Coverage** | 398 Playwright tests | YES |
| **Component Structure** | Clear separation of concerns | YES |
| **Supabase Integration** | Good use of RLS | YES |
| **Type Definitions** | Comprehensive (when enabled) | YES |

## Patterns to Change

| Pattern | Issue | Specky Approach |
|---------|-------|-----------------|
| 6 Celebrity Personas | No measurable benefit | Role-based challengers |
| Monolithic Spec Gen | Hard to iterate | Phased workflow |
| No Temporal Grounding | Stale versions | Verify with current date |

## Multi-Agent System (Original)

The original Specificity used 8 named personas:
1. Elon Musk (First Principles)
2. Mark Cuban (Business)
3. DHH (Developer)
4. Dieter Rams (Design)
5. Paul Graham (Startup)
6. + 3 others

**Research Finding**: M3MAD-Bench (Jan 2026) shows no measurable benefit from named personas over role-based challengers.

## Specky Improvements

| Specificity | Specky |
|-------------|--------|
| 8 celebrity personas | 4 role-based challengers |
| Always run full debate | Selective triggering (iMAD) |
| No temporal grounding | Date-first verification |
| No MCP awareness | MCP-optimized defaults |

## What to Salvage

1. **E2E test patterns** - Good foundation
2. **Supabase schema** - Review and adapt
3. **UI component structure** - Modernize styling
4. **Type definitions** - Enable strict mode

## What to Discard

1. **Celebrity persona code** - Replace with role-based
2. **Hardcoded versions** - Use temporal verification
3. **Leaked credentials** - Fresh setup required
4. **Non-strict TypeScript** - Enable strict mode

## Sources

- Direct repository analysis via Task agent
- Git history inspection
- Dependency audit
