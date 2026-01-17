/**
 * Base Agent - Common functionality for all pipeline agents
 *
 * Handles:
 * - LLM invocation with structured output
 * - Retry logic with exponential backoff
 * - Response parsing and validation
 * - Error handling
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import Anthropic from '@anthropic-ai/sdk';

/**
 * LLM Provider configuration
 */
export interface LLMConfig {
  /** Provider name */
  provider: 'anthropic' | 'openai' | 'groq';
  /** Model identifier */
  model: string;
  /** API key (from environment if not provided) */
  apiKey?: string;
  /** Maximum tokens in response */
  maxTokens?: number;
  /** Temperature (0-1, lower = more deterministic) */
  temperature?: number;
  /** Request timeout in ms */
  timeout?: number;
}

/**
 * Default configuration for Specky agents
 */
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'anthropic',
  model: 'claude-opus-4-5-20251101',
  maxTokens: 16384,
  temperature: 0.1, // Low temperature for consistent outputs
  timeout: 120000, // 2 minutes
};

/**
 * Message for LLM conversation
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Response from LLM
 */
export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
  stopReason?: string;
}

/**
 * Agent execution result
 */
export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
  usage?: LLMResponse['usage'];
  retries: number;
}

/**
 * Parse JSON from LLM response, handling common issues
 */
export function parseJSONResponse<T>(response: string): T {
  // Remove markdown code fences if present
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Try to find JSON object or array
  const jsonMatch = cleaned.match(/^[\[{][\s\S]*[\]}]$/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return JSON.parse(cleaned) as T;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelayMs * Math.pow(2, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Base class for all Specky agents
 */
export abstract class BaseAgent<TInput, TOutput> {
  protected config: LLMConfig;
  protected retryConfig: RetryConfig;

  constructor(config: Partial<LLMConfig> = {}, retryConfig: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_LLM_CONFIG, ...config };
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Get the system prompt for this agent
   */
  protected abstract getSystemPrompt(): string;

  /**
   * Create the user message for this agent
   */
  protected abstract createUserMessage(input: TInput): string;

  /**
   * Validate the parsed output
   */
  protected abstract validateOutput(output: TOutput): boolean;

  /**
   * Execute the agent
   */
  async execute(input: TInput): Promise<TOutput> {
    const result = await this.executeWithRetry(input);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Agent execution failed');
    }
    return result.data;
  }

  /**
   * Execute with retry logic
   */
  protected async executeWithRetry(input: TInput): Promise<AgentResult<TOutput>> {
    let lastError: string | undefined;
    let retries = 0;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const messages: Message[] = [
          { role: 'system', content: this.getSystemPrompt() },
          { role: 'user', content: this.createUserMessage(input) },
        ];

        const response = await this.invokeLLM(messages);
        const parsed = parseJSONResponse<TOutput>(response.content);

        if (!this.validateOutput(parsed)) {
          throw new Error('Output validation failed');
        }

        return {
          success: true,
          data: parsed,
          rawResponse: response.content,
          usage: response.usage,
          retries,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        retries++;

        if (attempt < this.retryConfig.maxRetries) {
          const delay = getBackoffDelay(attempt, this.retryConfig);
          await sleep(delay);
        }
      }
    }

    return {
      success: false,
      error: lastError,
      retries,
    };
  }

  /**
   * Invoke the LLM with messages
   */
  protected async invokeLLM(messages: Message[]): Promise<LLMResponse> {
    const { provider, model, maxTokens, temperature, apiKey, timeout } = this.config;

    if (provider === 'anthropic') {
      return this.invokeAnthropic(messages, model, maxTokens!, temperature!, apiKey, timeout!);
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }

  /**
   * Invoke Anthropic Claude API using the official SDK
   */
  private async invokeAnthropic(
    messages: Message[],
    model: string,
    maxTokens: number,
    temperature: number,
    apiKey?: string,
    _timeout?: number
  ): Promise<LLMResponse> {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }

    const client = new Anthropic({ apiKey: key });

    const systemMessage = messages.find((m) => m.role === 'system')?.content || '';
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage,
      messages: conversationMessages,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const content = textContent && 'text' in textContent ? textContent.text : '';

    return {
      content,
      usage: {
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
      },
      model: response.model,
      stopReason: response.stop_reason || undefined,
    };
  }
}

/**
 * Simple agent that just returns a function result (for testing/mocking)
 */
export class FunctionAgent<TInput, TOutput> {
  constructor(private fn: (input: TInput) => Promise<TOutput>) {}

  async execute(input: TInput): Promise<TOutput> {
    return this.fn(input);
  }
}
