# MCP Ecosystem Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search + MCP documentation

---

## Overview

**MCP**: Model Context Protocol
**Purpose**: Enable AI models to interact with external tools and data sources
**Relevance to Specky**: MCP availability should influence tech stack decisions

## Core Principle

> **If two technologies are functionally equivalent for the user, choose the one with the better MCP.**

A well-written Specky spec + good MCP = AI can execute autonomously.
A well-written Specky spec + poor MCP = AI needs human intervention.

## MCP Tiers

### Tier 1: Production-Ready, Highly Recommended

These MCPs should **heavily influence tech stack decisions**:

| MCP Server | Capabilities | Impact on Specky |
|------------|--------------|------------------|
| **Supabase MCP** | `apply_migration`, `execute_sql`, `generate_typescript_types`, `list_tables`, `get_logs` | Default to Supabase for any SQL needs |
| **GitHub MCP** | PRs, issues, repos, CI/CD | Spec tasks become GitHub issues |
| **Playwright MCP** | Browser automation, E2E tests | Spec-generated tests run immediately |
| **Context7** | Real-time docs for 50+ frameworks | Verify tech decisions against current docs |
| **Sequential Thinking** | Step-by-step reasoning | Better spec decomposition |

### Tier 2: Useful, Stable

| MCP Server | Capabilities | Use Case |
|------------|--------------|----------|
| **PostgreSQL MCP** | Direct DB queries | Alternative to Supabase |
| **Figma MCP** | Design tokens, specs | Design-to-code workflows |
| **Vercel MCP** | Deployment, env vars | Deploy specs directly |
| **Firebase MCP** | Firestore, auth, hosting | Alternative backend |
| **Notion MCP** | Docs, databases | Spec storage alternative |

### Tier 3: Specialized

| MCP Server | Capabilities | Use Case |
|------------|--------------|----------|
| **Brave Search** | Web search | Research during spec generation |
| **Puppeteer** | Browser automation | Screenshot-based testing |
| **Exa** | Code + web search | Chain-of-verification |
| **Memory** | Knowledge persistence | Store spec patterns |
| **Neo4j** | Graph database | Relationship-heavy specs |

## MCP-Aware Decision Examples

### Database Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Supabase (PostgreSQL) | Excellent | **DEFAULT CHOICE** |
| PlanetScale (MySQL) | Limited | Only if MySQL required |
| MongoDB Atlas | Decent | Only if document DB required |
| Raw PostgreSQL | Good | Only if Supabase overhead unwanted |

### Deployment Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Vercel | Official MCP | **DEFAULT for Next.js** |
| Netlify | Community MCP | Acceptable alternative |
| AWS/GCP | Complex setup | Only if enterprise requirements |
| Self-hosted | No MCP | Avoid unless required |

### Auth Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Supabase Auth | Via Supabase MCP | **DEFAULT** |
| Clerk | No dedicated MCP | Only if advanced features needed |
| Auth.js/NextAuth | No MCP | **AVOID** - breaking changes as of Jan 2026 |
| Firebase Auth | Via Firebase MCP | Alternative if using Firebase |

## Specky Default Stack (MCP-Optimized)

```json
{
  "backend": {
    "name": "Supabase",
    "reason": "Best-in-class MCP enables AI execution of specs",
    "mcp_capabilities": [
      "apply_migration",
      "execute_sql",
      "generate_typescript_types",
      "list_tables",
      "get_logs"
    ]
  },
  "deployment": {
    "name": "Vercel",
    "reason": "Official MCP, native Next.js support"
  },
  "testing": {
    "e2e": "Playwright",
    "reason": "Official MCP enables AI-driven test execution"
  }
}
```

## Override Conditions

Only recommend non-default tech when:
- User explicitly requests it ("must use MySQL")
- Functional requirement demands it (document DB needed)
- Enterprise constraint (must use AWS)

## Sources

- MCP official documentation
- Supabase MCP repository
- Vercel MCP documentation
- Community MCP implementations
