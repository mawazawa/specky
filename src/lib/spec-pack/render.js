const renderSection = (title, lines) => {
  const body = Array.isArray(lines) ? lines.join("\n") : lines;
  return `## ${title}\n${body}`;
};

export const renderRequirements = ({ prompt, questions, answers }) => {
  const goal = `Build a spec pack based on: "${prompt}".`;
  const scope = [
    "- Generate requirements, design, and tasks packs",
    "- Capture verified decisions with sources and dates",
    "- Enforce atomic task boundaries (<=3 files)",
  ];
  const nonGoals = [
    "- No automatic implementation without approval",
    "- No hosted SaaS in v0",
    "- No database requirement for core CLI",
  ];
  const requirements = [
    "- Output Markdown and JSON formats",
    "- Validate against schema before completion",
    "- Include quality report with staleness flags",
  ];
  const clarifyingQuestions = questions.map((question, index) => {
    const answer = answers[index] ?? "Unanswered";
    return `${index + 1}. ${question.prompt} (Answer: ${answer})`;
  });
  const acceptance = [
    "- Spec pack includes required files",
    "- Every decision has at least one source",
    "- Tasks list stays within atomic limits",
  ];

  return [
    "# Requirements",
    "",
    renderSection("Goal", goal),
    "",
    renderSection("Scope", scope),
    "",
    renderSection("Non-Goals", nonGoals),
    "",
    renderSection("Requirements", requirements),
    "",
    renderSection("Clarifying Questions", clarifyingQuestions),
    "",
    renderSection("Acceptance Criteria", acceptance),
  ].join("\n");
};

export const renderDesign = () => {
  return [
    "# Design",
    "",
    renderSection("Architecture", "Local-first CLI that generates deterministic spec packs."),
    "",
    renderSection(
      "Data Model",
      "Spec Pack consists of meta, requirements, design, tasks, sources, and quality."
    ),
    "",
    renderSection(
      "Security",
      "API keys are read from environment variables; cache stored locally."
    ),
    "",
    renderSection("Performance", "Cold start under 2 seconds; spec pack generation under 10 seconds."),
    "",
    renderSection("Alternatives Considered", [
      "- SaaS-first workflow (rejected for v0)",
      "- Database-backed storage (rejected for v0)",
    ]),
    "",
    renderSection("Trade-offs", "Favor deterministic output over maximal flexibility in v0."),
  ].join("\n");
};

export const renderTasks = (tasks) => {
  const sections = tasks.map((task) => {
    const files = task.files.map((file) => `- \`${file}\``).join("\n");
    const notTouched = task.notTouched?.length
      ? task.notTouched.map((file) => `- \`${file}\``).join("\n")
      : "- None";
    const acceptance = task.acceptance.map((item) => `- [ ] ${item}`).join("\n");

    return [
      `### ${task.id}: ${task.title}`,
      "**Files (<=3)**:",
      files,
      "",
      "**NOT Touched**:",
      notTouched,
      "",
      "**Acceptance Criteria**:",
      acceptance,
      "",
    ].join("\n");
  });

  return ["# Tasks", "", ...sections].join("\n");
};
