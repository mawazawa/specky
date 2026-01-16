import fs from "node:fs/promises";
import path from "node:path";

const defaultCachePath = () => path.join(process.cwd(), ".specky", "cache.json");

export const loadCache = async (cachePath = defaultCachePath()) => {
  try {
    const raw = await fs.readFile(cachePath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed?.queries ? parsed : { queries: {} };
  } catch {
    return { queries: {} };
  }
};

export const saveCache = async (cache, cachePath = defaultCachePath()) => {
  const dir = path.dirname(cachePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
};

export const getCachedQuery = (cache, query) => cache.queries?.[query] ?? null;

export const setCachedQuery = (cache, query, entry) => {
  const next = { ...(cache.queries ?? {}) };
  next[query] = entry;
  return { ...cache, queries: next };
};
