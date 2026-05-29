import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  User,
  Brain,
  Upload,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/candidate" },
  { icon: Search,          label: "Explore Jobs",    path: "/candidate/explore" },
  { icon: ClipboardList,   label: "My Applications", path: "/candidate/applications" },
  { icon: User,            label: "Profile",         path: "/candidate/profile" },
  { icon: Brain,           label: "Career AI",       path: "/candidate/career-ai" },
  { icon: Upload,          label: "Upload CV",       path: "/candidate/upload-cv" },
];

function LogoMark({ expanded }: { expanded: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
          <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      {expanded && (
        <div className="animate-fade-in">
          <span className="font-extrabold text-[18px] leading-none">
            <span className="text-primary">Job</span>
            <span className="text-foreground">Engine</span>
          </span>
        </div>
      )}
    </div>
  );
}

export function CandidateSidebar() {
  const [expanded, setExpanded] = useState(true);
  const { logout } = useAuth();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className={cn(
        "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40 transition-all duration-300",
        expanded ? "w-[240px]" : "w-[68px]"
      )}>

        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <LogoMark expanded={expanded} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-5 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/candidate"}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="nav-active-bar" />}
                    <item.icon className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-colors",
                      isActive ? "text-primary" : ""
                    )} />
                    {expanded && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              {expanded && <span>Logout</span>}
            </button>
          </div>
        </nav>

        {/* Bottom: Avatar + Collapse */}
        <div className="p-2.5 border-t border-sidebar-border space-y-1">
          <NavLink
            to="/candidate/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              JD
            </div>
            {expanded && <span className="text-sm truncate">John Doe</span>}
          </NavLink>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-full h-9 rounded-xl text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            {expanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/candidate"}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-sidebar-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div className={cn("hidden md:block shrink-0 transition-all duration-300", expanded ? "w-[240px]" : "w-[68px]")} />
    </>
  );
}
