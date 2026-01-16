import path from "node:path";
import { spawnSync } from "node:child_process";

const runValidator = (specPath, strict) => {
  const args = ["scripts/validate-spec-pack.js", specPath];
  if (strict) {
    args.push("--strict");
  }
  const result = spawnSync("node", args, { stdio: "inherit" });
  return result.status ?? 1;
};

export const runCommand = async (command, positionals, flags) => {
  switch (command) {
    case "new": {
      const prompt = positionals.join(" ").trim();
      if (!prompt) {
        throw new Error('Missing prompt. Example: specky new "Build a spec pack generator"');
      }
      console.log("Spec pack generation is not implemented yet.");
      console.log(`Prompt: ${prompt}`);
      return 1;
    }
    case "validate": {
      const specPath = positionals[0];
      if (!specPath) {
        throw new Error("Missing spec pack path. Example: specky validate ./spec-pack");
      }
      const resolved = path.resolve(process.cwd(), specPath);
      const strict = flags.strict === true;
      return runValidator(resolved, strict);
    }
    case "verify": {
      const specPath = positionals[0];
      if (!specPath) {
        throw new Error("Missing spec pack path. Example: specky verify ./spec-pack");
      }
      console.log("Verification is not implemented yet.");
      console.log(`Spec pack: ${specPath}`);
      return 1;
    }
    default:
      return null;
  }
};
