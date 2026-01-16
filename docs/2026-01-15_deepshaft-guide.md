# DEEPSHAFT for Specky

> Single-branch, parallel micro-loops. No git worktrees. No merge hell.

---

## Why DEEPSHAFT?

Git worktrees are a pain:
- Complex setup
- Disk space overhead
- Merge conflicts anyway
- Mental overhead tracking which worktree you're in

DEEPSHAFT eliminates all of this with **territorial discipline**.

---

## Core Concept

```
SINGLE BRANCH (main)
│
├── Lane A: Spec Engine       (owns: src/lib/spec/**)
├── Lane B: UI Components     (owns: src/components/**)
└── Lane C: AI Integrations   (owns: src/lib/ai/**)

RULE: No lane writes to another lane's files.
```

If you need to change files across lanes → escalate, coordinate, then proceed.

---

## Specky Lane Mapping

### Lane A: Spec Engine
```yaml
lane: spec-engine
owner: primary
scope:
  write:
    - src/lib/spec/**
    - src/lib/templates/**
    - src/types/spec.ts
  read:
    - src/lib/ai/**
    - src/components/**
smoke: "npm test -- --grep @spec"
```

### Lane B: UI Components
```yaml
lane: ui-components
owner: primary
scope:
  write:
    - src/components/**
    - src/app/**/*.tsx
    - src/styles/**
  read:
    - src/lib/spec/**
    - src/types/**
smoke: "npm test -- --grep @ui"
```

### Lane C: AI Integrations
```yaml
lane: ai-integrations
owner: primary
scope:
  write:
    - src/lib/ai/**
    - src/types/ai.ts
  read:
    - src/lib/spec/**
smoke: "npm test -- --grep @ai"
```

---

## Micro-Loop (60-120 seconds)

```
1. Edit Cell (≤300 lines in your lane)
      ↓
2. Hot Reload (Turbopack)
      ↓
3. Scoped Smoke Test (your lane only)
      ↓
4. Commit (if passes)
      ↓
5. Push (CI runs deeper tests async)
```

---

## Commands (Planned)

These commands document the intended interface. They are not implemented yet.

```bash
# Check for lane overlap violations
npm run deepshaft:check

# Run smoke tests for specific lane
npm run smoke:spec-engine
npm run smoke:ui
npm run smoke:ai

# Claim a lane (for multi-person teams)
npm run deepshaft:claim -- --lane spec-engine --owner "me"

# Create a new micro-sprint spec
npm run deepshaft:spec:new -- --lane ui-components --title "Add question card"
```

---

## CI Tiers

| Tier | When | What | Time |
|------|------|------|------|
| 0 | Every push | Lint, secrets, type check | 30s |
| 1 | Every push | Smoke tests (all lanes) | 60s |
| 2 | Every push | Build | 90s |
| 3 | Every push | Full E2E | 5min |
| 4 | Nightly | Visual, a11y, perf | 20min |

---

## Why This Works for Specky

Specky is a focused tool with clear boundaries:

1. **Spec Engine** - The brain (parsing, synthesis, verification)
2. **UI** - The interface (questions, output display)
3. **AI** - The LLM connections (Claude, Groq, etc.)

These rarely need to change simultaneously. When they do, coordinate briefly, then proceed.

---

## Comparison

| Approach | Complexity | Merge Pain | Disk Usage |
|----------|------------|------------|------------|
| Git worktrees | High | Medium | 2-3x |
| Feature branches | Medium | High | 1x |
| **DEEPSHAFT** | **Low** | **None** | **1x** |

---

## Getting Started

1. Decide which lane you're working in
2. Check that no one else is writing to those files
3. Make your change (≤300 LOC)
4. Run your lane's smoke test
5. Commit and push
6. CI handles the rest

No worktrees. No feature branches for small changes. Just clean, parallel work.
