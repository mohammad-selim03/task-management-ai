import { TaskManager } from "@/components/task-manager";
import { ListChecks } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="container mx-auto max-w-3xl p-4 md:p-8">
        <header className="text-center my-8 md:my-12">
          <div className="inline-flex items-center gap-3">
            <ListChecks className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              GeminiTask
            </h1>
          </div>
          <p className="mt-3 text-lg text-muted-foreground">
            Your intelligent assistant for managing tasks.
          </p>
        </header>
        <div className="space-y-8">
          <TaskManager />
        </div>
        <footer className="text-center mt-16 text-muted-foreground text-sm">
          <p>Powered by Gemini Task with advanced AI</p>
        </footer>
      </div>
    </main>
  );
}
