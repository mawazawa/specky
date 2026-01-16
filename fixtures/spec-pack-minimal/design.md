# Design

## Architecture
Local-first CLI that writes spec packs to disk.

## Data Model
Spec Pack consists of meta, requirements, design, tasks, sources, quality.

## Security
No secrets stored beyond local files.

## Performance
Cold start under 2 seconds.

## Alternatives Considered
- SaaS UI (rejected for v0)

## Trade-offs
Simplicity over advanced integrations in v0.
