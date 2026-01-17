/**
 * Specky Spec Engine - Multi-Agent Specification Generator
 *
 * The core engine that powers Specky's 100% complete spec generation.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { createSpeckyPipeline } from '@/lib/spec-engine';
 *
 * const pipeline = createSpeckyPipeline();
 * const specPack = await pipeline.start({
 *   user_prompt: "Build a task management app for remote teams"
 * });
 *
 * console.log(specPack.quality.confidence_score); // 100
 * ```
 *
 * ## Architecture
 *
 * The spec engine uses a 6-phase multi-agent pipeline:
 *
 * 1. **Discovery** - Parse user intent, generate clarifying questions
 * 2. **Challenge** - Adversarial review (Ray Dalio principles)
 * 3. **Design** - Tech stack verification, architecture, schemas
 * 4. **Decomposition** - Atomic stories with complete code
 * 5. **Validation** - Quality audit (must reach 100%)
 * 6. **Synthesis** - Final spec pack assembly
 *
 * ## Core Principles
 *
 * - **100% Completeness**: No "...", no TODO, no shortcuts
 * - **Atomic Tasks**: Each story touches ≤3 files
 * - **Verified Citations**: Every decision has URL + date
 * - **Iteration Until Perfect**: Loops until 100% confidence
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Main factory function
  createSpeckyPipeline,

  // Lower-level factories
  createPipeline,
  PipelineOrchestrator,

  // Agent utilities
  createPipelineAgents,
  createPipelineAgentsWithPreset,
  MODEL_PRESETS,

  // Types
  type CreateSpeckyPipelineOptions,
  type PipelineAgentConfig,
} from './orchestrator';

// ═══════════════════════════════════════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Base agent
  BaseAgent,
  FunctionAgent,
  parseJSONResponse,
  DEFAULT_LLM_CONFIG,

  // Individual agents
  DiscoveryAgent,
  ChallengerAgent,
  ArchitectAgent,
  DecomposerAgent,
  ValidatorAgent,
  SynthesizerAgent,

  // Agent factories
  createDiscoveryAgent,
  createChallengerAgent,
  createArchitectAgent,
  createDecomposerAgent,
  createValidatorAgent,
  createSynthesizerAgent,

  // Agent types
  type LLMConfig,
  type LLMResponse,
  type Message,
  type AgentResult,
  type RetryConfig,
} from './agents';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Main validation function
  validateAll,
  getValidationSummary,

  // Individual validators
  validateCompleteness,
  validateAtomic,
  validateCitations,
  hasIncompleteCode,
  countFilesAffected,
  suggestSplit,
  hasProperCitation,
  MAX_FILES_PER_TASK,

  // Types
  type ValidationInput,
  type CompletenessResult,
  type AtomicResult,
  type CitationResult,
} from './validators';

// ═══════════════════════════════════════════════════════════════════════════
// PROMPTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  // System prompts
  DISCOVERY_SYSTEM,
  CHALLENGE_SYSTEM,
  ARCHITECT_SYSTEM,
  DECOMPOSER_SYSTEM,
  VALIDATOR_SYSTEM,
  SYNTHESIZER_SYSTEM,
  BASE_CONTEXT,
  JSON_OUTPUT_INSTRUCTIONS,

  // User message factories
  createDiscoveryMessage,
  createChallengeMessage,
  createArchitectMessage,
  createDecomposerMessage,
  createValidatorMessage,
  createSynthesizerMessage,
} from './prompts';

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORT SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export type {
  // Spec pack types
  SpecPack,
  Story,
  Sprint,
  QualityReport,
  DesignDecision,
  VerifiedTechStack,
  ValidationIssue,

  // Pipeline types
  PipelinePhase,
  PhaseStatus,
  PipelineState,
  PipelineEvent,
  PipelineEventHandler,
  PipelineRunner,
  PipelineAgents,
  IterationConfig,

  // Phase I/O types
  DiscoveryInput,
  DiscoveryOutput,
  ChallengeInput,
  ChallengeOutput,
  DesignInput,
  DesignOutput,
  DecompositionInput,
  DecompositionOutput,
  ValidationOutput,
  SynthesisInput,
  SynthesisOutput,
  ClarifyingQuestion,
  MentionedTech,
  Challenge,
  ChallengeType,
} from '../../../planning/schemas';

export { DEFAULT_ITERATION_CONFIG } from '../../../planning/schemas';
