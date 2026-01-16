# Verified Tech Stack Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search with temporal grounding

---

## Overview

This document captures the verified current versions of all technologies in Specky's stack, verified via Exa MCP on January 15, 2026.

## Verification Methodology

1. Run `date` command to establish current date
2. Search Exa: `"[package] latest stable version as of January 15, 2026"`
3. Cross-reference with official sources (GitHub tags, npm, official sites)
4. Document source and verification date

## Core Framework & Language

| Technology | Version | Verified Source | Verification Date |
|------------|---------|-----------------|-------------------|
| **Next.js** | 16.1.2 | GitHub tags | Jan 14, 2026 |
| **React** | 19.2.3 | GitHub releases | Dec 11, 2025 |
| **TypeScript** | 5.9 | typescriptlang.org | Jan 12, 2026 |
| **Tailwind CSS** | 4.1.18 | GitHub releases | Dec 11, 2025 |
| **Node.js** | 20+ LTS | nodejs.org | Standard recommendation |

### Critical Version Notes

| Package | Common Error | Correct Version |
|---------|--------------|-----------------|
| Next.js | Saying "15.x" | **16.1.2** (16.x is current) |
| Tailwind | Saying "4.0" | **4.1.18** (4.1.x is current) |
| TypeScript | Saying "6.x" or "7.x" | **5.9** (6/7 still in dev) |

## AI Providers (Multi-LLM)

| Provider | Model | Speed | Context | Use Case |
|----------|-------|-------|---------|----------|
| **Anthropic** | Claude 4.5 Opus | ~100 t/s | 200K | Primary reasoning |
| **Groq** | Kimi K2-0905 (Moonshot AI) | 200 t/s | 256K | Fast inference |
| **Groq** | Llama Guard 4 12B | 1200 t/s | - | Ultra-fast validation |
| **Google** | Gemini 3.0 Flash | ~300 t/s | 1M | Visual analysis, large context |
| **DeepSeek** | V3.2 | Variable | - | Alternative reasoning |

### Groq Model Notes

- **Kimi K2-0905** is from Moonshot AI, available on Groq
- 256K context window
- 200 tokens/second inference speed
- Recommended for fast inference tasks in Specky

## Backend Stack

| Component | Choice | MCP Capabilities |
|-----------|--------|------------------|
| **Database** | Supabase | `apply_migration`, `execute_sql`, `generate_typescript_types` |
| **Auth** | Supabase Auth | PKCE by default, bundled with DB |
| **Edge Functions** | Deno runtime | Via Supabase |
| **Deployment** | Vercel | Official MCP, native Next.js 16 |

### Auth Warning

**Auth.js (NextAuth)**: As of January 2026, experiencing breaking changes. **AVOID** - use Supabase Auth instead.

## Testing Stack

| Type | Tool | Reason |
|------|------|--------|
| **E2E** | Playwright | MCP enables AI test execution |
| **Unit** | Vitest | Fast, Vite-native |
| **Component** | React Testing Library | Standard for React |

## UI Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Styling** | Tailwind CSS | 4.1.18 |
| **Components** | shadcn/ui | Latest |
| **State** | React hooks + React Query | - |

## Version Pinning Strategy

```json
{
  "dependencies": {
    "next": "^16.1.0",
    "react": "^19.2.0",
    "typescript": "~5.9.0",
    "tailwindcss": "^4.1.0",
    "@supabase/supabase-js": "^2.x"
  }
}
```

| Symbol | Meaning | Use For |
|--------|---------|---------|
| `^` | Minor updates safe | Most packages |
| `~` | Patch updates only | TypeScript (compiler stability) |

## Verification Commands

Run before any spec generation:

```bash
# Temporal grounding
date

# Verify current versions
npm info next version      # Should return 16.x
npm info react version     # Should return 19.x
npm info typescript version # Should return 5.x
npm info tailwindcss version # Should return 4.1.x
```

## Anti-Patterns

| Bad Practice | Correct Practice |
|--------------|------------------|
| Saying "Next.js 15" | Verify via Exa, confirm 16.1.2 |
| Recommending Auth.js | Default to Supabase Auth |
| Ignoring MCP quality | Weight MCP heavily in decisions |
| Using training data for versions | Always verify with current date |

## Sources

- GitHub release pages (Next.js, React, Tailwind)
- typescriptlang.org official blog
- Exa MCP web search with temporal grounding
- npm registry version info
