import { CLICommand } from "./types";
import { SpecEngine } from "../lib/spec/engine";

export const commands: CLICommand[] = [
  {
    name: "new",
    description: "Start a new specification based on a prompt",
    options: [
      { name: "prompt", alias: "p", description: "The initial prompt for the spec", type: "string", required: true }
    ],
    action: async (args) => {
      console.log(`🐦 Specky: Initializing new spec for "${args.prompt}"...`);
      const engine = new SpecEngine(args.prompt);
      const spec = engine.initializeSpec();
      
      console.log("✅ Spec Initialized:");
      console.log(JSON.stringify(spec.meta, null, 2));
      console.log("\nNext step: Run 'specky clarify' to generate clarifying questions.");
    }
  },
  {
    name: "version",
    description: "Show version information",
    action: async () => {
      console.log("Specky v0.1.0 (Verified Jan 15, 2026)");
    }
  }
];
