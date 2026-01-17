/**
 * Prompts Index - System prompts and user message templates
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

// System prompts
export {
  BASE_CONTEXT,
  JSON_OUTPUT_INSTRUCTIONS,
  DISCOVERY_SYSTEM,
  CHALLENGE_SYSTEM,
  ARCHITECT_SYSTEM,
  DECOMPOSER_SYSTEM,
  VALIDATOR_SYSTEM,
  SYNTHESIZER_SYSTEM,
} from './system';

// User message templates
export {
  createDiscoveryMessage,
  createChallengeMessage,
  createArchitectMessage,
  createDecomposerMessage,
  createValidatorMessage,
  createSynthesizerMessage,
} from './user-messages';
