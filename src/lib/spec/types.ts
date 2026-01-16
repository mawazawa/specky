export interface SpecPack {
  meta: SpecMeta;
  requirements: SpecRequirements;
  design: SpecDesign;
  tasks: SpecTask[];
  sources: SpecSource[];
  quality: SpecQuality;
}

export interface SpecMeta {
  specPackVersion: string;
  generatedAt: string;
  verificationDate: string;
  projectName: string;
  inputs: {
    prompt: string;
    clarifyingQuestions: ClarifyingQuestion[];
    answers: Record<string, string>;
  };
  decisions: TechDecision[];
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
  rationale: string;
}

export interface TechDecision {
  category: string;
  choice: string;
  rationale: string;
  verifiedAt: string;
  sources: string[];
  query: string;
}

export interface SpecRequirements {
  goal: string;
  corePrinciples: string[];
  successMetrics: string[];
  userFlows: string[];
}

export interface SpecDesign {
  architecture: string;
  techStack: TechDecision[];
  fileStructure: string;
}

export interface SpecTask {
  id: string;
  title: string;
  files: string[]; // Max 3
  description: string;
  acceptanceCriteria: string[];
  dependencies?: string[];
}

export interface SpecSource {
  url: string;
  title: string;
  summary: string;
  verifiedAt: string;
  relevanceScore: number;
}

export interface SpecQuality {
  schemaCompliant: boolean;
  atomicTaskCompliance: number; // 0-100%
  citationCoverage: number; // 0-100%
  freshnessScore: number; // 0-100%
  totalScore: number;
}
