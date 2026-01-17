/**
 * User Message Templates - Phase-Specific Prompts
 *
 * These templates construct the user messages sent to each agent.
 * They follow the Role → Goal → Context → Instructions → Output pattern.
 *
 * Based on January 2026 research:
 * - Structured CoT for code generation (AAAI 2026)
 * - Intention Chain-of-Thought (ICoT) for complex tasks
 * - Few-shot examples for format compliance
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type {
  DiscoveryInput,
  DiscoveryOutput,
  ChallengeInput,
  DesignInput,
  DecompositionInput,
  ValidationInput,
  SynthesisInput,
} from '../../../../planning/schemas';

/**
 * Format a JSON schema for the expected output
 */
function formatOutputSchema(schemaName: string, properties: Record<string, string>): string {
  const props = Object.entries(properties)
    .map(([key, type]) => `  "${key}": ${type}`)
    .join(',\n');
  return `Expected output schema (${schemaName}):\n{\n${props}\n}`;
}

/**
 * Discovery Agent User Message
 */
export function createDiscoveryMessage(input: DiscoveryInput): string {
  const schema = formatOutputSchema('DiscoveryOutput', {
    parsed_intent: 'string - One sentence capturing what user wants',
    clarifying_questions: `[
      {
        "question": "string - The question",
        "rationale": "string - Why this matters",
        "recommended": "string - Best answer",
        "alternatives": ["string"] - Other valid options
      }
    ] - Exactly 5 questions`,
    mentioned_tech: `[
      {
        "name": "string - Technology name",
        "context": "string - How it was mentioned",
        "verified": false - Always false initially
      }
    ]`,
    requirements_draft: `{
      "goal": "string - Success criteria",
      "scope": ["string"] - 3-5 included items,
      "non_goals": ["string"] - 2-3 excluded items
    }`,
  });

  return `
<task>
Analyze this project request and prepare it for specification generation.
</task>

<user_prompt>
${input.user_prompt}
</user_prompt>

${input.project_context ? `<project_context>\n${input.project_context}\n</project_context>` : ''}

<thinking_steps>
Before responding, think through:
1. What is the user's core goal? (Not the features, the outcome)
2. Who will use this? (End users, developers, admins?)
3. What domain is this? (Web, mobile, CLI, API, etc.)
4. What decisions will most impact implementation?
5. What technologies were mentioned or implied?
</thinking_steps>

<example_output>
{
  "parsed_intent": "Build a task management app for remote teams with real-time collaboration",
  "clarifying_questions": [
    {
      "question": "What scale of team should this support?",
      "rationale": "Affects database design and real-time architecture",
      "recommended": "Small teams (2-10 people)",
      "alternatives": ["Solo use only", "Medium teams (10-50)", "Enterprise (50+)"]
    }
  ],
  "mentioned_tech": [
    {
      "name": "React",
      "context": "User mentioned wanting a React frontend",
      "verified": false
    }
  ],
  "requirements_draft": {
    "goal": "Enable remote teams to manage tasks with real-time updates",
    "scope": ["Task CRUD operations", "Real-time sync", "Team workspaces"],
    "non_goals": ["Time tracking", "Invoicing", "Project templates"]
  }
}
</example_output>

${schema}

Respond with valid JSON only.
`;
}

/**
 * Challenge Agent User Message
 */
export function createChallengeMessage(input: ChallengeInput): string {
  const { discovery_output, answered_questions } = input;

  const questionsContext = answered_questions
    .map((q, i) => `${i + 1}. ${q.question}\n   Answer: ${q.answer || q.recommended}`)
    .join('\n');

  const schema = formatOutputSchema('ChallengeOutput', {
    challenges: `[
      {
        "type": "feasibility | scope | security | ux | performance",
        "concern": "string - The specific concern",
        "evidence": "string - Why this is a concern",
        "suggested_resolution": "string - How to address it",
        "status": "open",
        "severity": "must_resolve | consider"
      }
    ] - At least 3 challenges`,
    requirements_challenged: `{
      "goal": "string - Refined goal",
      "scope": ["string"] - Refined scope,
      "non_goals": ["string"] - Refined non-goals,
      "acceptance_criteria": ["string"] - Testable criteria
    }`,
    needs_discovery_loop: 'boolean - True if critical info missing',
    loop_reason: 'string | null - Why loop is needed',
  });

  return `
<task>
Adversarially review these requirements and find weaknesses.
Your job is to prevent problems, not rubber-stamp the spec.
</task>

<parsed_intent>
${discovery_output.parsed_intent}
</parsed_intent>

<requirements_draft>
Goal: ${discovery_output.requirements_draft.goal}

Scope:
${discovery_output.requirements_draft.scope.map((s) => `- ${s}`).join('\n')}

Non-Goals:
${discovery_output.requirements_draft.non_goals.map((s) => `- ${s}`).join('\n')}
</requirements_draft>

<clarifying_questions_answers>
${questionsContext}
</clarifying_questions_answers>

<mentioned_technologies>
${discovery_output.mentioned_tech.map((t) => `- ${t.name}: ${t.context}`).join('\n')}
</mentioned_technologies>

<review_checklist>
1. FEASIBILITY: Can each requirement actually be built?
2. SCOPE: Is this MVP-sized or feature creep?
3. SECURITY: What data needs protection? What's the attack surface?
4. UX: Does every requirement serve a clear user need?
5. PERFORMANCE: Are there any unbounded operations?
</review_checklist>

<thinking_steps>
For each category:
1. List what could go wrong
2. Rate severity (must_resolve vs consider)
3. Propose a concrete resolution
</thinking_steps>

${schema}

Respond with valid JSON only. Include at least 3 genuine challenges.
`;
}

/**
 * Architect Agent User Message
 */
export function createArchitectMessage(input: DesignInput): string {
  const { requirements, verified_tech, challenges } = input;

  const challengeContext = challenges
    .filter((c) => c.status !== 'dismissed')
    .map((c) => `- [${c.type.toUpperCase()}] ${c.concern}\n  Resolution: ${c.suggested_resolution}`)
    .join('\n');

  const techContext = verified_tech
    .map((t) => `- ${t.name}${t.verified ? ` (verified: ${t.verification?.latest_version})` : ' (needs verification)'}`)
    .join('\n');

  const schema = formatOutputSchema('DesignOutput', {
    architecture: 'string - High-level architecture description',
    tech_stack: `{
      "verified_at": "string - ISO date",
      "verification_method": "mcp__exa__web_search_exa",
      "frontend": {
        "framework": { "name": "string", "version": "string", "verified_latest": true, "verification_source": "URL" },
        "react": { ... },
        "typescript": { ... },
        "styling": { ... }
      },
      "backend": { ... },
      "ai": { ... }
    }`,
    file_structure: 'string - Directory tree',
    decisions: `[
      {
        "id": "D-001",
        "topic": "string",
        "decision": "string",
        "alternatives_considered": [{ "option": "string", "rejected_because": "string" }],
        "challenger_objection": "string",
        "response": "string",
        "verified_at": "string - ISO date",
        "verification_source": "URL"
      }
    ]`,
    schemas: `{
      "schema-name.ts": "string - COMPLETE TypeScript code"
    }`,
    needs_refinement: 'boolean',
    refinement_notes: '["string"] | null',
  });

  return `
<task>
Design the architecture and make definitive technology decisions.
Every decision must be verified. Every schema must be COMPLETE.
</task>

<requirements>
Goal: ${requirements.goal}

Scope:
${requirements.scope.map((s) => `- ${s}`).join('\n')}

Acceptance Criteria:
${requirements.acceptance_criteria.map((c) => `- ${c}`).join('\n')}
</requirements>

<challenges_to_address>
${challengeContext || 'No unresolved challenges.'}
</challenges_to_address>

<mentioned_technologies>
${techContext || 'No specific technologies mentioned - optimize for MCP support.'}
</mentioned_technologies>

<architecture_instructions>
1. Choose a high-level pattern (Next.js App Router recommended for web apps)
2. Define the data model entities
3. Map out the API/data flow
4. Identify external service integrations
</architecture_instructions>

<tech_stack_instructions>
For EVERY technology, provide:
- Exact version (e.g., "16.1.3", not "latest" or "16.x")
- verification_source: URL to official release notes or npm
- verified_at: Today's date (${new Date().toISOString().slice(0, 10)})

Default stack if no preferences:
- Next.js 16.1.3 (App Router)
- React 19.2.3
- TypeScript 5.7.0
- Tailwind CSS 4.1.18
- Supabase (PostgreSQL + Auth)
- Vitest 4.0.0 + Playwright 1.57.0
</tech_stack_instructions>

<decision_instructions>
For each significant choice (database, auth, state management, etc.):
1. State the decision clearly
2. List 2+ alternatives you considered
3. Explain why each alternative was rejected
4. Anticipate an objection and address it
5. Provide a verification URL
</decision_instructions>

<schema_instructions>
Write COMPLETE TypeScript schemas. Example of COMPLETE:

\`\`\`typescript
/**
 * User entity schema
 */
export interface User {
  /** Unique identifier (UUID) */
  id: string;
  /** User's email address */
  email: string;
  /** Display name */
  name: string;
  /** Profile avatar URL */
  avatarUrl: string | null;
  /** Account creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Create user input (for registration)
 */
export interface CreateUserInput {
  email: string;
  name: string;
  avatarUrl?: string;
}

/**
 * User with related data
 */
export interface UserWithProjects extends User {
  projects: Project[];
}
\`\`\`

NOT acceptable:
\`\`\`typescript
export interface User {
  id: string;
  // ... other fields
}
\`\`\`
</schema_instructions>

${schema}

Respond with valid JSON only. All schemas must be complete.
`;
}

/**
 * Decomposer Agent User Message
 */
export function createDecomposerMessage(input: DecompositionInput): string {
  const { design, requirements } = input;

  const schema = formatOutputSchema('DecompositionOutput', {
    sprints: `{
      "sprint-1": {
        "name": "string",
        "theme": "string",
        "story_ids": ["S1-001", "S1-002"]
      }
    }`,
    stories: `[
      {
        "id": "S1-001",
        "title": "string",
        "sprint": "sprint-1",
        "domain": "frontend | backend | pipeline | infra",
        "status": "ready | pending | blocked",
        "agent_type": "senior-fullstack | backend-data-architect | ...",
        "estimated_effort": "S | M | L | XL",
        "blocked_by": ["string"],
        "blocks": ["string"],
        "task_ids": 5,
        "steps": [
          {
            "step_id": 1,
            "title": "string",
            "file_path": "exact/path/to/file.ts",
            "action": "CREATE | MODIFY | DELETE",
            "code": "COMPLETE code - no ellipsis",
            "verification": "command to verify"
          }
        ],
        "files_affected": [{ "path": "string", "action": "CREATE" }],
        "acceptance_criteria": [{ "criterion": "string", "verification": "command" }]
      }
    ]`,
    dependency_dag: `{
      "S1-001": [],
      "S1-002": ["S1-001"],
      "S2-001": ["S1-002"]
    }`,
    has_non_atomic_tasks: 'boolean - True if any story > 3 files',
    non_atomic_stories: '["string"] | null',
  });

  return `
<task>
Break this design into atomic, executable stories with COMPLETE code.
This is the most critical phase. Incomplete code = spec failure.
</task>

<requirements>
Goal: ${requirements.goal}

Acceptance Criteria:
${requirements.acceptance_criteria.map((c) => `- ${c}`).join('\n')}
</requirements>

<architecture>
${design.architecture}
</architecture>

<file_structure>
${design.file_structure}
</file_structure>

<tech_stack>
${JSON.stringify(design.tech_stack, null, 2)}
</tech_stack>

<available_schemas>
${Object.keys(design.schemas).map((name) => `- ${name}`).join('\n')}
</available_schemas>

<sprint_planning_rules>
1. Sprint 1: Foundation (auth, database, core components)
2. Sprint 2: Core features
3. Sprint 3: Advanced features
4. Sprint 4: Polish and testing
</sprint_planning_rules>

<story_rules>
1. Each story touches MAXIMUM 3 files (atomic rule - NO EXCEPTIONS)
2. Each story has a clear, testable outcome
3. Each story can be executed independently once blockers clear
4. Backend stories before frontend stories that need those APIs
</story_rules>

<code_completeness_rules>
BEFORE writing any code block, verify:
- All imports are at the top
- All types are imported or defined
- All functions have complete bodies
- All error paths are handled
- No "..." or ellipsis
- No "TODO" or "FIXME"
- No "// add more" or "// etc"
- No "similar to above"

EXAMPLE OF COMPLETE CODE:
\`\`\`typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(\`Failed to fetch user: \${error.message}\`);
  }

  return data;
}
\`\`\`

EXAMPLE OF INCOMPLETE CODE (WILL FAIL VALIDATION):
\`\`\`typescript
export async function getUser(id: string) {
  // ... fetch user from database
  return user;
}
\`\`\`
</code_completeness_rules>

<thinking_steps>
For each feature:
1. What files need to be created/modified?
2. If > 3 files, how can I split into multiple stories?
3. What are the dependencies between files?
4. What's the minimal code to make this work?
5. How will I verify it works?
</thinking_steps>

${schema}

Respond with valid JSON only. EVERY code block must be complete.
`;
}

/**
 * Validator Agent User Message
 */
export function createValidatorMessage(input: ValidationInput): string {
  const { stories, schemas, decisions, dependency_dag } = input;

  const storyCount = stories.length;
  const schemaCount = Object.keys(schemas).length;
  const decisionCount = decisions.length;
  const dagSize = Object.keys(dependency_dag).length;

  const schema = formatOutputSchema('ValidationOutput', {
    quality_report: `{
      "confidence_score": "number 0-100 (100 only if zero errors)",
      "passes": "boolean",
      "breakdown": {
        "completeness": { "score": "number", "issues": [...] },
        "citations": { "score": "number", "issues": [...] },
        "atomic": { "score": "number", "issues": [...] },
        "schemas": { "score": "number", "issues": [...] },
        "dag": { "score": "number", "issues": [...] }
      },
      "validated_at": "ISO date"
    }`,
    passes: 'boolean',
    loop_targets: `{
      "design_issues": ["string"] | null,
      "decomposition_issues": ["string"] | null
    } | null`,
  });

  return `
<task>
Audit this spec pack for 100% completeness.
You are the last line of defense. If you approve incomplete work, the spec fails.
</task>

<audit_scope>
- Stories to audit: ${storyCount}
- Schemas to audit: ${schemaCount}
- Decisions to audit: ${decisionCount}
- DAG nodes to audit: ${dagSize}
</audit_scope>

<stories>
${JSON.stringify(stories, null, 2)}
</stories>

<schemas>
${JSON.stringify(schemas, null, 2)}
</schemas>

<decisions>
${JSON.stringify(decisions, null, 2)}
</decisions>

<dependency_dag>
${JSON.stringify(dependency_dag, null, 2)}
</dependency_dag>

<audit_checklist>
1. CODE COMPLETENESS
   - Search for: "...", "…", "// TODO", "// FIXME", "similar to", "etc.", "// add"
   - Check: Empty function bodies, return undefined, placeholder comments
   - Each issue is a FATAL ERROR (score = 0)

2. CITATION COVERAGE
   - Every decision must have verification_source URL
   - Every decision must have verified_at date
   - Dates > 90 days old are WARNINGS
   - Missing URL/date is an ERROR

3. ATOMIC TASK COMPLIANCE
   - Count unique files per story (steps + files_affected)
   - If ANY story > 3 files, ERROR
   - Suggest split strategy

4. SCHEMA VALIDITY
   - Check balanced braces and parentheses
   - Check for incomplete code patterns
   - Check exports are not empty

5. DAG VALIDITY
   - Check for cycles (A -> B -> C -> A)
   - Check all blocked_by references exist
   - Check for orphan nodes
</audit_checklist>

<scoring_rules>
- Start at 100
- ANY error = score becomes 0 (errors are fatal)
- Warnings reduce score by 5 each
- Score of 100 ONLY if zero errors

If score < 100, identify what needs to loop back:
- design_issues: Problems with architecture/tech choices
- decomposition_issues: Problems with task splitting/code completeness
</scoring_rules>

${schema}

Respond with valid JSON only. Be thorough and strict.
`;
}

/**
 * Synthesizer Agent User Message
 */
export function createSynthesizerMessage(input: SynthesisInput): string {
  const { discovery, challenge, design, decomposition, validation } = input;

  const schema = formatOutputSchema('SynthesisOutput', {
    spec_pack: 'SpecPack - Complete spec pack structure',
    executive_summary: 'string - 3-5 paragraph summary',
    exports: `{
      "markdown": "string - Full Markdown export",
      "json": "string - JSON string of spec pack"
    }`,
  });

  return `
<task>
Assemble all phase outputs into the final spec pack.
</task>

<discovery_output>
${JSON.stringify(discovery, null, 2)}
</discovery_output>

<challenge_output>
${JSON.stringify(challenge, null, 2)}
</challenge_output>

<design_output>
${JSON.stringify(design, null, 2)}
</design_output>

<decomposition_output>
${JSON.stringify(decomposition, null, 2)}
</decomposition_output>

<validation_output>
${JSON.stringify(validation, null, 2)}
</validation_output>

<assembly_instructions>
1. Merge requirements (discovery + challenge refinements)
2. Include tech stack from design
3. Include all stories from decomposition
4. Include quality report from validation
5. Build debate trail from all design decisions
6. Generate status.yaml content
7. Write executive summary
8. Generate markdown and JSON exports
</assembly_instructions>

<executive_summary_template>
Paragraph 1: What is being built (goal, target users)
Paragraph 2: Key technology choices and rationale
Paragraph 3: Scope overview (X sprints, Y stories, estimated effort)
Paragraph 4: Notable design decisions
Paragraph 5: Quality score and readiness assessment
</executive_summary_template>

${schema}

Respond with valid JSON only.
`;
}
