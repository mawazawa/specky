import { SpecTask } from "./types";
import { SPEC_PROMPTS } from "./prompts";

// Mock LLM Interface (Replace with actual MCP/LLM call later)
interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

export class TaskGenerator {
  private llm: LLMProvider;

  constructor(llm: LLMProvider) {
    this.llm = llm;
  }

  async generateAtomicTasks(feature: string, architecture: string): Promise<SpecTask[]> {
    const prompt = SPEC_PROMPTS.ATOMIC_TASK_DECOMPOSITION
      .replace("{{feature}}", feature)
      .replace("{{architecture}}", architecture);

    try {
      const response = await this.llm.generate(prompt);
      const tasks: SpecTask[] = JSON.parse(response);

      // Validate Atomicity Post-Generation
      const nonAtomicTasks = tasks.filter(t => t.files.length > 3);
      if (nonAtomicTasks.length > 0) {
        console.warn(`[TaskGenerator] Warning: ${nonAtomicTasks.length} tasks violated atomicity constraint. Attempting to split...`);
        // TODO: Implement recursive splitting logic
      }

      return tasks;
    } catch (error) {
      console.error("[TaskGenerator] Failed to generate tasks", error);
      return [];
    }
  }
}
