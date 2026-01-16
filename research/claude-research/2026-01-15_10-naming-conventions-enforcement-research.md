# Naming Conventions & Enforcement Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search with temporal grounding

---

## Overview

Research into best practices for file naming conventions, particularly for non-mission-critical but important files (research, context, plans, roadmaps), and methods to enforce these conventions via hooks and linters.

## Key Finding: Temporal Staleness Problem

**The Problem**: Files like research reports, context documents, and plans become stale over time. Without temporal markers in filenames, users can't tell:
- When the file was created
- If the information is still current
- Whether to trust the content

**The Solution**: Date-prefix naming conventions with enforcement.

---

## Best Practices (Verified January 2026)

### 1. Date Format: ISO 8601 (YYYY-MM-DD)

**Consensus across all sources**: Use `YYYY-MM-DD` prefix for chronological sorting.

```
✓ 2026-01-15_nextjs-version-research.md
✓ 2026-01-15_auth-strategy-plan.md
✗ nextjs-version-research.md (no temporal context)
✗ 15-01-2026_research.md (wrong format, doesn't sort)
```

**Why YYYY-MM-DD**:
- Sorts chronologically in any file explorer
- ISO 8601 international standard
- Unambiguous (no US vs EU date confusion)

### 2. File Categories & Naming Patterns

| Category | Pattern | Example |
|----------|---------|---------|
| **Research** | `YYYY-MM-DD_[topic]-research.md` | `2026-01-15_auth-strategies-research.md` |
| **Plans** | `YYYY-MM-DD_[scope]-plan.md` | `2026-01-15_mvp-plan.md` |
| **Context** | `YYYY-MM-DD_[area]-context.md` | `2026-01-15_codebase-context.md` |
| **Roadmaps** | `YYYY-MM-DD_[name]-roadmap.md` | `2026-01-15_q1-roadmap.md` |
| **Specs** | `YYYY-MM-DD_[feature]-spec.md` | `2026-01-15_auth-spec.md` |
| **Decisions** | `YYYY-MM-DD_[topic]-adr.md` | `2026-01-15_database-choice-adr.md` |

### 3. Case Convention: kebab-case

**Consensus**: Use `kebab-case` (lowercase with hyphens) for:
- Cross-platform compatibility
- URL-friendliness
- Readability

```
✓ 2026-01-15_nextjs-version-research.md
✗ 2026-01-15_NextJS_Version_Research.md
✗ 2026-01-15_nextjsVersionResearch.md
```

### 4. Version Control for Living Documents

For documents that update over time, add version suffix:

```
2026-01-15_tech-stack-v1.md
2026-01-20_tech-stack-v2.md
```

Or use date of last update:

```
2026-01-15_tech-stack.md  → renamed to →
2026-01-20_tech-stack.md  (when updated)
```

---

## Enforcement Methods

### Method 1: ESLint Plugin (eslint-plugin-check-file)

**Latest version**: v3.3.1 (November 2025)
**Best for**: JavaScript/TypeScript projects

```javascript
// eslint.config.js
import checkFile from 'eslint-plugin-check-file';

export default [
  {
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      // Enforce kebab-case for all markdown files
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.md': 'KEBAB_CASE',
          '**/*.ts': 'CAMEL_CASE',
          '**/*.tsx': 'PASCAL_CASE',
        },
      ],
      // Enforce folder naming
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
          'docs/**/': 'KEBAB_CASE',
          'research/**/': 'KEBAB_CASE',
        },
      ],
    },
  },
];
```

### Method 2: Biome (useFilenamingConvention)

**Modern alternative to ESLint for file naming**.

```json
{
  "linter": {
    "rules": {
      "style": {
        "useFilenamingConvention": {
          "level": "error",
          "options": {
            "filenameCases": ["kebab-case"]
          }
        }
      }
    }
  }
}
```

### Method 3: Pre-commit Hooks (Husky + lint-staged)

```javascript
// .lintstagedrc.js
module.exports = {
  '*.md': ['eslint --fix'],
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
};
```

```bash
# .husky/pre-commit
#!/bin/sh
npx lint-staged
```

### Method 4: Claude Code Hooks (PreToolUse)

**Source**: Claude Code blog (December 2025)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "tool_name": "Write",
        "command": "./scripts/validate-filename.sh \"$FILE_PATH\""
      }
    ]
  }
}
```

**validate-filename.sh**:
```bash
#!/bin/bash
FILE_PATH="$1"
FILENAME=$(basename "$FILE_PATH")

# Check for research/docs/plans folders
if [[ "$FILE_PATH" =~ ^(research|docs|plans)/ ]]; then
  # Must start with YYYY-MM-DD
  if ! [[ "$FILENAME" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}_ ]]; then
    echo "ERROR: Files in $FOLDER must start with YYYY-MM-DD_ prefix"
    exit 1
  fi

  # Must be kebab-case after date
  AFTER_DATE="${FILENAME#????-??-??_}"
  if ! [[ "$AFTER_DATE" =~ ^[a-z0-9]+(-[a-z0-9]+)*\.[a-z]+$ ]]; then
    echo "ERROR: Filename must be kebab-case after date prefix"
    exit 1
  fi
fi

exit 0
```

### Method 5: Custom Pre-commit Hook (Python)

**Source**: Medium article (July 2025) on filename linters

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/your-org/filename-linter
    rev: v1.0.0
    hooks:
      - id: filename-lint
        args: [--style, kebab-case, --require-date-prefix]
```

---

## Specky-Specific Recommendations

### Folder Structure with Naming Enforcement

```
specky/
├── docs/                          # kebab-case, date-prefixed
│   ├── 2026-01-15_spec-philosophy.md
│   └── 2026-01-15_deepshaft-guide.md
├── research/
│   └── claude-research/           # kebab-case, date-prefixed
│       ├── 2026-01-15_01-autoclaude-research.md
│       └── 2026-01-15_02-naming-conventions-research.md
├── plans/                         # kebab-case, date-prefixed
│   └── 2026-01-15_mvp-plan.md
├── src/                           # camelCase for files, kebab-case for folders
│   ├── components/
│   ├── lib/
│   └── app/
└── CLAUDE.md                      # Exempt: root config files
```

### Enforcement Rules

| Location | Convention | Date Prefix | Enforced By |
|----------|------------|-------------|-------------|
| `docs/**/*.md` | kebab-case | Required | ESLint |
| `research/**/*.md` | kebab-case | Required | ESLint |
| `plans/**/*.md` | kebab-case | Required | ESLint |
| `src/**/*.ts` | camelCase | Not required | ESLint |
| `src/**/*.tsx` | PascalCase | Not required | ESLint |
| `src/**/` (folders) | kebab-case | Not required | ESLint |
| Root files | SCREAMING_CASE or dot-prefix | Not required | Exempt |

### Exempt Files (No Date Prefix Required)

- `CLAUDE.md`, `AGENTS.md`, `README.md` - Root config files
- `package.json`, `tsconfig.json` - Config files
- `.env`, `.gitignore` - Dot files
- `index.ts`, `page.tsx` - Entry points

---

## Implementation Plan for Specky

### Phase 1: Add ESLint Plugin

```bash
npm install -D eslint-plugin-check-file
```

### Phase 2: Configure Rules

Create `.eslintrc.js` with filename rules targeting `docs/`, `research/`, `plans/`.

### Phase 3: Add Pre-commit Hook

Use Husky + lint-staged to enforce on every commit.

### Phase 4: Add Claude Code Hook (Optional)

For real-time enforcement during Claude Code sessions.

### Phase 5: Document Convention

Add naming convention section to CLAUDE.md and AGENTS.md.

---

## Sources

- https://airenamer.app/blog/file-naming-conventions-best-practices-2026-update (Jan 2026)
- https://renamer.ai/insights/file-naming-conventions-best-practices (Jan 2026)
- https://datamanagement.hms.harvard.edu/plan-design/file-naming-conventions
- https://github.com/dukeluo/eslint-plugin-check-file (v3.3.1, Nov 2025)
- https://biomejs.dev/linter/rules/use-filenaming-convention
- https://claude.com/blog/how-to-configure-hooks (Dec 2025)
- https://medium.com/@ahmet-demir/enforcing-consistent-file-naming-conventions-with-pre-commit-hooks (Jul 2025)
- https://apidog.com/blog/claude-code-hooks/ (Jan 2026)
