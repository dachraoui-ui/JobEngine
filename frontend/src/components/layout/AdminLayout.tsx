import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, CheckSquare, Settings, BarChart2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminNav = [
  { icon: Home,        label: "System Core",    href: "/admin" },
  { icon: Users,       label: "Users",          href: "/admin/users" },
  { icon: CheckSquare, label: "Verifications",  href: "/admin/verifications" },
  { icon: Settings,    label: "Configuration",  href: "/admin/config" },
  { icon: BarChart2,   label: "Reports",        href: "/admin/reports" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-warning/15 border border-warning/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-warning" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-foreground">
              <span className="text-primary">Job</span>Engine
            </span>
            <span className="text-[10px] text-warning block font-semibold uppercase tracking-widest leading-none">
              Admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {adminNav.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/admin"}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-warning/10 text-warning"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-warning shadow-[0_0_8px_hsl(var(--warning)/0.5)]" />
                  )}
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-warning" : "")} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center gap-2">
          <ThemeToggle />
          <NavLink
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-sidebar-accent"
          >
            ← Back to App
          </NavLink>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
