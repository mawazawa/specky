/**
 * Agents Index - Central exports for all pipeline agents
 *
 * The 6-phase multi-agent pipeline:
 * 1. Discovery (Questioner) - Parse intent, generate questions
 * 2. Challenge (Adversarial Reviewer) - Find weaknesses
 * 3. Architect (Designer) - Tech stack, architecture, schemas
 * 4. Decomposer (Task Splitter) - Atomic stories with complete code
 * 5. Validator (Quality Auditor) - Ensure 100% completeness
 * 6. Synthesizer (Assembler) - Final spec pack
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

// Base agent exports
export {
  BaseAgent,
  FunctionAgent,
  parseJSONResponse,
  DEFAULT_LLM_CONFIG,
  type LLMConfig,
  type LLMResponse,
  type Message,
  type AgentResult,
  type RetryConfig,
} from './base';

// Individual agent exports
export {
  DiscoveryAgent,
  createDiscoveryAgent,
} from './discovery';

export {
  ChallengerAgent,
  createChallengerAgent,
} from './challenger';

export {
  ArchitectAgent,
  createArchitectAgent,
} from './architect';

export {
  DecomposerAgent,
  createDecomposerAgent,
} from './decomposer';

export {
  ValidatorAgent,
  createValidatorAgent,
} from './validator';

export {
  SynthesizerAgent,
  createSynthesizerAgent,
} from './synthesizer';

// Import types for PipelineAgents
import type { PipelineAgents } from '../../../../planning/schemas';
import type { LLMConfig, RetryConfig } from './base';
import { createDiscoveryAgent } from './discovery';
import { createChallengerAgent } from './challenger';
import { createArchitectAgent } from './architect';
import { createDecomposerAgent } from './decomposer';
import { createValidatorAgent } from './validator';
import { createSynthesizerAgent } from './synthesizer';

/**
 * Configuration for creating pipeline agents
 */
export interface PipelineAgentConfig {
  /** LLM configuration (applied to all agents) */
  llm?: Partial<LLMConfig>;
  /** Retry configuration (applied to all agents) */
  retry?: Partial<RetryConfig>;
  /** Per-agent LLM overrides */
  agentOverrides?: {
    discovery?: Partial<LLMConfig>;
    challenge?: Partial<LLMConfig>;
    design?: Partial<LLMConfig>;
    decomposition?: Partial<LLMConfig>;
    validation?: Partial<LLMConfig>;
    synthesis?: Partial<LLMConfig>;
  };
}

/**
 * Create all pipeline agents with shared configuration
 *
 * @param config - Optional configuration for agents
 * @returns All 6 pipeline agents
 *
 * @example
 * ```typescript
 * // Use defaults (Claude Opus 4.5)
 * const agents = createPipelineAgents();
 *
 * // Use a different model for validation (faster iteration)
 * const agents = createPipelineAgents({
 *   agentOverrides: {
 *     validation: { model: 'claude-3-5-haiku-20241022' }
 *   }
 * });
 * ```
 */
export function createPipelineAgents(config: PipelineAgentConfig = {}): PipelineAgents {
  const { llm, retry, agentOverrides } = config;

  return {
    discovery: createDiscoveryAgent(
      { ...llm, ...agentOverrides?.discovery },
      retry
    ),
    challenge: createChallengerAgent(
      { ...llm, ...agentOverrides?.challenge },
      retry
    ),
    design: createArchitectAgent(
      { ...llm, ...agentOverrides?.design },
      retry
    ),
    decomposition: createDecomposerAgent(
      { ...llm, ...agentOverrides?.decomposition },
      retry
    ),
    validation: createValidatorAgent(
      { ...llm, ...agentOverrides?.validation },
      retry
    ),
    synthesis: createSynthesizerAgent(
      { ...llm, ...agentOverrides?.synthesis },
      retry
    ),
  };
}

/**
 * Model recommendations for different use cases
 */
export const MODEL_PRESETS = {
  /**
   * Quality-first: Use Claude Opus 4.5 for all phases
   * Best for: Production specs, complex projects
   */
  quality: {
    discovery: { model: 'claude-opus-4-5-20251101' },
    challenge: { model: 'claude-opus-4-5-20251101' },
    design: { model: 'claude-opus-4-5-20251101' },
    decomposition: { model: 'claude-opus-4-5-20251101' },
    validation: { model: 'claude-opus-4-5-20251101' },
    synthesis: { model: 'claude-opus-4-5-20251101' },
  },

  /**
   * Speed-first: Use faster models where possible
   * Best for: Iteration, testing, simple projects
   */
  speed: {
    discovery: { model: 'claude-3-5-sonnet-20241022' },
    challenge: { model: 'claude-3-5-sonnet-20241022' },
    design: { model: 'claude-opus-4-5-20251101' }, // Keep Opus for architecture
    decomposition: { model: 'claude-opus-4-5-20251101' }, // Keep Opus for code
    validation: { model: 'claude-3-5-haiku-20241022' }, // Fast validation
    synthesis: { model: 'claude-3-5-sonnet-20241022' },
  },

  /**
   * Balanced: Mix of quality and speed
   * Best for: Most use cases
   */
  balanced: {
    discovery: { model: 'claude-3-5-sonnet-20241022' },
    challenge: { model: 'claude-3-5-sonnet-20241022' },
    design: { model: 'claude-opus-4-5-20251101' },
    decomposition: { model: 'claude-opus-4-5-20251101' },
    validation: { model: 'claude-3-5-sonnet-20241022' },
    synthesis: { model: 'claude-3-5-sonnet-20241022' },
  },
} as const;

/**
 * Create pipeline agents with a preset configuration
 *
 * @param preset - One of 'quality', 'speed', or 'balanced'
 * @param extraConfig - Additional configuration to merge
 * @returns All 6 pipeline agents
 *
 * @example
 * ```typescript
 * const agents = createPipelineAgentsWithPreset('balanced');
 * ```
 */
export function createPipelineAgentsWithPreset(
  preset: keyof typeof MODEL_PRESETS,
  extraConfig: PipelineAgentConfig = {}
): PipelineAgents {
  return createPipelineAgents({
    ...extraConfig,
    agentOverrides: {
      ...MODEL_PRESETS[preset],
      ...extraConfig.agentOverrides,
    },
  });
}
