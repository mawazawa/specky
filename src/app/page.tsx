import { SpecGenerator } from "@/components/spec/SpecGenerator";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent blur-[128px] opacity-60" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-12 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-sky-200 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-sky" />
            <span>v0.1.0 • Spec Pack Engine</span>
          </div>
          
          <h1 className="text-display bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent max-w-3xl">
            The Spec is the Moat.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            Generate ultra-granular implementation plans so powerful that any LLM can single-shot execute them.
          </p>
        </div>

        <SpecGenerator />
      </main>
      
      <footer className="w-full p-8 text-center text-sm text-muted-foreground/40">
        <p>Specky "Hummingbird" • Built with Next.js 16.1.2 & Tailwind 4.1.18</p>
      </footer>
    </div>
  );
}
