import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function CandidateTopBar({ title }: { title?: string }) {
  const { user } = useAuth();
  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 border-b border-border bg-background/80 backdrop-blur-md">
      <h2 className="text-lg font-bold text-foreground tracking-tight">{title || "Dashboard"}</h2>
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center h-9 px-3 gap-2 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground cursor-pointer hover:border-primary/30 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border font-mono">⌘K</kbd>
        </div>
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
