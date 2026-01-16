# Specky - AI Specification Generator

> **Codename**: Specky (🐦 the hummingbird)
> **Vision**: Ultra-granular specification generation so powerful that any LLM can single-shot execute it
> **Target User**: Vibe coders who need minimal effort, maximum specification
> **Moat**: The Spec is the moat. Not the execution.

---

## Core Philosophy

**THE SPEC IS THE MOAT**

A Specky specification is so well-researched and hyper-detailed that:
- Claude 4.5 Haiku can single-shot execute it
- DeepSeek V3.2 can run it with zero intervention
- Gemini Flash 3.0 can build a full-stack app from it
- Any competent LLM becomes 10x more effective

**Design Principles**:
1. **Time-to-Value = Immediate** - Minimize clicks, keystrokes, menus, layers
2. **Beautiful by Default** - Apple-level design that doesn't look AI-generated
3. **Atomic Tasks** - Each task touches ≤3 files, fully researched
4. **TDD from Elite Engineers** - Real tests, not AI slop
5. **Temporally Grounded** - Every decision verified against current date

---

## Project Philosophy

Specky combines the best patterns from:
1. **AutoClaude** - Autonomous multi-session AI coding with parallel execution
2. **Ralph Wiggum** - Persistent iteration loops until completion
3. **GitHub Spec Kit** - Spec-Driven Development (SDD) workflow
4. **Claude Co-Work** - Progressive disclosure and accessibility
5. **Specificity** - Beautiful UI/UX and multi-agent debate system
6. **DEEPSHAFT** - Micro-iteration with lane-based parallel development

---

## Core Principles

### 1. Temporal Grounding (MANDATORY)
Always verify current date and use it in all research queries:
```bash
date  # Run FIRST on every session
```
Append date to Exa queries: `"topic as of January 15 2026"`

### 2. Chain-of-Verification Questions
Every specification starts with high-leverage clarifying questions:
- Present 3-5 multiple choice options
- Include recommended selection with 5-word rationale
- Verify accuracy with Exa MCP before presenting
- Use progressive disclosure (simple → complex)

### 3. Adversarial Collaborative Verification (ACV)

Instead of named celebrity personas, use **role-based challengers** following Ray Dalio's principles:

| Role | Challenge Mandate | When to Trigger |
|------|-------------------|-----------------|
| **Feasibility Challenger** | "Can this actually be built with current tech?" | Technical decisions |
| **Scope Challenger** | "Is this MVP or feature creep?" | Requirements phase |
| **UX Challenger** | "Does this add friction or remove it?" | UI/workflow decisions |
| **Security Challenger** | "What could go wrong? What's the attack surface?" | Data/auth decisions |

**Principles** (from Ray Dalio):
- **Radical Transparency**: All reasoning visible, no black boxes
- **Thoughtful Disagreement**: Challenges are constructive, not hostile
- **Believability-Weighted**: Weight by domain relevance, not persona fame
- **Disagree and Commit**: Once synthesized, move forward

**Research basis** (M3MAD-Bench, Jan 2026):
- Collaborative debate works for safety/judgment tasks
- Named personas show no measurable benefit over role-based challengers
- Selective triggering (iMAD) reduces tokens 92% while improving accuracy 13.5%

### 4. Progressive Disclosure Architecture
Skills load in 3 stages:
- **Stage 1**: Metadata only (name + description)
- **Stage 2**: Full instructions (on activation)
- **Stage 3**: Resources/scripts (on execution)

---

## Tech Stack

### Frontend (Verified Jan 15, 2026)
- **Framework**: Next.js 16.1.2 (App Router, RSC) - NOT 15.x
- **React**: 19.2.3 (use() hook, compiler)
- **TypeScript**: 5.9 (strict mode) - TS 6/7 still in dev
- **Styling**: Tailwind CSS 4.1.18 + shadcn/ui - NOT 4.0
- **State**: React hooks (add query lib per spec)

### Backend (MCP-Aware Defaults)
- **Database**: Supabase (PostgreSQL + RLS) - Best MCP, default choice
- **Auth**: Supabase Auth (PKCE) - Avoid Auth.js (breaking changes)
- **Edge Functions**: Deno runtime
- **Deployment**: Vercel - Official MCP, native Next.js 16 support

### MCP Ecosystem (Critical for Spec Execution)

| MCP | Purpose | Why Default |
|-----|---------|-------------|
| **Supabase** | DB, auth, types | AI can apply migrations, generate types |
| **GitHub** | Issues, PRs | Spec tasks become GitHub issues |
| **Playwright** | E2E tests | AI can run generated tests |
| **Context7** | Live docs | Verify tech decisions |
| **Exa** | Web + code search | Chain-of-verification |

**Specky Rule**: If two technologies are equivalent for the user, choose the one with the better MCP.

### AI Providers (Multi-LLM from Start)

| Provider | Model | Speed | Use Case |
|----------|-------|-------|----------|
| **Anthropic** | Claude 4.5 Opus | ~100 t/s | Primary reasoning, synthesis |
| **Groq** | Kimi K2-0905 (Moonshot AI) | 200 t/s | Fast inference, 256K context |
| **Groq** | Llama Guard 4 12B | 1200 t/s | Ultra-fast validation |
| **Groq** | GPT-OSS 20B | 1000 t/s | Fast generation |
| **Google** | Gemini 3.0 Flash | ~300 t/s | Visual analysis, large context |
| **DeepSeek** | V3.2 | Variable | Alternative reasoning |

**Verified as of**: January 15, 2026

### Development
- **Testing**: Planned (recommend Playwright + Vitest for generated specs)
- **Build**: Next.js (App Router)
- **Deployment**: Vercel

---

## Vercel React Best Practices (MANDATORY)

Apply these rules in priority order:

### Priority 1: Eliminate Waterfalls
- `async-parallel`: Use Promise.all() for independent operations
- `async-suspense-boundaries`: Stream content with Suspense
- `async-defer-await`: Move await into branches where used

### Priority 2: Bundle Size
- `bundle-barrel-imports`: Import directly, avoid barrel files
- `bundle-dynamic-imports`: Use next/dynamic for heavy components
- `bundle-defer-third-party`: Load analytics after hydration

### Priority 3: Server Performance
- `server-cache-react`: Use React.cache() for deduplication
- `server-serialization`: Minimize data to client components

### Priority 4-8: TBD (rule set not yet documented)

---

## Specification Workflow

### Phase 1: Requirements Discovery
```
User Input → Clarifying Questions → Requirements.md
```
- 5 high-leverage multiple choice questions
- Each with recommended option + rationale
- Chain-of-verification with Exa

### Phase 2: Design Exploration
```
Requirements → Technical Options → Design.md
```
- Architecture decisions (mono vs micro)
- Tech stack evaluation
- Trade-off analysis

### Phase 3: Implementation Planning
```
Design → Task Decomposition → Tasks.md
```
- Granular task breakdown
- Dependency mapping
- Acceptance criteria per task

### Phase 4: Execution
```
Tasks → Parallel Agents → Working Code
```
- Use Task tool with specialized agents
- Progressive implementation
- Continuous validation

---

## Agent Patterns

### Explore Agent
Use for codebase discovery:
```typescript
Task({
  subagent_type: "Explore",
  prompt: "Find all authentication-related files",
  thoroughness: "very thorough"
})
```

### Plan Agent
Use for implementation planning:
```typescript
Task({
  subagent_type: "Plan",
  prompt: "Design architecture for user auth system"
})
```

### General-Purpose Agent
Use for implementation:
```typescript
Task({
  subagent_type: "general-purpose",
  prompt: "Implement login form with validation"
})
```

---

## Memory Protocol

### Before Every Task
```javascript
// Check existing knowledge
mcp__memory__search_nodes({ query: "relevant keywords" })
```

### After Every Task
```javascript
// Store learnings
mcp__memory__create_entities({
  entities: [{
    name: "Solution: [Problem]",
    entityType: "LessonLearned",
    observations: ["Problem: X", "Solution: Y", "Date: Z"]
  }]
})
```

---

## Quality Gates

### Pre-Implementation Checklist
- [ ] Temporal grounding complete (date verified)
- [ ] Memory MCP checked for prior solutions
- [ ] Exa research with current date context
- [ ] 5 clarifying questions answered
- [ ] Multi-agent debate synthesized
- [ ] Design approved by user

### Post-Implementation Checklist
- [ ] All acceptance criteria met
- [ ] Tests passing (E2E + unit)
- [ ] Bundle size within limits
- [ ] No TypeScript errors
- [ ] Memory updated with learnings

---

## Banned Patterns

### Words to Avoid
- **"likely"** - Indicates verification skipped
- **"should"** - Indicates commitment avoided

### Anti-Patterns
- ❌ Skip temporal grounding
- ❌ Skip Memory MCP check
- ❌ Use stale documentation
- ❌ Execute without user approval
- ❌ Reinvent solved problems
- ❌ Hardcode version numbers without Exa verification
- ❌ Recommend tech without considering MCP availability
- ❌ Use training data for "latest version" claims

---

## MCP-Aware Decision Making

**CRITICAL PRINCIPLE**: When two technologies are functionally equivalent for the user, **always choose the one with the better MCP**.

### Why This Matters

A well-written Specky spec + good MCP = AI can execute autonomously.
A well-written Specky spec + no MCP = AI needs human intervention.

### Default Stack (MCP-Optimized)

| Need | Default Choice | Why |
|------|----------------|-----|
| Database | Supabase | `apply_migration`, `execute_sql`, `generate_typescript_types` |
| Deployment | Vercel | Official MCP, native Next.js support |
| Testing | Playwright | MCP enables AI test execution |
| Auth | Supabase Auth | Bundled with Supabase MCP |
| Docs lookup | Context7 | Real-time docs for 50+ frameworks |

### Override Only When

- User explicitly requests different tech (e.g., "must use MySQL")
- Functional requirement demands it (e.g., document DB needed)
- Enterprise constraint (e.g., must use AWS)

### Questions to Ask

When generating tech stack clarifying questions:
1. "Do you have a preference, or should I optimize for AI execution speed?"
2. "Any existing infrastructure constraints?"
3. "Enterprise requirements (compliance, vendor lock-in concerns)?"

If answer is "no preference" → default to MCP-optimized stack.

---

## Closed Learning Events (CLE)

Mistakes made once, learned forever. These are logged to Memory MCP.

### CLE-001: Version Verification (Jan 15, 2026)

**Trigger**: Specifying any tech stack version
**Failure**: Said "Next.js 15" when 16.1.2 was current
**Root Cause**: Used training data instead of temporal verification
**Correct Behavior**:
```bash
# ALWAYS run before stating any version
date  # Temporal grounding
# Then Exa search: "[package] latest stable version as of [today's date]"
```

### CLE-002: MCP-Blind Recommendations (Jan 15, 2026)

**Trigger**: Recommending any backend/database/deployment tech
**Failure**: Could have recommended tech without MCP
**Root Cause**: Didn't weight MCP availability in decisions
**Correct Behavior**: Check MCP availability before recommending. If equivalent options exist, prefer the one with better MCP support.

---

## File Naming Conventions (ENFORCED)

### Non-Code Files (docs/, research/, plans/)

**Pattern**: `YYYY-MM-DD_descriptive-name-suffix.md`

```
✓ 2026-01-15_auth-strategy-research.md
✓ 2026-01-15_mvp-plan.md
✗ auth-research.md (missing date - rejected)
✗ Research_Auth.md (wrong case - rejected)
```

| Suffix | Purpose |
|--------|---------|
| `-research.md` | Investigation findings |
| `-plan.md` | Implementation plans |
| `-spec.md` | Specifications |
| `-adr.md` | Architecture decisions |

### Code Files (src/)

| Type | Convention | Example |
|------|------------|---------|
| TypeScript | camelCase | `specEngine.ts` |
| React Components | PascalCase | `QuestionCard.tsx` |
| Folders | kebab-case | `src/lib/spec-engine/` |

### Why Date Prefixes Matter

Files become stale. Without dates, you can't tell if research is current:
- **< 30 days**: Fresh, trust it
- **30-90 days**: Verify key claims
- **> 90 days**: Re-research before using

**Full guide**: `docs/2026-01-15_naming-conventions.md`

### Enforcement Stack (Verified Jan 15, 2026)

| Layer | Tool | Purpose |
|-------|------|---------|
| **Validation** | `scripts/validate-filenames.sh` | Bash script with custom regex |
| **Pre-commit** | Lefthook | Block commits with invalid filenames |
| **CI** | GitHub Actions | Final gate before merge |

```bash
# Run validation manually
npm run lint:filenames
```

**What Does NOT Work** (verified via Chain-of-Verification):
- Claude Code Hooks - `permissionDecision: "deny"` is ignored (issues #4362, #4669, #15441)
- Biome `useFilenamingConvention` - false positives on date prefixes (issue #3952)
- eslint-plugin-validate-filename - ESLint can't parse markdown without plugins
- Husky - slower than Lefthook, sequential execution

---

## File Structure (Current)

```
specky/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # UI primitives
│   ├── lib/                    # Utilities
│   └── hooks/                  # Custom React hooks
├── .claude/                    # Claude hooks (local tooling)
├── docs/                       # Documentation
├── fixtures/                   # Golden spec packs
├── plans/                      # Roadmaps and plans
├── research/                   # Verified research
├── schemas/                    # Spec pack schemas
├── scripts/                    # Validation and quality gates
└── templates/                  # Spec output templates
```

---

## Commands

### Development
```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run start          # Run production server
npm run lint           # Lint code
npm run lint:filenames # Validate docs/research/plans naming
npm run typecheck      # TypeScript check
npm run validate:specpack # Validate golden spec pack
npm run quality:gate   # Enforce perfect-spec contract
```

### Spec Generation (CLI)
```bash
specky new "Build a user authentication system"
specky validate ./spec-pack --strict
specky verify ./spec-pack
```

---

**Effective**: January 15, 2026
**Version**: 0.1.0
