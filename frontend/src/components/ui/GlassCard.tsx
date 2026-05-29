import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "primary" | "accent" | "cyan" | "violet" | "mint";
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  glowColor = "primary",
  ...props
}: GlassCardProps) {
  // Map legacy color names to new ones
  const glowClasses: Record<string, string> = {
    primary: "glow-primary",
    accent:  "glow-accent",
    cyan:    "glow-primary",   // legacy alias → orange primary glow
    violet:  "glow-accent",    // legacy alias → teal accent glow
    mint:    "glow-accent",    // legacy alias → teal accent glow
  };

  return (
    <div
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        glow && glowClasses[glowColor],
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
