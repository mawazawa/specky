// ESLint configuration for Specky
// Note: Markdown filename validation is handled by ./scripts/validate-filenames.sh
// This config is for JavaScript/TypeScript files only
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // Ignore markdown files - they're validated by the bash script
    ignores: ['**/*.md', 'node_modules/**', '.next/**'],
  },
];
