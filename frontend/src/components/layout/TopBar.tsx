import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function TopBar() {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "JE";

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 md:px-8 bg-background/80 backdrop-blur-md border-b border-border">
      <div />
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-muted/60 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded bg-background text-[10px] font-mono text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
