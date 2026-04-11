import { cn } from "@/lib/utils";

interface PulseOrbProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { bg: "bg-primary", ring: "bg-primary/40", text: "text-primary", shadow: "shadow-[0_0_16px_rgba(0,212,255,0.4)]" };
  if (score >= 60) return { bg: "bg-warning", ring: "bg-warning/40", text: "text-warning", shadow: "shadow-[0_0_16px_rgba(245,158,11,0.4)]" };
  return { bg: "bg-destructive", ring: "bg-destructive/40", text: "text-destructive", shadow: "shadow-[0_0_16px_rgba(244,63,94,0.4)]" };
};

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-[10px]", ring: "w-10 h-10" },
  md: { container: "w-12 h-12", text: "text-sm", ring: "w-16 h-16" },
  lg: { container: "w-20 h-20", text: "text-xl", ring: "w-28 h-28" },
};

export function PulseOrb({ score, size = "md", showLabel = true, className }: PulseOrbProps) {
  const colors = getScoreColor(score);
  const sizes = sizeMap[size];
  const pulseSpeed = score >= 80 ? "animate-pulse-ring-fast" : score >= 60 ? "animate-pulse-ring" : "animate-pulse-ring-slow";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn("absolute rounded-full", sizes.ring, colors.ring, pulseSpeed)} />
      <div className={cn("relative rounded-full flex items-center justify-center", sizes.container, colors.bg, colors.shadow)}>
        {showLabel && (
          <span className={cn("font-mono font-bold text-primary-foreground", sizes.text)}>
            {score}
          </span>
        )}
      </div>
    </div>
  );
}

export function getScoreColorClass(score: number) {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}
