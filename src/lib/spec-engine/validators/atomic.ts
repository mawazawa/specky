/**
 * Atomic Task Validator
 *
 * Ensures all tasks touch ≤3 files.
 * This is a hard rule - no exceptions.
 *
 * @version 1.0.0
 * @created 2026-01-17
 */

import type { ValidationIssue, Story } from '../../../../planning/schemas';

/**
 * Maximum files a single task can touch
 */
export const MAX_FILES_PER_TASK = 3;

/**
 * Result of atomic task validation
 */
export interface AtomicResult {
  /** Whether all tasks are atomic */
  atomic: boolean;
  /** Score from 0-100 */
  score: number;
  /** Issues found */
  issues: ValidationIssue[];
  /** Stories that violate the atomic rule */
  violatingStories: string[];
}

/**
 * Count unique files affected by a story
 */
export function countFilesAffected(story: Story): number {
  const files = new Set<string>();

  // Add files from files_affected
  for (const file of story.files_affected) {
    files.add(file.path);
  }

  // Add files from steps
  for (const step of story.steps) {
    files.add(step.file_path);
  }

  return files.size;
}

/**
 * Get all unique files affected by a story
 */
export function getFilesAffected(story: Story): string[] {
  const files = new Set<string>();

  for (const file of story.files_affected) {
    files.add(file.path);
  }

  for (const step of story.steps) {
    files.add(step.file_path);
  }

  return Array.from(files);
}

/**
 * Validate a single story for atomic task compliance
 */
export function validateStoryAtomic(story: Story): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fileCount = countFilesAffected(story);

  if (fileCount > MAX_FILES_PER_TASK) {
    const files = getFilesAffected(story);

    issues.push({
      severity: 'error',
      category: 'atomic',
      message: `Story ${story.id} touches ${fileCount} files (max: ${MAX_FILES_PER_TASK})`,
      location: story.id,
      suggestion: `Split into ${Math.ceil(fileCount / MAX_FILES_PER_TASK)} smaller stories. Files affected: ${files.join(', ')}`,
    });
  }

  return issues;
}

/**
 * Validate all stories for atomic task compliance
 */
export function validateAtomic(stories: Story[]): AtomicResult {
  const allIssues: ValidationIssue[] = [];
  const violatingStories: string[] = [];

  for (const story of stories) {
    const issues = validateStoryAtomic(story);
    if (issues.length > 0) {
      violatingStories.push(story.id);
      allIssues.push(...issues);
    }
  }

  // Score is 100 if all atomic, 0 if any violations
  // Atomic rule is binary - either you comply or you don't
  const score = violatingStories.length === 0 ? 100 : 0;

  return {
    atomic: violatingStories.length === 0,
    score,
    issues: allIssues,
    violatingStories,
  };
}

/**
 * Suggest how to split a non-atomic story
 */
export function suggestSplit(story: Story): string[] {
  const files = getFilesAffected(story);

  if (files.length <= MAX_FILES_PER_TASK) {
    return []; // No split needed
  }

  // Group files by directory/domain
  const filesByDir = new Map<string, string[]>();
  for (const file of files) {
    const dir = file.split('/').slice(0, -1).join('/') || 'root';
    if (!filesByDir.has(dir)) {
      filesByDir.set(dir, []);
    }
    filesByDir.get(dir)!.push(file);
  }

  // Generate split suggestions
  const suggestions: string[] = [];
  let storyNum = 1;

  for (const [dir, dirFiles] of filesByDir) {
    // Chunk files into groups of MAX_FILES_PER_TASK
    for (let i = 0; i < dirFiles.length; i += MAX_FILES_PER_TASK) {
      const chunk = dirFiles.slice(i, i + MAX_FILES_PER_TASK);
      suggestions.push(
        `${story.id}-${storyNum}: ${dir} (${chunk.length} files: ${chunk.map((f) => f.split('/').pop()).join(', ')})`
      );
      storyNum++;
    }
  }

  return suggestions;
}

/**
 * Check if a planned change is atomic
 */
export function isAtomicChange(files: string[]): boolean {
  return new Set(files).size <= MAX_FILES_PER_TASK;
}

/**
 * Get the atomic rule as a string for documentation
 */
export function getAtomicRule(): string {
  return `Each task must touch ≤${MAX_FILES_PER_TASK} files. This ensures:
- Focused, reviewable changes
- Reduced merge conflicts
- Easier testing and verification
- Better AI context management`;
}
