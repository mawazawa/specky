#!/usr/bin/env node

// Minimal wrapper to bootstrap the CLI from TypeScript source or built output
// For now, we assume tsx is available for development, or we point to compiled JS in prod.

import { run } from "../src/cli/index.ts";
run().catch(console.error);
