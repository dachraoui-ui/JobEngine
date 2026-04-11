import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8">
      <div />
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm">
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded bg-foreground/5 text-[10px] font-mono text-muted-foreground border border-border">⌘K</kbd>
        </button>
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary glow-cyan" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold border border-secondary/20">
          JE
        </div>
      </div>
    </header>
  );
}
