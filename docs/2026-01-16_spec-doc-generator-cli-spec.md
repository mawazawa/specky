# Spec Document Generator CLI Spec

> Verification Date: 2026-01-16  
> Status: Draft v0.1

---

## 1. Commands

### 1.1 `specky new "<prompt>"`

Generates a new Spec Pack from a single prompt.

Flags:
- `--output <dir>`: destination folder (default: `./spec-pack`)
- `--format md,json`: output formats (default: `md,json`)
- `--offline`: use cache only, no live verification
- `--verify`: force live verification (default true)

Exit codes:
- 0 success
- 1 validation failure
- 2 verification failure

---

### 1.2 `specky validate <spec-pack-path>`

Runs schema and quality validation against a Spec Pack.

Flags:
- `--strict`: treat warnings as errors

Exit codes:
- 0 success
- 1 validation failure

---

### 1.3 `specky verify <spec-pack-path>`

Re-runs verification for all decisions and updates sources and quality.

Flags:
- `--offline`: use cache only

Exit codes:
- 0 success
- 2 verification failure

---

## 2. Deterministic Output

For identical inputs and verification results:
- Section order is stable.
- Task IDs are stable.
- Files are emitted in the same order.

---

## 3. Output Layout

```
spec-pack/
├── meta.json
├── requirements.md
├── design.md
├── tasks.md
├── sources.json
└── quality.json
```

---

## 4. Error Reporting

All failures must include:
- file path
- decision or task ID
- reason
- remediation hint

---

## 5. References

- Spec Pack schema: `docs/2026-01-16_spec-pack-schema-spec.md`
- Quality contract: `docs/2026-01-16_spec-quality-contract-spec.md`
