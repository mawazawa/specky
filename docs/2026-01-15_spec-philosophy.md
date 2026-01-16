# Specky: The Spec is the Moat

> A specification so powerful that any LLM can single-shot execute it.

---

## The Problem

Current AI coding assistants fail because:

1. **Vague prompts** → Vague outputs → Endless iteration
2. **Outdated knowledge** → Wrong library versions, deprecated APIs
3. **No verification** → AI hallucinations slip through
4. **Generic tests** → "Slop tests" that test nothing useful
5. **Ugly designs** → Obviously AI-generated UI

## The Solution: Hyper-Specifications

A Specky specification is:

### 1. Temporally Grounded
Every technology decision includes verification date:
```markdown
## Tech Stack Decision: State Management

**Query**: "React state management best practices as of January 15, 2026"

**Options Evaluated**:
- Zustand 5.x (Recommended) - 2.1KB, hooks-based, TypeScript-first
- Jotai 3.x - Atomic model, 2.8KB
- Redux Toolkit 3.x - Mature but heavier (14KB)

**Decision**: Zustand 5.0.9
**Rationale**: Smallest bundle, best DX, sufficient for spec-generation app
**Verified**: 2026-01-15 via Exa MCP
```

### 2. Atomically Decomposed
Each task touches **≤3 files** and has clear boundaries:
```markdown
## Task: AT-001 - Create Clarifying Question Component

**Files (3)**:
1. `src/components/questions/ClarifyingQuestion.tsx` - Component
2. `src/components/questions/ClarifyingQuestion.test.tsx` - Tests
3. `src/types/question.ts` - Types

**NOT Touched**:
- Any API routes
- Any database logic
- Any other components

**Acceptance Criteria**:
- [ ] Renders question text
- [ ] Shows 3-5 options as radio buttons
- [ ] Highlights recommended option
- [ ] Fires onSelect callback with chosen value
- [ ] Passes 5 unit tests
```

### 3. TDD from Elite Engineers
Tests are **researched**, not generated slop:
```typescript
// BAD: AI-generated slop test
it('should render', () => {
  render(<ClarifyingQuestion />);
  expect(screen.getByRole('group')).toBeInTheDocument();
});

// GOOD: Elite TDD test with actual assertions
describe('ClarifyingQuestion', () => {
  const mockQuestion = {
    id: 'arch-001',
    question: 'What architecture pattern?',
    options: [
      { label: 'Monolith', value: 'mono', recommended: false },
      { label: 'Microservices', value: 'micro', recommended: true },
      { label: 'Modular monolith', value: 'modular', recommended: false },
    ],
  };

  it('highlights the recommended option with visual distinction', () => {
    render(<ClarifyingQuestion question={mockQuestion} />);
    const recommended = screen.getByLabelText(/microservices/i);
    expect(recommended.closest('label')).toHaveClass('bg-primary/10');
  });

  it('fires onSelect with the correct value when option clicked', async () => {
    const onSelect = vi.fn();
    render(<ClarifyingQuestion question={mockQuestion} onSelect={onSelect} />);

    await userEvent.click(screen.getByLabelText(/monolith/i));

    expect(onSelect).toHaveBeenCalledWith('mono');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation (a11y)', async () => {
    render(<ClarifyingQuestion question={mockQuestion} />);
    const group = screen.getByRole('radiogroup');

    group.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByLabelText(/microservices/i)).toHaveFocus();
  });
});
```

### 4. Beautiful by Default
Design tokens enforce Apple-level aesthetics:
```typescript
// Design system enforces consistency
const designTokens = {
  // Spacing: 4pt grid
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // Typography: Clear hierarchy
  typography: {
    h1: { size: '32px', weight: 700, tracking: '-0.02em' },
    body: { size: '16px', weight: 400, leading: 1.5 },
    caption: { size: '12px', weight: 500, color: 'muted' },
  },

  // Colors: Semantic, not arbitrary
  colors: {
    primary: 'hsl(222 47% 11%)',      // Deep blue-black
    accent: 'hsl(217 91% 60%)',        // Vibrant blue
    success: 'hsl(142 76% 36%)',       // Forest green
    muted: 'hsl(215 16% 47%)',         // Subtle gray
  },

  // Animations: Subtle, purposeful
  motion: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '400ms ease-in-out',
  },
};
```

### 5. Single-Shot Executable
The spec is so complete that an LLM can execute it without clarification:

```markdown
# Specification: User Authentication System

## Context
- App: Specky (AI specification generator)
- Framework: Next.js 16.1.2 (App Router)
- Auth: Supabase Auth with PKCE flow
- Date: January 15, 2026

## Requirements (Verified)
1. Email/password authentication
2. Magic link (passwordless) option
3. OAuth: Google, GitHub
4. Session persistence: 7 days
5. PKCE flow for security (Supabase default since 2.x)

## Technical Decisions

### Why Supabase Auth (not NextAuth/Auth.js)?
- **Bundle size**: 0KB client (uses Supabase client already included)
- **RLS integration**: Native row-level security
- **Edge compatibility**: Works in Supabase Edge Functions
- **Verified**: Auth.js 5.x still has breaking changes as of Jan 2026

### Why PKCE (not session cookies)?
- **Security**: Prevents authorization code interception
- **SPA-friendly**: No server-side session management
- **Supabase default**: Enabled by default since v2.0

## File Structure
```
src/
├── lib/auth/
│   ├── client.ts          # Supabase client singleton
│   ├── hooks.ts           # useAuth, useUser hooks
│   └── types.ts           # Auth-related types
├── app/auth/
│   ├── sign-in/page.tsx   # Sign in page
│   ├── sign-up/page.tsx   # Sign up page
│   ├── callback/route.ts  # OAuth callback handler
│   └── confirm/route.ts   # Email confirmation handler
└── components/auth/
    ├── SignInForm.tsx     # Email/password form
    ├── OAuthButtons.tsx   # Google, GitHub buttons
    └── MagicLinkForm.tsx  # Passwordless form
```

## Atomic Tasks (10 total)

### AT-001: Create Supabase Auth Client
**Files**: `src/lib/auth/client.ts`, `src/lib/auth/types.ts`
**Tests**: `src/lib/auth/client.test.ts`
**Acceptance**:
- [ ] Singleton pattern prevents multiple clients
- [ ] Environment validation throws on missing keys
- [ ] TypeScript types exported for User, Session

### AT-002: Create useAuth Hook
**Files**: `src/lib/auth/hooks.ts`
**Tests**: `src/lib/auth/hooks.test.ts`
**Acceptance**:
- [ ] Returns { user, session, isLoading, signIn, signOut }
- [ ] Subscribes to auth state changes
- [ ] Cleans up subscription on unmount

[...8 more atomic tasks...]

## Success Criteria
- [ ] User can sign up with email/password
- [ ] User can sign in with Google OAuth
- [ ] User can sign in with magic link
- [ ] Session persists across browser refresh
- [ ] Unauthorized routes redirect to /auth/sign-in
- [ ] All 15 tests pass
- [ ] Bundle size impact: <5KB

## Test Coverage
```typescript
// src/lib/auth/client.test.ts (3 tests)
// src/lib/auth/hooks.test.ts (5 tests)
// src/app/auth/sign-in/page.test.tsx (4 tests)
// src/components/auth/SignInForm.test.tsx (3 tests)
// Total: 15 tests, 100% coverage on auth logic
```

---

**This specification can be executed by**:
- Claude 4.5 Haiku (single-shot with 1-2 clarifications)
- Claude 4.5 Opus (single-shot, no clarification needed)
- Gemini 3.0 Flash (with vision for design reference)
- DeepSeek V3.2 (single-shot)
- GPT-4.5 (single-shot with 1 clarification)

**Estimated execution time**: 45-60 minutes for a competent LLM agent
```

---

## The Output: actions.md

Every Specky session produces an `actions.md` file:

```markdown
# Actions: [Project Name]

Generated: 2026-01-15T19:45:00Z
Specky Version: 0.1.0

## Summary
- Total tasks: 24
- Files affected: 42
- Estimated LLM execution: 3-4 hours
- Test coverage target: 95%

## Prerequisites
- Node.js 20+
- pnpm 10+
- Supabase account
- Anthropic API key (or alternative)

## Phase 1: Foundation (Tasks 1-6)

### Task 1: Project Scaffolding
**Atomic ID**: AT-001
**Files**: 3 (package.json, tsconfig.json, next.config.ts)
**Verified Stack**:
- Next.js 16.1.2 (as of 2026-01-15)
- TypeScript 5.9
- Tailwind CSS 4.1.18
- shadcn/ui (latest)

[...detailed task spec...]

### Task 2: Design System Setup
**Atomic ID**: AT-002
**Files**: 3 (tailwind.config.ts, globals.css, lib/design-tokens.ts)

[...continues for all 24 tasks...]

## Quality Gates

### Before Each Task
- [ ] Read task spec completely
- [ ] Verify no file overlap with parallel tasks
- [ ] Check date-sensitive dependencies

### After Each Task
- [ ] Run task-specific tests
- [ ] Verify TypeScript compiles
- [ ] Visual check matches design spec

## Success Metrics
- All 24 tasks completed
- 95%+ test coverage
- 0 TypeScript errors
- Lighthouse score >90
- Bundle size <500KB (gzipped)
```

---

## Why This Works

| Traditional Approach | Specky Approach |
|---------------------|-----------------|
| "Build a todo app" | 24 atomic tasks, each with acceptance criteria |
| AI guesses tech stack | Every choice verified against current date |
| Tests generated after | TDD: tests designed first from elite patterns |
| Generic UI | Design tokens enforce Apple-level aesthetics |
| Needs 10+ iterations | Single-shot executable by any competent LLM |

---

## The Specky Guarantee

If your specification is built with Specky:

1. **Any LLM can execute it** - Not just Claude Opus
2. **Tests will be meaningful** - Not AI slop
3. **Design will be beautiful** - Not obviously AI-generated
4. **Tech choices are current** - Verified against today's date
5. **Tasks are atomic** - ≤3 files, clear boundaries

**The spec is the moat. The execution is commodity.**
