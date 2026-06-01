import { useMemo, useState } from "react";
import { Settings, Shield, Mail, Database, Server, Globe, Clock, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const coreSettings = [
  { label: "Environment", value: "Production", note: "Live traffic enabled" },
  { label: "Region", value: "eu-west-3 (Paris)", note: "Primary cluster" },
  { label: "Release", value: "JobEngine v2.4.1", note: "Hotfix channel" },
  { label: "Last Deploy", value: formatDateTime("2026-05-29T18:12:00Z"), note: "Pipeline #492" },
];

const policyRows = [
  { label: "Session timeout", value: "45 minutes", note: "Admin portal" },
  { label: "Password policy", value: "12 chars + 1 MFA", note: "Admins & recruiters" },
  { label: "Inactive users", value: "Auto-suspend after 30 days", note: "Background job" },
  { label: "Upload limit", value: "25 MB", note: "CV + portfolio" },
  { label: "API rate limit", value: "120 req/min", note: "Per token" },
];

const integrationRows = [
  { name: "SendGrid", type: "Email", status: "Healthy", detail: "Queue latency 1.8s" },
  { name: "Twilio", type: "SMS", status: "Healthy", detail: "Fallback enabled" },
  { name: "S3 Storage", type: "Storage", status: "Healthy", detail: "1.4 TB / 2 TB" },
  { name: "ElasticSearch", type: "Search", status: "Warning", detail: "Shard rebalance" },
];

const statusStyle = (status: string) => {
  if (status === "Healthy") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
  if (status === "Warning") return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
  return "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400";
};

export default function AdminConfig() {
  const [toggles, setToggles] = useState({
    signups: true,
    recruiterVerification: true,
    autoArchiveJobs: true,
    realTimeAlerts: true,
  });

  const toggleRows = useMemo(() => [
    { key: "signups", label: "New user signups", description: "Allow candidates and recruiters to register" },
    { key: "recruiterVerification", label: "Recruiter verification", description: "Require manual approval for new recruiters" },
    { key: "autoArchiveJobs", label: "Auto-archive jobs", description: "Close inactive jobs after 45 days" },
    { key: "realTimeAlerts", label: "Real-time alerts", description: "Send incident alerts to admins" },
  ], []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuration</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Platform settings and operational controls</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground/80 font-mono bg-foreground/5 px-3 py-1.5 rounded-lg border border-foreground/10">
          {dateStr}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-semibold text-foreground">Core Settings</h2>
            </div>
            <Button variant="outline" className="border-border text-foreground bg-foreground/5 hover:bg-foreground/10">Sync</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreSettings.map((item) => (
              <div key={item.label} className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground mt-1">{item.value}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Admin MFA</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Required</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IP allowlist</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Suspicious login</span>
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400"><AlertTriangle className="w-4 h-4" /> Review</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Data retention</span>
              <span className="text-foreground">24 months</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-semibold text-foreground">Operational Toggles</h2>
          </div>
          <div className="space-y-4">
            {toggleRows.map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
                </div>
                <Switch
                  checked={toggles[row.key as keyof typeof toggles]}
                  onCheckedChange={() => setToggles((prev) => ({
                    ...prev,
                    [row.key]: !prev[row.key as keyof typeof prev]
                  }))}
                />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-violet-400" />
            <h2 className="text-lg font-semibold text-foreground">Policies & Limits</h2>
          </div>
          <div className="space-y-3">
            {policyRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-foreground/10 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.note}</p>
                </div>
                <span className="text-sm text-foreground font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
          </div>
          <div className="space-y-3">
            {integrationRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between border-b border-foreground/10 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{row.type} · {row.detail}</p>
                </div>
                <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${statusStyle(row.status)}`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Daily summary</span>
              <span className="text-foreground">08:00 CET</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Incident channel</span>
              <span className="text-foreground">#ops-alerts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">From address</span>
              <span className="text-foreground">noreply@jobengine.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Escalation window</span>
              <span className="text-foreground">15 minutes</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Maintenance Window</h2>
              <p className="text-xs text-muted-foreground">Next scheduled maintenance</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Next window</p>
              <p className="text-sm font-semibold text-foreground">Jun 04, 2026 · 01:00 - 02:00</p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
              Schedule Update
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

