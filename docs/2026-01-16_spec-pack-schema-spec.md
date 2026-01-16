# Spec Pack Schema (v1.0.0)

> **Status**: Draft v0.1
> **Effective**: 2026-01-16
> **Goal**: Define the canonical output structure for every Specky run.

---

## 1. File Layout

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

## 2. Versioning

- `specPackVersion` is semver.
- Major changes break compatibility and require new validators.
- Minor changes add optional fields.
- Patch changes are non-breaking.

---

## 3. meta.json (Required)

### 3.1 JSON Schema (core fields)
```json
{
  "specPackVersion": "1.0.0",
  "generatedAt": "2026-01-16T00:00:00Z",
  "verificationDate": "2026-01-16",
  "projectName": "string",
  "inputs": {
    "prompt": "string",
    "clarifyingQuestions": ["string"],
    "answers": ["string"]
  },
  "decisions": [
    {
      "id": "DEC-001",
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

### 3.2 Required Constraints
- `decisions[].id` must be unique.
- `decisions[].sources` must contain at least one URL.
- `verificationDate` must match the date used in verification queries.

---

## 4. sources.json (Required)

### 4.1 Schema
```json
{
  "sources": [
    {
      "decisionId": "DEC-001",
      "url": "https://example.com",
      "verifiedAt": "YYYY-MM-DD",
      "query": "string",
      "title": "string (optional)",
      "excerpt": "string (optional)"
    }
  ]
}
```

### 4.2 Required Constraints
- `decisionId` must map to `meta.json` decisions.
- `verifiedAt` must be a valid date.

---

## 5. quality.json (Required)

### 5.1 Schema
```json
{
  "overallScore": 0,
  "sections": {
    "requirements": 0,
    "design": 0,
    "tasks": 0
  },
  "staleness": {
    "fresh": ["DEC-001"],
    "verify": ["DEC-002"],
    "stale": ["DEC-003"]
  },
  "violations": {
    "missingCitations": ["DEC-004"],
    "atomicTaskFailures": ["AT-007"]
  }
}
```

### 5.2 Required Constraints
- Scores range from 0 to 100.
- Any violation list triggers warnings or blocking failures per quality contract.

---

## 6. requirements.md (Required)

### 6.1 Required Sections
- Goal
- Scope
- Non-Goals
- Requirements
- Clarifying Questions
- Acceptance Criteria

### 6.2 Format Rules
- Each section is a top-level heading (`##`).
- Clarifying Questions must be numbered.

---

## 7. design.md (Required)

### 7.1 Required Sections
- Architecture
- Data Model
- Security
- Performance
- Alternatives Considered
- Trade-offs

---

## 8. tasks.md (Required)

### 8.1 Task Structure
Each task uses the following template:
```
### AT-001: Task Title
**Files (<=3)**:
- `path/to/file1`
- `path/to/file2`

**NOT Touched**:
- `path/to/other`

**Acceptance Criteria**:
- [ ] Item 1
- [ ] Item 2
```

### 8.2 Required Constraints
- Task IDs must be unique.
- Files list length must be <=3.
- Acceptance criteria must contain at least 2 items.

---

## 9. Validation Rules

- All required files must exist.
- `meta.json`, `sources.json`, `quality.json` must parse as JSON.
- `meta.json.decisions` must have citations in `sources.json`.
- `tasks.md` must pass atomicity rule.

---

## 10. Example Minimal Spec Pack

```
spec-pack/
├── meta.json (1 decision)
├── requirements.md (goal + 3 questions)
├── design.md (architecture + trade-offs)
├── tasks.md (3 atomic tasks)
├── sources.json (1 citation)
└── quality.json (scores + no violations)
```

---

## 11. References

- https://addyosmani.com/blog/good-spec/
- https://nathanlasnoski.com/2026/01/08/what-is-spec-driven-development/
- https://developer.microsoft.com/blog/spec-driven-development-spec-kit
