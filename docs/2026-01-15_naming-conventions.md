# Specky Naming Conventions

> **Effective**: January 15, 2026
> **Enforced By**: `scripts/validate-filenames.sh` + Lefthook pre-commit hooks

---

## Why This Matters

Files without temporal markers become stale without warning. Research from 2024 is useless if you can't tell it's from 2024. This convention ensures:

- **Discoverability**: Humans and agents find files predictably
- **Temporal Awareness**: Staleness is visible at a glance
- **Consistency**: No guessing which convention to use

---

## Core Rules

### Rule 1: Date Prefix for Non-Code Files

All files in `docs/`, `research/`, and `plans/` folders **MUST** start with `YYYY-MM-DD_`.

```
✓ 2026-01-15_auth-strategy-research.md
✓ 2026-01-15_mvp-plan.md
✗ auth-strategy-research.md (missing date)
✗ 15-01-2026_research.md (wrong format)
```

### Rule 2: kebab-case for File Names

Use lowercase with hyphens. No spaces, underscores, or camelCase in documentation files.

```
✓ 2026-01-15_nextjs-version-research.md
✗ 2026-01-15_NextJS_Version_Research.md
✗ 2026-01-15_nextjsVersionResearch.md
```

### Rule 3: Descriptive Suffixes

End filenames with their type:

| Suffix | Purpose | Example |
|--------|---------|---------|
| `-research.md` | Investigation/findings | `auth-providers-research.md` |
| `-plan.md` | Implementation plans | `mvp-plan.md` |
| `-spec.md` | Specifications | `user-auth-spec.md` |
| `-context.md` | Background info | `codebase-context.md` |
| `-roadmap.md` | Timeline/milestones | `q1-roadmap.md` |
| `-adr.md` | Architecture decisions | `database-choice-adr.md` |
| `-guide.md` | How-to documentation | `deployment-guide.md` |

---

## Folder-Specific Conventions

### `/docs/`
General documentation and guides.

```
docs/
├── 2026-01-15_spec-philosophy.md
├── 2026-01-15_deepshaft-guide.md
├── 2026-01-15_verified-tech-stack.md
└── 2026-01-15_naming-conventions.md
```

### `/research/`
Research organized by source/topic.

```
research/
├── claude-research/
│   ├── 2026-01-15_01-autoclaude-research.md
│   ├── 2026-01-15_02-ralph-wiggum-research.md
│   └── 2026-01-15_03-naming-conventions-research.md
└── exa-research/
    └── 2026-01-15_llm-benchmarks-research.md
```

**Numbered prefixes** (01-, 02-) indicate reading order within a topic.

### `/plans/`
Implementation and roadmap plans.

```
plans/
├── 2026-01-15_mvp-plan.md
├── 2026-01-15_v0.2-roadmap.md
└── 2026-01-20_auth-implementation-plan.md
```

### `/src/`
Source code follows different conventions:

| Type | Convention | Example |
|------|------------|---------|
| Files | camelCase | `specEngine.ts` |
| React Components | PascalCase | `QuestionCard.tsx` |
| Folders | kebab-case | `src/lib/spec-engine/` |
| Test files | `*.test.ts` | `specEngine.test.ts` |

---

## Exempt Files

These files do NOT require date prefixes:

| File | Reason |
|------|--------|
| `CLAUDE.md` | Root config, always current |
| `AGENTS.md` | Root config, always current |
| `README.md` | Standard convention |
| `LICENSE` | License file |
| `package.json` | Config file |
| `*.config.js` | Config files |
| `.env*` | Environment files |
| `.gitignore` | Git config |

---

## Staleness Indicators

### When to Update Date Prefix

If you **significantly update** a document, update the date prefix:

```
2026-01-15_tech-stack.md  →  2026-01-20_tech-stack.md
```

For minor fixes (typos, formatting), keep the original date.

### Staleness Thresholds

| Age | Status | Action |
|-----|--------|--------|
| < 30 days | Fresh | Trust as current |
| 30-90 days | Check | Verify key claims |
| > 90 days | Stale | Re-research before using |

---

## Enforcement

### Filename Validation Script

`scripts/validate-filenames.sh` enforces the exact `YYYY-MM-DD_` + kebab-case pattern
for all markdown files in `docs/`, `research/`, and `plans/`.

### Lefthook Pre-commit

Lefthook runs the validation script on staged markdown files before commit.
Commits are rejected if any file violates the convention.

### CI Gate (Optional)

CI can run `npm run lint:filenames` as the final enforcement layer.

---

## Examples

### Good Names

```
2026-01-15_autoclaude-patterns-research.md
2026-01-15_mvp-implementation-plan.md
2026-01-15_database-selection-adr.md
2026-01-15_user-authentication-spec.md
2026-01-15_q1-2026-roadmap.md
```

### Bad Names

```
research.md                    # No date, not descriptive
AutoClaude_Research.md         # Wrong case, no date
2026-1-15_research.md          # Wrong date format (needs leading zero)
research-2026-01-15.md         # Date should be prefix, not suffix
research_autoclaude.md         # Underscore instead of hyphen
```

---

## Quick Reference

```
Pattern: YYYY-MM-DD_descriptive-name-suffix.md

Date:    2026-01-15
         └─ ISO 8601, always use leading zeros

Name:    _descriptive-name
         └─ kebab-case, lowercase, hyphens

Suffix:  -research.md | -plan.md | -spec.md | -context.md | -adr.md
         └─ Indicates document type
```

---

**This convention is not optional. Enforcement is automated.**
