// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Button, Card, Typography, Alert, Table, Tag, Space, Avatar } from "antd";
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { PulseOrb } from "@/components/ui/PulseOrb";
import {
  Users, Briefcase, FileCheck, Zap, TrendingUp, Shield,
  AlertTriangle, Clock, Check
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const { Title, Text } = Typography;

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
  { name: "Candidates", value: 1142, color: "#F97316" },
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
  { skill: "React", count: 234, color: "#F97316" },
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
    <div className="bg-slate-900/95 border border-foreground/10 rounded-lg px-3 py-2 text-xs shadow-xl z-50">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-mono font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            {record.user.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
          </Avatar>
          <Text strong style={{ color: 'var(--foreground)' }}>{record.user}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      responsive: ['md' as any],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'cyan';
        if (role === 'Recruiter') color = 'purple';
        if (role === 'Admin') color = 'orange';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      responsive: ['sm' as any],
      render: (time: string) => (
        <Space size="small">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <Text type="secondary">{time}</Text>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'right' as any,
      render: (status: string) => (
        status === 'Pending' ? 
          <Space><AlertTriangle className="w-3 h-3 text-amber-400" /><Text style={{ color: '#f59e0b' }}>Pending</Text></Space> : 
          <Space><Check className="w-3 h-3 text-emerald-400" /><Text style={{ color: '#10b981' }}>Complete</Text></Space>
      )
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'var(--foreground)' }}>System Core</Title>
            <Text type="secondary">Platform health and metrics</Text>
          </div>
        </div>
        <Text keyboard>{dateStr}</Text>
      </div>

      {!alertDismissed && (
        <Alert
          message={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Space>
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                <Text strong style={{ color: '#d97706' }}>3 recruiters awaiting verification and account approval</Text>
              </Space>
              <Button size="small" type="primary" style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>Review Now <RightOutlined /></Button>
            </div>
          }
          type="warning"
          closable
          onClose={() => setAlertDismissed(true)}
          style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.4)' }}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <PulseOrb score={m.orb} size="sm" />
              <Space size={2} style={{ color: m.up ? '#10b981' : '#f43f5e', fontSize: '12px', fontWeight: 600 }}>
                {m.up ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {m.change}
              </Space>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>{m.value}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>{m.label}</Text>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card bordered={false} className="lg:col-span-2" style={{ background: 'var(--surface)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>User Growth</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>Last 6 months</Text>
            </div>
            <Space style={{ fontSize: '12px' }}>
              <Space size={4}><div style={{ width: 12, height: 4, background: '#F97316', borderRadius: 2 }} /><Text type="secondary">Candidates</Text></Space>
              <Space size={4}><div style={{ width: 12, height: 4, background: '#8B5CF6', borderRadius: 2 }} /><Text type="secondary">Recruiters</Text></Space>
            </Space>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRecruiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="candidates" stroke="#F97316" strokeWidth={2} fill="url(#gradCandidates)" />
                <Area type="monotone" dataKey="recruiters" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradRecruiters)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card bordered={false} style={{ background: 'var(--surface)' }}>
          <div className="mb-4">
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Distribution</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>User type breakdown</Text>
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
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card bordered={false} style={{ background: 'var(--surface)' }}>
          <div className="mb-6">
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Weekly Applications</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Last 8 weeks</Text>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="apps" name="Applications" fill="#F97316" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card bordered={false} style={{ background: 'var(--surface)' }}>
          <div className="mb-6">
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Top Skills in Demand</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Across all active job postings</Text>
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
        </Card>
      </div>

      <Card bordered={false} style={{ background: 'var(--surface)', padding: 0 }} bodyStyle={{ padding: 0 }}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/10">
          <div>
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Recent Activity</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Latest platform events</Text>
          </div>
          <a href="#" className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            View All <RightOutlined style={{ fontSize: 10, marginLeft: 4 }} />
          </a>
        </div>
        <Table 
          columns={columns} 
          dataSource={recentActivity.map((r, i) => ({ ...r, key: i }))} 
          pagination={false}
        />
      </Card>
    </div>
  );
}
