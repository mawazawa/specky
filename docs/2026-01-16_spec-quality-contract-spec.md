# Spec Quality Contract (Perfect Spec Guarantee)

> **Status**: Draft v0.1
> **Effective**: 2026-01-16
> **Principle**: The spec is the moat.

---

## 1. Purpose

Define the non-negotiable quality guarantees that every Specky run must satisfy. The output is invalid unless all gates pass. This is the core product promise.

---

## 2. Scope

Applies to every spec pack produced by the app, regardless of user, project size, or integrations.

---

## 3. Definitions

- **Spec Pack**: A deterministic set of files generated per run.
- **Decision**: Any tech stack, architecture, or tool selection.
- **Atomic Task**: A task that touches 3 or fewer files.
- **Citation**: Source URL + verification date + query.

---

## 4. Contract Guarantees

### G1. Canonical Output
Every run produces a Spec Pack with the required files and formats.

**Required files**:
- `meta.json`
- `requirements.md`
- `design.md`
- `tasks.md`
- `sources.json`
- `quality.json`

### G2. Verification Required
Every decision includes at least one citation:
- Source URL
- Verification date
- Verification query

### G3. Atomic Tasks Only
All tasks must touch 3 or fewer files. Any task exceeding the limit invalidates the pack.

### G4. Quality Report Included
Each pack must include per-section quality scores and staleness flags.

### G5. Deterministic Ordering
Sections and task order must be stable for identical inputs.

---

## 5. Validation Rules

### V1. Schema Validation
- `meta.json` must validate against Spec Pack Schema v1.0.0.
- `sources.json` must map to decisions in `meta.json`.
- `quality.json` must include scores for each section.

### V2. Citation Coverage
- 100% coverage of decisions.
- Missing citations fail validation.

### V3. Staleness Rules
- <30 days: fresh
- 30-90 days: verify
- >90 days: stale (must be flagged)

### V4. Atomic Task Enforcement
- Task file lists must be explicit.
- Any task with >3 files is a hard error.

---

## 6. Quality Scoring

Each section receives a 0-100 score based on:
- Citation coverage
- Source recency
- Decision-to-source ratio
- Task atomicity compliance

Minimum thresholds:
- Requirements: 80
- Design: 80
- Tasks: 90
- Overall: 85

Scores below threshold trigger a retry or a blocking warning.

---

## 7. Failure Handling

### Blocking Failures (must stop output)
- Missing required files
- Schema validation failure
- Missing citations
- Atomic task violation

### Non-Blocking Failures (warn but continue)
- Low confidence score (< threshold)
- Stale sources
- Missing optional sections

---

## 8. Regression Protection

- Golden spec fixtures must be maintained for baseline projects.
- Snapshot tests compare generated packs to golden fixtures.
- Any drift requires explicit approval.

---

## 9. Acceptance Criteria (Product)

- 100% of spec packs pass schema validation before delivery.
- 100% of decisions include citations.
- 100% of tasks obey the atomicity rule.
- Quality report is always present.

---

## 10. Non-Goals

- Guaranteeing implementation correctness by downstream agents.
- Auto-fixing user answers without confirmation.

---

## 11. References

- https://addyosmani.com/blog/good-spec/
- https://nathanlasnoski.com/2026/01/08/what-is-spec-driven-development/
- https://developer.microsoft.com/blog/spec-driven-development-spec-kit
