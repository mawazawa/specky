/**
 * Code Completeness Validator
 *
 * Ensures 100% code completeness - no ellipsis, no TODO, no shortcuts.
 * A spec fails validation if ANY incomplete code is detected.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type { ValidationIssue, Story, StoryStep } from '../../../../planning/schemas';

/**
 * Patterns that indicate incomplete code
 */
const INCOMPLETE_PATTERNS = [
  // Ellipsis patterns
  { pattern: /\.{3}/g, message: 'Ellipsis (...) found - code must be complete' },
  { pattern: /…/g, message: 'Ellipsis character (…) found - code must be complete' },

  // TODO/FIXME patterns
  { pattern: /\/\/\s*TODO/gi, message: 'TODO comment found - must be implemented' },
  { pattern: /\/\/\s*FIXME/gi, message: 'FIXME comment found - must be fixed' },
  { pattern: /\/\*\s*TODO/gi, message: 'TODO block comment found - must be implemented' },
  { pattern: /\/\*\s*FIXME/gi, message: 'FIXME block comment found - must be fixed' },
  { pattern: /#\s*TODO/gi, message: 'TODO comment found - must be implemented' },
  { pattern: /#\s*FIXME/gi, message: 'FIXME comment found - must be fixed' },

  // Placeholder patterns
  { pattern: /\/\/\s*\.\.\./g, message: 'Placeholder comment (...) found' },
  { pattern: /\/\*\s*\.\.\./g, message: 'Placeholder block comment found' },
  { pattern: /\/\/\s*implementation/gi, message: 'Vague "implementation" comment found' },
  { pattern: /\/\/\s*handle\s+(other|remaining|rest)/gi, message: 'Incomplete handling comment found' },
  { pattern: /\/\/\s*add\s+(more|other|remaining)/gi, message: 'Incomplete addition comment found' },

  // Lazy patterns
  { pattern: /similar\s+to\s+(above|below|previous)/gi, message: '"Similar to above" reference - write actual code' },
  { pattern: /as\s+shown\s+(above|below|before)/gi, message: '"As shown above" reference - write actual code' },
  { pattern: /same\s+as\s+(above|below|before)/gi, message: '"Same as above" reference - write actual code' },
  { pattern: /see\s+(above|below|other)/gi, message: '"See above" reference - write actual code' },
  { pattern: /rest\s+of\s+(the\s+)?implementation/gi, message: '"Rest of implementation" found - complete it' },
  { pattern: /etc\.?$/gim, message: 'Incomplete list ending with "etc"' },
  { pattern: /and\s+so\s+on/gi, message: '"And so on" found - complete the list' },

  // Stub patterns
  { pattern: /throw\s+new\s+Error\s*\(\s*['"]not\s+implemented/gi, message: 'Not implemented error found' },
  { pattern: /throw\s+new\s+Error\s*\(\s*['"]TODO/gi, message: 'TODO error found' },
  { pattern: /pass\s*#\s*TODO/gi, message: 'Python pass with TODO found' },
  { pattern: /raise\s+NotImplementedError/gi, message: 'NotImplementedError found' },

  // Vague comments
  { pattern: /\/\/\s*logic\s*(goes\s+)?here/gi, message: '"Logic here" placeholder found' },
  { pattern: /\/\/\s*code\s*(goes\s+)?here/gi, message: '"Code here" placeholder found' },
  { pattern: /\/\/\s*your\s+code\s+here/gi, message: '"Your code here" placeholder found' },
  { pattern: /\/\/\s*insert/gi, message: '"Insert" placeholder comment found' },
];

/**
 * Patterns that indicate incomplete function bodies
 */
const INCOMPLETE_FUNCTION_PATTERNS = [
  // Empty function bodies
  { pattern: /\{\s*\}/g, message: 'Empty function body found', context: 'function' },

  // Functions returning undefined/null without logic
  { pattern: /=>\s*undefined\s*;?$/gm, message: 'Arrow function returning undefined' },
  { pattern: /return\s+undefined\s*;?\s*\}/g, message: 'Function returning undefined without logic' },

  // Empty async functions
  { pattern: /async\s+\([^)]*\)\s*=>\s*\{\s*\}/g, message: 'Empty async arrow function' },
  { pattern: /async\s+function\s+\w+\s*\([^)]*\)\s*\{\s*\}/g, message: 'Empty async function' },
];

/**
 * Result of completeness validation
 */
export interface CompletenessResult {
  /** Whether the code is complete */
  complete: boolean;
  /** Score from 0-100 */
  score: number;
  /** Issues found */
  issues: ValidationIssue[];
}

/**
 * Validate a single code block for completeness
 */
export function validateCodeBlock(
  code: string,
  location: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check against incomplete patterns
  for (const { pattern, message } of INCOMPLETE_PATTERNS) {
    const matches = code.match(pattern);
    if (matches) {
      for (const match of matches) {
        // Find line number
        const beforeMatch = code.substring(0, code.indexOf(match));
        const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

        issues.push({
          severity: 'error',
          category: 'completeness',
          message,
          location: `${location}:${lineNumber}`,
          suggestion: 'Replace with complete implementation',
        });
      }
    }
  }

  // Check for incomplete function bodies (only in appropriate contexts)
  for (const { pattern, message } of INCOMPLETE_FUNCTION_PATTERNS) {
    const matches = code.match(pattern);
    if (matches) {
      // Only flag if this looks like a real function, not a type definition
      const isTypeContext = /type\s+\w+\s*=|interface\s+\w+/.test(code);
      if (!isTypeContext) {
        for (const match of matches) {
          const beforeMatch = code.substring(0, code.indexOf(match));
          const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;

          issues.push({
            severity: 'error',
            category: 'completeness',
            message,
            location: `${location}:${lineNumber}`,
            suggestion: 'Implement the function body',
          });
        }
      }
    }
  }

  return issues;
}

/**
 * Validate a story step for completeness
 */
export function validateStep(step: StoryStep, storyId: string): ValidationIssue[] {
  const location = `${storyId}/step:${step.step_id}/${step.file_path}`;
  return validateCodeBlock(step.code, location);
}

/**
 * Validate all steps in a story
 */
export function validateStory(story: Story): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const step of story.steps) {
    issues.push(...validateStep(step, story.id));
  }

  return issues;
}

/**
 * Validate all stories for completeness
 */
export function validateCompleteness(stories: Story[]): CompletenessResult {
  const allIssues: ValidationIssue[] = [];

  for (const story of stories) {
    allIssues.push(...validateStory(story));
  }

  // Calculate score
  // Score is 100 if no issues, decreases by 5 per issue, minimum 0
  const score = Math.max(0, 100 - allIssues.length * 5);

  return {
    complete: allIssues.length === 0,
    score,
    issues: allIssues,
  };
}

/**
 * Quick check if a string contains incomplete patterns
 */
export function hasIncompleteCode(code: string): boolean {
  for (const { pattern } of INCOMPLETE_PATTERNS) {
    if (pattern.test(code)) {
      return true;
    }
    // Reset regex lastIndex for global patterns
    pattern.lastIndex = 0;
  }
  return false;
}

/**
 * Get all incomplete patterns for display/documentation
 */
export function getIncompletePatterns(): { pattern: string; message: string }[] {
  return INCOMPLETE_PATTERNS.map(({ pattern, message }) => ({
    pattern: pattern.source,
    message,
  }));
}
