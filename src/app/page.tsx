export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight">Specky</h1>
      <p className="text-muted-foreground text-lg text-center max-w-xl">
        The Spec is the Moat.
      </p>
      <div className="flex gap-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
          New Spec
        </button>
      </div>
    </div>
  );
}
