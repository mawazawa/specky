import { DEFAULT_DECISIONS, QUESTIONS } from "./constants.js";
import { buildSpecPack } from "./build.js";
import { verifyDecisions } from "../verify/exa.js";

const today = () => new Date().toISOString().slice(0, 10);

export const generateSpecPack = async ({
  prompt,
  answers,
  verificationDate = today(),
  offline = false,
  cachePath,
}) => {
  const { decisions, sources } = await verifyDecisions({
    decisions: DEFAULT_DECISIONS,
    verificationDate,
    offline,
    cachePath,
  });

  return buildSpecPack({
    prompt,
    questions: QUESTIONS,
    answers,
    decisions,
    sources,
    verificationDate,
    generatedAt: new Date().toISOString(),
  });
};
