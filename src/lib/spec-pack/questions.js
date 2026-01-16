export const QUESTIONS = [
  {
    id: "platform",
    prompt: "Target platform?",
    options: ["Web only", "Web + Mobile", "Native iOS + Android"],
    recommended: 0,
  },
  {
    id: "scale",
    prompt: "Expected user scale?",
    options: ["Personal (<100)", "Team (100-1k)", "SaaS (1k-100k)", "Enterprise (100k+)"],
    recommended: 1,
  },
  {
    id: "formats",
    prompt: "Output formats?",
    options: ["Markdown + JSON", "Markdown only", "JSON only"],
    recommended: 0,
  },
  {
    id: "integrations",
    prompt: "Required integrations?",
    options: ["None", "GitHub", "Supabase", "GitHub + Supabase"],
    recommended: 0,
  },
];
