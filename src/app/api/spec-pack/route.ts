import { NextResponse } from "next/server";
import { QUESTIONS, generateSpecPack } from "@/lib/spec-pack";

const resolveAnswers = (answers: unknown[]) =>
  QUESTIONS.map((question, index) => {
    const candidate = answers[index];
    if (typeof candidate === "string" && question.options.includes(candidate)) {
      return candidate;
    }
    return question.options[question.recommended];
  });

export async function POST(request: Request) {
  let payload: { prompt?: string; answers?: unknown[]; offline?: boolean } | null = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = payload?.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  const answers = Array.isArray(payload?.answers) ? resolveAnswers(payload!.answers) : resolveAnswers([]);
  const offline = payload?.offline === true;

  try {
    const specPack = await generateSpecPack({ prompt, answers, offline });
    const gatePass =
      specPack.quality.violations.missingCitations.length === 0 &&
      specPack.quality.violations.atomicTaskFailures.length === 0;

    return NextResponse.json({ specPack, gatePass }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Spec pack generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
