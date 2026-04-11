import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  BarChart3,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Users, label: "Candidates", path: "/candidates" },
  { icon: GitBranch, label: "Pipeline", path: "/pipeline" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40 transition-all duration-300",
        expanded ? "w-[260px]" : "w-[72px]"
      )}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center glow-cyan">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            {expanded && (
              <div className="animate-fade-in">
                <h1 className="font-bold text-foreground tracking-tighter text-lg">JobEngine</h1>
              </div>
            )}
          </div>
        </div>

        {/* Nav items with constellation lines */}
        <nav className="flex-1 px-3 py-6 relative">
          {/* Constellation line */}
          <div className="absolute left-[34px] top-8 bottom-8 w-px bg-border" style={{ width: expanded ? undefined : undefined }}>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/20 to-transparent" />
          </div>

          <div className="space-y-1 relative">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full glow-cyan" />
                    )}
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive && "drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]")} />
                    {expanded && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="absolute bottom-6 left-3 right-3 space-y-1">
             <NavLink
                to="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 group relative"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {expanded && <span>Logout</span>}
             </NavLink>
          </div>
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-full h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer for sidebar */}
      <div className={cn("hidden md:block shrink-0 transition-all duration-300", expanded ? "w-[260px]" : "w-[72px]")} />
    </>
  );
}
