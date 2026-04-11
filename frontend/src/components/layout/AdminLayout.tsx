import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, CheckSquare, Settings, BarChart2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminNav = [
  { icon: Home, label: "System Core", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: CheckSquare, label: "Verifications", href: "/admin/verifications" },
  { icon: Settings, label: "Configuration", href: "/admin/config" },
  { icon: BarChart2, label: "Reports", href: "/admin/reports" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-foreground/[0.06] bg-surface/50 backdrop-blur-xl flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-foreground/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">JobEngine</span>
            <span className="text-[10px] text-amber-400 block font-medium uppercase tracking-widest">Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/admin"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_15px_rgba(245,158,11,0.08)]"
                  : "text-muted-foreground hover:text-white hover:bg-foreground/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 flex gap-2 border-t border-foreground/[0.06]">
          <ThemeToggle />
          <NavLink
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
          >
            ← Back
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
