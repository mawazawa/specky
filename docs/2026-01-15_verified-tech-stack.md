# Verified Tech Stack

> **Verification Date**: January 15, 2026
> **Method**: Exa MCP web search with temporal grounding

---

## Core Framework & Language

| Technology | Latest Stable | Verified Source | Notes |
|------------|---------------|-----------------|-------|
| **Next.js** | 16.1.2 | GitHub tags (Jan 14, 2026) | NOT 15.x - use 16.x |
| **React** | 19.2.3 | GitHub releases (Dec 11, 2025) | Stable, use this |
| **TypeScript** | 5.9 | typescriptlang.org (Jan 12, 2026) | TS 6/7 still in dev |
| **Tailwind CSS** | 4.1.18 | GitHub releases (Dec 11, 2025) | NOT 4.0 - use 4.1.x |
| **Node.js** | 20+ LTS | Standard recommendation | Required for Next.js 16 |

---

## MCP Ecosystem (Critical for Specky)

### Tier 1: Production-Ready, Highly Recommended

These MCPs are battle-tested and should **heavily influence tech stack decisions**:

| MCP Server | What It Does | Why It Matters for Specky |
|------------|--------------|---------------------------|
| **Supabase MCP** | DB queries, migrations, types, RLS | If spec recommends SQL, default to Supabase |
| **GitHub MCP** | PRs, issues, repos, CI/CD | Spec tasks can create GitHub issues directly |
| **Playwright MCP** | Browser automation, E2E tests | Spec-generated tests can run immediately |
| **Context7** | Real-time docs for 50+ frameworks | Verify tech decisions against current docs |
| **Sequential Thinking** | Step-by-step reasoning | Better spec decomposition |

### Tier 2: Useful, Stable

| MCP Server | What It Does | Use Case |
|------------|--------------|----------|
| **PostgreSQL MCP** | Direct DB queries | Alternative to Supabase if needed |
| **Figma MCP** | Design tokens, component specs | Design-to-code workflows |
| **Vercel MCP** | Deployment, env vars | Deploy specs directly |
| **Firebase MCP** | Firestore, auth, hosting | Alternative backend |
| **Notion MCP** | Docs, databases | Spec storage alternative |

### Tier 3: Specialized

| MCP Server | What It Does | Use Case |
|------------|--------------|----------|
| **Brave Search** | Web search | Research during spec generation |
| **Puppeteer** | Browser automation | Screenshot-based testing |
| **Exa** | Code + web search | Chain-of-verification |
| **Memory** | Knowledge persistence | Store spec patterns |
| **Neo4j** | Graph database | Relationship-heavy specs |

---

## MCP-Aware Tech Stack Decisions

**CRITICAL PRINCIPLE**: If two technologies are functionally equivalent for the user, but one has a superior MCP, **choose the one with the better MCP**.

### Example: Database Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Supabase (PostgreSQL) | Excellent - migrations, types, RLS, queries | **DEFAULT CHOICE** |
| PlanetScale (MySQL) | Limited MCP | Only if MySQL required |
| MongoDB Atlas | Decent MCP | Only if document DB required |
| Raw PostgreSQL | Good MCP | Only if Supabase overhead unwanted |

**Specky Rule**: Unless the user explicitly needs MySQL/MongoDB features, recommend Supabase because the MCP enables:
- `apply_migration` - AI can apply schema changes
- `execute_sql` - AI can query/modify data
- `generate_typescript_types` - AI can generate types
- `list_tables`, `list_extensions` - AI can explore schema

### Example: Deployment Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Vercel | Official MCP | **DEFAULT for Next.js** |
| Netlify | Community MCP | Acceptable alternative |
| AWS/GCP | Complex setup | Only if enterprise requirements |
| Self-hosted | No MCP | Avoid unless required |

### Example: Auth Selection

| Option | MCP Quality | Verdict |
|--------|-------------|---------|
| Supabase Auth | Via Supabase MCP | **DEFAULT** - free, integrated |
| Clerk | No dedicated MCP | Only if advanced features needed |
| Auth.js/NextAuth | No MCP | Avoid - breaking changes as of Jan 2026 |
| Firebase Auth | Via Firebase MCP | Alternative if using Firebase |

---

## Specky Tech Stack (Verified Jan 15, 2026)

```json
{
  "framework": {
    "name": "Next.js",
    "version": "16.1.2",
    "verified": "2026-01-15",
    "source": "github.com/vercel/next.js/tags"
  },
  "language": {
    "name": "TypeScript",
    "version": "5.9",
    "verified": "2026-01-15",
    "source": "typescriptlang.org"
  },
  "ui": {
    "react": "19.2.3",
    "tailwind": "4.1.18",
    "verified": "2026-01-15"
  },
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

---

## Version Pinning Strategy

For Specky-generated specs, always include:

```markdown
## Tech Stack (Verified {{DATE}})

| Package | Version | Pinning | Reason |
|---------|---------|---------|--------|
| next | 16.1.2 | ^16.1.0 | Minor updates safe |
| react | 19.2.3 | ^19.2.0 | Minor updates safe |
| typescript | 5.9.x | ~5.9.0 | Patch updates only |
| tailwindcss | 4.1.18 | ^4.1.0 | Minor updates safe |
| @supabase/supabase-js | latest | ^2.x | Follow Supabase MCP |

**Verification Command**:
\`\`\`bash
npm info next version  # Should return 16.x
npm info react version # Should return 19.x
\`\`\`
```

---

## Anti-Patterns to Avoid

| Bad Practice | Why It's Bad | Specky Behavior |
|--------------|--------------|-----------------|
| Hardcoding "Next.js 15" | Outdated as of Jan 2026 | Always verify via Exa |
| Recommending Auth.js | Breaking changes ongoing | Default to Supabase Auth |
| Ignoring MCP availability | Slower AI execution | Weight MCP quality heavily |
| Using outdated Tailwind | Missing v4.1 features | Verify version before spec |

---

## How Specky Uses This

1. **Before generating any spec**, verify versions via Exa MCP
2. **When tech stack questions arise**, present MCP-aware options
3. **Default to Supabase + Vercel + Playwright** unless user has specific needs
4. **Include verification date** in every spec output
5. **Flag outdated versions** if user provides old constraints

---

**Last Updated**: January 15, 2026
**Next Review**: Before each spec generation (temporal grounding)
