#!/usr/bin/env node
import { run } from "../src/cli/index.js";

run(process.argv.slice(2)).catch((error) => {
  console.error(error?.message ?? error);
  process.exit(1);
});
