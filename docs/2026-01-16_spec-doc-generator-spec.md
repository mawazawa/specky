# Spec Document Generator: Lightweight + Powerful

> **Spec is the moat.**
> **Verification Date**: 2026-01-16
> **Status**: Draft v0.1

---

## 1. Problem Statement

AI agents fail when specs are vague, stale, or too large to fit context windows. The product must produce a compact, verifiable, and executable spec pack that any competent agent can run without clarification.

**Evidence**:
- AI agent specs must be structured and scoped to avoid context overload (2026-01-13). https://addyosmani.com/blog/good-spec/
- Spec-first workflows reduce ambiguity and separate planning from implementation (2026-01-08). https://nathanlasnoski.com/2026/01/08/what-is-spec-driven-development/
- Spec-driven workflows prioritize a lightweight but formal spec over ad-hoc prompts (2025-09-15). https://developer.microsoft.com/blog/spec-driven-development-spec-kit

---

## 2. Product Goal

Deliver a local-first, minimal-dependency spec generator that produces a **Spec Pack** with:
- Verified, timestamped technical decisions
- Atomic tasks (each touches 3 or fewer files)
- Deterministic structure that agents can execute

**Power is optional and additive**. The core stays small; integrations are plugins.

---

## 3. Non-Goals

- Hosting a full SaaS platform in v0
- Large, opinionated UI frameworks
- Auto-implementation of code without explicit user confirmation

---

## 4. Principles

1. **Lightweight Core**: No database, no server, minimal dependencies.
2. **Spec Pack Contract**: Every output conforms to a versioned schema.
3. **Temporal Grounding**: Every decision has a date and source.
4. **Atomic Tasks**: Each task is independently executable.
5. **Power via Plugins**: Optional integrations extend capability without bloating core.

---

## 5. Success Metrics

- Cold start under 2 seconds on a typical laptop
- Generate a small spec pack in under 10 seconds
- Spec Pack schema validation pass rate: 100%
- Missing citations: 0 per pack
- Atomic task compliance: 100% (no task touches more than 3 files)
- Dependencies: 5 or fewer in core CLI

---

## 6. Primary User Flows

### Flow A: Generate Spec Pack (CLI)
1. User runs `specky new` with a one-line problem description.
2. Tool asks 3 to 5 clarifying questions.
3. Tool verifies any tech decisions with sources and dates.
4. Tool outputs Spec Pack (Markdown + JSON).

### Flow B: Validate Spec Pack
1. User runs `specky validate ./spec-pack`.
2. Tool reports schema compliance, missing citations, and atomicity violations.

---

## 7. Spec Pack Format (v1)

### 7.1 File Layout
```
spec-pack/
├── meta.json
├── requirements.md
├── design.md
├── tasks.md
├── sources.json
└── quality.json
```

### 7.2 Schema (meta.json)
```json
{
  "specPackVersion": "1.0.0",
  "generatedAt": "2026-01-16T00:00:00Z",
  "verificationDate": "2026-01-16",
  "projectName": "Spec Document Generator",
  "inputs": {
    "prompt": "string",
    "clarifyingQuestions": ["string"],
    "answers": ["string"]
  },
  "decisions": [
    {
      "category": "string",
      "choice": "string",
      "rationale": "string",
      "verifiedAt": "YYYY-MM-DD",
      "sources": ["url"],
      "query": "string"
    }
  ]
}
```

### 7.3 tasks.md Format
Each task includes:
- **ID**: AT-###
- **Files (<=3)**
- **Acceptance Criteria**
- **Tests** (if applicable)

---

## 8. Verification Pipeline

### 8.1 Steps
1. Extract decisions (tech stack, architecture, tools).
2. Run verification queries with current date.
3. Attach sources + verification date.
4. Flag stale sources in `quality.json`.

### 8.2 Staleness Rules
- <30 days: fresh
- 30-90 days: verify
- >90 days: stale

### 8.3 Confidence Scoring
Score each section 0-100 using:
- Citation coverage
- Recency of sources
- Decision count vs source count

---

## 9. Lightweight Runtime

- Single CLI binary or `node` script
- No database for v0
- Cache verification results in local file
- Stream output to stdout and file

---

## 10. Plugin Architecture (Optional Power)

### 10.1 Plugin Contract (v1)
```ts
export interface SpeckyPlugin {
  name: string;
  version: string;
  apply(input: SpecPack): SpecPack;
}
```

### 10.2 Core Guarantees
- Core works with zero plugins.
- Plugin failure never blocks base output.

---

## 11. Quality Gates

- Schema validation required before output is considered valid.
- Missing citations fail validation.
- Atomic tasks fail validation if >3 files.

---

## 12. Atomic Task List (v0.1)

### AT-001: CLI Skeleton
**Files**: `src/cli/index.ts`, `src/cli/commands.ts`, `src/cli/types.ts`
**Acceptance**:
- CLI runs with `specky --help`
- No external dependencies beyond core runtime

### AT-002: Spec Pack Schema
**Files**: `src/spec/schema.ts`, `src/spec/validator.ts`, `src/spec/types.ts`
**Acceptance**:
- Schema validates `meta.json`
- Validation errors are human-readable

### AT-003: Requirements Pack Generator
**Files**: `src/generate/requirements.ts`, `src/spec/types.ts`, `src/output/render.ts`
**Acceptance**:
- Outputs `requirements.md` with 3-5 questions
- Includes explicit acceptance criteria section

### AT-004: Design Pack Generator
**Files**: `src/generate/design.ts`, `src/spec/types.ts`, `src/output/render.ts`
**Acceptance**:
- Outputs architecture decisions with rationale
- Includes constraints and trade-offs

### AT-005: Tasks Pack Generator
**Files**: `src/generate/tasks.ts`, `src/spec/types.ts`, `src/output/render.ts`
**Acceptance**:
- Each task has <=3 files
- Each task has acceptance criteria

### AT-006: Source Capture
**Files**: `src/verify/sources.ts`, `src/verify/types.ts`, `src/output/render.ts`
**Acceptance**:
- Writes `sources.json`
- Each decision has at least 1 source

### AT-007: Confidence Scoring
**Files**: `src/quality/score.ts`, `src/quality/types.ts`, `src/output/render.ts`
**Acceptance**:
- Writes `quality.json` with per-section scores

---

## 13. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Spec too large for context | Chunk outputs with size budgets |
| Verification adds latency | Cache results locally |
| Plugins bloat core | Keep plugin system optional |

---

## 14. Example Output (short)

```
# requirements.md
## Goal
Build a spec generator that is small, fast, and verifiable.

## Clarifying Questions
1. Target user: solo dev, team, or org?
2. Output formats: Markdown only or JSON too?
3. Required integrations: none, GitHub, or Supabase?

## Acceptance Criteria
- Spec pack contains requirements, design, tasks
- Each decision includes a source and date
```

---

## 15. Open Questions

- Which LLM provider is default for verification summaries?
- How strict is offline mode (no network at all vs cached only)?
- Is a minimal UI required for non-coders in v1?
