/**
 * Pipeline Orchestrator - 6-Phase Spec Generation
 *
 * Coordinates all agents to produce 100% complete spec packs.
 * Implements iteration loops until quality threshold is met.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type {
  PipelineState,
  PipelinePhase,
  PhaseStatus,
  PipelineEvent,
  PipelineEventHandler,
  PipelineRunner,
  PipelineAgents,
  IterationConfig,
  DiscoveryInput,
  DiscoveryOutput,
  ChallengeInput,
  ChallengeOutput,
  DesignInput,
  DesignOutput,
  DecompositionInput,
  DecompositionOutput,
  ValidationInput,
  ValidationOutput,
  SynthesisInput,
  SynthesisOutput,
  SpecPack,
} from '../../../planning/schemas';

import { DEFAULT_ITERATION_CONFIG } from '../../../planning/schemas';

import {
  createPipelineAgents,
  createPipelineAgentsWithPreset,
  MODEL_PRESETS,
  type PipelineAgentConfig,
} from './agents';

/**
 * Pipeline Orchestrator
 *
 * Runs the 6-phase spec generation pipeline with iteration loops.
 * Will not exit until quality score reaches 100%.
 */
export class PipelineOrchestrator implements PipelineRunner {
  private state: PipelineState;
  private agents: PipelineAgents;
  private config: IterationConfig;
  private eventHandlers: PipelineEventHandler[] = [];
  private cancelled = false;

  constructor(agents: PipelineAgents, config: Partial<IterationConfig> = {}) {
    this.agents = agents;
    this.config = { ...DEFAULT_ITERATION_CONFIG, ...config };
    this.state = this.createInitialState();
  }

  /**
   * Start the pipeline with user input
   */
  async start(input: DiscoveryInput): Promise<SpecPack> {
    this.state.status = 'running';
    this.state.started_at = new Date().toISOString();
    this.state.phases.discovery.input = input;

    try {
      // Phase 1: Discovery
      await this.runDiscoveryPhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      // Phase 2: Challenge (with Discovery loop)
      await this.runChallengePhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      // Phase 3: Design
      await this.runDesignPhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      // Phase 4: Decomposition (with Design loop)
      await this.runDecompositionPhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      // Phase 5: Validation (loops until 100%)
      await this.runValidationPhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      // Phase 6: Synthesis
      const result = await this.runSynthesisPhase();
      if (this.cancelled) throw new Error('Pipeline cancelled');

      this.state.status = 'completed';
      this.state.completed_at = new Date().toISOString();
      this.emit({ type: 'pipeline_completed', timestamp: new Date().toISOString(), details: {} });

      return result.spec_pack;
    } catch (error) {
      this.state.status = 'failed';
      this.emit({
        type: 'pipeline_failed',
        timestamp: new Date().toISOString(),
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      throw error;
    }
  }

  /**
   * Get current pipeline state
   */
  getState(): PipelineState {
    return { ...this.state };
  }

  /**
   * Subscribe to pipeline events
   */
  onEvent(handler: PipelineEventHandler): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Cancel the pipeline
   */
  cancel(): void {
    this.cancelled = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE RUNNERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Phase 1: Discovery
   * Parse user intent, generate clarifying questions, verify tech
   */
  private async runDiscoveryPhase(): Promise<void> {
    const phase = this.state.phases.discovery;
    this.setPhaseStatus('discovery', 'running');
    this.emit({ type: 'phase_started', phase: 'discovery', timestamp: new Date().toISOString(), details: {} });

    try {
      const output = await this.agents.discovery.execute(phase.input!);
      phase.output = output;
      phase.iterations++;
      this.setPhaseStatus('discovery', 'completed');
      this.emit({ type: 'phase_completed', phase: 'discovery', timestamp: new Date().toISOString(), details: {} });
    } catch (error) {
      phase.error = error instanceof Error ? error.message : String(error);
      this.setPhaseStatus('discovery', 'failed');
      this.emit({ type: 'phase_failed', phase: 'discovery', timestamp: new Date().toISOString(), details: { error: phase.error } });
      throw error;
    }
  }

  /**
   * Phase 2: Challenge
   * Adversarial review with loop back to Discovery if needed
   */
  private async runChallengePhase(): Promise<void> {
    const phase = this.state.phases.challenge;
    const discoveryOutput = this.state.phases.discovery.output!;

    let iterations = 0;
    const maxIterations = this.config.discovery_challenge_max;

    while (iterations < maxIterations) {
      this.setPhaseStatus('challenge', iterations > 0 ? 'iterating' : 'running');
      this.emit({
        type: iterations > 0 ? 'iteration_started' : 'phase_started',
        phase: 'challenge',
        timestamp: new Date().toISOString(),
        details: { iteration: iterations + 1 },
      });

      const input: ChallengeInput = {
        discovery_output: discoveryOutput,
        answered_questions: discoveryOutput.clarifying_questions,
      };
      phase.input = input;

      try {
        const output = await this.agents.challenge.execute(input);
        phase.output = output;
        phase.iterations++;
        iterations++;
        this.state.total_iterations++;

        if (output.needs_discovery_loop && iterations < maxIterations) {
          // Loop back to Discovery
          this.emit({
            type: 'loop_back',
            phase: 'discovery',
            timestamp: new Date().toISOString(),
            details: { reason: output.loop_reason },
          });
          await this.runDiscoveryPhase();
        } else {
          // Challenge complete
          this.setPhaseStatus('challenge', 'completed');
          this.emit({ type: 'phase_completed', phase: 'challenge', timestamp: new Date().toISOString(), details: {} });
          return;
        }
      } catch (error) {
        phase.error = error instanceof Error ? error.message : String(error);
        this.setPhaseStatus('challenge', 'failed');
        this.emit({ type: 'phase_failed', phase: 'challenge', timestamp: new Date().toISOString(), details: { error: phase.error } });
        throw error;
      }
    }

    // Max iterations reached
    this.setPhaseStatus('challenge', 'completed');
    this.emit({ type: 'phase_completed', phase: 'challenge', timestamp: new Date().toISOString(), details: { max_iterations_reached: true } });
  }

  /**
   * Phase 3: Design
   * Architecture decisions, tech stack verification, schema generation
   */
  private async runDesignPhase(): Promise<void> {
    const phase = this.state.phases.design;
    const challengeOutput = this.state.phases.challenge.output!;
    const discoveryOutput = this.state.phases.discovery.output!;

    this.setPhaseStatus('design', 'running');
    this.emit({ type: 'phase_started', phase: 'design', timestamp: new Date().toISOString(), details: {} });

    const input: DesignInput = {
      requirements: challengeOutput.requirements_challenged,
      verified_tech: discoveryOutput.mentioned_tech,
      challenges: challengeOutput.challenges,
    };
    phase.input = input;

    try {
      const output = await this.agents.design.execute(input);
      phase.output = output;
      phase.iterations++;
      this.state.total_iterations++;
      this.setPhaseStatus('design', 'completed');
      this.emit({ type: 'phase_completed', phase: 'design', timestamp: new Date().toISOString(), details: {} });
    } catch (error) {
      phase.error = error instanceof Error ? error.message : String(error);
      this.setPhaseStatus('design', 'failed');
      this.emit({ type: 'phase_failed', phase: 'design', timestamp: new Date().toISOString(), details: { error: phase.error } });
      throw error;
    }
  }

  /**
   * Phase 4: Decomposition
   * Task splitting with loop back to Design if needed
   */
  private async runDecompositionPhase(): Promise<void> {
    const phase = this.state.phases.decomposition;
    const designOutput = this.state.phases.design.output!;
    const challengeOutput = this.state.phases.challenge.output!;

    let iterations = 0;
    const maxIterations = this.config.design_decomposition_max;

    while (iterations < maxIterations) {
      this.setPhaseStatus('decomposition', iterations > 0 ? 'iterating' : 'running');
      this.emit({
        type: iterations > 0 ? 'iteration_started' : 'phase_started',
        phase: 'decomposition',
        timestamp: new Date().toISOString(),
        details: { iteration: iterations + 1 },
      });

      const input: DecompositionInput = {
        design: designOutput,
        requirements: challengeOutput.requirements_challenged,
      };
      phase.input = input;

      try {
        const output = await this.agents.decomposition.execute(input);
        phase.output = output;
        phase.iterations++;
        iterations++;
        this.state.total_iterations++;

        if (output.has_non_atomic_tasks && iterations < maxIterations) {
          // Loop back to Design for better modularity
          this.emit({
            type: 'loop_back',
            phase: 'design',
            timestamp: new Date().toISOString(),
            details: { reason: 'Non-atomic tasks detected', stories: output.non_atomic_stories },
          });
          await this.runDesignPhase();
        } else {
          // Decomposition complete
          this.setPhaseStatus('decomposition', 'completed');
          this.emit({ type: 'phase_completed', phase: 'decomposition', timestamp: new Date().toISOString(), details: {} });
          return;
        }
      } catch (error) {
        phase.error = error instanceof Error ? error.message : String(error);
        this.setPhaseStatus('decomposition', 'failed');
        this.emit({ type: 'phase_failed', phase: 'decomposition', timestamp: new Date().toISOString(), details: { error: phase.error } });
        throw error;
      }
    }

    // Max iterations reached
    this.setPhaseStatus('decomposition', 'completed');
    this.emit({ type: 'phase_completed', phase: 'decomposition', timestamp: new Date().toISOString(), details: { max_iterations_reached: true } });
  }

  /**
   * Phase 5: Validation
   * Quality audit with unlimited iterations until 100%
   */
  private async runValidationPhase(): Promise<void> {
    const phase = this.state.phases.validation;
    const decompositionOutput = this.state.phases.decomposition.output!;
    const designOutput = this.state.phases.design.output!;

    let iterations = 0;
    const maxIterations = this.config.decomposition_validation_max;

    // Keep iterating until 100% confidence or unlimited iterations exhausted
    while (true) {
      this.setPhaseStatus('validation', iterations > 0 ? 'iterating' : 'running');
      this.emit({
        type: iterations > 0 ? 'iteration_started' : 'phase_started',
        phase: 'validation',
        timestamp: new Date().toISOString(),
        details: { iteration: iterations + 1 },
      });

      const input: ValidationInput = {
        stories: decompositionOutput.stories,
        schemas: designOutput.schemas,
        decisions: designOutput.decisions,
        dependency_dag: decompositionOutput.dependency_dag,
      };
      phase.input = input;

      try {
        const output = await this.agents.validation.execute(input);
        phase.output = output;
        phase.iterations++;
        iterations++;
        this.state.total_iterations++;

        if (output.passes) {
          // 100% achieved!
          this.setPhaseStatus('validation', 'completed');
          this.emit({ type: 'phase_completed', phase: 'validation', timestamp: new Date().toISOString(), details: { confidence: 100 } });
          return;
        }

        // Not yet 100% - loop back
        if (maxIterations !== 'unlimited' && iterations >= maxIterations) {
          throw new Error(`Failed to reach 100% confidence after ${iterations} iterations`);
        }

        // Determine what to fix
        if (output.loop_targets?.design_issues?.length) {
          this.emit({
            type: 'loop_back',
            phase: 'design',
            timestamp: new Date().toISOString(),
            details: { issues: output.loop_targets.design_issues },
          });
          await this.runDesignPhase();
          await this.runDecompositionPhase();
        } else if (output.loop_targets?.decomposition_issues?.length) {
          this.emit({
            type: 'loop_back',
            phase: 'decomposition',
            timestamp: new Date().toISOString(),
            details: { issues: output.loop_targets.decomposition_issues },
          });
          await this.runDecompositionPhase();
        }
      } catch (error) {
        phase.error = error instanceof Error ? error.message : String(error);
        this.setPhaseStatus('validation', 'failed');
        this.emit({ type: 'phase_failed', phase: 'validation', timestamp: new Date().toISOString(), details: { error: phase.error } });
        throw error;
      }
    }
  }

  /**
   * Phase 6: Synthesis
   * Assemble final spec pack
   */
  private async runSynthesisPhase(): Promise<SynthesisOutput> {
    const phase = this.state.phases.synthesis;

    this.setPhaseStatus('synthesis', 'running');
    this.emit({ type: 'phase_started', phase: 'synthesis', timestamp: new Date().toISOString(), details: {} });

    const input: SynthesisInput = {
      discovery: this.state.phases.discovery.output!,
      challenge: this.state.phases.challenge.output!,
      design: this.state.phases.design.output!,
      decomposition: this.state.phases.decomposition.output!,
      validation: this.state.phases.validation.output!,
    };
    phase.input = input;

    try {
      const output = await this.agents.synthesis.execute(input);
      phase.output = output;
      phase.iterations++;
      this.state.total_iterations++;
      this.setPhaseStatus('synthesis', 'completed');
      this.emit({ type: 'phase_completed', phase: 'synthesis', timestamp: new Date().toISOString(), details: {} });
      return output;
    } catch (error) {
      phase.error = error instanceof Error ? error.message : String(error);
      this.setPhaseStatus('synthesis', 'failed');
      this.emit({ type: 'phase_failed', phase: 'synthesis', timestamp: new Date().toISOString(), details: { error: phase.error } });
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private createInitialState(): PipelineState {
    const createPhaseState = <TInput, TOutput>(phase: PipelinePhase, maxIterations: number) => ({
      phase,
      status: 'pending' as PhaseStatus,
      iterations: 0,
      max_iterations: maxIterations,
    });

    return {
      id: crypto.randomUUID(),
      status: 'running',
      current_phase: 'discovery',
      phases: {
        discovery: createPhaseState('discovery', 1),
        challenge: createPhaseState('challenge', this.config.discovery_challenge_max),
        design: createPhaseState('design', 1),
        decomposition: createPhaseState('decomposition', this.config.design_decomposition_max),
        validation: createPhaseState('validation', this.config.decomposition_validation_max === 'unlimited' ? 999 : this.config.decomposition_validation_max),
        synthesis: createPhaseState('synthesis', 1),
      },
      total_iterations: 0,
      started_at: new Date().toISOString(),
    };
  }

  private setPhaseStatus(phase: PipelinePhase, status: PhaseStatus): void {
    this.state.phases[phase].status = status;
    this.state.current_phase = phase;

    if (status === 'running') {
      this.state.phases[phase].started_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed') {
      this.state.phases[phase].completed_at = new Date().toISOString();
    }
  }

  private emit(event: PipelineEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch {
        // Ignore handler errors
      }
    }
  }
}

/**
 * Create a pipeline orchestrator with provided agents
 */
export function createPipeline(agents: PipelineAgents, config?: Partial<IterationConfig>): PipelineRunner {
  return new PipelineOrchestrator(agents, config);
}

/**
 * Configuration for creating a complete pipeline
 */
export interface CreateSpeckyPipelineOptions {
  /** Agent configuration (LLM settings, retries) */
  agentConfig?: PipelineAgentConfig;
  /** Iteration configuration */
  iterationConfig?: Partial<IterationConfig>;
  /** Use a preset configuration for agents */
  preset?: keyof typeof MODEL_PRESETS;
}

/**
 * Create a complete Specky pipeline with all agents wired up
 *
 * This is the main entry point for using Specky programmatically.
 *
 * @example
 * ```typescript
 * // Default configuration (Claude Opus 4.5 for all phases)
 * const pipeline = createSpeckyPipeline();
 * const specPack = await pipeline.start({
 *   user_prompt: "Build a task management app for remote teams"
 * });
 *
 * // With speed preset (faster models for non-critical phases)
 * const fastPipeline = createSpeckyPipeline({ preset: 'speed' });
 *
 * // With custom configuration
 * const customPipeline = createSpeckyPipeline({
 *   agentConfig: {
 *     llm: { temperature: 0.2 },
 *     agentOverrides: {
 *       validation: { model: 'claude-3-5-haiku-20241022' }
 *     }
 *   },
 *   iterationConfig: {
 *     discovery_challenge_max: 5
 *   }
 * });
 *
 * // Listen to pipeline events
 * pipeline.onEvent((event) => {
 *   console.log(`[${event.type}] Phase: ${event.phase}`);
 * });
 * ```
 */
export function createSpeckyPipeline(options: CreateSpeckyPipelineOptions = {}): PipelineRunner {
  const { agentConfig, iterationConfig, preset } = options;

  // Create agents with preset or custom config
  const agents = preset
    ? createPipelineAgentsWithPreset(preset, agentConfig)
    : createPipelineAgents(agentConfig);

  // Create and return the orchestrator
  return new PipelineOrchestrator(agents, iterationConfig);
}

/**
 * Re-export agent utilities for advanced usage
 */
export {
  createPipelineAgents,
  createPipelineAgentsWithPreset,
  MODEL_PRESETS,
  type PipelineAgentConfig,
} from './agents';
