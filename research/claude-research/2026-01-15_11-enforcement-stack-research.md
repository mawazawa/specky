# Filename Enforcement Stack Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search + Droid (Factory AI) cross-validation
> **Status**: Chain-of-Verification COMPLETE

---

## Executive Summary

Initial assumptions about filename enforcement were **invalidated** through rigorous verification:

| Original Assumption | Reality | Status |
|---------------------|---------|--------|
| Claude Code Hooks can block file writes | Broken - deny is ignored | INVALIDATED |
| Biome is best for filename enforcement | No custom regex, false positives | INVALIDATED |
| Husky is the standard for pre-commit | Lefthook is faster | SUPERSEDED |

---

## What Does NOT Work

### Claude Code PreToolUse Hooks

**Verdict**: FUNDAMENTALLY BROKEN for blocking/enforcement

| Issue | Date | Status | Problem |
|-------|------|--------|---------|
| #4362 | Jul 2025 | Closed | `approve: false` ignored |
| #4669 | Jul 2025 | Closed as "not planned" | `permissionDecision: "deny"` ignored |
| #6403 | Aug 2025 | Closed as "not planned" | PostToolUse hooks not executing |
| #15441 | Dec 2025 | Closed as duplicate | pre_tool_use not firing in v2.0.76 |

**Conclusion**: Multiple issues closed as "not planned" indicates Anthropic is not prioritizing hook enforcement fixes. Do NOT rely on Claude Code hooks for any blocking functionality.

### Biome useFilenamingConvention

**Verdict**: DOES NOT SUPPORT date prefix pattern

| Issue | Problem |
|-------|---------|
| #3952 | False positives on number-prefixed files (e.g., `2026-01-15_file.md`) |
| #2754 | Multiple ignore statements collide |
| #3353 | `_404.tsx` incorrectly flagged |

**Root Cause**: Biome only supports predefined case conventions (camelCase, kebab-case, snake_case, PascalCase). No custom regex support means `YYYY-MM-DD_` prefix patterns cannot be enforced.

### Husky

**Verdict**: SLOWER than alternatives

- Sequential execution (no parallelism)
- No caching
- npm prepare script issues (resets hooks on install)
- Benchmarks show Lefthook is 2-3x faster

---

## What DOES Work

### eslint-plugin-validate-filename

**Verdict**: CORRECT CHOICE for custom patterns

**Why it works**:
- Supports custom regex patterns via `patterns` option
- Can enforce `^[0-9]{4}-[0-9]{2}-[0-9]{2}_` prefix
- Actively maintained (v1.2.0 as of Jan 2026)

**Configuration**:
```javascript
'validate-filename/naming-rules': [
  'error',
  {
    rules: [
      {
        target: '**/docs/**',
        patterns: '^[0-9]{4}-[0-9]{2}-[0-9]{2}_[a-z0-9]+(-[a-z0-9]+)*\\.md$',
      },
    ],
  },
]
```

### Lefthook

**Verdict**: FASTEST pre-commit hook manager

**Benchmarks** (Dec 2025 sources):
- 2-3x faster than Husky
- Parallel execution by default
- Go binary (no Node.js dependency for hooks)
- Caching support

**Comparison**:

| Feature | Lefthook | Husky | simple-git-hooks |
|---------|----------|-------|------------------|
| Language | Go | Node.js | Node.js |
| Execution | Parallel | Sequential | Sequential |
| Size | Binary | 53KB | 10KB |
| Caching | Yes | No | No |
| Best for | Monorepos, multi-lang | Simple JS | Very simple |

### simple-git-hooks (Alternative)

**Verdict**: GOOD for simple projects

- 10KB, zero dependencies
- Simple configuration in package.json
- No parallel execution
- Use when Lefthook is overkill

---

## Recommended Stack for Specky

```
┌─────────────────────────────────────────────────────────────┐
│                    ENFORCEMENT STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Bash Script (scripts/validate-filenames.sh)       │
│  └─ Custom regex: ^[0-9]{4}-[0-9]{2}-[0-9]{2}_              │
│  └─ Targets: docs/**/*.md, research/**/*.md, plans/**/*.md  │
│  └─ Zero dependencies, fast, reliable                       │
│                                                              │
│  Layer 2: Lefthook (Pre-commit)                             │
│  └─ Runs validation script on staged .md files              │
│  └─ Parallel execution, fast feedback                       │
│                                                              │
│  Layer 3: CI (GitHub Actions)                               │
│  └─ Final gate before merge                                 │
│                                                              │
│  ❌ NOT USED: Claude Code Hooks (broken)                    │
│  ❌ NOT USED: Biome (no custom regex support)               │
│  ❌ NOT USED: Husky (slower)                                │
│  ❌ NOT USED: eslint-plugin-validate-filename (ESLint can't │
│              parse markdown without additional plugins)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why Bash Script Instead of ESLint Plugin?

During implementation, we discovered that `eslint-plugin-validate-filename` requires ESLint to actually parse the file content (not just check the filename). This causes errors on markdown files since ESLint's default parser expects JavaScript.

The bash script approach is:
- **Zero dependencies** - Works everywhere bash is available
- **Faster** - No Node.js startup overhead
- **Simpler** - Easy to understand and modify
- **More reliable** - No complex ESLint configuration needed

---

## Memory MCP Entities Created

This research has been stored for compounding intelligence:

1. `CLE: Claude Code Hooks Cannot Block Tool Execution January 2026`
2. `CLE: Biome useFilenamingConvention Does Not Support Date Prefix January 2026`
3. `Filename Enforcement Working Stack January 2026`
4. `Lefthook vs Husky Performance January 2026`

---

## Sources

### Claude Code Hooks Issues
- https://github.com/anthropics/claude-code/issues/4362
- https://github.com/anthropics/claude-code/issues/4669
- https://github.com/anthropics/claude-code/issues/6403
- https://github.com/anthropics/claude-code/issues/15441

### Biome Issues
- https://github.com/biomejs/biome/issues/3952
- https://github.com/biomejs/biome/issues/2754

### Lefthook vs Husky
- https://www.edopedia.com/blog/lefthook-vs-husky/ (Aug 2025)
- https://npm-compare.com/husky,lefthook,lint-staged,pre-commit (Nov 2024)
- https://0xdc.me/blog/git-hooks-management-with-pre-commit-and-lefthook/ (Jun 2024)

### ESLint Plugins
- https://github.com/hiro08gh/eslint-plugin-validate-filename
- https://www.npmjs.com/package/eslint-plugin-validate-filename

---

## Acknowledgments

Special thanks to **Droid by Factory AI** for cross-validating these findings and catching the critical bugs in Claude Code Hooks and Biome that would have wasted implementation time.

---

**Last Updated**: January 15, 2026
**Verified By**: Chain-of-Verification with Exa MCP
