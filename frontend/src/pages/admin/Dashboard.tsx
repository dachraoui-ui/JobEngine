import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PulseOrb } from "@/components/ui/PulseOrb";
import {
  Users, Briefcase, FileCheck, Zap, TrendingUp, ArrowUpRight,
  ChevronRight, Shield, Settings, BarChart2, CheckSquare, Home,
  AlertTriangle, Clock, Check
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

// ─── Mock data ───────────────────────────────────────────────────────────────
const growthData = [
  { month: "Nov", candidates: 720, recruiters: 48 },
  { month: "Dec", candidates: 810, recruiters: 55 },
  { month: "Jan", candidates: 890, recruiters: 61 },
  { month: "Feb", candidates: 980, recruiters: 68 },
  { month: "Mar", candidates: 1070, recruiters: 78 },
  { month: "Apr", candidates: 1142, recruiters: 89 },
];

const distributionData = [
  { name: "Candidates", value: 1142, color: "#00D4FF" },
  { name: "Recruiters", value: 89, color: "#8B5CF6" },
  { name: "Admins", value: 16, color: "#F59E0B" },
];

const weeklyAppsData = [
  { week: "W1", apps: 28 },
  { week: "W2", apps: 35 },
  { week: "W3", apps: 22 },
  { week: "W4", apps: 48 },
  { week: "W5", apps: 39 },
  { week: "W6", apps: 55 },
  { week: "W7", apps: 43 },
  { week: "W8", apps: 47 },
];

const topSkills = [
  { skill: "React", count: 234, color: "#00D4FF" },
  { skill: "Python", count: 189, color: "#8B5CF6" },
  { skill: "TypeScript", count: 156, color: "#34D399" },
  { skill: "Java", count: 142, color: "#F59E0B" },
  { skill: "AWS", count: 98, color: "#64748B" },
];

const recentActivity = [
  { user: "Ahmed Ben Ali", action: "Registered as Recruiter", role: "Recruiter", time: "2h ago", status: "Pending" },
  { user: "Sarah Johnson", action: "Uploaded CV", role: "Candidate", time: "4h ago", status: "Complete" },
  { user: "TechCorp Inc.", action: "Posted new Job Opening", role: "Recruiter", time: "5h ago", status: "Complete" },
  { user: "Mike Chen", action: "Applied to 3 jobs", role: "Candidate", time: "6h ago", status: "Complete" },
  { user: "DataFlow SAS", action: "Verification requested", role: "Recruiter", time: "8h ago", status: "Pending" },
  { user: "Layla Hassan", action: "Profile updated", role: "Candidate", time: "10h ago", status: "Complete" },
  { user: "CloudCore Ltd.", action: "Registered as Recruiter", role: "Recruiter", time: "12h ago", status: "Pending" },
  { user: "Omar Farouq", action: "Completed Neural Scan", role: "Candidate", time: "14h ago", status: "Complete" },
];

const metrics = [
  { label: "Total Users", value: "1,247", change: "+12%", up: true, icon: Users, orb: 88, color: "text-cyan-400" },
  { label: "Recruiters", value: "89", change: "+5%", up: true, icon: Briefcase, orb: 72, color: "text-violet-400" },
  { label: "Candidates", value: "1,142", change: "+15%", up: true, icon: Users, orb: 90, color: "text-emerald-400" },
  { label: "Active Jobs", value: "234", change: "-2%", up: false, icon: FileCheck, orb: 65, color: "text-amber-400" },
  { label: "Today's Applications", value: "47", change: "+8%", up: true, icon: TrendingUp, orb: 80, color: "text-rose-400" },
];

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
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

// ─── Admin Sidebar ───────────────────────────────────────────────────────────
const adminNav = [
  { icon: Home, label: "System Core", href: "/admin", active: true },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: CheckSquare, label: "Verifications", href: "/admin/verifications" },
  { icon: Settings, label: "Configuration", href: "/admin/config" },
  { icon: BarChart2, label: "Reports", href: "/admin/reports" },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">System Core</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Platform health and metrics</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground/80 font-mono bg-foreground/5 px-3 py-1.5 rounded-lg border border-foreground/10">
          {dateStr}
        </span>
      </div>

      {/* Alert Banner */}
      {!alertDismissed && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl border border-amber-500/40 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <p className="text-amber-300 font-medium">3 recruiters awaiting verification and account approval</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs">
              Review Now <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <button onClick={() => setAlertDismissed(true)} className="text-muted-foreground/80 hover:text-foreground text-xs">Dismiss</button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <GlassCard key={m.label} className="p-4 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <PulseOrb score={m.orb} size="sm" />
              <span className={`flex items-center text-xs font-semibold ${m.up ? "text-emerald-400" : "text-rose-400"}`}>
                <ArrowUpRight className={`w-3 h-3 mr-0.5 ${!m.up && "rotate-180"}`} />
                {m.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-foreground">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart — User Growth */}
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
                  <linearGradient id="gradCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRecruiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="candidates" stroke="#00D4FF" strokeWidth={2} fill="url(#gradCandidates)" dot={{ fill: "#00D4FF", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#00D4FF", stroke: "rgba(0,212,255,0.3)", strokeWidth: 4 }} />
                <Area type="monotone" dataKey="recruiters" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradRecruiters)" dot={{ fill: "#8B5CF6", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#8B5CF6", stroke: "rgba(139,92,246,0.3)", strokeWidth: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Donut Chart — Distribution */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Distribution</h2>
            <p className="text-xs text-muted-foreground mt-0.5">User type breakdown</p>
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
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-mono font-bold text-foreground">1,247</span>
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Weekly Applications */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Weekly Applications</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Last 8 weeks</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="apps" name="Applications" fill="#00D4FF" radius={[6, 6, 0, 0]} fillOpacity={0.85}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Horizontal Bar Chart — Top Skills */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Top Skills in Demand</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Across all active job postings</p>
          </div>
          <div className="space-y-4 mt-2">
            {topSkills.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between items-center mb-1.5 text-sm">
                  <span className="text-muted-foreground font-medium">{item.skill}</span>
                  <span className="font-mono text-foreground font-bold">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(item.count / 250) * 100}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest platform events</p>
          </div>
          <a href="#" className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-foreground/5 text-muted-foreground/80 text-xs uppercase tracking-widest">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Action</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Time</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row, i) => (
                <tr key={i} className="border-b border-foreground/[0.04] hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                        {row.user.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">{row.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">{row.action}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      row.role === "Recruiter" ? "bg-violet-500/10 text-violet-400" :
                      row.role === "Admin" ? "bg-amber-500/10 text-amber-400" :
                      "bg-cyan-500/10 text-cyan-400"
                    }`}>{row.role}</span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground/80 text-xs font-mono hidden sm:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {row.time}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {row.status === "Pending" ? (
                      <span className="flex items-center justify-end gap-1 text-amber-400 text-xs">
                        <AlertTriangle className="w-3 h-3" /> Pending
                      </span>
                    ) : (
                      <span className="flex items-center justify-end gap-1 text-emerald-400 text-xs">
                        <Check className="w-3 h-3" /> Complete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
