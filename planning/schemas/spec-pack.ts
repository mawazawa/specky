/**
 * Spec Pack Schema - Complete Type Definitions
 *
 * These types define the structure of a 100% complete Specky spec pack.
 * Every field is required unless explicitly marked optional.
 * No ambiguity. No guessing. Copy-paste ready.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Story status in the pipeline
 */
export type StoryStatus =
  | 'pending'      // Not yet ready to start
  | 'ready'        // All blockers cleared, can be dispatched
  | 'in_progress'  // Currently being worked on
  | 'completed'    // Done and verified
  | 'blocked';     // Waiting on dependencies

/**
 * Effort estimation using t-shirt sizing
 */
export type EffortSize = 'S' | 'M' | 'L' | 'XL';

/**
 * Agent types that can execute stories
 */
export type AgentType =
  | 'senior-fullstack'
  | 'backend-data-architect'
  | 'senior-devops'
  | 'general-purpose'
  | 'Explore';

/**
 * File action in a story
 */
export type FileAction = 'CREATE' | 'MODIFY' | 'DELETE';

/**
 * Confidence level for a decision or section
 */
export type ConfidenceLevel = 'verified' | 'high' | 'medium' | 'low' | 'unverified';

// ═══════════════════════════════════════════════════════════════════════════
// VERIFICATION & CITATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A verified source for a tech decision
 */
export interface VerificationSource {
  /** URL of the source */
  url: string;
  /** Date the source was verified (ISO 8601) */
  verified_at: string;
  /** Brief description of what was verified */
  notes: string;
}

/**
 * A tech stack entry with full verification
 */
export interface VerifiedTech {
  /** Technology name */
  name: string;
  /** Exact version number */
  version: string;
  /** Whether this is the latest stable version */
  verified_latest: boolean;
  /** Release date of this version */
  release_date?: string;
  /** URL where version was verified */
  verification_source: string;
  /** Additional verification notes */
  verification_notes?: string;
}

/**
 * Complete tech stack with all technologies verified
 */
export interface VerifiedTechStack {
  /** When the entire stack was verified */
  verified_at: string;
  /** Method used for verification */
  verification_method: string;
  /** Frontend technologies */
  frontend: {
    framework: VerifiedTech;
    react?: VerifiedTech;
    typescript?: VerifiedTech;
    styling?: VerifiedTech;
    state_management?: VerifiedTech;
    testing?: {
      unit?: VerifiedTech;
      e2e?: VerifiedTech;
    };
  };
  /** Backend technologies */
  backend?: {
    database?: VerifiedTech;
    orm?: VerifiedTech;
    api?: VerifiedTech;
  };
  /** AI/ML technologies */
  ai?: {
    primary: {
      name: string;
      model: string;
      provider: string;
    };
    verification?: {
      name: string;
      purpose: string;
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBATE TRAIL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * An alternative that was considered but rejected
 */
export interface RejectedAlternative {
  /** The option that was considered */
  option: string;
  /** Why it was rejected */
  rejected_because: string;
}

/**
 * A design decision with full reasoning trail
 */
export interface DesignDecision {
  /** Unique identifier for this decision */
  id: string;
  /** Topic being decided */
  topic: string;
  /** The chosen decision */
  decision: string;
  /** Alternatives that were considered */
  alternatives_considered: RejectedAlternative[];
  /** Objection raised by challenger agent */
  challenger_objection: string;
  /** Response to the objection */
  response: string;
  /** When this was verified */
  verified_at: string;
  /** Source used for verification */
  verification_source: string;
}

/**
 * Complete debate trail for a spec pack
 */
export interface DebateTrail {
  /** All design decisions with reasoning */
  decisions: DesignDecision[];
}

// ═══════════════════════════════════════════════════════════════════════════
// STORY STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A file affected by a story
 */
export interface AffectedFile {
  /** Exact file path from project root */
  path: string;
  /** Action to perform */
  action: FileAction;
  /** Line range if modifying (e.g., "45-89") */
  lines?: string;
}

/**
 * An acceptance criterion with verification command
 */
export interface AcceptanceCriterion {
  /** The criterion description */
  criterion: string;
  /** Exact command to verify this criterion */
  verification: string;
}

/**
 * A step in a story implementation
 */
export interface StoryStep {
  /** Step number (matches <!-- step:N --> marker) */
  step_id: number;
  /** Title of this step */
  title: string;
  /** File being created/modified */
  file_path: string;
  /** Action on the file */
  action: FileAction;
  /** Line range if modifying */
  lines?: string;
  /** COMPLETE code for this step - no ellipsis, no TODO */
  code: string;
  /** Verification command for this step */
  verification: string;
}

/**
 * A complete story with all implementation details
 */
export interface Story {
  /** Story ID (e.g., "S1-002") */
  id: string;
  /** Story title */
  title: string;
  /** Sprint this story belongs to */
  sprint: string;
  /** Domain (frontend, backend, pipeline, etc.) */
  domain: string;
  /** Current status */
  status: StoryStatus;
  /** Type of agent that should execute this */
  agent_type: AgentType;
  /** Estimated effort */
  estimated_effort: EffortSize;
  /** Actual effort (set after completion) */
  actual_effort?: EffortSize;
  /** Story IDs that must complete before this can start */
  blocked_by: string[];
  /** Story IDs waiting for this to complete */
  blocks: string[];
  /** Number of step markers in the story */
  task_ids: number;
  /** Implementation steps with complete code */
  steps: StoryStep[];
  /** Files affected by this story */
  files_affected: AffectedFile[];
  /** Testable acceptance criteria */
  acceptance_criteria: AcceptanceCriterion[];
  /** Additional notes */
  notes?: string;
  /** Completion timestamp (ISO 8601) */
  completed_at?: string;
  /** Who/what completed this story */
  completed_by?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SPRINT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A sprint containing multiple stories
 */
export interface Sprint {
  /** Sprint ID (e.g., "sprint-1") */
  id: string;
  /** Sprint name */
  name: string;
  /** Theme/focus of this sprint */
  theme: string;
  /** Current status */
  status: 'pending' | 'in_progress' | 'completed';
  /** Progress percentage (0-100) */
  progress: number;
  /** Total stories in this sprint */
  total_stories: number;
  /** Completed stories count */
  completed_stories: number;
  /** Sprint IDs that must complete before this can start */
  blocked_by?: string[];
  /** Story IDs in this sprint */
  stories: string[];
  /** Start timestamp */
  started_at?: string;
  /** Target end timestamp */
  target_end?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUALITY & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A validation issue found in the spec pack
 */
export interface ValidationIssue {
  /** Severity of the issue */
  severity: 'error' | 'warning';
  /** Category of the issue */
  category: 'completeness' | 'citation' | 'atomic' | 'schema' | 'dag';
  /** Description of the issue */
  message: string;
  /** Location where the issue was found */
  location: string;
  /** Suggested fix */
  suggestion?: string;
}

/**
 * Quality report for a spec pack
 */
export interface QualityReport {
  /** Overall confidence score (must be 100 to ship) */
  confidence_score: number;
  /** Whether all quality gates pass */
  passes: boolean;
  /** Breakdown by category */
  breakdown: {
    /** Code completeness (no "...", no TODO) */
    completeness: {
      score: number;
      issues: ValidationIssue[];
    };
    /** Citation coverage (all decisions have URL+date) */
    citations: {
      score: number;
      issues: ValidationIssue[];
    };
    /** Atomic task rule (all tasks ≤3 files) */
    atomic: {
      score: number;
      issues: ValidationIssue[];
    };
    /** Schema validity (all .ts compile) */
    schemas: {
      score: number;
      issues: ValidationIssue[];
    };
    /** DAG validity (no cycles, valid dependencies) */
    dag: {
      score: number;
      issues: ValidationIssue[];
    };
  };
  /** Timestamp of validation */
  validated_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPUTED VIEWS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A blocked story entry
 */
export interface BlockedStory {
  /** Story ID */
  story: string;
  /** Story IDs blocking this one */
  blocked_by: string[];
}

/**
 * Computed views for quick status queries
 */
export interface ComputedViews {
  /** Stories ready for dispatch (status=ready, all blockers done) */
  ready_for_dispatch: string[];
  /** Stories currently in progress */
  in_progress: string[];
  /** Stories that are blocked */
  blocked_stories: BlockedStory[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SPEC PACK - THE COMPLETE OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Metadata for the spec pack
 */
export interface SpecPackMeta {
  /** Spec pack schema version */
  version: string;
  /** Project name */
  name: string;
  /** Project codename (optional) */
  codename?: string;
  /** Brief description */
  description: string;
  /** Creation timestamp */
  created_at: string;
  /** Who/what created this */
  created_by: string;
  /** Last update timestamp */
  updated_at: string;
}

/**
 * Requirements section of the spec pack
 */
export interface Requirements {
  /** Goal of the project */
  goal: string;
  /** In-scope items */
  scope: string[];
  /** Explicitly out-of-scope items */
  non_goals: string[];
  /** Clarifying questions that were asked */
  clarifying_questions: {
    question: string;
    answer: string;
  }[];
  /** Acceptance criteria for the entire project */
  acceptance_criteria: string[];
}

/**
 * Design section of the spec pack
 */
export interface Design {
  /** Architecture description */
  architecture: string;
  /** Verified tech stack */
  tech_stack: VerifiedTechStack;
  /** File structure */
  file_structure: string;
  /** Design decisions with reasoning */
  decisions: DesignDecision[];
}

/**
 * A complete Specky spec pack
 *
 * This is the final output of the 6-phase pipeline.
 * Every field must be complete. No ambiguity. No guessing.
 */
export interface SpecPack {
  /** Spec pack metadata */
  meta: SpecPackMeta;

  /** Requirements gathered in Phase 1-2 */
  requirements: Requirements;

  /** Design from Phase 3 */
  design: Design;

  /** Sprints containing stories */
  sprints: Record<string, Sprint>;

  /** All stories with complete implementation */
  stories: Record<string, Story>;

  /** TypeScript schemas (as string content, ready to write to files) */
  schemas: Record<string, string>;

  /** Computed views for quick queries */
  views: ComputedViews;

  /** Quality report (must show 100% confidence) */
  quality: QualityReport;

  /** Complete debate trail showing all reasoning */
  debate_trail: DebateTrail;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a spec pack is complete (100% confidence)
 */
export function isSpecPackComplete(pack: SpecPack): boolean {
  return pack.quality.confidence_score === 100 && pack.quality.passes;
}

/**
 * Get all stories ready for dispatch
 */
export function getReadyStories(pack: SpecPack): Story[] {
  return pack.views.ready_for_dispatch.map((id) => pack.stories[id]);
}

/**
 * Get the dependency DAG for a spec pack
 */
export function buildDependencyDAG(pack: SpecPack): Map<string, string[]> {
  const dag = new Map<string, string[]>();
  for (const [id, story] of Object.entries(pack.stories)) {
    dag.set(id, story.blocked_by);
  }
  return dag;
}

/**
 * Check if a story can be dispatched (all blockers complete)
 */
export function canDispatch(pack: SpecPack, storyId: string): boolean {
  const story = pack.stories[storyId];
  if (!story) return false;
  if (story.status !== 'ready') return false;

  return story.blocked_by.every((blockerId) => {
    const blocker = pack.stories[blockerId];
    return blocker && blocker.status === 'completed';
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default quality report for a new spec pack
 */
export const DEFAULT_QUALITY_REPORT: QualityReport = {
  confidence_score: 0,
  passes: false,
  breakdown: {
    completeness: { score: 0, issues: [] },
    citations: { score: 0, issues: [] },
    atomic: { score: 0, issues: [] },
    schemas: { score: 0, issues: [] },
    dag: { score: 0, issues: [] },
  },
  validated_at: new Date().toISOString(),
};

/**
 * Empty spec pack template
 */
export function createEmptySpecPack(name: string, description: string): SpecPack {
  const now = new Date().toISOString();
  return {
    meta: {
      version: '1.0.0',
      name,
      description,
      created_at: now,
      created_by: 'specky',
      updated_at: now,
    },
    requirements: {
      goal: '',
      scope: [],
      non_goals: [],
      clarifying_questions: [],
      acceptance_criteria: [],
    },
    design: {
      architecture: '',
      tech_stack: {
        verified_at: now,
        verification_method: 'mcp__exa__web_search_exa',
        frontend: {
          framework: {
            name: '',
            version: '',
            verified_latest: false,
            verification_source: '',
          },
        },
      },
      file_structure: '',
      decisions: [],
    },
    sprints: {},
    stories: {},
    schemas: {},
    views: {
      ready_for_dispatch: [],
      in_progress: [],
      blocked_stories: [],
    },
    quality: DEFAULT_QUALITY_REPORT,
    debate_trail: {
      decisions: [],
    },
  };
}
