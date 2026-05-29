import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, DollarSign, ThumbsUp, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import api from "@/lib/api";

const barColors = ["#00D4FF", "#8B5CF6", "#F59E0B", "#F43F5E", "#34D399"];

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/applications/analytics");
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-24">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading analytics...</p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Time to Hire",
      value: `${data?.timeToHire ?? 0} days`,
      icon: Clock,
      color: "text-primary",
      change: "Average days from apply to hired",
    },
    {
      label: "Cost per Hire",
      value: `$${(data?.costPerHire ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-secondary",
      change: "Estimated average cost",
    },
    {
      label: "Offer Acceptance",
      value: `${data?.offerAcceptance ?? 0}%`,
      icon: ThumbsUp,
      color: "text-accent",
      change: "Hired / (Hired + Rejected)",
    },
    {
      label: "Source Effectiveness",
      value: `${data?.sourceEffectiveness ?? 0}%`,
      icon: Target,
      color: "text-warning",
      change: "Candidate pipeline quality",
    },
  ];

  const hiringFunnel: any[] = data?.hiringFunnel ?? [];
  const monthlyHires: any[] = data?.monthlyHires ?? [];
  const sourceBreakdown: any[] = data?.sourceBreakdown ?? [];
  const maxSource = sourceBreakdown.reduce((m: number, s: any) => Math.max(m, s.percentage), 1);

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
          {hiringFunnel.every((s) => s.count === 0) ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground/60">
              <p className="text-sm">No data yet — start building your pipeline</p>
            </div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringFunnel} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    width={80}
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                    {hiringFunnel.map((_, i) => (
                      <Cell key={i} fill={barColors[i]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Monthly Hires */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Monthly Hires</h2>
          <p className="text-sm text-muted-foreground mb-6">Hiring trend over the last 6 months</p>
          {monthlyHires.every((m) => m.hires === 0) ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground/60">
              <p className="text-sm">No hired candidates yet</p>
            </div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyHires}>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Bar dataKey="hires" fill="#00D4FF" radius={[8, 8, 0, 0]} barSize={32} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Source Breakdown */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Source Breakdown</h2>
        <div className="space-y-4">
          {sourceBreakdown.map((s: any) => (
            <div key={s.source} className="flex items-center gap-4">
              <span className="w-20 text-sm text-muted-foreground">{s.source}</span>
              <div className="flex-1 h-3 rounded-full bg-foreground/5">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(s.percentage / maxSource) * 100}%`, opacity: 0.8 }}
                />
              </div>
              <span className="w-12 text-right text-sm font-mono text-foreground">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
