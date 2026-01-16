# Multi-Agent Debate Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search + academic papers

---

## Overview

Research into whether multi-agent debate systems improve AI output quality, and specifically whether named personas (celebrities) provide measurable benefits.

## Key Findings

### M3MAD-Bench (January 2026)

**Finding**: Named personas show **no measurable benefit** over role-based challengers.

- Celebrity personas don't improve reasoning quality
- Role-based challengers (e.g., "Security Expert") are equally effective
- Token cost of celebrity context is not justified

### iMAD: Intermittent Multi-Agent Debate (AAAI 2026)

**Finding**: Selective triggering dramatically improves efficiency.

| Metric | Improvement |
|--------|-------------|
| Token reduction | 92% |
| Accuracy improvement | 13.5% |

**Key insight**: Debate isn't needed for every decision. Trigger only when:
- High uncertainty detected
- Multiple valid approaches exist
- Stakes justify the overhead

### Debate Effectiveness by Domain

| Domain | Debate Value | Notes |
|--------|--------------|-------|
| Safety/judgment tasks | HIGH | Collaborative debate catches blind spots |
| Factual questions | LOW | Single agent with verification is sufficient |
| Creative tasks | MEDIUM | Debate can spark alternatives |
| Technical architecture | HIGH | Challenge assumptions before commitment |

## Sycophancy Failure Mode

**Problem**: Agents tend to agree to avoid conflict, negating debate value.

**Solution**: Adversarial Collaborative Verification (ACV)
- Agents have explicit mandate to challenge
- Disagreement is rewarded, not penalized
- Synthesis phase resolves conflicts constructively

## Ray Dalio Principles Applied

| Principle | Application |
|-----------|-------------|
| **Radical Transparency** | All agent reasoning visible |
| **Thoughtful Disagreement** | Challenge to improve, not to win |
| **Believability-Weighted** | Weight by domain expertise |
| **Disagree and Commit** | Once synthesized, move forward |

## Specky Implementation

### Role-Based Challengers (NOT Celebrity Personas)

| Role | Challenge Mandate | When to Trigger |
|------|-------------------|-----------------|
| **Feasibility Challenger** | "Can this actually be built?" | Technical decisions |
| **Scope Challenger** | "Is this MVP or feature creep?" | Requirements phase |
| **UX Challenger** | "Does this add or remove friction?" | UI decisions |
| **Security Challenger** | "What could go wrong?" | Data/auth decisions |

### Selective Triggering

Only invoke challengers when:
1. Architecture decisions are being made
2. Multiple valid approaches exist
3. User explicitly requests review
4. High-stakes functionality (auth, payments)

## Sources

- M3MAD-Bench paper (January 2026)
- iMAD: Intermittent Multi-Agent Debate (AAAI 2026)
- Ray Dalio "Principles" for organizational decision-making
- Academic research on LLM debate effectiveness
