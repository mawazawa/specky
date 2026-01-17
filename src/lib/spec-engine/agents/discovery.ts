/**
 * Discovery Agent - Phase 1: Questioner
 *
 * Parses user intent, generates clarifying questions, and drafts requirements.
 * First agent in the 6-phase pipeline.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { DISCOVERY_SYSTEM } from '../prompts/system';
import { createDiscoveryMessage } from '../prompts/user-messages';
import type {
  DiscoveryInput,
  DiscoveryOutput,
  DiscoveryAgent as IDiscoveryAgent,
} from '../../../../planning/schemas';

/**
 * Validates the Discovery agent output structure
 */
function isValidDiscoveryOutput(output: unknown): output is DiscoveryOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check required fields
  if (typeof o.parsed_intent !== 'string' || o.parsed_intent.length === 0) {
    return false;
  }

  // Check clarifying_questions is an array with at least 1 item
  if (!Array.isArray(o.clarifying_questions) || o.clarifying_questions.length < 1) {
    return false;
  }

  // Validate each question has required fields
  for (const q of o.clarifying_questions) {
    if (
      typeof q.question !== 'string' ||
      typeof q.rationale !== 'string' ||
      typeof q.recommended !== 'string'
    ) {
      return false;
    }
  }

  // Check mentioned_tech is an array
  if (!Array.isArray(o.mentioned_tech)) {
    return false;
  }

  // Check requirements_draft structure
  if (!o.requirements_draft || typeof o.requirements_draft !== 'object') {
    return false;
  }

  const rd = o.requirements_draft as Record<string, unknown>;
  if (
    typeof rd.goal !== 'string' ||
    !Array.isArray(rd.scope) ||
    !Array.isArray(rd.non_goals)
  ) {
    return false;
  }

  return true;
}

/**
 * Discovery Agent implementation
 *
 * Responsibilities:
 * - Parse user's project description
 * - Generate 5 high-leverage clarifying questions
 * - Identify technologies mentioned for verification
 * - Draft initial requirements
 */
export class DiscoveryAgent
  extends BaseAgent<DiscoveryInput, DiscoveryOutput>
  implements IDiscoveryAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Discovery agent
   */
  protected getSystemPrompt(): string {
    return DISCOVERY_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: DiscoveryInput): string {
    return createDiscoveryMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: DiscoveryOutput): boolean {
    return isValidDiscoveryOutput(output);
  }
}

/**
 * Factory function to create a Discovery agent
 */
export function createDiscoveryAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): DiscoveryAgent {
  return new DiscoveryAgent(config, retryConfig);
}
