export interface VerifiedTech {
  name: string;
  version: string;
  verified_latest: boolean;
  verification_source?: string;
}

export interface VerifiedTechStack {
  verified_at: string;
  verification_method: string;
  runtime?: VerifiedTech;
  language?: VerifiedTech;
  framework?: VerifiedTech;
  database?: VerifiedTech;
  [key: string]: any;
}

export interface PipelineAgents {
  discovery: PipelineAgent;
  challenge: PipelineAgent;
  design: PipelineAgent;
  decomposition: PipelineAgent;
  validation: PipelineAgent;
  synthesis: PipelineAgent;
}

export interface PipelineAgent {
  execute(input: any): Promise<any>;
}

export interface DiscoveryInput {
  user_prompt: string;
}

export interface DiscoveryOutput {
  parsed_intent: string;
  clarifying_questions: any[];
  mentioned_tech: any[];
  requirements_draft: any;
}

export interface ChallengeInput {
  requirements: any;
}

export interface ChallengeOutput {
  challenges: any[];
  requirements_challenged: any;
  needs_discovery_loop: boolean;
}

export interface DesignInput {
  requirements: any;
}

export interface DesignOutput {
  architecture: string;
  tech_stack: VerifiedTechStack;
  file_structure: string;
  decisions: any[];
  schemas: Record<string, string>;
  needs_refinement: boolean;
}

export interface DecompositionInput {
  requirements: any;
  design: any;
}

export interface DecompositionOutput {
  sprints: any;
  stories: any[];
  dependency_dag: any;
  has_non_atomic_tasks: boolean;
}

export interface ValidationInput {
  requirements: any;
  design: any;
  decomposition: any;
}

export interface ValidationOutput {
  quality_report: any;
  passes: boolean;
}

export interface SynthesisInput {
  requirements: any;
  design: any;
  decomposition: any;
  validation: any;
}

export interface SynthesisOutput {
  spec_pack: any;
  executive_summary: string;
  exports: any;
}

export interface ValidationIssue {
  type: string;
  message: string;
}

export interface DesignDecision {
  id: string;
  topic: string;
  decision: string;
}
