#!/usr/bin/env npx tsx
/**
 * Mock Test Script - Verify Pipeline Wiring Without API Calls
 *
 * This script tests the pipeline orchestration using mock agents
 * that return predefined responses. Use this to verify the pipeline
 * flow without consuming API credits.
 *
 * Usage:
 *   npx tsx scripts/test-pipeline-mock.ts
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import {
  PipelineOrchestrator,
  type PipelineAgentConfig,
} from '../src/lib/spec-engine/orchestrator';

import type {
  PipelineAgents,
  DiscoveryInput,
  DiscoveryOutput,
  ChallengeInput,
  ChallengeOutput,
  DesignInput,
  DesignOutput,
  DecompositionInput,
  DecompositionOutput,
  ValidationInput,
  ValidationOutput,
  SynthesisInput,
  SynthesisOutput,
} from '../planning/schemas';

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

// ═══════════════════════════════════════════════════════════════════════════
// MOCK AGENTS
// ═══════════════════════════════════════════════════════════════════════════

const mockDiscoveryOutput: DiscoveryOutput = {
  parsed_intent: 'Build a CLI todo list application with CRUD operations and local JSON storage',
  clarifying_questions: [
    {
      question: 'What level of complexity do you need for the CLI interface?',
      rationale: 'Affects argument parsing and user experience',
      recommended: 'Simple positional arguments',
      alternatives: ['Interactive prompts', 'Full flag-based CLI'],
    },
    {
      question: 'Should todos support due dates and priorities?',
      rationale: 'Affects data model complexity',
      recommended: 'No - keep it minimal for MVP',
      alternatives: ['Due dates only', 'Full task metadata'],
    },
    {
      question: 'How should the JSON file be located?',
      rationale: 'Affects portability and configuration',
      recommended: 'Current directory (./todos.json)',
      alternatives: ['Home directory (~/.todos.json)', 'Configurable path'],
    },
    {
      question: 'Should the CLI support multiple todo lists?',
      rationale: 'Affects architecture complexity',
      recommended: 'No - single list for simplicity',
      alternatives: ['Multiple named lists', 'Project-based lists'],
    },
    {
      question: 'What output format for listing todos?',
      rationale: 'Affects user experience and scripting',
      recommended: 'Human-readable table',
      alternatives: ['JSON output', 'Minimal one-per-line'],
    },
  ],
  mentioned_tech: [
    { name: 'Node.js', context: 'Runtime for CLI application', verified: false },
    { name: 'JSON', context: 'Data storage format', verified: false },
  ],
  requirements_draft: {
    goal: 'Enable users to manage todos via command line with persistent local storage',
    scope: ['Add todos', 'List todos', 'Mark complete', 'Delete todos', 'JSON persistence'],
    non_goals: ['Due dates', 'Priorities', 'Multiple lists', 'Sync/cloud'],
  },
};

const mockChallengeOutput: ChallengeOutput = {
  challenges: [
    {
      type: 'scope',
      concern: 'No error handling specified for file operations',
      evidence: 'JSON file could be corrupted or permissions denied',
      suggested_resolution: 'Add graceful error handling with clear user messages',
      status: 'addressed',
      resolution: 'Will add try/catch with user-friendly error messages',
    },
    {
      type: 'ux',
      concern: 'No confirmation for delete operations',
      evidence: 'Users might accidentally delete todos',
      suggested_resolution: 'Add --force flag or confirmation prompt',
      status: 'addressed',
      resolution: 'Will add --force flag for non-interactive delete',
    },
    {
      type: 'feasibility',
      concern: 'Concurrent file access not handled',
      evidence: 'Two terminals could corrupt the JSON file',
      suggested_resolution: 'Use file locking or accept as out of scope for MVP',
      status: 'accepted',
      resolution: 'Accepted as out of scope - single user CLI',
    },
  ],
  requirements_challenged: {
    goal: 'Enable users to manage todos via command line with persistent local storage and proper error handling',
    scope: [
      'Add todos with title',
      'List all todos with status',
      'Mark todo as complete by ID',
      'Delete todo by ID with --force flag',
      'JSON persistence in ./todos.json',
      'Graceful error handling',
    ],
    non_goals: ['Due dates', 'Priorities', 'Multiple lists', 'Sync/cloud', 'Concurrent access'],
    acceptance_criteria: [
      'Can add a todo and see it in list',
      'Can mark a todo complete and see status change',
      'Can delete a todo with --force flag',
      'Errors show user-friendly messages',
      'Data persists across CLI invocations',
    ],
  },
  needs_discovery_loop: false,
};

const mockDesignOutput: DesignOutput = {
  architecture: 'Single-file CLI application with command pattern for operations',
  tech_stack: {
    verified_at: new Date().toISOString().slice(0, 10),
    verification_method: 'mcp__exa__web_search_exa',
    runtime: {
      name: 'Node.js',
      version: '22.12.0',
      verified_latest: true,
      verification_source: 'https://nodejs.org/en/download',
    },
  },
  file_structure: `
todo-cli/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts      # CLI entry point
│   ├── commands.ts   # Command handlers
│   └── storage.ts    # JSON file operations
└── todos.json        # Data file (created on first run)
`,
  decisions: [
    {
      id: 'D-001',
      topic: 'CLI argument parsing',
      decision: 'Use built-in process.argv parsing',
      alternatives_considered: [
        { option: 'commander.js', rejected_because: 'Overkill for 4 simple commands' },
        { option: 'yargs', rejected_because: 'Adds unnecessary dependency' },
      ],
      challenger_objection: 'Manual parsing is error-prone',
      response: 'For 4 commands with simple args, manual parsing is clearer and has no dependencies',
      verified_at: new Date().toISOString().slice(0, 10),
      verification_source: 'https://nodejs.org/api/process.html#processargv',
    },
  ],
  schemas: {
    'types.ts': `/**
 * Todo item type
 */
export interface Todo {
  /** Unique identifier */
  id: number;
  /** Todo title/description */
  title: string;
  /** Whether the todo is completed */
  completed: boolean;
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Todo list stored in JSON file
 */
export interface TodoList {
  /** Auto-incrementing ID counter */
  nextId: number;
  /** All todos */
  todos: Todo[];
}
`,
  },
  needs_refinement: false,
};

const mockDecompositionOutput: DecompositionOutput = {
  sprints: {
    'sprint-1': {
      name: 'Foundation',
      theme: 'Core infrastructure and data layer',
      story_ids: ['S1-001', 'S1-002'],
    },
    'sprint-2': {
      name: 'Commands',
      theme: 'CLI command implementations',
      story_ids: ['S2-001', 'S2-002'],
    },
  },
  stories: [
    {
      id: 'S1-001',
      title: 'Setup project structure',
      sprint: 'sprint-1',
      domain: 'infra',
      status: 'ready',
      agent_type: 'senior-fullstack',
      estimated_effort: 'S',
      blocked_by: [],
      blocks: ['S1-002'],
      task_ids: 2,
      steps: [
        {
          step_id: 1,
          title: 'Create package.json',
          file_path: 'package.json',
          action: 'CREATE',
          code: `{
  "name": "todo-cli",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "todo": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}`,
          verification: 'npm install && npm run build',
        },
        {
          step_id: 2,
          title: 'Create tsconfig.json',
          file_path: 'tsconfig.json',
          action: 'CREATE',
          code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}`,
          verification: 'npx tsc --noEmit',
        },
      ],
      files_affected: [
        { path: 'package.json', action: 'CREATE' },
        { path: 'tsconfig.json', action: 'CREATE' },
      ],
      acceptance_criteria: [
        { criterion: 'npm install succeeds', verification: 'npm install' },
        { criterion: 'TypeScript compiles', verification: 'npm run build' },
      ],
    },
    {
      id: 'S1-002',
      title: 'Implement storage layer',
      sprint: 'sprint-1',
      domain: 'backend',
      status: 'blocked',
      agent_type: 'senior-fullstack',
      estimated_effort: 'M',
      blocked_by: ['S1-001'],
      blocks: ['S2-001', 'S2-002'],
      task_ids: 2,
      steps: [
        {
          step_id: 1,
          title: 'Create types',
          file_path: 'src/types.ts',
          action: 'CREATE',
          code: mockDesignOutput.schemas['types.ts'],
          verification: 'npx tsc --noEmit',
        },
        {
          step_id: 2,
          title: 'Create storage module',
          file_path: 'src/storage.ts',
          action: 'CREATE',
          code: `import { readFileSync, writeFileSync, existsSync } from 'fs';
import type { Todo, TodoList } from './types.js';

const DATA_FILE = './todos.json';

function getEmptyList(): TodoList {
  return { nextId: 1, todos: [] };
}

export function loadTodos(): TodoList {
  try {
    if (!existsSync(DATA_FILE)) {
      return getEmptyList();
    }
    const data = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data) as TodoList;
  } catch (error) {
    console.error('Error loading todos:', error instanceof Error ? error.message : error);
    return getEmptyList();
  }
}

export function saveTodos(list: TodoList): void {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
  } catch (error) {
    console.error('Error saving todos:', error instanceof Error ? error.message : error);
  }
}

export function addTodo(title: string): Todo {
  const list = loadTodos();
  const todo: Todo = {
    id: list.nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  list.todos.push(todo);
  saveTodos(list);
  return todo;
}

export function getTodos(): Todo[] {
  return loadTodos().todos;
}

export function completeTodo(id: number): boolean {
  const list = loadTodos();
  const todo = list.todos.find(t => t.id === id);
  if (!todo) return false;
  todo.completed = true;
  saveTodos(list);
  return true;
}

export function deleteTodo(id: number): boolean {
  const list = loadTodos();
  const index = list.todos.findIndex(t => t.id === id);
  if (index === -1) return false;
  list.todos.splice(index, 1);
  saveTodos(list);
  return true;
}
`,
          verification: 'npx tsc --noEmit',
        },
      ],
      files_affected: [
        { path: 'src/types.ts', action: 'CREATE' },
        { path: 'src/storage.ts', action: 'CREATE' },
      ],
      acceptance_criteria: [
        { criterion: 'TypeScript compiles without errors', verification: 'npx tsc --noEmit' },
      ],
    },
  ],
  dependency_dag: {
    'S1-001': [],
    'S1-002': ['S1-001'],
    'S2-001': ['S1-002'],
    'S2-002': ['S1-002'],
  },
  has_non_atomic_tasks: false,
};

const mockValidationOutput: ValidationOutput = {
  quality_report: {
    confidence_score: 100,
    passes: true,
    breakdown: {
      completeness: { score: 100, issues: [] },
      citations: { score: 100, issues: [] },
      atomic: { score: 100, issues: [] },
      schemas: { score: 100, issues: [] },
      dag: { score: 100, issues: [] },
    },
    validated_at: new Date().toISOString(),
  },
  passes: true,
};

const mockSynthesisOutput: SynthesisOutput = {
  spec_pack: {
    meta: {
      id: 'sp-todo-cli',
      name: 'Todo CLI',
      version: '1.0.0',
      created_at: new Date().toISOString(),
      created_by: 'specky',
    },
    requirements: mockChallengeOutput.requirements_challenged,
    tech_stack: mockDesignOutput.tech_stack,
    sprints: [
      { id: 'sprint-1', name: 'Foundation', theme: 'Core infrastructure', story_ids: ['S1-001', 'S1-002'] },
      { id: 'sprint-2', name: 'Commands', theme: 'CLI commands', story_ids: ['S2-001', 'S2-002'] },
    ],
    stories: mockDecompositionOutput.stories,
    schemas: mockDesignOutput.schemas,
    decisions: mockDesignOutput.decisions,
    debate_trail: [],
    quality: mockValidationOutput.quality_report,
  },
  executive_summary: `
## Todo CLI Specification

This specification defines a simple command-line todo list application built with Node.js.

### Key Technology Choices
- **Runtime**: Node.js 22.12.0 (latest LTS)
- **Language**: TypeScript 5.7.0 with strict mode
- **Storage**: Local JSON file (./todos.json)

### Scope
The application supports 4 core commands: add, list, complete, and delete. Data persists locally in JSON format.

### Implementation Plan
- **Sprint 1**: Project setup and storage layer (2 stories)
- **Sprint 2**: CLI command implementations (2 stories)

### Quality Score
100% - All validation checks pass.
`,
  exports: {
    markdown: '# Todo CLI Spec\n\n...',
    json: JSON.stringify({ id: 'sp-todo-cli' }),
  },
};

// Create mock agents
function createMockAgents(): PipelineAgents {
  return {
    discovery: {
      execute: async (_input: DiscoveryInput): Promise<DiscoveryOutput> => {
        await sleep(100); // Simulate API delay
        return mockDiscoveryOutput;
      },
    },
    challenge: {
      execute: async (_input: ChallengeInput): Promise<ChallengeOutput> => {
        await sleep(100);
        return mockChallengeOutput;
      },
    },
    design: {
      execute: async (_input: DesignInput): Promise<DesignOutput> => {
        await sleep(100);
        return mockDesignOutput;
      },
    },
    decomposition: {
      execute: async (_input: DecompositionInput): Promise<DecompositionOutput> => {
        await sleep(100);
        return mockDecompositionOutput;
      },
    },
    validation: {
      execute: async (_input: ValidationInput): Promise<ValidationOutput> => {
        await sleep(100);
        return mockValidationOutput;
      },
    },
    synthesis: {
      execute: async (_input: SynthesisInput): Promise<SynthesisOutput> => {
        await sleep(100);
        return mockSynthesisOutput;
      },
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const prompt = 'Build a simple todo list CLI application with add, list, complete, and delete commands.';

  console.log();
  log('┌─────────────────────────────────────────────────────────────────┐', 'cyan');
  log('│  SPECKY PIPELINE TEST (MOCK)                                   │', 'cyan');
  log('└─────────────────────────────────────────────────────────────────┘', 'cyan');
  console.log();

  log('Prompt:', 'bright');
  log(`  "${prompt}"`, 'dim');
  console.log();

  // Create pipeline with mock agents
  const mockAgents = createMockAgents();
  const pipeline = new PipelineOrchestrator(mockAgents);

  // Track timing
  const startTime = Date.now();

  // Subscribe to events
  pipeline.onEvent((event: any) => {
    switch (event.type) {
      case 'phase_started':
        logPhase(event.phase || '', 'running');
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
        log(`    ↩ Looping back to ${event.phase}`, 'yellow');
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

  log('Running pipeline with mock agents...', 'bright');
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

    // Show stories
    log('Stories:', 'bright');
    for (const story of specPack.stories) {
      const statusIcon = story.status === 'ready' ? '○' : story.status === 'blocked' ? '◌' : '●';
      log(`  ${statusIcon} ${story.id}: ${story.title} [${story.status}]`, 'dim');
    }
    console.log();

    // Show quality breakdown
    log('Quality Breakdown:', 'bright');
    const breakdown = specPack.quality.breakdown;
    for (const [category, result] of Object.entries(breakdown)) {
      const icon = result.score === 100 ? '✓' : '✗';
      const color = result.score === 100 ? 'green' : 'red';
      log(`  ${colors[color]}${icon}${colors.reset} ${category}: ${result.score}%`, 'reset');
    }
    console.log();

    log('✓ Pipeline wiring verified successfully!', 'green');

  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log();
    log(`Pipeline failed after ${duration}s`, 'red');
    log(`Error: ${error instanceof Error ? error.message : String(error)}`, 'red');
    process.exit(1);
  }
}

main().catch(console.error);
