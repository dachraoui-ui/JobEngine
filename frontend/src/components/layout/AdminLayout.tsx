import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, CheckSquare, Settings, BarChart2, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const adminNav = [
  { icon: Home,        label: "System Core",    href: "/admin" },
  { icon: Users,       label: "Users",          href: "/admin/users" },
  { icon: CheckSquare, label: "Verifications",  href: "/admin/verifications" },
  { icon: Settings,    label: "Configuration",  href: "/admin/config" },
  { icon: BarChart2,   label: "Reports",        href: "/admin/reports" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

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

        {/* Footer Profile & Actions */}
        <div className="mt-auto p-4 border-t border-border bg-sidebar-accent/30 flex flex-col gap-3.5">
          {user && (
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center text-warning text-xs font-bold uppercase select-none">
                {user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-snug">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate leading-none mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 h-9 text-xs font-semibold rounded-xl transition-all duration-200",
                "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white"
              )}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
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
