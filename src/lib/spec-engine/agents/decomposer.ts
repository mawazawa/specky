/**
 * Decomposer Agent - Phase 4: Task Splitter
 *
 * Breaks the design into atomic, executable stories with COMPLETE code.
 * This is the most critical phase - incomplete code here means spec failure.
 *
 * KEY RULES:
 * - Maximum 3 files per story (atomic rule - NO EXCEPTIONS)
 * - Every code block must be COMPLETE (no "...", no TODO)
 * - Every step must have a verification command
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { DECOMPOSER_SYSTEM } from '../prompts/system';
import { createDecomposerMessage } from '../prompts/user-messages';
import type {
  DecompositionInput,
  DecompositionOutput,
  DecompositionAgent as IDecompositionAgent,
} from '../../../../planning/schemas';

/**
 * Patterns that indicate incomplete code
 */
const INCOMPLETE_PATTERNS = [
  /\.\.\./,                    // Ellipsis
  /…/,                         // Unicode ellipsis
  /\/\/\s*TODO/i,             // TODO comments
  /\/\/\s*FIXME/i,            // FIXME comments
  /\/\*\s*TODO/i,             // Block TODO
  /\/\*\s*FIXME/i,            // Block FIXME
  /similar to above/i,         // Lazy reference
  /same as before/i,           // Lazy reference
  /etc\./i,                    // Etc pattern
  /\/\/\s*add/i,              // Add placeholder
  /\/\/\s*implement/i,        // Implement placeholder
  /\/\/\s*rest of/i,          // Rest of placeholder
];

/**
 * Check if code contains incomplete patterns
 */
function hasIncompleteCode(code: string): boolean {
  return INCOMPLETE_PATTERNS.some((pattern) => pattern.test(code));
}

/**
 * Validates the Decomposer agent output structure
 */
function isValidDecompositionOutput(output: unknown): output is DecompositionOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check sprints exists and is an object
  if (!o.sprints || typeof o.sprints !== 'object') {
    return false;
  }

  // Check stories is an array
  if (!Array.isArray(o.stories) || o.stories.length === 0) {
    return false;
  }

  // Validate each story
  for (const story of o.stories) {
    // Check required fields
    if (
      typeof story.id !== 'string' ||
      typeof story.title !== 'string' ||
      typeof story.sprint !== 'string' ||
      !['frontend', 'backend', 'pipeline', 'infra'].includes(story.domain) ||
      !['ready', 'pending', 'blocked', 'in_progress', 'done'].includes(story.status)
    ) {
      return false;
    }

    // Check steps array
    if (!Array.isArray(story.steps)) {
      return false;
    }

    // Validate each step
    for (const step of story.steps) {
      if (
        typeof step.step_id !== 'number' ||
        typeof step.title !== 'string' ||
        typeof step.file_path !== 'string' ||
        !['CREATE', 'MODIFY', 'DELETE'].includes(step.action)
      ) {
        return false;
      }

      // Check code completeness (critical!)
      if (typeof step.code === 'string' && step.code.length > 0) {
        if (hasIncompleteCode(step.code)) {
          return false;
        }
      }
    }

    // Check files_affected
    if (!Array.isArray(story.files_affected)) {
      return false;
    }

    // Check acceptance_criteria
    if (!Array.isArray(story.acceptance_criteria)) {
      return false;
    }
  }

  // Check dependency_dag exists
  if (!o.dependency_dag || typeof o.dependency_dag !== 'object') {
    return false;
  }

  // Check has_non_atomic_tasks is boolean
  if (typeof o.has_non_atomic_tasks !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Decomposer Agent implementation
 *
 * Responsibilities:
 * - Break design into sprints
 * - Create atomic stories (≤3 files each)
 * - Write COMPLETE code for every step
 * - Build dependency DAG
 * - Flag non-atomic stories for splitting
 */
export class DecomposerAgent
  extends BaseAgent<DecompositionInput, DecompositionOutput>
  implements IDecompositionAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Decomposer agent
   */
  protected getSystemPrompt(): string {
    return DECOMPOSER_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: DecompositionInput): string {
    return createDecomposerMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: DecompositionOutput): boolean {
    return isValidDecompositionOutput(output);
  }
}

/**
 * Factory function to create a Decomposer agent
 */
export function createDecomposerAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): DecomposerAgent {
  return new DecomposerAgent(config, retryConfig);
}
