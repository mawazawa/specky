export const SPEC_PACK_VERSION = "1.0.0";

export const DEFAULT_DECISIONS = [
  {
    id: "DEC-001",
    category: "framework",
    choice: "Next.js 16.1.2",
    rationale: "Latest stable framework for React 19 with App Router.",
    queryBase: "Next.js latest stable version",
  },
  {
    id: "DEC-002",
    category: "language",
    choice: "TypeScript 5.9",
    rationale: "Current stable compiler with strict typing.",
    queryBase: "TypeScript latest stable version",
  },
  {
    id: "DEC-003",
    category: "styling",
    choice: "Tailwind CSS 4.1.18",
    rationale: "Current stable version for utility-first UI.",
    queryBase: "Tailwind CSS latest stable version",
  },
  {
    id: "DEC-004",
    category: "database",
    choice: "Supabase (PostgreSQL + RLS)",
    rationale: "Best MCP integration for autonomous execution.",
    queryBase: "Supabase MCP capabilities latest",
  },
  {
    id: "DEC-005",
    category: "deployment",
    choice: "Vercel",
    rationale: "Official Next.js deploy path with strong tooling.",
    queryBase: "Vercel MCP deployment capabilities",
  },
  {
    id: "DEC-006",
    category: "testing",
    choice: "Playwright",
    rationale: "Reliable E2E testing with strong tooling integration.",
    queryBase: "Playwright latest stable version",
  },
];

export const DEFAULT_TASKS = [
  {
    id: "AT-001",
    title: "Create CLI skeleton",
    files: ["bin/specky.js", "src/cli/index.js", "src/cli/commands.js"],
    notTouched: ["src/lib/spec-pack/*"],
    acceptance: [
      "CLI runs with `specky --help`",
      "Parses `new`, `validate`, and `verify` commands",
    ],
  },
  {
    id: "AT-002",
    title: "Define spec pack schema types",
    files: ["schemas/meta.schema.json", "schemas/sources.schema.json", "schemas/quality.schema.json"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Schemas match required Spec Pack files",
      "Validation enforces required fields",
    ],
  },
  {
    id: "AT-003",
    title: "Generate requirements pack",
    files: ["src/lib/spec-pack/render.js", "src/lib/spec-pack/constants.js", "src/lib/spec-pack/build.js"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Outputs Goal, Scope, Non-Goals, Requirements sections",
      "Includes clarifying questions and acceptance criteria",
    ],
  },
  {
    id: "AT-004",
    title: "Generate design pack",
    files: ["src/lib/spec-pack/render.js", "src/lib/spec-pack/build.js"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Outputs Architecture, Data Model, Security, Performance",
      "Includes alternatives and trade-offs",
    ],
  },
  {
    id: "AT-005",
    title: "Generate tasks pack",
    files: ["src/lib/spec-pack/render.js", "src/lib/spec-pack/constants.js"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Each task lists <=3 files",
      "Each task includes acceptance criteria",
    ],
  },
  {
    id: "AT-006",
    title: "Capture verification sources",
    files: ["src/lib/verify/exa.js", "src/lib/verify/cache.js", "src/lib/spec-pack/build.js"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Each decision has at least one source",
      "Sources include query and verification date",
    ],
  },
  {
    id: "AT-007",
    title: "Compute quality scoring",
    files: ["src/lib/spec-pack/quality.js", "src/lib/spec-pack/build.js"],
    notTouched: ["src/cli/*"],
    acceptance: [
      "Outputs per-section scores",
      "Flags staleness and violations",
    ],
  },
];
