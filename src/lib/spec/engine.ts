import { SpecPack, SpecTask, SpecMeta, TechDecision } from "./types";

export class SpecEngine {
  private projectPrompt: string;
  
  constructor(prompt: string) {
    this.projectPrompt = prompt;
  }

  // Phase 1: Initialize minimal spec
  public initializeSpec(): SpecPack {
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    return {
      meta: {
        specPackVersion: "1.0.0",
        generatedAt: now,
        verificationDate: today,
        projectName: "Untitled Spec",
        inputs: {
          prompt: this.projectPrompt,
          clarifyingQuestions: [],
          answers: {}
        },
        decisions: []
      },
      requirements: {
        goal: "",
        corePrinciples: [],
        successMetrics: [],
        userFlows: []
      },
      design: {
        architecture: "",
        techStack: [],
        fileStructure: ""
      },
      tasks: [],
      sources: [],
      quality: {
        schemaCompliant: true,
        atomicTaskCompliance: 100,
        citationCoverage: 0,
        freshnessScore: 100,
        totalScore: 0
      }
    };
  }

  // Phase 2: Add Verified Decision
  public addDecision(spec: SpecPack, decision: TechDecision): SpecPack {
    return {
      ...spec,
      meta: {
        ...spec.meta,
        decisions: [...spec.meta.decisions, decision]
      }
    };
  }

  // Phase 3: Add Atomic Task (with strict validation)
  public addAtomicTask(spec: SpecPack, task: SpecTask): SpecPack {
    if (task.files.length > 3) {
      throw new Error(`Atomic Task Violation: Task ${task.id} touches ${task.files.length} files (max 3 allowed).`);
    }

    return {
      ...spec,
      tasks: [...spec.tasks, task]
    };
  }

  // Phase 4: Calculate Quality Score
  public calculateQuality(spec: SpecPack): SpecPack {
    const atomicTasks = spec.tasks.filter(t => t.files.length <= 3).length;
    const atomicCompliance = spec.tasks.length > 0 
      ? (atomicTasks / spec.tasks.length) * 100 
      : 100;

    const verifiedDecisions = spec.meta.decisions.filter(d => d.sources.length > 0).length;
    const citationCoverage = spec.meta.decisions.length > 0
      ? (verifiedDecisions / spec.meta.decisions.length) * 100
      : 0;

    const totalScore = (atomicCompliance * 0.6) + (citationCoverage * 0.4);

    return {
      ...spec,
      quality: {
        ...spec.quality,
        atomicTaskCompliance: Math.round(atomicCompliance),
        citationCoverage: Math.round(citationCoverage),
        totalScore: Math.round(totalScore)
      }
    };
  }
}
