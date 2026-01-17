/**
 * Validators Index
 *
 * Central export for all validation modules.
 * Use validateAll() to run the complete quality gate.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type {
  Story,
  DesignDecision,
  VerifiedTechStack,
  QualityReport,
  ValidationIssue,
} from '../../../../planning/schemas';

import {
  validateCompleteness,
  hasIncompleteCode,
  type CompletenessResult,
} from './completeness';

import {
  validateAtomic,
  countFilesAffected,
  suggestSplit,
  type AtomicResult,
} from './atomic';

import {
  validateCitations,
  hasProperCitation,
  type CitationResult,
} from './citations';

// Re-export individual validators
export {
  validateCompleteness,
  hasIncompleteCode,
  type CompletenessResult,
} from './completeness';

export {
  validateAtomic,
  countFilesAffected,
  suggestSplit,
  MAX_FILES_PER_TASK,
  type AtomicResult,
} from './atomic';

export {
  validateCitations,
  hasProperCitation,
  type CitationResult,
} from './citations';

/**
 * Input for full validation
 */
export interface ValidationInput {
  stories: Story[];
  decisions: DesignDecision[];
  schemas: Record<string, string>;
  techStack?: VerifiedTechStack;
  dependencyDag?: Record<string, string[]>;
}

/**
 * Run all validators and produce a quality report
 */
export function validateAll(input: ValidationInput): QualityReport {
  const { stories, decisions, schemas, techStack, dependencyDag } = input;

  // Run completeness validation
  const completenessResult = validateCompleteness(stories);

  // Run atomic task validation
  const atomicResult = validateAtomic(stories);

  // Run citation validation
  const citationResult = validateCitations(decisions, techStack);

  // Run schema validation (compile check)
  const schemaResult = validateSchemas(schemas);

  // Run DAG validation (cycle check)
  const dagResult = dependencyDag ? validateDag(dependencyDag) : { score: 100, issues: [] };

  // Calculate overall confidence score
  // All must be 100 for the spec to pass
  const allScores = [
    completenessResult.score,
    atomicResult.score,
    citationResult.score,
    schemaResult.score,
    dagResult.score,
  ];

  const confidenceScore = Math.min(...allScores);
  const passes = confidenceScore === 100;

  return {
    confidence_score: confidenceScore,
    passes,
    breakdown: {
      completeness: {
        score: completenessResult.score,
        issues: completenessResult.issues,
      },
      citations: {
        score: citationResult.score,
        issues: citationResult.issues,
      },
      atomic: {
        score: atomicResult.score,
        issues: atomicResult.issues,
      },
      schemas: {
        score: schemaResult.score,
        issues: schemaResult.issues,
      },
      dag: {
        score: dagResult.score,
        issues: dagResult.issues,
      },
    },
    validated_at: new Date().toISOString(),
  };
}

/**
 * Validate TypeScript schemas can compile
 */
function validateSchemas(schemas: Record<string, string>): {
  score: number;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  for (const [name, content] of Object.entries(schemas)) {
    // Basic syntax checks (full compile check would need TypeScript compiler)

    // Check for obvious syntax errors
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push({
        severity: 'error',
        category: 'schema',
        message: `Schema "${name}" has mismatched braces`,
        location: `schemas/${name}`,
        suggestion: 'Check for missing { or }',
      });
    }

    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push({
        severity: 'error',
        category: 'schema',
        message: `Schema "${name}" has mismatched parentheses`,
        location: `schemas/${name}`,
        suggestion: 'Check for missing ( or )',
      });
    }

    // Check for empty exports
    if (content.includes('export {}') && !content.includes('export type') && !content.includes('export interface')) {
      issues.push({
        severity: 'warning',
        category: 'schema',
        message: `Schema "${name}" has empty export`,
        location: `schemas/${name}`,
        suggestion: 'Add actual type exports',
      });
    }

    // Check for incomplete code patterns
    if (hasIncompleteCode(content)) {
      issues.push({
        severity: 'error',
        category: 'schema',
        message: `Schema "${name}" contains incomplete code`,
        location: `schemas/${name}`,
        suggestion: 'Complete all type definitions',
      });
    }
  }

  const score = issues.filter((i) => i.severity === 'error').length === 0 ? 100 : 0;
  return { score, issues };
}

/**
 * Validate dependency DAG has no cycles
 */
function validateDag(dag: Record<string, string[]>): {
  score: number;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  // Detect cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(node: string, path: string[]): string[] | null {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      return [...path.slice(cycleStart), node];
    }

    if (visited.has(node)) {
      return null;
    }

    visited.add(node);
    recursionStack.add(node);

    const dependencies = dag[node] || [];
    for (const dep of dependencies) {
      const cycle = hasCycle(dep, [...path, node]);
      if (cycle) {
        return cycle;
      }
    }

    recursionStack.delete(node);
    return null;
  }

  // Check each node
  for (const node of Object.keys(dag)) {
    if (!visited.has(node)) {
      const cycle = hasCycle(node, []);
      if (cycle) {
        issues.push({
          severity: 'error',
          category: 'dag',
          message: `Circular dependency detected: ${cycle.join(' → ')}`,
          location: 'dependency_dag',
          suggestion: 'Remove the circular dependency',
        });
        break; // One cycle is enough to fail
      }
    }
  }

  // Check for missing dependencies
  for (const [node, deps] of Object.entries(dag)) {
    for (const dep of deps) {
      if (!(dep in dag)) {
        issues.push({
          severity: 'error',
          category: 'dag',
          message: `Story "${node}" depends on unknown story "${dep}"`,
          location: `dependency_dag/${node}`,
          suggestion: `Add story "${dep}" or remove it from blocked_by`,
        });
      }
    }
  }

  const score = issues.filter((i) => i.severity === 'error').length === 0 ? 100 : 0;
  return { score, issues };
}

/**
 * Get human-readable summary of validation results
 */
export function getValidationSummary(report: QualityReport): string {
  const lines: string[] = [];

  lines.push(`Confidence Score: ${report.confidence_score}%`);
  lines.push(`Status: ${report.passes ? 'PASS ✓' : 'FAIL ✗'}`);
  lines.push('');
  lines.push('Breakdown:');

  for (const [category, result] of Object.entries(report.breakdown)) {
    const status = result.score === 100 ? '✓' : '✗';
    lines.push(`  ${category}: ${result.score}% ${status}`);

    if (result.issues.length > 0) {
      for (const issue of result.issues.slice(0, 3)) {
        lines.push(`    - ${issue.message}`);
      }
      if (result.issues.length > 3) {
        lines.push(`    ... and ${result.issues.length - 3} more issues`);
      }
    }
  }

  return lines.join('\n');
}
