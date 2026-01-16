# Spec Document Generator Roadmap (No Cap)

> Goal: Lightweight core, powerful spec pack moat  
> Date: 2026-01-16

---

## Phase 0: Contract Lock (v0.1)

**Outcome**: Spec Pack contract is unambiguous and enforced.

- Finalize schema and quality contract
- Golden spec pack fixtures pass quality gate
- CLI surface defined (but not implemented)

Exit criteria:
- 100 percent schema validation on fixtures
- 0 missing citations in fixtures

---

## Phase 1: Core Generator (v0.2)

**Outcome**: Deterministic, local-first spec pack generation.

- Generator emits requirements, design, tasks
- Deterministic ordering rules enforced
- Minimal dependencies (5 or fewer)

Exit criteria:
- Spec pack generation under 10 seconds
- Cold start under 2 seconds

---

## Phase 2: Verification Engine (v0.3)

**Outcome**: Evidence-backed specs with staleness control.

- Exa verification flow for decisions
- Caching and offline mode
- Staleness flags and confidence scoring

Exit criteria:
- 100 percent decision citation coverage
- Staleness flags populated for all decisions

---

## Phase 3: Quality Governance (v0.4)

**Outcome**: Hard gate for perfect specs.

- Strict validation mode
- Quality gate report output
- Regression snapshots against fixtures

Exit criteria:
- Quality gate enforced by default
- Fixture drift requires explicit approval

---

## Phase 4: Plugins and Extensions (v0.5)

**Outcome**: Power without core bloat.

- Plugin API and loader
- Optional MCP enrichment
- Plugin failures isolated and logged

Exit criteria:
- Core works with zero plugins
- Plugin errors do not block base output

---

## Phase 5: Optional Web UI (v0.6)

**Outcome**: Non-coder friendly interface.

- Guided questions and progress UI
- Export spec packs
- Sync with CLI outputs

Exit criteria:
- UI flow produces identical spec packs to CLI

---

## Prioritization Rule

Core spec generation and verification must ship before any UI work.
Power is added through plugins, not core bloat.
