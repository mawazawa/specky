#!/usr/bin/env npx tsx
/**
 * Test Specky Pipeline using Claude Agent SDK
 *
 * Uses your Claude Max subscription through the Agent SDK
 * which properly handles OAuth authentication.
 *
 * Usage:
 *   npx tsx scripts/test-agent-sdk.ts
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { query, type Options } from '@anthropic-ai/claude-agent-sdk';
import { DISCOVERY_SYSTEM } from '../src/lib/spec-engine/prompts/system';
import { createDiscoveryMessage } from '../src/lib/spec-engine/prompts/user-messages';
import { parseJSONResponse } from '../src/lib/spec-engine/agents/base';
import type { DiscoveryInput, DiscoveryOutput } from '../planning/schemas';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDiscoveryAgent() {
  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY DISCOVERY AGENT TEST (Agent SDK)                       │', 'cyan');
  log('└─────────────────────────────────────────────────────────────────┘', 'cyan');
  console.log();

  const input: DiscoveryInput = {
    user_prompt: 'Build a simple todo list CLI application with add, list, complete, and delete commands. Use Node.js and store data in a local JSON file.',
  };

  log('Prompt:', 'bright');
  log(`  "${input.user_prompt}"`, 'dim');
  console.log();

  // Build the full prompt combining system and user message
  const systemPrompt = DISCOVERY_SYSTEM;
  const userMessage = createDiscoveryMessage(input);

  log('Running Discovery Agent via Claude Agent SDK...', 'bright');
  log('(Using your Claude Max subscription)', 'dim');
  console.log();

  const startTime = Date.now();
  let responseText = '';

  try {
    // Use the Agent SDK's query function with proper options
    const options: Options = {
      systemPrompt,
      tools: [], // No tools needed for this test
      maxTurns: 1,
      model: 'claude-sonnet-4-20250514', // Use Sonnet for faster response
    };

    // Stream the response
    process.stdout.write(`${colors.dim}Response: ${colors.reset}`);

    const queryResult = query({ prompt: userMessage, options });

    for await (const message of queryResult) {
      if (message.type === 'assistant' && message.message) {
        // Extract text content from the message
        for (const content of message.message.content) {
          if (content.type === 'text') {
            responseText += content.text;
            // Print a dot for progress
            process.stdout.write('.');
          }
        }
      }
    }

    console.log();
    console.log();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`✓ Response received in ${duration}s`, 'green');
    console.log();

    // Parse the JSON response
    log('Parsing JSON response...', 'dim');
    const parsed = parseJSONResponse<DiscoveryOutput>(responseText);

    log('┌─────────────────────────────────────────────────────────────────┐', 'green');
    log('│  DISCOVERY OUTPUT                                              │', 'green');
    log('└─────────────────────────────────────────────────────────────────┘', 'green');
    console.log();

    log('Parsed Intent:', 'bright');
    log(`  ${parsed.parsed_intent}`, 'cyan');
    console.log();

    log('Clarifying Questions:', 'bright');
    for (const q of parsed.clarifying_questions) {
      log(`  • ${q.question}`, 'reset');
      log(`    Recommended: ${q.recommended}`, 'dim');
    }
    console.log();

    log('Mentioned Tech:', 'bright');
    for (const t of parsed.mentioned_tech) {
      log(`  • ${t.name}: ${t.context}`, 'dim');
    }
    console.log();

    log('Requirements Draft:', 'bright');
    log(`  Goal: ${parsed.requirements_draft.goal}`, 'reset');
    log('  Scope:', 'reset');
    for (const s of parsed.requirements_draft.scope) {
      log(`    - ${s}`, 'dim');
    }
    console.log();

    log('✓ Discovery Agent test passed!', 'green');

  } catch (error) {
    console.log();
    log(`✗ Error: ${error instanceof Error ? error.message : String(error)}`, 'red');

    if (responseText) {
      log('Raw response (first 500 chars):', 'dim');
      log(responseText.slice(0, 500), 'dim');
    }

    process.exit(1);
  }
}

testDiscoveryAgent().catch((error) => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
