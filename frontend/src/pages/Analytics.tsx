import { GlassCard } from "@/components/ui/GlassCard";
import { analyticsData } from "@/data/mockData";
import { Clock, DollarSign, ThumbsUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const metrics = [
  { label: "Time to Hire", value: `${analyticsData.timeToHire} days`, icon: Clock, color: "text-primary", change: "-2 days vs last quarter" },
  { label: "Cost per Hire", value: `$${analyticsData.costPerHire.toLocaleString()}`, icon: DollarSign, color: "text-secondary", change: "-$300 vs last quarter" },
  { label: "Offer Acceptance", value: `${analyticsData.offerAcceptance}%`, icon: ThumbsUp, color: "text-accent", change: "+4% vs last quarter" },
  { label: "Source Effectiveness", value: `${analyticsData.sourceEffectiveness}%`, icon: Target, color: "text-warning", change: "+8% vs last quarter" },
];

const barColors = ["#00D4FF", "#8B5CF6", "#F59E0B", "#34D399", "#34D399"];

export default function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Recruitment performance insights</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <GlassCard key={m.label} hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className={cn("text-2xl font-bold font-mono mt-1", m.color)}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{m.change}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-foreground/5", m.color)}>
                <m.icon className="w-5 h-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Hiring Funnel</h2>
          <p className="text-sm text-muted-foreground mb-6">Candidates at each stage</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.hiringFunnel} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" width={80} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {analyticsData.hiringFunnel.map((_, i) => (
                    <Cell key={i} fill={barColors[i]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Monthly Hires */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Monthly Hires</h2>
          <p className="text-sm text-muted-foreground mb-6">Hiring trend over the last 6 months</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyHires}>
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Bar dataKey="hires" fill="#00D4FF" radius={[8, 8, 0, 0]} barSize={32} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Source Breakdown */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Source Breakdown</h2>
        <div className="space-y-4">
          {analyticsData.sourceBreakdown.map((s) => (
            <div key={s.source} className="flex items-center gap-4">
              <span className="w-20 text-sm text-muted-foreground">{s.source}</span>
              <div className="flex-1 h-3 rounded-full bg-foreground/5">
                <div className="h-full rounded-full bg-primary" style={{ width: `${s.percentage}%`, opacity: 0.8 }} />
              </div>
              <span className="w-12 text-right text-sm font-mono text-foreground">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
