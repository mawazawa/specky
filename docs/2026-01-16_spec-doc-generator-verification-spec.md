# Spec Document Generator Verification Spec

> Verification Date: 2026-01-16  
> Status: Draft v0.1

---

## 1. Purpose

Define how Specky verifies decisions and attaches evidence so that every Spec Pack
can be trusted and audited.

---

## 2. Verification Sources

Primary:
- Exa web search for current documentation and releases.
- Context7 for framework API confirmations (when available).

Secondary:
- Official vendor documentation and release tags.

---

## 3. Verification Requirements

Every decision MUST include:
- Source URL
- Verification date (YYYY-MM-DD)
- The exact query used

Missing any element is a blocking failure.

---

## 4. Query Format

Queries must include the verification date:

```
<topic> as of <YYYY-MM-DD>
```

Example:
```
Next.js latest stable version as of 2026-01-16
```

---

## 5. Staleness Rules

- < 30 days: fresh
- 30 to 90 days: verify
- > 90 days: stale (flagged in quality.json)

Stale decisions are allowed only if flagged.

---

## 6. Output Requirements

`sources.json` MUST map 1:1 to `meta.json` decisions:

- All decision IDs referenced
- All entries have valid dates
- All entries include query and URL

---

## 7. Failure Modes

Blocking:
- Missing citation
- Missing query
- Missing verification date
- Invalid or unknown decision ID

Non-blocking:
- Stale source (if flagged)
- Low confidence score

---

## 8. References (Exa Verified)

- IEEE 830 SRS recommended practice: https://www.utdallas.edu/~chung/RE/IEEE830-1993.pdf  
- arc42 quality requirements: https://docs.arc42.org/section-10/  
- Acceptance criteria best practices: https://www.atlassian.com/work-management/project-management/acceptance-criteria  
- Spec-driven development (Spec Kit): https://developer.microsoft.com/blog/spec-driven-development-spec-kit
