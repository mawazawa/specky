/**
 * Validator Agent - Phase 5: Quality Auditor
 *
 * Ensures 100% spec completeness. The last line of defense.
 * If this agent approves incomplete work, the entire spec fails.
 *
 * AUDITS:
 * - Code completeness (no "...", no TODO)
 * - Citation coverage (URL + date for all decisions)
 * - Atomic task compliance (≤3 files per story)
 * - Schema validity (TypeScript compiles)
 * - DAG validity (no cycles)
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { VALIDATOR_SYSTEM } from '../prompts/system';
import { createValidatorMessage } from '../prompts/user-messages';
import type {
  ValidationInput,
  ValidationOutput,
  ValidationAgent as IValidationAgent,
} from '../../../../planning/schemas';

/**
 * Valid issue severities
 */
const VALID_SEVERITIES = ['error', 'warning'];

/**
 * Valid issue categories
 */
const VALID_CATEGORIES = ['completeness', 'citations', 'atomic', 'schema', 'dag'];

/**
 * Validates the Validator agent output structure
 */
function isValidValidationOutput(output: unknown): output is ValidationOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check quality_report exists
  if (!o.quality_report || typeof o.quality_report !== 'object') {
    return false;
  }

  const qr = o.quality_report as Record<string, unknown>;

  // Check confidence_score is a number 0-100
  if (
    typeof qr.confidence_score !== 'number' ||
    qr.confidence_score < 0 ||
    qr.confidence_score > 100
  ) {
    return false;
  }

  // Check passes is boolean
  if (typeof qr.passes !== 'boolean') {
    return false;
  }

  // Check breakdown exists
  if (!qr.breakdown || typeof qr.breakdown !== 'object') {
    return false;
  }

  const breakdown = qr.breakdown as Record<string, unknown>;

  // Validate each breakdown category
  for (const category of VALID_CATEGORIES) {
    if (breakdown[category]) {
      const cat = breakdown[category] as Record<string, unknown>;
      if (typeof cat.score !== 'number') {
        return false;
      }
      if (!Array.isArray(cat.issues)) {
        return false;
      }

      // Validate each issue
      for (const issue of cat.issues) {
        if (
          !VALID_SEVERITIES.includes(issue.severity) ||
          typeof issue.message !== 'string'
        ) {
          return false;
        }
      }
    }
  }

  // Check validated_at is a string
  if (typeof qr.validated_at !== 'string') {
    return false;
  }

  // Check top-level passes is boolean
  if (typeof o.passes !== 'boolean') {
    return false;
  }

  // Consistency check: passes should match quality_report.passes
  if (o.passes !== qr.passes) {
    return false;
  }

  // If not passing, loop_targets should exist
  if (!o.passes && !o.loop_targets) {
    return false;
  }

  return true;
}

/**
 * Validator Agent implementation
 *
 * Responsibilities:
 * - Audit all code blocks for completeness
 * - Verify all decisions have citations
 * - Check all stories are atomic (≤3 files)
 * - Validate TypeScript schemas can compile
 * - Check dependency DAG has no cycles
 * - Calculate confidence score (100 = perfect)
 * - Determine loop targets if validation fails
 */
export class ValidatorAgent
  extends BaseAgent<ValidationInput, ValidationOutput>
  implements IValidationAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Validator agent
   */
  protected getSystemPrompt(): string {
    return VALIDATOR_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: ValidationInput): string {
    return createValidatorMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: ValidationOutput): boolean {
    return isValidValidationOutput(output);
  }
}

/**
 * Factory function to create a Validator agent
 */
export function createValidatorAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): ValidatorAgent {
  return new ValidatorAgent(config, retryConfig);
}
