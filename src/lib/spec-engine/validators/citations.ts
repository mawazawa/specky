/**
 * Citation Validator
 *
 * Ensures all design decisions have proper citations.
 * Every decision must have a URL and verification date.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type { ValidationIssue, DesignDecision, VerifiedTechStack, VerifiedTech } from '../../../../planning/schemas';

/**
 * Result of citation validation
 */
export interface CitationResult {
  /** Whether all citations are present */
  complete: boolean;
  /** Score from 0-100 */
  score: number;
  /** Issues found */
  issues: ValidationIssue[];
  /** Decisions missing citations */
  missingCitations: string[];
}

/**
 * Validate a URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate a date format (ISO 8601 or common formats)
 */
function isValidDate(date: string): boolean {
  // Accept ISO 8601 formats
  const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  if (isoPattern.test(date)) {
    return !isNaN(Date.parse(date));
  }

  // Accept common date formats
  const commonPatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // 2026-01-17
    /^\d{2}\/\d{2}\/\d{4}$/, // 01/17/2026
    /^[A-Z][a-z]+ \d{1,2}, \d{4}$/, // January 17, 2026
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(date)) {
      return !isNaN(Date.parse(date));
    }
  }

  return false;
}

/**
 * Check if a date is recent (within 90 days)
 */
function isRecentDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  return date >= ninetyDaysAgo;
}

/**
 * Validate a single design decision
 */
export function validateDecision(decision: DesignDecision): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const location = `decision/${decision.id}`;

  // Check URL
  if (!decision.verification_source) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Decision "${decision.topic}" missing verification source URL`,
      location,
      suggestion: 'Add a verification_source URL to the decision',
    });
  } else if (!isValidUrl(decision.verification_source)) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Decision "${decision.topic}" has invalid URL: ${decision.verification_source}`,
      location,
      suggestion: 'Provide a valid HTTP/HTTPS URL',
    });
  }

  // Check verification date
  if (!decision.verified_at) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Decision "${decision.topic}" missing verification date`,
      location,
      suggestion: 'Add a verified_at date to the decision',
    });
  } else if (!isValidDate(decision.verified_at)) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Decision "${decision.topic}" has invalid date: ${decision.verified_at}`,
      location,
      suggestion: 'Use ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ',
    });
  } else if (!isRecentDate(decision.verified_at)) {
    issues.push({
      severity: 'warning',
      category: 'citation',
      message: `Decision "${decision.topic}" verification is over 90 days old`,
      location,
      suggestion: 'Re-verify this decision with current sources',
    });
  }

  // Check alternatives considered
  if (!decision.alternatives_considered || decision.alternatives_considered.length === 0) {
    issues.push({
      severity: 'warning',
      category: 'citation',
      message: `Decision "${decision.topic}" has no alternatives documented`,
      location,
      suggestion: 'Document at least 2 alternatives that were considered',
    });
  }

  return issues;
}

/**
 * Validate a verified tech entry
 */
export function validateTech(tech: VerifiedTech, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const location = `tech_stack/${path}`;

  // Check version
  if (!tech.version || tech.version === 'latest') {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Tech "${tech.name}" has no specific version (found: "${tech.version || 'undefined'}")`,
      location,
      suggestion: 'Specify an exact version number, not "latest"',
    });
  }

  // Check verification source
  if (!tech.verification_source) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Tech "${tech.name}" missing verification source URL`,
      location,
      suggestion: 'Add verification_source URL pointing to release notes or npm',
    });
  } else if (!isValidUrl(tech.verification_source)) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: `Tech "${tech.name}" has invalid URL: ${tech.verification_source}`,
      location,
      suggestion: 'Provide a valid HTTP/HTTPS URL',
    });
  }

  return issues;
}

/**
 * Validate entire tech stack
 */
export function validateTechStack(techStack: VerifiedTechStack): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check top-level verification
  if (!techStack.verified_at) {
    issues.push({
      severity: 'error',
      category: 'citation',
      message: 'Tech stack missing verification timestamp',
      location: 'tech_stack',
      suggestion: 'Add verified_at timestamp to tech_stack',
    });
  }

  // Validate frontend tech
  if (techStack.frontend) {
    if (techStack.frontend.framework) {
      issues.push(...validateTech(techStack.frontend.framework, 'frontend/framework'));
    }
    if (techStack.frontend.react) {
      issues.push(...validateTech(techStack.frontend.react, 'frontend/react'));
    }
    if (techStack.frontend.typescript) {
      issues.push(...validateTech(techStack.frontend.typescript, 'frontend/typescript'));
    }
    if (techStack.frontend.styling) {
      issues.push(...validateTech(techStack.frontend.styling, 'frontend/styling'));
    }
    if (techStack.frontend.state_management) {
      issues.push(...validateTech(techStack.frontend.state_management, 'frontend/state_management'));
    }
  }

  // Validate backend tech
  if (techStack.backend) {
    if (techStack.backend.database) {
      issues.push(...validateTech(techStack.backend.database, 'backend/database'));
    }
    if (techStack.backend.orm) {
      issues.push(...validateTech(techStack.backend.orm, 'backend/orm'));
    }
  }

  return issues;
}

/**
 * Validate all citations in decisions and tech stack
 */
export function validateCitations(
  decisions: DesignDecision[],
  techStack?: VerifiedTechStack
): CitationResult {
  const allIssues: ValidationIssue[] = [];
  const missingCitations: string[] = [];

  // Validate decisions
  for (const decision of decisions) {
    const issues = validateDecision(decision);
    if (issues.some((i) => i.severity === 'error')) {
      missingCitations.push(decision.id);
    }
    allIssues.push(...issues);
  }

  // Validate tech stack
  if (techStack) {
    allIssues.push(...validateTechStack(techStack));
  }

  // Calculate score
  const errorCount = allIssues.filter((i) => i.severity === 'error').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;

  // Errors are fatal (score 0), warnings reduce score
  const score = errorCount > 0 ? 0 : Math.max(0, 100 - warningCount * 10);

  return {
    complete: errorCount === 0,
    score,
    issues: allIssues,
    missingCitations,
  };
}

/**
 * Check if a decision has proper citations
 */
export function hasProperCitation(decision: DesignDecision): boolean {
  return (
    !!decision.verification_source &&
    isValidUrl(decision.verification_source) &&
    !!decision.verified_at &&
    isValidDate(decision.verified_at)
  );
}

/**
 * Get citation requirements as documentation
 */
export function getCitationRequirements(): string {
  return `Every design decision must include:
1. verification_source: A valid HTTP/HTTPS URL pointing to official documentation
2. verified_at: ISO 8601 date when the source was verified
3. alternatives_considered: At least 2 alternatives with rejection reasons

Tech stack entries must include:
1. Exact version number (not "latest")
2. verification_source URL
3. release_date (recommended)

Citations older than 90 days will generate warnings.`;
}
