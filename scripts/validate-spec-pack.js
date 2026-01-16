#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const targetPath = args.find((arg) => !arg.startsWith('-'));

if (!targetPath) {
  console.error('Usage: node scripts/validate-spec-pack.js <spec-pack-path> [--strict]');
  process.exit(1);
}

const requiredFiles = [
  'meta.json',
  'requirements.md',
  'design.md',
  'tasks.md',
  'sources.json',
  'quality.json',
];

const errors = [];
const warnings = [];

const readJson = async (filePath, label) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    errors.push(`${label} is missing or invalid JSON: ${filePath}`);
    return null;
  }
};

const isValidDate = (value) => !Number.isNaN(Date.parse(value));

const ensureScore = (value, label) => {
  if (typeof value !== 'number' || value < 0 || value > 100) {
    errors.push(`Invalid score for ${label}: ${value}`);
  }
};

const parseTasks = (content) => {
  const lines = content.split(/\r?\n/);
  const tasks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('### AT-')) {
      const taskId = line.split(':')[0].replace('### ', '').trim();
      let filesCount = 0;
      let acceptanceCount = 0;
      let j = i + 1;
      let inFiles = false;
      let inAcceptance = false;

      while (j < lines.length) {
        const current = lines[j].trim();

        if (current.startsWith('### AT-')) {
          break;
        }

        if (current.startsWith('**Files')) {
          inFiles = true;
          inAcceptance = false;
          j += 1;
          continue;
        }

        if (current.startsWith('**Acceptance Criteria')) {
          inAcceptance = true;
          inFiles = false;
          j += 1;
          continue;
        }

        if (current.startsWith('**')) {
          inFiles = false;
          inAcceptance = false;
          j += 1;
          continue;
        }

        if (inFiles && current.startsWith('- ')) {
          filesCount += 1;
        }

        if (inAcceptance && current.startsWith('- [ ]')) {
          acceptanceCount += 1;
        }

        j += 1;
      }

      tasks.push({ id: taskId, filesCount, acceptanceCount });
      i = j;
      continue;
    }

    i += 1;
  }

  return tasks;
};

const main = async () => {
  const specPath = path.resolve(process.cwd(), targetPath);

  for (const file of requiredFiles) {
    const fullPath = path.join(specPath, file);
    try {
      await fs.access(fullPath);
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }

  const meta = await readJson(path.join(specPath, 'meta.json'), 'meta.json');
  const sources = await readJson(path.join(specPath, 'sources.json'), 'sources.json');
  const quality = await readJson(path.join(specPath, 'quality.json'), 'quality.json');

  if (!meta || !sources || !quality) {
    process.exit(1);
  }

  if (typeof meta.specPackVersion !== 'string') {
    errors.push('meta.json missing specPackVersion');
  }

  if (!isValidDate(meta.generatedAt)) {
    errors.push('meta.json generatedAt is not a valid date');
  }

  if (!isValidDate(meta.verificationDate)) {
    errors.push('meta.json verificationDate is not a valid date');
  }

  if (typeof meta.projectName !== 'string') {
    errors.push('meta.json projectName is required');
  }

  if (!meta.inputs || typeof meta.inputs.prompt !== 'string') {
    errors.push('meta.json inputs.prompt is required');
  }

  if (!Array.isArray(meta.inputs?.clarifyingQuestions)) {
    errors.push('meta.json inputs.clarifyingQuestions must be an array');
  }

  if (!Array.isArray(meta.inputs?.answers)) {
    errors.push('meta.json inputs.answers must be an array');
  }

  if (!Array.isArray(meta.decisions) || meta.decisions.length === 0) {
    errors.push('meta.json decisions must be a non-empty array');
  }

  const decisionIds = new Set();
  const decisionVerifiedDates = new Map();

  for (const decision of meta.decisions || []) {
    if (typeof decision.id !== 'string') {
      errors.push('Decision id must be a string');
      continue;
    }

    if (decisionIds.has(decision.id)) {
      errors.push(`Duplicate decision id: ${decision.id}`);
    }
    decisionIds.add(decision.id);

    if (!decision.sources || !Array.isArray(decision.sources) || decision.sources.length === 0) {
      errors.push(`Decision ${decision.id} missing sources`);
    }

    if (!isValidDate(decision.verifiedAt)) {
      errors.push(`Decision ${decision.id} verifiedAt is invalid`);
    } else {
      decisionVerifiedDates.set(decision.id, decision.verifiedAt);
    }

    if (typeof decision.query !== 'string') {
      errors.push(`Decision ${decision.id} query is required`);
    }
  }

  if (!Array.isArray(sources.sources)) {
    errors.push('sources.json sources must be an array');
  }

  const sourcesByDecision = new Map();

  for (const entry of sources.sources || []) {
    if (!decisionIds.has(entry.decisionId)) {
      errors.push(`sources.json references unknown decision: ${entry.decisionId}`);
      continue;
    }

    if (!isValidDate(entry.verifiedAt)) {
      errors.push(`sources.json verifiedAt invalid for decision ${entry.decisionId}`);
    }

    if (typeof entry.query !== 'string' || entry.query.length === 0) {
      errors.push(`sources.json query missing for decision ${entry.decisionId}`);
    } else if (meta.verificationDate && !entry.query.includes(meta.verificationDate)) {
      warnings.push(`sources.json query missing verification date for decision ${entry.decisionId}`);
    }

    const list = sourcesByDecision.get(entry.decisionId) || [];
    list.push(entry);
    sourcesByDecision.set(entry.decisionId, list);
  }

  for (const decisionId of decisionIds) {
    if (!sourcesByDecision.has(decisionId)) {
      errors.push(`No sources.json entries for decision ${decisionId}`);
    }
  }

  ensureScore(quality.overallScore, 'overallScore');
  if (!quality.sections) {
    errors.push('quality.json sections are required');
  } else {
    ensureScore(quality.sections.requirements, 'requirements');
    ensureScore(quality.sections.design, 'design');
    ensureScore(quality.sections.tasks, 'tasks');
  }

  if (!quality.staleness) {
    errors.push('quality.json staleness section is required');
  } else {
    if (!Array.isArray(quality.staleness.fresh) || !Array.isArray(quality.staleness.verify) || !Array.isArray(quality.staleness.stale)) {
      errors.push('quality.json staleness must include fresh, verify, stale arrays');
    }
  }

  if (!quality.violations) {
    errors.push('quality.json violations section is required');
  } else {
    if (!Array.isArray(quality.violations.missingCitations)) {
      errors.push('quality.json violations.missingCitations must be an array');
    }
    if (!Array.isArray(quality.violations.atomicTaskFailures)) {
      errors.push('quality.json violations.atomicTaskFailures must be an array');
    }
  }

  const verificationDate = isValidDate(meta.verificationDate) ? new Date(meta.verificationDate) : null;
  if (verificationDate) {
    for (const [decisionId, verifiedAt] of decisionVerifiedDates.entries()) {
      const verifiedDate = new Date(verifiedAt);
      const ageDays = Math.floor((verificationDate - verifiedDate) / (1000 * 60 * 60 * 24));

      if (ageDays > 90 && !quality.staleness?.stale?.includes(decisionId)) {
        errors.push(`Decision ${decisionId} is stale but not flagged in quality.json`);
      } else if (ageDays >= 30 && ageDays <= 90 && !quality.staleness?.verify?.includes(decisionId)) {
        warnings.push(`Decision ${decisionId} should be flagged for verification`);
      }
    }
  }

  const tasksContent = await fs.readFile(path.join(specPath, 'tasks.md'), 'utf8');
  const tasks = parseTasks(tasksContent);

  if (tasks.length === 0) {
    errors.push('tasks.md contains no AT- tasks');
  }

  for (const task of tasks) {
    if (task.filesCount === 0) {
      errors.push(`Task ${task.id} has no files listed`);
    }
    if (task.filesCount > 3) {
      errors.push(`Task ${task.id} has more than 3 files`);
    }
    if (task.acceptanceCount < 2) {
      errors.push(`Task ${task.id} has fewer than 2 acceptance criteria`);
    }
  }

  if (errors.length > 0) {
    console.error('Spec Pack validation failed:');
    console.error(errors.join('\n'));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('Spec Pack validation warnings:');
    console.warn(warnings.join('\n'));
    if (strict) {
      process.exit(1);
    }
  }

  console.log('Spec Pack validation passed.');
};

main();
