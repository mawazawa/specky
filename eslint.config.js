// ESLint configuration for Specky
// Note: Markdown filename validation is handled by ./scripts/validate-filenames.sh
// This config is for JavaScript/TypeScript files only

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      // Add TypeScript/JavaScript rules here as needed
    },
  },
  {
    // Ignore markdown files - they're validated by the bash script
    ignores: ['**/*.md'],
  },
];
