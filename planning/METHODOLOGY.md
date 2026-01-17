# Specky Planning Methodology

> **100% Spec Completeness - Zero Questions During Execution**
> **Version**: 1.0.0
> **Created**: 2026-01-17
> **Standard**: If an executing agent has to guess, the spec failed.

---

## Core Principle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  THE SPEC IS THE MOAT                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  A Specky spec is so complete that:                                         │
│                                                                              │
│  ✓ Claude Haiku can single-shot execute it                                  │
│  ✓ DeepSeek V3 can run it with zero intervention                            │
│  ✓ Gemini Flash can build a full-stack app from it                          │
│  ✓ Any competent LLM becomes 10x more effective                             │
│                                                                              │
│  If execution requires interpretation, the spec is incomplete.              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The 100% Standard

### What 100% Means

| Dimension | Requirement | Failure Mode |
|-----------|-------------|--------------|
| Code Blocks | Complete, copy-paste ready | `// ... logic here` |
| File Paths | Exact path + line numbers | `somewhere in src/` |
| Tech Versions | Verified URL + date | `latest version` |
| Edge Cases | Addressed or explicit out-of-scope | Silence |
| Dependencies | In DAG, no implicit ordering | `do this first` |
| Acceptance | Testable with exact command | `should work` |

### Zero Tolerance

```
❌ "The transformation logic goes here"
❌ "Similar to the pattern above"
❌ "You'll need to handle errors appropriately"
❌ "Use the latest version"
❌ "This should be straightforward"

✓ Complete code block with every line
✓ Explicit error handling with try/catch
✓ "Version 16.1.3 (verified 2026-01-17, source: nextjs.org/blog)"
✓ Step-by-step with verification commands
```

---

## Multi-Agent Pipeline

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SPECKY 6-PHASE GENERATION PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER INPUT                                                                  │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 1: DISCOVERY                                                  │    │
│  │  Agent: Questioner                                                   │    │
│  │  ├── Parse user intent                                               │    │
│  │  ├── Generate 5 clarifying questions with recommended answers        │    │
│  │  ├── Run Exa verification on all tech mentioned                      │    │
│  │  └── Output: requirements-draft.md                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 2: CHALLENGE                                                  │    │
│  │  Agent: Adversarial Reviewer                                         │    │
│  │  ├── Feasibility: "Can this be built with current tech?"            │    │
│  │  ├── Scope: "Is this MVP or feature creep?"                         │    │
│  │  ├── Security: "What's the attack surface?"                         │    │
│  │  ├── UX: "Does this add or remove friction?"                        │    │
│  │  └── Output: requirements-challenged.md + debate-trail.json         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 3: DESIGN                                                     │    │
│  │  Agent: Architect                                                    │    │
│  │  ├── Select tech stack with Exa verification (URL + date)           │    │
│  │  ├── Define architecture with alternatives considered               │    │
│  │  ├── Pre-write ALL TypeScript schemas (complete, no stubs)          │    │
│  │  ├── Define Neo4j/Cypher queries if applicable                      │    │
│  │  └── Output: design.md + planning/schemas/*.ts                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 4: DECOMPOSITION                                              │    │
│  │  Agent: Task Splitter                                                │    │
│  │  ├── Break into atomic tasks (≤3 files per task, ENFORCED)          │    │
│  │  ├── Add step IDs: <!-- step:N -->                                  │    │
│  │  ├── Write COMPLETE code for each step (no "...")                   │    │
│  │  ├── Specify exact file paths with line numbers                     │    │
│  │  ├── Build dependency DAG with blocked_by relationships             │    │
│  │  └── Output: stories/*.md + status.yaml                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 5: VALIDATION                                                 │    │
│  │  Agent: Quality Auditor                                              │    │
│  │  ├── Atomic task rule: Reject if any task >3 files                  │    │
│  │  ├── Code completeness: Reject if any "..." or "TODO"               │    │
│  │  ├── Citation coverage: Reject if any decision lacks URL+date       │    │
│  │  ├── Schema validation: All outputs match JSON schema               │    │
│  │  ├── Confidence scoring: Per-section scores                         │    │
│  │  └── Output: quality.json (MUST be 100% to proceed)                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PHASE 6: SYNTHESIS                                                  │    │
│  │  Agent: Orchestrator                                                 │    │
│  │  ├── Merge all outputs into canonical spec-pack/                    │    │
│  │  ├── Generate final status.yaml (machine-parseable)                 │    │
│  │  ├── Write executive summary                                         │    │
│  │  ├── Package for export (Markdown + JSON)                           │    │
│  │  └── Output: Complete Spec Pack                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       │                                                                      │
│       ▼                                                                      │
│  SPEC PACK (100% COMPLETE)                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Iteration Loops

Each phase can loop back if quality threshold not met:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ITERATION RULES                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Loop 1: Discovery ↔ Challenge                                              │
│    - If challenger finds scope unclear → back to Discovery                  │
│    - Max 3 iterations before human escalation                               │
│                                                                              │
│  Loop 2: Design ↔ Decomposition                                             │
│    - If tasks exceed 3 files → back to Design for better modularity         │
│    - Max 3 iterations before architectural review                           │
│                                                                              │
│  Loop 3: Decomposition ↔ Validation                                         │
│    - If code incomplete → back to Decomposition                             │
│    - If citations missing → back to Design                                  │
│    - NO MAX - iterate until 100%                                            │
│                                                                              │
│  EXIT CRITERIA (ALL MUST PASS):                                             │
│    ✓ Every task ≤3 files                                                    │
│    ✓ Every code block complete (no "...", no "TODO")                        │
│    ✓ Every tech decision has URL + verification date                        │
│    ✓ Every schema compiles with tsc --strict                                │
│    ✓ Confidence score = 100%                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Story Anatomy

### Required Structure

Every story file MUST follow this exact structure:

```markdown
# S[Sprint]-[Number]: [Title]

> **Sprint**: [N]
> **Status**: [pending | ready | in_progress | completed | blocked]
> **Agent**: [agent-type]
> **Effort**: [S | M | L | XL]
> **Blocked By**: [Story IDs]
> **Blocks**: [Story IDs]

## Context

[2-3 sentences on WHY this story exists]

## Prerequisites <!-- step:1 -->

- [ ] [Prerequisite with exact command to verify]

## Implementation

### Step 2: [Action] <!-- step:2 -->

**File**: `exact/path/to/file.ts` (Lines X-Y if modifying)

**Action**: [CREATE | MODIFY | DELETE]

```typescript
// COMPLETE CODE - NO ELLIPSIS, NO TODO
// Every import, every function, every line
```

**Verification**:
```bash
# Exact command to verify this step worked
pnpm typecheck
```

### Step 3: [Next Action] <!-- step:3 -->

[Continue with same structure...]

## Verification <!-- step:N -->

```bash
# Full verification sequence
pnpm typecheck  # Expected: 0 errors
pnpm lint       # Expected: 0 errors
pnpm test path/to/test.ts  # Expected: all pass
```

## Acceptance Criteria

- [ ] [Criterion 1 - testable with specific command]
- [ ] [Criterion 2 - testable with specific command]

## Files Affected

- `path/to/file1.ts` (CREATE)
- `path/to/file2.ts` (MODIFY, Lines 45-89)

## Schema References

- Types: `planning/schemas/[name].ts`
- Queries: `planning/schemas/queries.md#[section]`
```

### Code Block Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CODE BLOCK COMPLETENESS CHECKLIST                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✓ All imports listed at top                                                │
│  ✓ All types either imported or defined inline                              │
│  ✓ All functions have complete implementation                               │
│  ✓ All error handling explicit (try/catch or error returns)                 │
│  ✓ All edge cases handled or documented as out-of-scope                     │
│  ✓ No "..." or "// rest of implementation"                                  │
│  ✓ No "TODO" or "FIXME" comments                                            │
│  ✓ No "similar to above" references                                         │
│  ✓ Compiles with `tsc --strict` (for TypeScript)                            │
│                                                                              │
│  FORBIDDEN PATTERNS:                                                         │
│    ❌ // ... transformation logic                                           │
│    ❌ // Handle other cases similarly                                       │
│    ❌ // TODO: implement error handling                                     │
│    ❌ // See [other file] for pattern                                       │
│    ❌ /* Implementation details */                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Status.yaml Structure

### Single Source of Truth

```yaml
# planning/status.yaml
# Machine-parseable, queryable, diff-friendly

version: "1.0.0"
updated_at: "2026-01-17T12:00:00Z"
spec_name: "[Project Name]"

# Computed metrics
metrics:
  total_stories: 0
  completed_stories: 0
  progress_percent: 0
  confidence_score: 100  # Must be 100 to ship

# Sprint overview
sprints:
  sprint-1:
    name: "[Sprint Name]"
    status: "pending"  # pending | in_progress | completed
    stories: ["S1-001", "S1-002"]

# Story details
stories:
  S1-001:
    title: "[Story Title]"
    status: "ready"
    agent_type: "[agent-type]"
    effort: "M"
    blocked_by: []
    blocks: ["S1-002"]
    files_affected:
      - path: "src/file.ts"
        action: "CREATE"
    acceptance_criteria:
      - criterion: "[Testable criterion]"
        verification: "pnpm test src/file.test.ts"

# Computed views (auto-generated)
views:
  ready_for_dispatch: ["S1-001"]
  blocked: []
  in_progress: []

# Tech stack with verification
tech_stack:
  next:
    version: "16.1.3"
    verified_at: "2026-01-17"
    source: "https://nextjs.org/blog/next-16-1"
```

---

## Quality Gates

### Per-Story Gate

Before marking any story complete:

| Gate | Command | Required Result |
|------|---------|-----------------|
| TypeScript | `pnpm typecheck` | 0 errors |
| Lint | `pnpm lint` | 0 errors |
| Tests | `pnpm test [path]` | All pass |
| Build | `pnpm build` | Success |

### Per-Spec-Pack Gate

Before shipping any spec pack:

| Gate | Check | Required |
|------|-------|----------|
| Atomic Tasks | No task >3 files | 100% |
| Code Completeness | No "..." or "TODO" | 100% |
| Citation Coverage | All decisions have URL+date | 100% |
| Schema Validity | All .ts files compile | 100% |
| Confidence Score | quality.json score | 100% |

### Validation Commands

```bash
# Validate spec pack structure
specky validate ./spec-pack --strict

# Check code completeness (no ellipsis, no TODO)
specky lint:completeness ./spec-pack

# Verify all citations present
specky lint:citations ./spec-pack

# Run all quality gates
specky quality:gate ./spec-pack
# Output: PASS (100%) or FAIL (list of issues)
```

---

## Debate Trail Format

Every design decision must include reasoning:

```json
// debate-trail.json
{
  "decisions": [
    {
      "id": "D-001",
      "topic": "State Management Library",
      "decision": "TanStack Query v5",
      "alternatives_considered": [
        {
          "option": "Redux Toolkit",
          "rejected_because": "Overkill for server-state only app"
        },
        {
          "option": "Zustand",
          "rejected_because": "No built-in caching/invalidation"
        },
        {
          "option": "SWR",
          "rejected_because": "TanStack has better DevTools integration"
        }
      ],
      "challenger_objection": "TanStack Query adds 12KB to bundle",
      "response": "Acceptable tradeoff for DX gains; tree-shaking reduces actual impact to ~8KB",
      "verified_at": "2026-01-17",
      "verification_source": "https://bundlephobia.com/package/@tanstack/react-query"
    }
  ]
}
```

---

## File Structure

```
planning/
├── METHODOLOGY.md           # This file
├── status.yaml              # Single source of truth
├── debate-trail.json        # All design decisions with reasoning
│
├── sprints/
│   └── sprint-N-[name].md   # Sprint overview
│
├── stories/
│   └── SN-NNN-[name].md     # Story files (pending/ready/in_progress)
│
├── completed/
│   └── SN-NNN-[name].md     # Completed stories (archive)
│
├── schemas/
│   ├── [domain].ts          # TypeScript types (complete, compilable)
│   └── queries.md           # Database queries by story ID
│
└── sessions/
    └── YYYY-MM-DD-NNN/      # Session artifacts
        ├── handoff.md       # For next agent
        └── artifacts/       # Screenshots, logs
```

---

## Banned Patterns

### Words That Indicate Incompleteness

| Pattern | Why It's Banned | What To Do Instead |
|---------|-----------------|---------------------|
| "likely" | Unverified assumption | Verify with Exa, state fact |
| "should" | Commitment avoided | State what WILL happen |
| "probably" | Uncertainty | Research and confirm |
| "etc." | Incomplete list | List all items |
| "and so on" | Incomplete list | List all items |
| "similar to" | Missing code | Write the actual code |
| "as needed" | Vague scope | Define exact scope |
| "appropriate" | Undefined standard | Specify the standard |

### Code Patterns That Fail Validation

```typescript
// ❌ FAILS - Incomplete
async function processData(data: unknown) {
  // Transform data...
}

// ✓ PASSES - Complete
async function processData(data: RawInput): Promise<ProcessedOutput> {
  if (!data || typeof data !== 'object') {
    throw new ProcessingError('Invalid input: expected object');
  }

  const validated = inputSchema.parse(data);

  return {
    id: validated.id,
    name: validated.name.trim(),
    createdAt: new Date().toISOString(),
  };
}
```

---

## Definition of Done

A spec pack is DONE when:

1. **Every story** has complete code blocks (no "...")
2. **Every decision** has a URL and verification date
3. **Every task** touches ≤3 files
4. **Every schema** compiles with `tsc --strict`
5. **Every acceptance criterion** has a verification command
6. **The quality gate** returns 100%
7. **The debate trail** documents all alternatives considered

If ANY of these fail, the spec pack is NOT done.

---

**Version**: 1.0.0
**Created**: 2026-01-17
**Standard**: 100% completeness, zero ambiguity
