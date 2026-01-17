/**
 * Architect Agent - Phase 3: Technical Designer
 *
 * Makes definitive technology decisions, designs architecture,
 * and generates complete TypeScript schemas.
 *
 * Every decision must be verified with URL + date.
 * Every schema must be 100% complete (no ellipsis, no TODO).
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { BaseAgent, type LLMConfig, type RetryConfig } from './base';
import { ARCHITECT_SYSTEM } from '../prompts/system';
import { createArchitectMessage } from '../prompts/user-messages';
import type {
  DesignInput,
  DesignOutput,
  DesignAgent as IDesignAgent,
} from '../../../../planning/schemas';

/**
 * Validates that a tech stack entry has proper verification
 */
function hasValidVerification(entry: unknown): boolean {
  if (!entry || typeof entry !== 'object') {
    return false;
  }

  const e = entry as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    typeof e.version === 'string' &&
    e.version !== 'latest' &&
    e.version.length > 0
  );
}

/**
 * Validates the Architect agent output structure
 */
function isValidDesignOutput(output: unknown): output is DesignOutput {
  if (!output || typeof output !== 'object') {
    return false;
  }

  const o = output as Record<string, unknown>;

  // Check required string fields
  if (typeof o.architecture !== 'string' || o.architecture.length === 0) {
    return false;
  }

  if (typeof o.file_structure !== 'string' || o.file_structure.length === 0) {
    return false;
  }

  // Check tech_stack exists and has basic structure
  if (!o.tech_stack || typeof o.tech_stack !== 'object') {
    return false;
  }

  const ts = o.tech_stack as Record<string, unknown>;
  if (typeof ts.verified_at !== 'string') {
    return false;
  }

  // Check frontend tech stack
  if (ts.frontend && typeof ts.frontend === 'object') {
    const fe = ts.frontend as Record<string, unknown>;
    if (fe.framework && !hasValidVerification(fe.framework)) {
      return false;
    }
  }

  // Check decisions is an array
  if (!Array.isArray(o.decisions)) {
    return false;
  }

  // Validate each decision has required fields
  for (const d of o.decisions) {
    if (
      typeof d.id !== 'string' ||
      typeof d.topic !== 'string' ||
      typeof d.decision !== 'string' ||
      !Array.isArray(d.alternatives_considered) ||
      d.alternatives_considered.length < 1
    ) {
      return false;
    }
  }

  // Check schemas exists and is an object
  if (!o.schemas || typeof o.schemas !== 'object') {
    return false;
  }

  // Check needs_refinement is boolean
  if (typeof o.needs_refinement !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Architect Agent implementation
 *
 * Responsibilities:
 * - Select and verify tech stack (exact versions, not "latest")
 * - Design high-level architecture
 * - Create file structure
 * - Document design decisions with alternatives
 * - Generate complete TypeScript schemas
 */
export class ArchitectAgent
  extends BaseAgent<DesignInput, DesignOutput>
  implements IDesignAgent
{
  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    super(config, retryConfig);
  }

  /**
   * Get the system prompt for the Architect agent
   */
  protected getSystemPrompt(): string {
    return ARCHITECT_SYSTEM;
  }

  /**
   * Create the user message from input
   */
  protected createUserMessage(input: DesignInput): string {
    return createArchitectMessage(input);
  }

  /**
   * Validate the parsed output
   */
  protected validateOutput(output: DesignOutput): boolean {
    return isValidDesignOutput(output);
  }
}

/**
 * Factory function to create an Architect agent
 */
export function createArchitectAgent(
  config?: Partial<LLMConfig>,
  retryConfig?: Partial<RetryConfig>
): ArchitectAgent {
  return new ArchitectAgent(config, retryConfig);
}
