#!/usr/bin/env node

import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const targetPath = args[0] || 'fixtures/spec-pack-minimal';

const child = spawn('node', ['scripts/validate-spec-pack.js', targetPath, '--strict'], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log('Quality gate passed.');
  } else {
    console.error('Quality gate failed.');
  }
  process.exit(code ?? 1);
});
