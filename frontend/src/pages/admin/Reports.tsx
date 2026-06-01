import { useMemo } from "react";
import { BarChart2, Download, TrendingUp, Users, Briefcase, FileCheck, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ADMIN_MOCK_JOBS, ADMIN_MOCK_USERS } from "@/data/adminMockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-foreground/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-mono font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

const getMonthSeries = (candidateCount: number, recruiterCount: number) => ([
  { month: "Dec", candidates: Math.round(candidateCount * 0.45), recruiters: Math.round(recruiterCount * 0.4) },
  { month: "Jan", candidates: Math.round(candidateCount * 0.55), recruiters: Math.round(recruiterCount * 0.5) },
  { month: "Feb", candidates: Math.round(candidateCount * 0.65), recruiters: Math.round(recruiterCount * 0.6) },
  { month: "Mar", candidates: Math.round(candidateCount * 0.78), recruiters: Math.round(recruiterCount * 0.7) },
  { month: "Apr", candidates: Math.round(candidateCount * 0.9), recruiters: Math.round(recruiterCount * 0.85) },
  { month: "May", candidates: candidateCount, recruiters: recruiterCount },
]);

const REPORT_SEGMENTS = [
  { label: "Software & AI", value: 46, color: "#00D4FF" },
  { label: "FinTech", value: 18, color: "#8B5CF6" },
  { label: "HealthTech", value: 14, color: "#34D399" },
  { label: "E-commerce", value: 12, color: "#F59E0B" },
  { label: "Other", value: 10, color: "#64748B" },
];

export default function AdminReports() {
  const stats = useMemo(() => {
    const totalUsers = ADMIN_MOCK_USERS.length;
    const candidateCount = ADMIN_MOCK_USERS.filter((u) => u.role === "CANDIDATE").length;
    const recruiterCount = ADMIN_MOCK_USERS.filter((u) => u.role === "RECRUITER").length;
    const adminCount = ADMIN_MOCK_USERS.filter((u) => u.role === "ADMIN").length;
    const pendingRecruiters = ADMIN_MOCK_USERS.filter((u) => u.role === "RECRUITER" && !u.isVerified).length;
    const activeUsers = ADMIN_MOCK_USERS.filter((u) => u.isActive !== false).length;
    return {
      totalUsers,
      candidateCount,
      recruiterCount,
      adminCount,
      pendingRecruiters,
      activeUsers,
      totalJobs: ADMIN_MOCK_JOBS.length,
    };
  }, []);

  const growthData = useMemo(() => getMonthSeries(stats.candidateCount, stats.recruiterCount), [stats]);
  const distributionData = useMemo(() => ([
    { name: "Candidates", value: stats.candidateCount, color: "#00D4FF" },
    { name: "Recruiters", value: stats.recruiterCount, color: "#8B5CF6" },
    { name: "Admins", value: stats.adminCount, color: "#F59E0B" },
  ]), [stats]);

  const approvalsData = useMemo(() => ([
    { status: "Verified", count: stats.recruiterCount - stats.pendingRecruiters },
    { status: "Pending", count: stats.pendingRecruiters },
  ]), [stats]);

  const reportDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Executive summary · {reportDate}</p>
          </div>
        </div>
        <Button variant="outline" className="border-border text-foreground bg-foreground/5 hover:bg-foreground/10">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+9.2%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Active Users</p>
          <p className="text-2xl font-mono font-bold text-foreground">{stats.activeUsers}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+4.1%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Recruiters</p>
          <p className="text-2xl font-mono font-bold text-foreground">{stats.recruiterCount}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <FileCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+6.7%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Active Jobs</p>
          <p className="text-2xl font-mono font-bold text-foreground">{stats.totalJobs}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">-1.3d</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Time to Hire</p>
          <p className="text-2xl font-mono font-bold text-foreground">18.4d</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">User Growth</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-cyan-400 rounded-full inline-block" />Candidates</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-violet-400 rounded-full inline-block" />Recruiters</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="reportsCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reportsRecruiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="candidates" stroke="#00D4FF" strokeWidth={2} fill="url(#reportsCandidates)" dot={{ fill: "#00D4FF", r: 3, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="recruiters" stroke="#8B5CF6" strokeWidth={2} fill="url(#reportsRecruiters)" dot={{ fill: "#8B5CF6", r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">User Distribution</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Current split</p>
          </div>
          <div className="h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={3} dataKey="value" stroke="none">
                  {distributionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-mono font-bold text-foreground">{stats.totalUsers}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {distributionData.map((d) => (
              <div key={d.name} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-mono text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recruiter Approvals</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Verification outcomes</p>
            </div>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approvalsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="status" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Recruiters" fill="#00D4FF" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Industry Mix</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Hiring focus areas</p>
            </div>
          </div>
          <div className="space-y-4">
            {REPORT_SEGMENTS.map((segment) => (
              <div key={segment.label}>
                <div className="flex justify-between items-center mb-1.5 text-sm">
                  <span className="text-muted-foreground font-medium">{segment.label}</span>
                  <span className="font-mono text-foreground font-bold">{segment.value}%</span>
                </div>
                <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${segment.value}%`,
                      backgroundColor: segment.color,
                      boxShadow: `0 0 8px ${segment.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

