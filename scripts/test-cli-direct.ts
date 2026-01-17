#!/usr/bin/env npx tsx
/**
 * Test Specky Discovery Agent using Claude CLI directly
 *
 * Uses your Claude Max subscription through the CLI
 * in print mode (-p flag).
 *
 * Usage:
 *   npx tsx scripts/test-cli-direct.ts
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { spawn } from 'child_process';
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

async function runClaudeCLI(prompt: string, systemPrompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Use the claude CLI with -p flag for print mode
    // IMPORTANT: Remove ANTHROPIC_API_KEY to force use of Claude Max subscription
    // See: https://github.com/anthropics/claude-code/issues/1826
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY;

    const claude = spawn('claude', [
      '-p',
      '--output-format', 'text',
      '--append-system-prompt', systemPrompt,
      prompt,
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env,
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write('.');
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    claude.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr || stdout}`));
      }
    });

    claude.on('error', (err) => {
      reject(err);
    });
  });
}

async function testDiscoveryAgent() {
  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY DISCOVERY AGENT TEST (CLI Direct)                      │', 'cyan');
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

  log('Running Discovery Agent via Claude CLI...', 'bright');
  log('(Using your Claude Max subscription)', 'dim');
  console.log();

  const startTime = Date.now();

  try {
    process.stdout.write(`${colors.dim}Response: ${colors.reset}`);

    const responseText = await runClaudeCLI(userMessage, systemPrompt);

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
    process.exit(1);
  }
}

testDiscoveryAgent().catch((error) => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
