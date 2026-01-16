# 🐦 Specky

> **The Spec is the Moat**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://typescriptlang.org)

---

## What is Specky?

Specky is building a spec-first generator that produces specifications so powerful that
**any LLM can single-shot execute them**.

**Current state**: the repo ships the spec-pack contract, quality gate, golden fixtures,
and a CLI that generates validated spec packs with Exa-backed verification.

- Claude 4.5 Haiku? Single-shot.
- DeepSeek V3.2? Zero intervention.
- Gemini Flash 3.0? Full-stack app from one spec.

**The spec is the moat. The execution is commodity.**

### Core Principles

1. **Time-to-Value = Immediate** - Minimal clicks, keystrokes, menus
2. **Beautiful by Default** - Apple-level design, never looks AI-generated
3. **Atomic Tasks** - Each task touches ≤3 files, fully researched
4. **Elite TDD** - Real tests from TDD engineers, not AI slop
5. **Temporally Grounded** - Every decision verified against current date

## Why Specky?

| Problem | Specky Solution |
|---------|-----------------|
| Vague prompts → endless iteration | Hyper-detailed specs any LLM can execute |
| AI generates outdated code | Temporal grounding + Exa verification with current date |
| Generic "slop" tests | Elite TDD patterns from real engineers |
| Ugly AI-generated UI | Design tokens enforce Apple-level aesthetics |
| Tasks touch too many files | Atomic decomposition: ≤3 files per task |
| Single perspective blind spots | Role-based challenger debate + synthesis |

---

## Research Foundation

Specky synthesizes patterns from the best AI development tools (as of January 2026):

### AutoClaude (v2.7.4)
- **What it does**: Autonomous multi-session AI coding with Kanban board
- **Key pattern**: Parallel execution (up to 12 agents), git worktrees isolation
- **Specky adopts**: Parallel agent execution, visual task management

### Ralph Wiggum Plugin
- **What it does**: Persistent iteration loops using Stop hook
- **Key pattern**: Re-prompts until completion promise is met
- **Specky adopts**: Iterative refinement until specification is complete

### GitHub Spec Kit
- **What it does**: Spec-Driven Development workflow
- **Key pattern**: Constitution → Specify → Plan → Tasks → Implement
- **Specky adopts**: Phased specification workflow with approval gates

### Claude Co-Work
- **What it does**: Claude Code for non-coders (released Jan 12, 2026)
- **Key pattern**: Folder-based sandbox, progressive disclosure
- **Specky adopts**: Accessible UI for non-technical users

### Specificity (Original)
- **What it does**: Multi-agent debate for specification generation
- **Key pattern**: 8 AI agents debate, then synthesize into spec
- **Specky adopts**: Role-based challengers with conflict resolution

### DEEPSHAFT
- **What it does**: Micro-iteration with lane-based parallel development
- **Key pattern**: Single-branch, 6 parallel lanes, smoke tests per lane
- **Specky adopts**: Constraint-based scoping, fast feedback loops

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SPECKY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Temporal   │───▶│   Memory     │───▶│    Exa       │       │
│  │  Grounding   │    │   MCP Check  │    │   Research   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              CLARIFYING QUESTIONS ENGINE                 │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │    │
│  │  │ Q1: Arch│  │Q2: Stack│  │Q3: Scale│  │Q4: Users│    │    │
│  │  │ (Rec:B) │  │ (Rec:A) │  │ (Rec:C) │  │ (Rec:A) │    │    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               ROLE-BASED CHALLENGERS                     │    │
│  │ ┌─────────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐  │    │
│  │ │ Feasibility │ │  Scope   │ │   UX    │ │  Security │  │    │
│  │ │    0.8      │ │  0.7     │ │  0.7    │ │   0.8     │  │    │
│  │ └─────────────┘ └──────────┘ └─────────┘ └───────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              SYNTHESIS & CONFLICT RESOLUTION             │    │
│  │  • Identify conflicting perspectives                     │    │
│  │  • Find pragmatic middle ground                         │    │
│  │  • Generate unified specification                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   OUTPUT ARTIFACTS                       │    │
│  │  📄 requirements.md  📐 design.md  ✅ tasks.md          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Specification Workflow

### Phase 1: Requirements Discovery
```
User: "I want to build a todo app"

Specky: "Let me ask 5 clarifying questions to understand your needs:

1. **Target Platform** (Architecture)
   - A) Web only (Recommended - fastest to ship)
   - B) Web + Mobile (React Native)
   - C) Native iOS + Android
   - D) Desktop (Electron)

2. **User Scale** (Performance)
   - A) Personal use (<100 users)
   - B) Small team (100-1000 users)
   - C) SaaS product (1000-100K users) (Recommended - prepares for growth)
   - D) Enterprise (100K+ users)

[...3 more questions...]"
```

### Phase 2: Role-Based Challenger Review
```
Running 4 role-based challengers in parallel...

Feasibility Challenger: "Can this be built with current tech?"
Scope Challenger: "Is this MVP or feature creep?"
UX Challenger: "Does this remove friction?"
Security Challenger: "What could go wrong?"

Conflicts identified: Scale vs Simplicity
Resolution: Start simple, design for scale
```

### Phase 3: Specification Output
```markdown
# Todo App Specification

## Overview
A web-based task management application for small teams.

## Requirements
- User authentication (email + social)
- Task CRUD with due dates
- Team sharing with permissions
- Mobile-responsive design

## Technical Approach
- Next.js 16.1.2 (App Router)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + shadcn/ui
- Vercel deployment

## MVP Scope
1. User registration/login
2. Personal task list
3. Basic sharing

## Non-Negotiables
- Sub-100ms task creation
- Offline support (PWA)
- WCAG AA accessibility
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/specky.git
cd specky

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and API keys

# Run repo checks
npm run lint
npm run lint:filenames
npm run quality:gate

# Development server
npm run dev
```

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Providers
ANTHROPIC_API_KEY=your-anthropic-key
GROQ_API_KEY=your-groq-key  # For fast inference
EXA_API_KEY=your-exa-key    # Verification search

# Optional
SENTRY_DSN=your-sentry-dsn  # Error tracking
```

---

## Usage

### CLI Mode
```bash
# Generate a spec pack (requires EXA_API_KEY)
specky new "Build a user authentication system"

# Validate an existing spec pack
specky validate ./spec-pack --strict

# Re-verify sources for a spec pack (uses cache if --offline)
specky verify ./spec-pack
```

### Web Mode (Planned)
1. Navigate to `http://localhost:3000`
2. Describe your project idea
3. Answer clarifying questions
4. Review multi-agent debate
5. Export specification (Markdown, PDF, or JSON)

---

## Spec Pack Quality Gate

Specky enforces the perfect-spec contract on every run. Run this locally to verify
the golden spec pack fixture and validation logic:

```bash
npm run validate:specpack
npm run quality:gate
```

---

## Default Stack for Generated Specs (Verified Jan 15, 2026)

| Category | Technology | Version | Verified Source |
|----------|------------|---------|-----------------|
| Framework | Next.js | **16.1.2** | GitHub tags (Jan 14, 2026) |
| React | React | **19.2.3** | GitHub releases (Dec 11, 2025) |
| Language | TypeScript | **5.9** | typescriptlang.org |
| Styling | Tailwind CSS | **4.1.18** | GitHub releases (Dec 11, 2025) |
| Database | Supabase | Latest | PostgreSQL + RLS |
| Testing | Playwright | Recommended | E2E tests (planned in repo) |

### MCP-Optimized Defaults

Specky recommends tech based on **MCP availability** for AI execution:

| Need | Default | MCP Capabilities |
|------|---------|------------------|
| Database | Supabase | `apply_migration`, `execute_sql`, `generate_types` |
| Deploy | Vercel | Official MCP, native Next.js 16 |
| Testing | Playwright | AI can execute generated tests |
| Docs | Context7 | Real-time docs for 50+ frameworks |

**Rule**: If two technologies are equivalent for the user, choose the one with better MCP support.

### AI Providers (Multi-LLM)

| Provider | Model | Speed | Use Case |
|----------|-------|-------|----------|
| Anthropic | Claude 4.5 Opus | ~100 t/s | Primary reasoning |
| Groq | Kimi K2-0905 (Moonshot) | 200 t/s | Fast inference, 256K context |
| Groq | Llama Guard 4 12B | 1200 t/s | Ultra-fast validation |
| Google | Gemini 3.0 Flash | ~300 t/s | Visual analysis |
| DeepSeek | V3.2 | Variable | Alternative reasoning |

*All versions verified via Exa MCP on January 15, 2026*

---

## Roadmap

### v0.1.0 (Current)
- [ ] Project scaffolding
- [ ] Basic clarifying questions
- [ ] Single-agent specification

### v0.2.0
- [ ] Multi-agent debate system
- [ ] Memory MCP integration
- [ ] Export to Markdown/PDF

### v0.3.0
- [ ] Web UI with streaming
- [ ] Template library
- [ ] Team collaboration

### v1.0.0
- [ ] Production-ready
- [ ] SaaS offering
- [ ] API access

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built on the shoulders of giants:
- [AutoClaude](https://github.com/AndyMik90/Auto-Claude) - Autonomous coding framework
- [GitHub Spec Kit](https://github.com/github/spec-kit) - Spec-driven development
- [Claude Code](https://claude.ai) - AI pair programming
- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills) - Performance patterns

---

**Made with ❤️ and lots of clarifying questions**
