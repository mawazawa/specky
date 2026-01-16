"use client";

import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/spec-pack/questions";
import { GlassButton } from "@/components/ui/glass-button";
import {
  SpecCard,
  SpecCardContent,
  SpecCardDescription,
  SpecCardFooter,
  SpecCardHeader,
  SpecCardTitle,
} from "@/components/ui/spec-card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
} from "lucide-react";

type SpecPackResponse = {
  specPack: {
    meta: Record<string, unknown>;
    requirements: string;
    design: string;
    tasks: string;
    sources: { sources: Array<{ decisionId: string; url: string; verifiedAt: string; query: string; title?: string | null; excerpt?: string | null }> };
    quality: {
      overallScore: number;
      sections: { requirements: number; design: number; tasks: number };
      staleness: { fresh: string[]; verify: string[]; stale: string[] };
      violations: { missingCitations: string[]; atomicTaskFailures: string[] };
    };
  };
  gatePass: boolean;
};

const sectionTabs = [
  { id: "requirements", label: "Requirements" },
  { id: "design", label: "Design" },
  { id: "tasks", label: "Tasks" },
  { id: "sources", label: "Sources" },
  { id: "quality", label: "Quality" },
  { id: "meta", label: "Meta" },
] as const;

const downloadFile = (name: string, content: string, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};

const copyText = async (content: string) => {
  if (!navigator?.clipboard) return;
  await navigator.clipboard.writeText(content);
};

export function SpecGenerator() {
  const [prompt, setPrompt] = useState("");
  const [offline, setOffline] = useState(false);
  const [answers, setAnswers] = useState(
    QUESTIONS.map((question) => question.options[question.recommended])
  );
  const [activeTab, setActiveTab] = useState<(typeof sectionTabs)[number]["id"]>("requirements");
  const [response, setResponse] = useState<SpecPackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specPack = response?.specPack ?? null;
  const gatePass = response?.gatePass ?? false;

  const files = useMemo(() => {
    if (!specPack) return null;
    return {
      "meta.json": JSON.stringify(specPack.meta, null, 2),
      "requirements.md": specPack.requirements,
      "design.md": specPack.design,
      "tasks.md": specPack.tasks,
      "sources.json": JSON.stringify(specPack.sources, null, 2),
      "quality.json": JSON.stringify(specPack.quality, null, 2),
    };
  }, [specPack]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/spec-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, answers, offline }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Spec pack generation failed.");
      }
      setResponse(data as SpecPackResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,420px)_1fr] gap-8 w-full">
      <SpecCard className="border-white/10">
        <SpecCardHeader>
          <SpecCardTitle>Spec Input</SpecCardTitle>
          <SpecCardDescription>
            Define the problem, answer the clarifying questions, and generate a verified spec pack.
          </SpecCardDescription>
        </SpecCardHeader>
        <SpecCardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project prompt</label>
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Describe what you want to build..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>

          <div className="space-y-4">
            {QUESTIONS.map((question, qIndex) => (
              <div key={question.id} className="space-y-2">
                <div className="text-sm font-medium">{question.prompt}</div>
                <div className="grid gap-2">
                  {question.options.map((option, oIndex) => {
                    const selected = answers[qIndex] === option;
                    const recommended = question.recommended === oIndex;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const next = [...answers];
                          next[qIndex] = option;
                          setAnswers(next);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
                          selected
                            ? "border-primary/60 bg-primary/10 text-white"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        <span>{option}</span>
                        {recommended ? (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-sky-200">
                            Recommended
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-black/40 text-primary"
              checked={offline}
              onChange={(event) => setOffline(event.target.checked)}
            />
            Offline mode (use cached verification only)
          </label>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </SpecCardContent>
        <SpecCardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {offline ? "Offline verification" : "Live verification"}
          </div>
          <GlassButton
            size="lg"
            className="gap-2"
            disabled={!prompt.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Generate Spec Pack
          </GlassButton>
        </SpecCardFooter>
      </SpecCard>

      <SpecCard className="border-white/10">
        <SpecCardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <SpecCardTitle>Spec Pack Output</SpecCardTitle>
              <SpecCardDescription>
                Verified sections with citations, quality scores, and atomic tasks.
              </SpecCardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {specPack ? (
                gatePass ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Quality Gate: PASS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    Quality Gate: FAIL
                  </span>
                )
              ) : null}
            </div>
          </div>
        </SpecCardHeader>

        <SpecCardContent className="space-y-6">
          {specPack ? (
            <>
              <div className="flex flex-wrap gap-2">
                {sectionTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition",
                      activeTab === tab.id
                        ? "border-primary/60 bg-primary/10 text-white"
                        : "border-white/10 text-muted-foreground hover:border-primary/30"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                {activeTab === "requirements" ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-100">
                    {specPack.requirements}
                  </pre>
                ) : null}
                {activeTab === "design" ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-100">
                    {specPack.design}
                  </pre>
                ) : null}
                {activeTab === "tasks" ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-100">
                    {specPack.tasks}
                  </pre>
                ) : null}
                {activeTab === "sources" ? (
                  <div className="space-y-3 text-sm text-slate-100">
                    {specPack.sources.sources.map((source, index) => (
                      <div key={`${source.decisionId}-${index}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-muted-foreground">{source.decisionId}</div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-sky-200 hover:text-sky-100"
                        >
                          {source.title ?? source.url}
                        </a>
                        <div className="text-xs text-muted-foreground">
                          Verified {source.verifiedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {activeTab === "quality" ? (
                  <div className="space-y-4 text-sm text-slate-100">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-muted-foreground">Overall</div>
                        <div className="text-2xl font-semibold">{specPack.quality.overallScore}</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-muted-foreground">Requirements</div>
                        <div className="text-2xl font-semibold">{specPack.quality.sections.requirements}</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-muted-foreground">Tasks</div>
                        <div className="text-2xl font-semibold">{specPack.quality.sections.tasks}</div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="text-xs text-muted-foreground">Staleness</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-200">
                          Fresh: {specPack.quality.staleness.fresh.length}
                        </span>
                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-amber-200">
                          Verify: {specPack.quality.staleness.verify.length}
                        </span>
                        <span className="rounded-full bg-red-500/10 px-2 py-1 text-red-200">
                          Stale: {specPack.quality.staleness.stale.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
                {activeTab === "meta" ? (
                  <pre className="whitespace-pre-wrap text-sm text-slate-100">
                    {JSON.stringify(specPack.meta, null, 2)}
                  </pre>
                ) : null}
              </div>

              {files ? (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Export</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {Object.entries(files).map(([name, content]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground"
                      >
                        <span>{name}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sky-200 hover:text-sky-100"
                            onClick={() =>
                              copyText(
                                content
                              )
                            }
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sky-200 hover:text-sky-100"
                            onClick={() =>
                              downloadFile(
                                name,
                                content,
                                name.endsWith(".json") ? "application/json" : "text/markdown"
                              )
                            }
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
              Generate a spec pack to preview requirements, design, tasks, sources, and quality scores.
            </div>
          )}
        </SpecCardContent>
      </SpecCard>
    </div>
  );
}
