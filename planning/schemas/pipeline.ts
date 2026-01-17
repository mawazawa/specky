/**
 * Pipeline Schema - Multi-Agent Generation Pipeline Types
 *
 * Defines the 6-phase pipeline architecture for generating 100% complete specs.
 * Each phase has clear inputs, outputs, and iteration rules.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type {
  SpecPack,
  QualityReport,
  DesignDecision,
  Story,
  VerifiedTechStack,
} from './spec-pack';

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE PHASES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The 6 phases of spec generation
 */
export type PipelinePhase =
  | 'discovery'      // Phase 1: Questioner agent
  | 'challenge'      // Phase 2: Adversarial reviewer
  | 'design'         // Phase 3: Architect agent
  | 'decomposition'  // Phase 4: Task splitter
  | 'validation'     // Phase 5: Quality auditor
  | 'synthesis';     // Phase 6: Final assembly

/**
 * Phase execution status
 */
export type PhaseStatus =
  | 'pending'       // Not started
  | 'running'       // Currently executing
  | 'iterating'     // Looping back for refinement
  | 'completed'     // Successfully finished
  | 'failed';       // Failed (needs human intervention)

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A clarifying question with recommended answer
 */
export interface ClarifyingQuestion {
  /** The question being asked */
  question: string;
  /** Why this question matters */
  rationale: string;
  /** Recommended answer */
  recommended: string;
  /** Alternative options if applicable */
  alternatives?: string[];
  /** User's actual answer (filled after interaction) */
  answer?: string;
}

/**
 * Tech mentioned in the user's prompt that needs verification
 */
export interface MentionedTech {
  /** Technology name as mentioned */
  name: string;
  /** Where it was mentioned */
  context: string;
  /** Whether it has been verified with Exa */
  verified: boolean;
  /** Verification result if verified */
  verification?: {
    latest_version: string;
    release_date: string;
    source_url: string;
  };
}

/**
 * Input to the Discovery phase
 */
export interface DiscoveryInput {
  /** Raw user prompt */
  user_prompt: string;
  /** Project context if available */
  project_context?: string;
}

/**
 * Output from the Discovery phase
 */
export interface DiscoveryOutput {
  /** Parsed intent from user prompt */
  parsed_intent: string;
  /** 5 clarifying questions with recommendations */
  clarifying_questions: ClarifyingQuestion[];
  /** Technologies mentioned that need verification */
  mentioned_tech: MentionedTech[];
  /** Draft requirements (to be refined in Challenge phase) */
  requirements_draft: {
    goal: string;
    scope: string[];
    non_goals: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2: CHALLENGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Types of challenges the adversarial reviewer can raise
 */
export type ChallengeType =
  | 'feasibility'   // Can this be built with current tech?
  | 'scope'         // Is this MVP or feature creep?
  | 'security'      // What's the attack surface?
  | 'ux'            // Does this add or remove friction?
  | 'performance';  // Will this scale?

/**
 * A challenge raised by the adversarial reviewer
 */
export interface Challenge {
  /** Type of challenge */
  type: ChallengeType;
  /** The concern being raised */
  concern: string;
  /** Evidence or reasoning for the concern */
  evidence: string;
  /** Suggested resolution */
  suggested_resolution: string;
  /** Status of resolution */
  status: 'open' | 'addressed' | 'accepted' | 'dismissed';
  /** How it was resolved (if addressed) */
  resolution?: string;
}

/**
 * Input to the Challenge phase
 */
export interface ChallengeInput {
  /** Output from Discovery phase */
  discovery_output: DiscoveryOutput;
  /** Answered clarifying questions */
  answered_questions: ClarifyingQuestion[];
}

/**
 * Output from the Challenge phase
 */
export interface ChallengeOutput {
  /** All challenges raised */
  challenges: Challenge[];
  /** Refined requirements after addressing challenges */
  requirements_challenged: {
    goal: string;
    scope: string[];
    non_goals: string[];
    acceptance_criteria: string[];
  };
  /** Whether any challenges require looping back to Discovery */
  needs_discovery_loop: boolean;
  /** Reason for loop if needed */
  loop_reason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: DESIGN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input to the Design phase
 */
export interface DesignInput {
  /** Challenged requirements */
  requirements: ChallengeOutput['requirements_challenged'];
  /** Verified tech from Discovery */
  verified_tech: MentionedTech[];
  /** Challenges to address in design */
  challenges: Challenge[];
}

/**
 * Output from the Design phase
 */
export interface DesignOutput {
  /** Architecture description */
  architecture: string;
  /** Verified tech stack */
  tech_stack: VerifiedTechStack;
  /** Proposed file structure */
  file_structure: string;
  /** Design decisions with alternatives and reasoning */
  decisions: DesignDecision[];
  /** TypeScript schemas (complete, compilable) */
  schemas: Record<string, string>;
  /** Whether design needs refinement */
  needs_refinement: boolean;
  /** Refinement notes if needed */
  refinement_notes?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4: DECOMPOSITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A code block in a story step
 */
export interface CodeBlock {
  /** Programming language */
  language: string;
  /** File path this code belongs to */
  file_path: string;
  /** Complete code content (NO ELLIPSIS, NO TODO) */
  content: string;
  /** Line range if modifying existing file */
  lines?: string;
}

/**
 * Input to the Decomposition phase
 */
export interface DecompositionInput {
  /** Design output */
  design: DesignOutput;
  /** Requirements for acceptance criteria */
  requirements: ChallengeOutput['requirements_challenged'];
}

/**
 * Output from the Decomposition phase
 */
export interface DecompositionOutput {
  /** Generated sprints */
  sprints: Record<string, {
    name: string;
    theme: string;
    story_ids: string[];
  }>;
  /** Generated stories with complete code */
  stories: Story[];
  /** Dependency DAG (story_id -> blocked_by[]) */
  dependency_dag: Record<string, string[]>;
  /** Whether any story exceeds atomic task limit */
  has_non_atomic_tasks: boolean;
  /** Stories that exceed 3 files */
  non_atomic_stories?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5: VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input to the Validation phase
 */
export interface ValidationInput {
  /** Stories to validate */
  stories: Story[];
  /** Schemas to compile */
  schemas: Record<string, string>;
  /** Decisions to check for citations */
  decisions: DesignDecision[];
  /** DAG to check for cycles */
  dependency_dag: Record<string, string[]>;
}

/**
 * Output from the Validation phase
 */
export interface ValidationOutput {
  /** Full quality report */
  quality_report: QualityReport;
  /** Whether all gates pass */
  passes: boolean;
  /** If not passing, what needs to loop back */
  loop_targets?: {
    /** Go back to Design for these issues */
    design_issues?: string[];
    /** Go back to Decomposition for these issues */
    decomposition_issues?: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 6: SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input to the Synthesis phase
 */
export interface SynthesisInput {
  /** All previous phase outputs */
  discovery: DiscoveryOutput;
  challenge: ChallengeOutput;
  design: DesignOutput;
  decomposition: DecompositionOutput;
  validation: ValidationOutput;
}

/**
 * Output from the Synthesis phase - the final spec pack
 */
export interface SynthesisOutput {
  /** The complete spec pack */
  spec_pack: SpecPack;
  /** Executive summary */
  executive_summary: string;
  /** Export formats generated */
  exports: {
    markdown: string;
    json: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * State of a single phase
 */
export interface PhaseState<TInput, TOutput> {
  /** Phase name */
  phase: PipelinePhase;
  /** Current status */
  status: PhaseStatus;
  /** Input to this phase */
  input?: TInput;
  /** Output from this phase */
  output?: TOutput;
  /** Number of iterations completed */
  iterations: number;
  /** Maximum iterations allowed */
  max_iterations: number;
  /** Error if failed */
  error?: string;
  /** Start timestamp */
  started_at?: string;
  /** End timestamp */
  completed_at?: string;
}

/**
 * Complete pipeline state
 */
export interface PipelineState {
  /** Pipeline ID */
  id: string;
  /** Overall status */
  status: 'running' | 'completed' | 'failed';
  /** Current phase being executed */
  current_phase: PipelinePhase;
  /** State of each phase */
  phases: {
    discovery: PhaseState<DiscoveryInput, DiscoveryOutput>;
    challenge: PhaseState<ChallengeInput, ChallengeOutput>;
    design: PhaseState<DesignInput, DesignOutput>;
    decomposition: PhaseState<DecompositionInput, DecompositionOutput>;
    validation: PhaseState<ValidationInput, ValidationOutput>;
    synthesis: PhaseState<SynthesisInput, SynthesisOutput>;
  };
  /** Total iterations across all phases */
  total_iterations: number;
  /** Pipeline start timestamp */
  started_at: string;
  /** Pipeline end timestamp */
  completed_at?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ITERATION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for iteration behavior
 */
export interface IterationConfig {
  /** Max iterations for Discovery ↔ Challenge loop */
  discovery_challenge_max: number;
  /** Max iterations for Design ↔ Decomposition loop */
  design_decomposition_max: number;
  /** Max iterations for Decomposition ↔ Validation loop (unlimited until 100%) */
  decomposition_validation_max: number | 'unlimited';
  /** Minimum confidence score to proceed */
  min_confidence_score: number;
}

/**
 * Default iteration configuration
 */
export const DEFAULT_ITERATION_CONFIG: IterationConfig = {
  discovery_challenge_max: 3,
  design_decomposition_max: 3,
  decomposition_validation_max: 'unlimited', // Must reach 100%
  min_confidence_score: 100, // No compromise
};

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE EVENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Event types emitted during pipeline execution
 */
export type PipelineEventType =
  | 'phase_started'
  | 'phase_completed'
  | 'phase_failed'
  | 'iteration_started'
  | 'loop_back'
  | 'pipeline_completed'
  | 'pipeline_failed';

/**
 * An event emitted during pipeline execution
 */
export interface PipelineEvent {
  /** Event type */
  type: PipelineEventType;
  /** Phase this event relates to */
  phase?: PipelinePhase;
  /** Timestamp */
  timestamp: string;
  /** Event details */
  details: Record<string, unknown>;
}

/**
 * Pipeline event handler
 */
export type PipelineEventHandler = (event: PipelineEvent) => void;

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE RUNNER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface for the pipeline orchestrator
 */
export interface PipelineRunner {
  /** Start the pipeline with user input */
  start(input: DiscoveryInput): Promise<SpecPack>;

  /** Get current pipeline state */
  getState(): PipelineState;

  /** Subscribe to pipeline events */
  onEvent(handler: PipelineEventHandler): void;

  /** Cancel the pipeline */
  cancel(): void;
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Interface for the Discovery agent (Questioner)
 */
export interface DiscoveryAgent {
  execute(input: DiscoveryInput): Promise<DiscoveryOutput>;
}

/**
 * Interface for the Challenge agent (Adversarial Reviewer)
 */
export interface ChallengeAgent {
  execute(input: ChallengeInput): Promise<ChallengeOutput>;
}

/**
 * Interface for the Design agent (Architect)
 */
export interface DesignAgent {
  execute(input: DesignInput): Promise<DesignOutput>;
}

/**
 * Interface for the Decomposition agent (Task Splitter)
 */
export interface DecompositionAgent {
  execute(input: DecompositionInput): Promise<DecompositionOutput>;
}

/**
 * Interface for the Validation agent (Quality Auditor)
 */
export interface ValidationAgent {
  execute(input: ValidationInput): Promise<ValidationOutput>;
}

/**
 * Interface for the Synthesis agent (Orchestrator)
 */
export interface SynthesisAgent {
  execute(input: SynthesisInput): Promise<SynthesisOutput>;
}

/**
 * All agents required for the pipeline
 */
export interface PipelineAgents {
  discovery: DiscoveryAgent;
  challenge: ChallengeAgent;
  design: DesignAgent;
  decomposition: DecompositionAgent;
  validation: ValidationAgent;
  synthesis: SynthesisAgent;
}
