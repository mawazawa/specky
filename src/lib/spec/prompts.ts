export const SPEC_PROMPTS = {
  CLARIFYING_QUESTIONS: `
    Analyze the following user request and generate 3-5 high-leverage clarifying questions.
    For each question, provide 3 distinct options and a rationale for why this question matters.
    
    User Request: "{{prompt}}"
    
    Output JSON format:
    [
      {
        "id": "q1",
        "question": "...",
        "options": ["Option A", "Option B", "Option C"],
        "rationale": "..."
      }
    ]
  `,

  TECH_STACK_DECISION: `
    Given the project requirements, recommend the best technology for "{{category}}".
    
    Constraints:
    - Must be verified stable as of {{date}}
    - Prefer technologies with strong MCP (Model Context Protocol) support
    - Minimize bundle size
    
    Output JSON format:
    {
      "choice": "...",
      "rationale": "...",
      "verificationQuery": "Search query to verify version/stability"
    }
  `,

  ATOMIC_TASK_DECOMPOSITION: `
    Break down the following feature into "Atomic Tasks".
    
    Constraint: Each task must touch MAXIMUM 3 files.
    Constraint: Tasks must be sequentially executable.
    
    Feature: "{{feature}}"
    Architecture: "{{architecture}}"
    
    Output JSON format:
    [
      {
        "id": "AT-001",
        "title": "...",
        "files": ["src/path/a.ts", "src/path/b.ts"],
        "description": "...",
        "acceptanceCriteria": ["..."]
      }
    ]
  `
};
