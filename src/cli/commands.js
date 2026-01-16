import path from "node:path";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import fs from "node:fs/promises";
import { QUESTIONS, generateSpecPack, writeSpecPack } from "../lib/spec-pack/index.js";

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
      const offline = flags.offline === true || flags.offline === "true";
      const outputDir = flags.output ?? "spec-pack";

      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const answers = [];
      for (const question of QUESTIONS) {
        console.log(`\n${question.prompt}`);
        question.options.forEach((option, index) => {
          const recommended = index === question.recommended ? " (recommended)" : "";
          console.log(`  ${index + 1}) ${option}${recommended}`);
        });
        const response = await rl.question(
          `Select option [1-${question.options.length}] (default ${question.recommended + 1}): `
        );
        const index = Number.parseInt(response, 10);
        const selection = Number.isFinite(index) && index > 0 && index <= question.options.length
          ? question.options[index - 1]
          : question.options[question.recommended];
        answers.push(selection);
      }
      await rl.close();

      const specPack = await generateSpecPack({
        prompt,
        answers,
        offline,
      });

      const outputPath = await writeSpecPack(outputDir, specPack);
      console.log(`Spec pack written to ${outputPath}`);
      return runValidator(outputPath, true);
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
      const resolved = path.resolve(process.cwd(), specPath);
      const offline = flags.offline === true || flags.offline === "true";

      const metaPath = path.join(resolved, "meta.json");
      const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
      const prompt = meta.inputs?.prompt ?? "Untitled spec";
      const answers = meta.inputs?.answers ?? [];

      const specPack = await generateSpecPack({
        prompt,
        answers,
        offline,
      });

      await writeSpecPack(resolved, specPack);
      console.log(`Spec pack re-verified at ${resolved}`);
      return runValidator(resolved, true);
    }
    default:
      return null;
  }
};
