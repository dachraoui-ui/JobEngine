import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "cyan" | "violet" | "mint";
}

export function GlassCard({ children, className, hover = false, glow = false, glowColor = "cyan", ...props }: GlassCardProps) {
  const glowClasses = {
    cyan: "glow-cyan",
    violet: "glow-violet",
    mint: "glow-mint",
  };

  return (
    <div className={cn(
      hover ? "glass-card-hover" : "glass-card",
      glow && glowClasses[glowColor],
      "p-6",
      className
    )}>
      {children}
    </div>
  );
}
