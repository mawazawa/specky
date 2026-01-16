import { GlassButton } from "@/components/ui/glass-button";
import { SpecCard, SpecCardContent, SpecCardDescription, SpecCardHeader, SpecCardTitle } from "@/components/ui/spec-card";
import { ArrowRight, Cpu, Sparkles, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent blur-[128px] opacity-60" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-sky-200 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-sky" />
            <span>v0.1.0 • Verified Jan 15, 2026</span>
          </div>
          
          <h1 className="text-display bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent max-w-3xl">
            The Spec is the Moat.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            Generate ultra-granular implementation plans so powerful that any LLM can single-shot execute them.
          </p>

          <div className="flex gap-4 mt-4">
            <GlassButton size="lg" className="gap-2 group bg-primary/20 hover:bg-primary/30 border-primary/20 shadow-[0_0_20px_-5px_var(--color-primary)]">
              Start New Spec
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </GlassButton>
            <GlassButton size="lg" variant="ghost" className="text-muted-foreground hover:text-white">
              View Documentation
            </GlassButton>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 animate-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards">
          <SpecCard className="border-white/5 hover:border-primary/20">
            <SpecCardHeader>
              <Terminal className="w-8 h-8 text-primary mb-2" />
              <SpecCardTitle>Temporal Grounding</SpecCardTitle>
            </SpecCardHeader>
            <SpecCardContent>
              <SpecCardDescription>
                Every technology decision is verified against today's date to prevent hallucinations.
              </SpecCardDescription>
            </SpecCardContent>
          </SpecCard>

          <SpecCard className="border-white/5 hover:border-accent/20">
            <SpecCardHeader>
              <Cpu className="w-8 h-8 text-accent mb-2" />
              <SpecCardTitle>Atomic Tasks</SpecCardTitle>
            </SpecCardHeader>
            <SpecCardContent>
              <SpecCardDescription>
                Specs are decomposed into tasks touching ≤3 files, perfect for AI context windows.
              </SpecCardDescription>
            </SpecCardContent>
          </SpecCard>

          <SpecCard className="border-white/5 hover:border-sky/20">
            <SpecCardHeader>
              <Sparkles className="w-8 h-8 text-sky mb-2" />
              <SpecCardTitle>MCP Optimized</SpecCardTitle>
            </SpecCardHeader>
            <SpecCardContent>
              <SpecCardDescription>
                Tech stack choices are weighted by Model Context Protocol support for autonomous execution.
              </SpecCardDescription>
            </SpecCardContent>
          </SpecCard>
        </div>
      </main>
      
      <footer className="w-full p-8 text-center text-sm text-muted-foreground/40">
        <p>Specky "Hummingbird" • Built with Next.js 16.1.2 & Tailwind 4.1.18</p>
      </footer>
    </div>
  );
}
