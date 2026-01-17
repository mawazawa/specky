/**
 * Challenger Agent - Phase 2: Adversarial Reviewer
 *
 * Reviews requirements and finds weaknesses across 5 dimensions:
 * feasibility, scope, security, UX, and performance.
 *
 * Follows Ray Dalio's principles:
 * - Radical Transparency: All reasoning visible
 * - Thoughtful Disagreement: Constructive challenges
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { CHALLENGE_SYSTEM } from '../prompts/system';
import { createChallengeMessage } from '../prompts/user-messages';
import type {
  ChallengeInput,
  ChallengeOutput,
  ChallengeAgent as IChallengeAgent,
  ChallengeType,
} from '../../../../planning/schemas';

/**
 * Valid challenge types
 */
const VALID_CHALLENGE_TYPES: ChallengeType[] = [
  'feasibility',
  'scope',
  'security',
  'ux',
  'performance',
];

/**
 * Validates the Challenge agent output structure
 */
function isValidChallengeOutput(output: unknown): output is ChallengeOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check challenges is an array with at least 1 item
  if (!Array.isArray(o.challenges) || o.challenges.length < 1) {
    return false;
  }

  // Validate each challenge has required fields
  for (const c of o.challenges) {
    if (
      !VALID_CHALLENGE_TYPES.includes(c.type) ||
      typeof c.concern !== 'string' ||
      typeof c.evidence !== 'string' ||
      typeof c.suggested_resolution !== 'string' ||
      !['open', 'addressed', 'accepted', 'dismissed'].includes(c.status)
    ) {
      return false;
    }
  }

  // Check requirements_challenged structure
  if (!o.requirements_challenged || typeof o.requirements_challenged !== 'object') {
    return false;
  }

  const rc = o.requirements_challenged as Record<string, unknown>;
  if (
    typeof rc.goal !== 'string' ||
    !Array.isArray(rc.scope) ||
    !Array.isArray(rc.non_goals) ||
    !Array.isArray(rc.acceptance_criteria)
  ) {
    return false;
  }

  // Check needs_discovery_loop is boolean
  if (typeof o.needs_discovery_loop !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Challenger Agent implementation
 *
 * Responsibilities:
 * - Review requirements for feasibility issues
 * - Challenge scope (MVP vs feature creep)
 * - Identify security concerns
 * - Evaluate UX friction
 * - Check for performance bottlenecks
 * - Determine if loop back to Discovery is needed
 */
export class ChallengerAgent
  extends BaseAgent<ChallengeInput, ChallengeOutput>
  implements IChallengeAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Challenge agent
   */
  protected getSystemPrompt(): string {
    return CHALLENGE_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: ChallengeInput): string {
    return createChallengeMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: ChallengeOutput): boolean {
    return isValidChallengeOutput(output);
  }
}

/**
 * Factory function to create a Challenger agent
 */
export function createChallengerAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): ChallengerAgent {
  return new ChallengerAgent(config, retryConfig);
}
