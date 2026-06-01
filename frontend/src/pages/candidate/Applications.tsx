import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, Loader2, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";
import { getSwalTheme, getSwalCustomClass } from "@/lib/swal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusEntry {
  status: string;
  changedAt: string;
  changedBy: string;
}

interface Application {
  id: string;
  jobId: string;
  cvId?: string;
  status: string;
  matchingScore: number;
  scoreBreakdown?: { skills: number; experience: number; culture: number };
  matchedSkills?: string[];
  missingSkills?: string[];
  appliedAt: string;
  statusHistory?: StatusEntry[];
  // enriched from job
  jobTitle?: string;
  company?: string;
  location?: string;
  jobType?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function capitalize(s: string): string {
  if (!s) return "";
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
  APPLIED:     { bg: "bg-slate-500/15",   text: "text-slate-400",   border: "border-slate-500/30",   icon: <Clock className="w-3.5 h-3.5" />,         label: "Applied" },
  SHORTLISTED: { bg: "bg-amber-500/15",   text: "text-amber-600 dark:text-amber-400",   border: "border-amber-500/30",   icon: <CheckCircle2 className="w-3.5 h-3.5" />,   label: "Shortlisted" },
  INTERVIEW:   { bg: "bg-violet-500/15",  text: "text-violet-400",  border: "border-violet-500/30",  icon: <Clock className="w-3.5 h-3.5" />,         label: "Interview" },
  REJECTED:    { bg: "bg-rose-500/15",    text: "text-rose-400",    border: "border-rose-500/30",    icon: <XCircle className="w-3.5 h-3.5" />,        label: "Rejected" },
  HIRED:       { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", icon: <Trophy className="w-3.5 h-3.5" />,         label: "Hired 🎉" },
};

const STATUS_ACCENT: Record<string, string> = {
  APPLIED:     "bg-slate-500",
  SHORTLISTED: "bg-amber-500",
  INTERVIEW:   "bg-violet-500",
  REJECTED:    "bg-rose-500",
  HIRED:       "bg-emerald-500",
};

const FILTER_TABS = ["All", "Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

// ─── Main component ───────────────────────────────────────────────────────────

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const appsRes = await api.get("/applications");
      const rawApps: any[] = appsRes.data.data ?? [];

      // Enrich each application with job details
      const enriched: Application[] = await Promise.all(
        rawApps.map(async (app: any) => {
          let jobTitle = "Unknown Position";
          let company = "Unknown Company";
          let location = "Remote";
          let jobType = "";

          try {
            const jobRes = await api.get(`/jobs/${app.jobId}`);
            const job = jobRes.data.data;
            if (job) {
              jobTitle = job.title ?? jobTitle;
              company = job.companyName || job.recruiterName || company;
              location = job.location ?? location;
              jobType = job.type ?? "";
            }
          } catch {
            // job might be deleted — keep defaults
          }

          return {
            ...app,
            jobTitle,
            company,
            location,
            jobType,
          } as Application;
        })
      );

      // Sort newest first
      enriched.sort(
        (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      );

      setApplications(enriched);
    } catch (err) {
      console.error("Failed to load applications", err);
      toast.error("Could not load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter.toUpperCase());

  // Stats
  const countByStatus = (s: string) =>
    applications.filter((a) => a.status === s).length;

  const stats = [
    { label: "Total Applied",  value: applications.length,           color: "text-blue-400" },
    { label: "Shortlisted",    value: countByStatus("SHORTLISTED"),   color: "text-amber-600 dark:text-amber-400" },
    { label: "Interviews",     value: countByStatus("INTERVIEW"),     color: "text-violet-400" },
    { label: "Offers / Hired", value: countByStatus("HIRED"),        color: "text-emerald-400" },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h1>
        <p className="text-muted-foreground">Track your application journey and neural matches.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-4 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-mono font-bold ${stat.color}`}>
              {loading ? "—" : stat.value}
            </span>
            <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
          </GlassCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const count =
            tab === "All"
              ? applications.length
              : applications.filter((a) => a.status === tab.toUpperCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                filter === tab
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                  : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
              )}
            >
              {tab} {!loading && tab !== "All" && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your applications…</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center border-dashed border-foreground/10">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            {filter === "All" ? "No applications yet" : `No ${filter} applications`}
          </h3>
          <p className="text-muted-foreground mt-2 mb-5 max-w-xs text-sm">
            {filter === "All"
              ? "Start exploring opportunities and submit your first application."
              : "Switch to 'All' to see all your applications."}
          </p>
          {filter === "All" && (
            <Link
              to="/candidate/explore"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Jobs
            </Link>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onWithdraw={() => fetchApplications()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card component ───────────────────────────────────────────────────────────

function AppCard({ app, onWithdraw }: { app: Application; onWithdraw: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG["APPLIED"];
  const accentClass = STATUS_ACCENT[app.status] ?? "bg-slate-500";

  const score = Math.round(app.matchingScore ?? 0);
  const skillsPct  = Math.round(app.scoreBreakdown?.skills ?? score);
  const expPct     = Math.round(app.scoreBreakdown?.experience ?? score);
  const culturePct = Math.round(app.scoreBreakdown?.culture ?? score);

  const history: StatusEntry[] = app.statusHistory ?? [];

  const handleWithdraw = () => {
    Swal.fire({
      title: "Withdraw Application?",
      text: "Are you sure you want to withdraw this application? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d4ff",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, withdraw it",
      cancelButtonText: "Cancel",
      ...getSwalTheme(),
      customClass: getSwalCustomClass("border-primary/20"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setWithdrawing(true);
        try {
          toast.info("Withdrawal request noted. Contact the recruiter directly if needed.");
        } finally {
          setWithdrawing(false);
        }
      }
    });
  };

  return (
    <GlassCard className="p-0 overflow-hidden hover:border-primary/40 transition-colors relative">
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", accentClass)} />

      {/* Main clickable row */}
      <div
        className="p-5 pl-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1 flex gap-4 w-full min-w-0">
          {/* Company logo */}
          <div className="w-11 h-11 rounded-xl bg-foreground/10 flex items-center justify-center font-bold text-lg text-primary shrink-0">
            {(app.company ?? "?").charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 text-xs text-muted-foreground">
              <span className="font-medium">{app.company}</span>
              <span>•</span>
              <span>Applied {formatDate(app.appliedAt)}</span>
              {app.location && (
                <>
                  <span>•</span>
                  <span>{app.location}</span>
                </>
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground truncate mb-2">
              {app.jobTitle}
            </h3>

            {/* Matched skills */}
            {app.matchedSkills && app.matchedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {app.matchedSkills.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-primary/5 border-l-2 border-primary/40 rounded text-[11px] text-primary"
                  >
                    {s}
                  </span>
                ))}
                {(app.matchedSkills.length > 4) && (
                  <span className="px-2 py-0.5 rounded text-[11px] text-muted-foreground bg-foreground/[0.02]">
                    +{app.matchedSkills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: status + score + chevron */}
        <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full",
              cfg.bg, cfg.text, cfg.border
            )}
          >
            {cfg.icon}
            {cfg.label}
          </Badge>
          {score > 0 && <PulseOrb score={score} size="md" />}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-foreground/10 p-5 pl-6 flex flex-col md:flex-row gap-8 animate-in slide-in-from-top-2 duration-200 bg-foreground/[0.015]">
          {/* Status Timeline */}
          <div className="flex-1 relative border-l border-foreground/10 ml-2 pl-6 space-y-5 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider -mt-1 mb-3">
              Application Timeline
            </p>

            {history.length > 0 ? (
              history.map((entry, i) => {
                const entryCfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG["APPLIED"];
                const isLatest = i === history.length - 1;
                return (
                  <div key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[31px] w-3 h-3 rounded-full top-1",
                        entryCfg.text.replace("text-", "bg-"),
                        isLatest && entry.status === "INTERVIEW" && "animate-pulse"
                      )}
                      style={{
                        boxShadow: isLatest ? "0 0 8px currentColor" : "none",
                        background: isLatest
                          ? undefined
                          : "hsl(var(--foreground) / 0.15)",
                      }}
                    />
                    <div
                      className={cn(
                        "p-2.5 rounded-lg",
                        isLatest && entry.status === "INTERVIEW" && "bg-violet-500/10 border border-violet-500/20"
                      )}
                    >
                      <p className={cn("text-sm font-medium mb-0.5", isLatest ? entryCfg.text : "text-foreground")}>
                        {capitalize(entry.status.replace("_", " "))}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(entry.changedAt)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback simple timeline
              <>
                <div className="relative">
                  <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-primary top-1" />
                  <p className="text-sm font-medium text-foreground mb-0.5">Applied</p>
                  <p className="text-xs text-muted-foreground">{formatDate(app.appliedAt)}</p>
                </div>

                {(app.status === "SHORTLISTED" || app.status === "INTERVIEW" || app.status === "HIRED") && (
                  <div className="relative">
                    <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-amber-400 top-1" />
                    <p className="text-sm font-medium text-foreground mb-0.5">Shortlisted by recruiter</p>
                  </div>
                )}

                {(app.status === "INTERVIEW" || app.status === "HIRED") && (
                  <div className="relative bg-violet-500/10 p-3 rounded-lg border border-violet-500/20 -ml-2">
                    <span className="absolute -left-[24px] w-3 h-3 rounded-full bg-violet-400 animate-pulse top-4" />
                    <p className="text-sm font-medium text-violet-300 mb-0.5">Interview Scheduled</p>
                    <p className="text-xs text-violet-400/80">Check your email for details</p>
                  </div>
                )}

                {app.status === "HIRED" && (
                  <div className="relative">
                    <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-emerald-400 top-1" />
                    <p className="text-sm font-medium text-emerald-400 mb-0.5">Hired ✨</p>
                    <p className="text-xs text-emerald-400/80">Congratulations!</p>
                  </div>
                )}

                {app.status === "REJECTED" && (
                  <div className="relative">
                    <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-rose-400 top-1" />
                    <p className="text-sm font-medium text-rose-400 mb-0.5">Application Closed</p>
                  </div>
                )}

                {app.status !== "HIRED" && app.status !== "REJECTED" && (
                  <div className="relative">
                    <span className="absolute -left-[31px] w-3 h-3 bg-transparent border-2 border-slate-600 rounded-full top-1" />
                    <p className="text-sm font-medium text-muted-foreground/70 mb-0.5">Awaiting Decision</p>
                    <p className="text-xs text-slate-500">Pending</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Score breakdown + actions */}
          <div className="w-full md:w-[300px] flex flex-col gap-5">
            {score > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Match Breakdown
                </p>

                {[
                  { label: "Skills Match", pct: skillsPct },
                  { label: "Experience Fit", pct: expPct },
                  { label: "Culture Match", pct: culturePct },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-rose-400"}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-rose-400"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Missing skills hint */}
            {app.missingSkills && app.missingSkills.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Missing skills: </span>
                {app.missingSkills.slice(0, 4).join(", ")}
                {app.missingSkills.length > 4 && ` +${app.missingSkills.length - 4} more`}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button asChild variant="outline" className="flex-1 border-border text-foreground hover:bg-foreground/10">
                <Link to={`/candidate/job/${app.jobId}`}>View Job</Link>
              </Button>
              {app.status !== "REJECTED" && app.status !== "HIRED" && (
                <Button
                  variant="ghost"
                  disabled={withdrawing}
                  onClick={handleWithdraw}
                  className="flex-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
