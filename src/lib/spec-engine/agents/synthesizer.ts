/**
 * Synthesizer Agent - Phase 6: Final Assembly
 *
 * Assembles all phase outputs into the final spec pack.
 * Generates executive summary, markdown export, and JSON export.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { SYNTHESIZER_SYSTEM } from '../prompts/system';
import { createSynthesizerMessage } from '../prompts/user-messages';
import type {
  SynthesisInput,
  SynthesisOutput,
  SynthesisAgent as ISynthesisAgent,
} from '../../../../planning/schemas';

/**
 * Validates the Synthesizer agent output structure
 */
function isValidSynthesisOutput(output: unknown): output is SynthesisOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check spec_pack exists
  if (!o.spec_pack || typeof o.spec_pack !== 'object') {
    return false;
  }

  const sp = o.spec_pack as Record<string, unknown>;

  // Validate spec_pack has required top-level fields
  if (!sp.meta || typeof sp.meta !== 'object') {
    return false;
  }

  if (!sp.requirements || typeof sp.requirements !== 'object') {
    return false;
  }

  if (!sp.tech_stack || typeof sp.tech_stack !== 'object') {
    return false;
  }

  if (!Array.isArray(sp.sprints)) {
    return false;
  }

  if (!Array.isArray(sp.stories)) {
    return false;
  }

  if (!sp.quality || typeof sp.quality !== 'object') {
    return false;
  }

  // Check executive_summary is a non-empty string
  if (typeof o.executive_summary !== 'string' || o.executive_summary.length === 0) {
    return false;
  }

  // Check exports exists
  if (!o.exports || typeof o.exports !== 'object') {
    return false;
  }

  const exports = o.exports as Record<string, unknown>;

  // Check markdown and json exports exist
  if (typeof exports.markdown !== 'string' || exports.markdown.length === 0) {
    return false;
  }

  if (typeof exports.json !== 'string' || exports.json.length === 0) {
    return false;
  }

  return true;
}

/**
 * Synthesizer Agent implementation
 *
 * Responsibilities:
 * - Merge all phase outputs
 * - Build the complete SpecPack structure
 * - Generate executive summary
 * - Create markdown export
 * - Create JSON export
 */
export class SynthesizerAgent
  extends BaseAgent<SynthesisInput, SynthesisOutput>
  implements ISynthesisAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Synthesizer agent
   */
  protected getSystemPrompt(): string {
    return SYNTHESIZER_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: SynthesisInput): string {
    return createSynthesizerMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: SynthesisOutput): boolean {
    return isValidSynthesisOutput(output);
  }
}

/**
 * Factory function to create a Synthesizer agent
 */
export function createSynthesizerAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): SynthesizerAgent {
  return new SynthesizerAgent(config, retryConfig);
}
