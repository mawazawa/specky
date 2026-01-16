import { SPEC_PACK_VERSION, DEFAULT_TASKS } from "./constants.js";
import { renderDesign, renderRequirements, renderTasks } from "./render.js";
import { buildQualityReport } from "./quality.js";

const toTitleCase = (value) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const deriveProjectName = (prompt) => {
  if (!prompt) return "Spec Pack";
  const words = prompt.trim().split(/\s+/).slice(0, 6).join(" ");
  return toTitleCase(words);
};

export const buildSpecPack = ({
  prompt,
  questions,
  answers,
  decisions,
  sources,
  verificationDate,
  generatedAt,
}) => {
  const projectName = deriveProjectName(prompt);
  const tasks = [...DEFAULT_TASKS];

  const requirements = renderRequirements({ prompt, questions, answers });
  const design = renderDesign();
  const tasksMarkdown = renderTasks(tasks);

  const quality = buildQualityReport({
    decisions,
    tasks,
    verificationDate,
  });

  const meta = {
    specPackVersion: SPEC_PACK_VERSION,
    generatedAt,
    verificationDate,
    projectName,
    inputs: {
      prompt,
      clarifyingQuestions: questions.map((question) => question.prompt),
      answers,
    },
    decisions,
  };

  return {
    meta,
    requirements,
    design,
    tasks: tasksMarkdown,
    sources: { sources },
    quality,
  };
};
