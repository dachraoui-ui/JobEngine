import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { candidates, activities, pipelineStages } from "@/data/mockData";
import { Briefcase, Users, CalendarDays, TrendingUp, UserPlus, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Open Positions", value: "12", icon: Briefcase, change: "+3 this week", color: "text-primary" },
  { label: "Active Candidates", value: "156", icon: Users, change: "+24 this week", color: "text-secondary" },
  { label: "Interviews Today", value: "8", icon: CalendarDays, change: "3 remaining", color: "text-warning" },
  { label: "Hire Rate", value: "68%", icon: TrendingUp, change: "+5% vs last month", color: "text-accent" },
];

const activityIcons: Record<string, typeof UserPlus> = {
  "user-plus": UserPlus,
  calendar: Calendar,
  "arrow-right": ArrowRight,
  "check-circle": CheckCircle,
};

export default function Dashboard() {
  const topCandidates = candidates.filter(c => c.score >= 80).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your hiring overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn("text-3xl font-bold font-mono mt-1", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-foreground/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Match Scores */}
        <GlassCard className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Top AI Matches</h2>
          <p className="text-sm text-muted-foreground mb-6">Highest-scoring candidates across all open roles</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topCandidates.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] hover:border-primary/20 transition-colors">
                <PulseOrb score={c.score} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pipeline Funnel */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Pipeline</h2>
          <p className="text-sm text-muted-foreground mb-6">Candidates per stage</p>
          <div className="space-y-3">
            {pipelineStages.map((stage, i) => {
              const maxCount = pipelineStages[0].count;
              const width = Math.max((stage.count / maxCount) * 100, 12);
              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{stage.label}</span>
                    <span className="font-mono text-foreground">{stage.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : i === 2 ? "bg-warning" : "bg-accent"
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.icon] || ArrowRight;
            return (
              <div key={activity.id} className="flex items-start gap-4 group">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  activity.type === "hired" ? "bg-accent/10 text-accent" :
                  activity.type === "interview" ? "bg-warning/10 text-warning" :
                  "bg-primary/10 text-primary"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
