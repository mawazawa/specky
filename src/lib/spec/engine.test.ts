import { SpecEngine } from "./engine";
import { SpecPack, SpecTask } from "./types";
import { strict as assert } from "node:assert";

// Simple test runner for SpecEngine
async function testSpecEngine() {
  console.log("🧪 Testing SpecEngine...");
  
  const engine = new SpecEngine("Build a todo app");
  
  // Test 1: Initialization
  const spec = engine.initializeSpec();
  assert.equal(spec.meta.projectName, "Untitled Spec");
  assert.ok(spec.meta.generatedAt, "Should have timestamp");
  console.log("✅ Initialization passed");

  // Test 2: Atomic Task Validation (Success)
  const validTask: SpecTask = {
    id: "AT-001",
    title: "Setup",
    files: ["package.json", "tsconfig.json"],
    description: "Init project",
    acceptanceCriteria: ["Runs"]
  };
  
  const specWithTask = engine.addAtomicTask(spec, validTask);
  assert.equal(specWithTask.tasks.length, 1);
  console.log("✅ Valid Atomic Task passed");

  // Test 3: Atomic Task Validation (Failure)
  const invalidTask: SpecTask = {
    id: "AT-002",
    title: "Big Feature",
    files: ["a.ts", "b.ts", "c.ts", "d.ts"], // 4 files
    description: "Too big",
    acceptanceCriteria: []
  };

  try {
    engine.addAtomicTask(specWithTask, invalidTask);
    console.error("❌ Failed to catch non-atomic task");
  } catch (e) {
    console.log("✅ Caught non-atomic task violation");
  }

  // Test 4: Quality Score
  const qualitySpec = engine.calculateQuality(specWithTask);
  assert.equal(qualitySpec.quality.atomicTaskCompliance, 100);
  console.log("✅ Quality Score calculation passed");
}

testSpecEngine().catch(console.error);
