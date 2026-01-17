#!/usr/bin/env npx tsx
/**
 * Test Specky Discovery Agent using Claude CLI via stdin
 *
 * Uses your Claude Max subscription through the CLI
 * Passes prompt via stdin to avoid argument length issues.
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
    // IMPORTANT: Remove ANTHROPIC_API_KEY to force use of Claude Max subscription
    // See: https://github.com/anthropics/claude-code/issues/1826
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY;

    // Use stdin for the prompt to avoid argument length issues
    const claude = spawn('claude', [
      '-p',
      '--output-format', 'text',
      '--system-prompt', systemPrompt,
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

    // Write prompt to stdin and close
    claude.stdin.write(prompt);
    claude.stdin.end();
  });
}

async function testDiscoveryAgent() {
  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY DISCOVERY AGENT TEST (CLI stdin)                       │', 'cyan');
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
  log(`System prompt length: ${systemPrompt.length} chars`, 'dim');
  log(`User message length: ${userMessage.length} chars`, 'dim');
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

    // Show raw response for debugging
    log('Raw response (first 500 chars):', 'dim');
    log(responseText.slice(0, 500), 'dim');
    console.log();

    // Parse the JSON response
    log('Parsing JSON response...', 'dim');
    const parsed = parseJSONResponse<DiscoveryOutput>(responseText);

    log('┌─────────────────────────────────────────────────────────────────┐', 'green');
    log('│  DISCOVERY OUTPUT (Eden Standard)                             │', 'green');
    log('└─────────────────────────────────────────────────────────────────┘', 'green');
    console.log();

    log('Parsed Intent:', 'bright');
    log(`  ${parsed.parsed_intent}`, 'cyan');
    console.log();

    log('Clarifying Questions (with alternatives):', 'bright');
    for (const q of parsed.clarifying_questions) {
      log(`  • ${q.question}`, 'reset');
      log(`    Recommended: ${q.recommended}`, 'dim');
      log(`    Rationale: ${q.recommended_rationale || 'N/A'}`, 'dim');
      if (q.alternatives && q.alternatives.length > 0) {
        log('    Alternatives:', 'dim');
        for (const alt of q.alternatives) {
          if (typeof alt === 'object') {
            log(`      - ${alt.option}: ${alt.not_recommended_because}`, 'dim');
          } else {
            log(`      - ${alt}`, 'dim');
          }
        }
      }
    }
    console.log();

    log('Mentioned Tech (with verification queries):', 'bright');
    for (const t of parsed.mentioned_tech) {
      log(`  • ${t.name}`, 'reset');
      log(`    Context: ${t.context}`, 'dim');
      if (t.verification_query) {
        log(`    Verification Query: ${t.verification_query}`, 'dim');
      }
    }
    console.log();

    log('Requirements Draft:', 'bright');
    log(`  Goal: ${parsed.requirements_draft.goal}`, 'reset');
    log('  Scope:', 'reset');
    for (const s of parsed.requirements_draft.scope) {
      log(`    - ${s}`, 'dim');
    }
    if (parsed.requirements_draft.non_goals && parsed.requirements_draft.non_goals.length > 0) {
      log('  Non-Goals:', 'reset');
      for (const ng of parsed.requirements_draft.non_goals) {
        log(`    - ${ng}`, 'dim');
      }
    }
    if (parsed.requirements_draft.acceptance_criteria && parsed.requirements_draft.acceptance_criteria.length > 0) {
      log('  Acceptance Criteria:', 'reset');
      for (const ac of parsed.requirements_draft.acceptance_criteria) {
        if (typeof ac === 'object') {
          log(`    - ${ac.criterion}`, 'dim');
          log(`      Verification: ${ac.verification}`, 'dim');
        } else {
          log(`    - ${ac}`, 'dim');
        }
      }
    }
    console.log();

    if (parsed.unknowns && parsed.unknowns.length > 0) {
      log('Unknowns:', 'yellow');
      for (const u of parsed.unknowns) {
        log(`  • ${u.item}`, 'reset');
        log(`    Impact: ${u.impact}`, 'dim');
        if (u.default_assumption) {
          log(`    Default: ${u.default_assumption}`, 'dim');
        }
      }
      console.log();
    }

    // Verify Eden compliance
    log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
    log('│  EDEN COMPLIANCE CHECK                                         │', 'cyan');
    log('└─────────────────────────────────────────────────────────────────┘', 'cyan');
    console.log();

    const checks = [
      { name: 'Alternatives with rejection reasons', pass: parsed.clarifying_questions.some((q: any) => q.alternatives?.some((a: any) => a.not_recommended_because)) },
      { name: 'Verification queries for tech', pass: parsed.mentioned_tech.some((t: any) => t.verification_query) },
      { name: 'Non-goals defined', pass: parsed.requirements_draft.non_goals?.length > 0 },
      { name: 'Acceptance criteria with verification', pass: parsed.requirements_draft.acceptance_criteria?.some((ac: any) => ac.verification) },
      { name: 'Unknowns identified', pass: parsed.unknowns?.length > 0 },
    ];

    let passed = 0;
    for (const check of checks) {
      const status = check.pass ? '✓' : '✗';
      const color = check.pass ? 'green' : 'red';
      log(`  ${status} ${check.name}`, color);
      if (check.pass) passed++;
    }
    console.log();
    log(`Eden Compliance: ${passed}/${checks.length} checks passed`, passed === checks.length ? 'green' : 'yellow');
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
