import fs from "node:fs/promises";
import path from "node:path";

export const writeSpecPack = async (outputDir, specPack) => {
  const resolved = path.resolve(process.cwd(), outputDir);
  await fs.mkdir(resolved, { recursive: true });

  await fs.writeFile(path.join(resolved, "meta.json"), JSON.stringify(specPack.meta, null, 2));
  await fs.writeFile(path.join(resolved, "requirements.md"), specPack.requirements);
  await fs.writeFile(path.join(resolved, "design.md"), specPack.design);
  await fs.writeFile(path.join(resolved, "tasks.md"), specPack.tasks);
  await fs.writeFile(path.join(resolved, "sources.json"), JSON.stringify(specPack.sources, null, 2));
  await fs.writeFile(path.join(resolved, "quality.json"), JSON.stringify(specPack.quality, null, 2));

  return resolved;
};
