#!/usr/bin/env npx tsx
/**
 * Test Script - Run the Specky Pipeline
 *
 * Usage:
 *   npx tsx scripts/test-pipeline.ts
 *   npx tsx scripts/test-pipeline.ts "Your custom prompt here"
 *
 * Requires:
 *   ANTHROPIC_API_KEY environment variable
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import { createSpeckyPipeline } from '../src/lib/spec-engine';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logPhase(phase: string, status: string) {
  const statusColor = status === 'completed' ? 'green' : status === 'failed' ? 'red' : 'yellow';
  const icon = status === 'completed' ? '✓' : status === 'failed' ? '✗' : '◐';
  console.log(`  ${colors[statusColor]}${icon}${colors.reset} ${phase}: ${colors[statusColor]}${status}${colors.reset}`);
}

async function main() {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    log('Error: ANTHROPIC_API_KEY environment variable is required', 'red');
    log('Set it with: export ANTHROPIC_API_KEY=your-key-here', 'dim');
    process.exit(1);
  }

  // Get prompt from args or use default
  const customPrompt = process.argv[2];
  const prompt = customPrompt || 'Build a simple todo list CLI application with add, list, complete, and delete commands. Use Node.js and store data in a local JSON file.';

  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY PIPELINE TEST                                          │', 'cyan');
  log('└─────────────────────────────────────────────────────────────────┘', 'cyan');
  console.log();

  log('Prompt:', 'bright');
  log(`  "${prompt}"`, 'dim');
  console.log();

  // Create pipeline with balanced preset for faster testing
  const pipeline = createSpeckyPipeline({
    preset: 'balanced',
    iterationConfig: {
      discovery_challenge_max: 2,
      design_decomposition_max: 2,
      decomposition_validation_max: 3, // Limit iterations for testing
    },
  });

  // Track timing
  const startTime = Date.now();
  let currentPhase = '';

  // Subscribe to events
  pipeline.onEvent((event) => {
    switch (event.type) {
      case 'phase_started':
        currentPhase = event.phase || '';
        logPhase(currentPhase, 'running');
        break;
      case 'phase_completed':
        logPhase(event.phase || '', 'completed');
        break;
      case 'phase_failed':
        logPhase(event.phase || '', 'failed');
        log(`    Error: ${event.details.error}`, 'red');
        break;
      case 'iteration_started':
        log(`    Iteration ${event.details.iteration}...`, 'dim');
        break;
      case 'loop_back':
        log(`    ↩ Looping back to ${event.phase}: ${event.details.reason || 'refinement needed'}`, 'yellow');
        break;
      case 'pipeline_completed':
        console.log();
        log('Pipeline completed successfully!', 'green');
        break;
      case 'pipeline_failed':
        console.log();
        log(`Pipeline failed: ${event.details.error}`, 'red');
        break;
    }
  });

  log('Running pipeline...', 'bright');
  console.log();

  try {
    const specPack = await pipeline.start({
      user_prompt: prompt,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log();
    log('┌─────────────────────────────────────────────────────────────────┐', 'green');
    log('│  RESULT                                                         │', 'green');
    log('└─────────────────────────────────────────────────────────────────┘', 'green');
    console.log();

    log(`Duration: ${duration}s`, 'dim');
    log(`Quality Score: ${specPack.quality.confidence_score}%`, specPack.quality.passes ? 'green' : 'yellow');
    log(`Sprints: ${specPack.sprints.length}`, 'reset');
    log(`Stories: ${specPack.stories.length}`, 'reset');
    console.log();

    // Show sprint breakdown
    log('Sprint Breakdown:', 'bright');
    for (const sprint of specPack.sprints) {
      const storyCount = specPack.stories.filter(s => s.sprint === sprint.id).length;
      log(`  ${sprint.id}: ${sprint.name} (${storyCount} stories)`, 'dim');
    }
    console.log();

    // Show quality breakdown
    log('Quality Breakdown:', 'bright');
    const breakdown = specPack.quality.breakdown;
    for (const [category, result] of Object.entries(breakdown)) {
      const icon = result.score === 100 ? '✓' : '✗';
      const color = result.score === 100 ? 'green' : 'red';
      log(`  ${colors[color]}${icon}${colors.reset} ${category}: ${result.score}%`, 'reset');
      if (result.issues.length > 0) {
        for (const issue of result.issues.slice(0, 2)) {
          log(`    - ${issue.message}`, 'dim');
        }
        if (result.issues.length > 2) {
          log(`    ... and ${result.issues.length - 2} more`, 'dim');
        }
      }
    }
    console.log();

    // Save spec pack to file
    const outputPath = './test-spec-pack.json';
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(specPack, null, 2));
    log(`Spec pack saved to: ${outputPath}`, 'cyan');

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log();
    log(`Pipeline failed after ${duration}s`, 'red');
    log(`Error: ${error instanceof Error ? error.message : String(error)}`, 'red');

    // Show pipeline state for debugging
    const state = pipeline.getState();
    console.log();
    log('Pipeline State:', 'bright');
    log(`  Status: ${state.status}`, 'dim');
    log(`  Current Phase: ${state.current_phase}`, 'dim');
    log(`  Total Iterations: ${state.total_iterations}`, 'dim');

    process.exit(1);
  }
}

main().catch(console.error);
