export const usage = () => `
Specky - Spec Pack Generator

Usage:
  specky new "<prompt>" [--output <dir>] [--offline] [--verify]
  specky validate <spec-pack-path> [--strict]
  specky verify <spec-pack-path> [--offline]

Examples:
  specky new "Build a spec pack generator"
  specky validate ./spec-pack --strict
  specky verify ./spec-pack
`.trim();
