#!/usr/bin/env npx tsx
/**
 * Test Discovery Agent with Claude Max OAuth Token
 *
 * This script tests just the Discovery agent using the OAuth token
 * from your Claude Max subscription.
 *
 * Usage:
 *   npx tsx scripts/test-discovery-oauth.ts
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { execSync } from 'child_process';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get OAuth token from keychain
function getOAuthToken(): string {
  try {
    const token = execSync(
      'security find-generic-password -s "claude-code" -a "oauth-token" -w 2>/dev/null',
      { encoding: 'utf-8' }
    ).trim();
    return token;
  } catch {
    throw new Error('Could not retrieve OAuth token from keychain');
  }
}

async function testWithOAuth() {
  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY DISCOVERY AGENT TEST (OAuth)                           │', 'cyan');
  log('└─────────────────────────────────────────────────────────────────┘', 'cyan');
  console.log();

  // Get token
  log('Retrieving OAuth token from keychain...', 'dim');
  const token = getOAuthToken();
  log(`✓ Token retrieved (${token.length} chars)`, 'green');
  console.log();

  // The OAuth token is for Claude Code only, not the API
  // Let's check if we can use it via a different method
  log('Note: OAuth tokens from Claude Max are for Claude Code only.', 'yellow');
  log('They cannot be used with the Anthropic API directly.', 'yellow');
  console.log();

  log('To test the pipeline with real API calls, you need:', 'bright');
  log('  1. An Anthropic API key with credits', 'dim');
  log('  2. Set ANTHROPIC_API_KEY environment variable', 'dim');
  log('  3. Run: npx tsx scripts/test-pipeline.ts', 'dim');
  console.log();

  log('Alternatively, the mock test verifies the pipeline wiring:', 'bright');
  log('  npx tsx scripts/test-pipeline-mock.ts', 'cyan');
  console.log();

  // Let's at least verify the Discovery agent can be instantiated
  log('Verifying agent instantiation...', 'dim');

  const { createDiscoveryAgent } = await import('../src/lib/spec-engine/agents');

  const agent = createDiscoveryAgent({
    model: 'claude-sonnet-4-20250514', // Use a smaller model
    maxTokens: 4096,
  });

  log('✓ DiscoveryAgent instantiated successfully', 'green');
  log(`  Provider: anthropic`, 'dim');
  log(`  Model: claude-sonnet-4-20250514`, 'dim');
  console.log();

  log('Agent is ready. To make actual API calls, set ANTHROPIC_API_KEY.', 'yellow');
}

testWithOAuth().catch((error) => {
  log(`Error: ${error.message}`, 'red');
  process.exit(1);
});
