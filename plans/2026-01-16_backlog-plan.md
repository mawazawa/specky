# Specky Backlog Plan (No Cap)

> **Goal**: Lightweight + powerful spec document generator where the Spec Pack is the moat.
> **Date**: 2026-01-16
> **Scope**: Uncapped backlog. Prioritized by value and dependency.

---

## Epics Overview

| Epic | Outcome | Priority |
|------|---------|----------|
| E1 Spec Pack Core | Deterministic requirements, design, tasks packs | P0 |
| E2 Temporal Verification | Every decision has date + source | P0 |
| E3 Lightweight Runtime | Fast local CLI with minimal deps | P0 |
| E4 Quality Governance | Validation + quality report | P1 |
| E5 Plugin Power | Optional integrations without bloat | P1 |

---

## E1: Spec Pack Core (P0)

### SPE-001: Requirements Pack Generator
**Story**: As a user, I want a requirements pack so I can define scope and constraints.
**Acceptance**:
- Outputs `requirements.md` with goal, scope, and non-goals
- Includes 3-5 clarifying questions
- Includes acceptance criteria section

### SPE-002: Design Pack Generator
**Story**: As a user, I want a design pack so I can see architecture and trade-offs.
**Acceptance**:
- Outputs `design.md` with architecture choices and rationale
- Lists constraints and risks
- Lists alternatives considered

### SPE-003: Tasks Pack Generator
**Story**: As a user, I want a tasks pack so I can execute without ambiguity.
**Acceptance**:
- Outputs `tasks.md` with AT-### tasks
- Each task includes file list and acceptance criteria
- Task order respects dependencies

### SPE-004: Atomic Task Enforcement
**Story**: As a user, I want tasks limited to 3 files so execution stays atomic.
**Acceptance**:
- Validation fails if any task touches >3 files
- Report includes offending task IDs

### SPE-005: Dual Output Formats
**Story**: As a user, I want Markdown and JSON output so I can use any agent.
**Acceptance**:
- Outputs both Markdown and JSON
- JSON schema validates output

### SPE-006: Spec Pack Versioning
**Story**: As a user, I want spec pack versioning so outputs stay compatible.
**Acceptance**:
- `meta.json` includes `specPackVersion`
- Version is semver

---

## E2: Temporal Verification (P0)

### TEM-001: Source Capture
**Story**: As a user, I want sources attached to decisions so I can trust them.
**Acceptance**:
- Each decision lists at least one URL
- Each decision includes verification date

### TEM-002: Query Logging
**Story**: As a user, I want the exact verification query logged so I can re-run it.
**Acceptance**:
- `sources.json` includes the search query
- Each query references the current date

### TEM-003: Staleness Flags
**Story**: As a user, I want stale data flagged so I can re-verify.
**Acceptance**:
- >90 days marked stale
- 30-90 days marked verify

### TEM-004: Confidence Scoring
**Story**: As a user, I want confidence scores so I know what to double-check.
**Acceptance**:
- Per-section score in `quality.json`
- Scores derived from coverage + recency

---

## E3: Lightweight Runtime (P0)

### LIG-001: Zero-DB CLI
**Story**: As a user, I want a CLI with no DB so it stays light.
**Acceptance**:
- Runs without any database
- Uses only local files

### LIG-002: Fast Start
**Story**: As a user, I want startup under 2 seconds so it feels instant.
**Acceptance**:
- Cold start under 2 seconds on standard laptop
- Time reported in output

### LIG-003: Offline Mode
**Story**: As a user, I want offline mode so I can work without network.
**Acceptance**:
- Uses cached sources
- Emits warning when offline

### LIG-004: Streaming Output
**Story**: As a user, I want streaming output so I can see progress early.
**Acceptance**:
- Streams sections in order
- Partial output is valid Markdown

### LIG-005: Minimal Dependencies
**Story**: As a user, I want minimal dependencies so installs are fast.
**Acceptance**:
- Core CLI uses 5 or fewer deps
- Dependency list documented

---

## E4: Quality Governance (P1)

### QUA-001: Schema Validation
**Story**: As a user, I want schema validation so I can trust outputs.
**Acceptance**:
- `specky validate` fails on invalid schema
- Error output is human-readable

### QUA-002: Citation Linting
**Story**: As a user, I want missing citations flagged so I avoid stale output.
**Acceptance**:
- Missing citations fail validation
- Output lists missing decision IDs

### QUA-003: Quality Report
**Story**: As a user, I want a quality report so I can audit spec health.
**Acceptance**:
- `quality.json` includes confidence + staleness stats
- Report includes summary table

### QUA-004: Test Checklist
**Story**: As a user, I want test checklists generated from tasks.
**Acceptance**:
- Each task maps to at least one test item
- Test checklist appended to `tasks.md`

---

## E5: Plugin Power (P1)

### PLU-001: Plugin Loader
**Story**: As a power user, I want plugins so I can extend the spec.
**Acceptance**:
- Loads plugins from `/plugins`
- Lists active plugins in `meta.json`

### PLU-002: Plugin Contract
**Story**: As a power user, I want a stable plugin interface so I can maintain extensions.
**Acceptance**:
- Contract versioned in code and docs
- Incompatible plugin versions rejected

### PLU-003: Optional MCP Enrichment
**Story**: As a power user, I want MCP-based enrichment to add integrations.
**Acceptance**:
- MCP plugin can add sections
- Core output works without MCP

### PLU-004: Plugin Sandbox
**Story**: As an admin, I want plugin sandboxing so core output stays safe.
**Acceptance**:
- Plugin errors do not crash core
- Plugin failures logged in `quality.json`

---

## Prioritization Notes (No Cap)

- P0 epics must be done before any UI work.
- P1 epics can run in parallel once core spec pack exists.

---

## Definition of Done (Global)

- All outputs validate against schema
- No missing citations
- Atomic task rule passes
- CLI start <2 seconds
- Spec pack export to Markdown + JSON
