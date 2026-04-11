import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function CandidateTopBar({ title }: { title?: string }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10">
      <h2 className="text-xl font-bold text-foreground tracking-tighter">{title || "Dashboard"}</h2>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center h-9 px-3 gap-2 rounded-xl glass-card text-sm text-muted-foreground cursor-pointer hover:border-foreground/10 transition-colors">
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 font-mono">⌘K</kbd>
        </div>
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-foreground/5 transition-colors text-muted-foreground">
          <Bell className="w-4 h-4" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </button>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
