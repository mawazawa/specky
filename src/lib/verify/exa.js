import { loadCache, saveCache, getCachedQuery, setCachedQuery } from "./cache.js";

const EXA_ENDPOINT = "https://api.exa.ai/search";

const buildQuery = (base, verificationDate) => {
  if (base.includes(verificationDate)) {
    return base;
  }
  return `${base} as of ${verificationDate}`;
};

const fetchExaResults = async ({ apiKey, query, numResults }) => {
  const response = await fetch(EXA_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      numResults,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Exa search failed: ${response.status} ${message}`);
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

const normalizeResults = (results) =>
  results
    .filter((result) => result?.url)
    .map((result) => ({
      url: result.url,
      title: result.title ?? null,
      excerpt: result.summary ?? result.text?.slice(0, 240) ?? null,
    }));

export const verifyDecisions = async ({
  decisions,
  verificationDate,
  offline = false,
  numResults = 3,
  cachePath,
}) => {
  const apiKey = process.env.EXA_API_KEY;
  const cache = await loadCache(cachePath);
  let nextCache = cache;

  const verifiedDecisions = [];
  const sources = [];

  for (const decision of decisions) {
    const query = buildQuery(decision.queryBase ?? decision.query ?? decision.choice, verificationDate);
    const cached = getCachedQuery(nextCache, query);
    const verifiedAt = cached?.verifiedAt ?? verificationDate;

    let resultEntries = cached?.results ?? null;
    if (!resultEntries) {
      if (offline) {
        throw new Error(`Offline mode missing cache for query: ${query}`);
      }
      if (!apiKey) {
        throw new Error("EXA_API_KEY is required for live verification.");
      }
      const results = await fetchExaResults({ apiKey, query, numResults });
      resultEntries = normalizeResults(results);

      if (resultEntries.length === 0) {
        throw new Error(`Exa returned no results for query: ${query}`);
      }

      nextCache = setCachedQuery(nextCache, query, { verifiedAt: verificationDate, results: resultEntries });
    }

    const urls = resultEntries.map((entry) => entry.url);
    verifiedDecisions.push({
      ...decision,
      query,
      verifiedAt,
      sources: urls,
    });

    resultEntries.forEach((entry) => {
      sources.push({
        decisionId: decision.id,
        url: entry.url,
        verifiedAt,
        query,
        title: entry.title,
        excerpt: entry.excerpt,
      });
    });
  }

  if (nextCache !== cache) {
    await saveCache(nextCache, cachePath);
  }

  return { decisions: verifiedDecisions, sources };
};
