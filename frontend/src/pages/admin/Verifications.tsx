import { useMemo, useState } from "react";
import { Search, ExternalLink, CheckCircle2, XCircle, CheckSquare, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ADMIN_MOCK_USERS } from "@/data/adminMockData";


const RECRUITER_DETAILS: Record<string, { company: string; companyUrl: string }> = {
  "oubaied29@gmail.com": { company: "Oubaied Group", companyUrl: "oubaiedgroup.com" },
  "emma.laurent@example.com": { company: "Aurora Labs", companyUrl: "auroralabs.com" },
  "rami.kader@example.com": { company: "Northwind HR", companyUrl: "northwindhr.com" },
  "sara.elamrani@example.com": { company: "BluePeak Talent", companyUrl: "bluepeaktalent.com" },
  "julien.costa@example.com": { company: "Seaside Tech", companyUrl: "seasidetech.com" },
  "maha.zahid@example.com": { company: "BrightPath Careers", companyUrl: "brightpath.com" },
  "victor.silva@example.com": { company: "Silverline Hiring", companyUrl: "silverline.io" },
  "dalia.haddad@example.com": { company: "Atlas Systems", companyUrl: "atlasy.io" },
  "aziz.rahman@example.com": { company: "Vertex Staffing", companyUrl: "vertexstaffing.com" }
};

const STATUS_PENDING = "Pending";
const STATUS_VERIFIED = "Verified";
const STATUS_REJECTED = "Rejected";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatRelative = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
};

const buildVerificationRows = () => {
  return ADMIN_MOCK_USERS
    .filter((u) => u.role === "RECRUITER")
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .map((user, index) => {
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
      const recruiterInfo = RECRUITER_DETAILS[user.email];
      return {
        id: index + 1,
        name,
        email: user.email,
        company: recruiterInfo?.company || "Independent Recruiter",
        companyUrl: recruiterInfo?.companyUrl,
        status: user.isVerified ? STATUS_VERIFIED : STATUS_PENDING,
        joined: formatDate(user.createdAt),
        lastActive: formatRelative(user.createdAt)
      };
    });
};

const statusPill = (status: string) => {
  if (status === STATUS_VERIFIED) {
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
  }
  if (status === STATUS_REJECTED) {
    return "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400";
  }
  return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
};

export default function Verifications() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [records, setRecords] = useState(buildVerificationRows());

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = `${record.name} ${record.email} ${record.company}`.toLowerCase();
      const searchMatch = searchText.includes(search.toLowerCase());
      const statusMatch = filterStatus === "All" || record.status === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [records, search, filterStatus]);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.status === STATUS_PENDING).length;
    const verified = records.filter((r) => r.status === STATUS_VERIFIED).length;
    const rejected = records.filter((r) => r.status === STATUS_REJECTED).length;
    return { total, pending, verified, rejected };
  }, [records]);

  const handleApprove = (id: number) => {
    setRecords((prev) => prev.map((record) => record.id === id ? { ...record, status: STATUS_VERIFIED } : record));
  };

  const handleReject = (id: number) => {
    setRecords((prev) => prev.map((record) => record.id === id ? { ...record, status: STATUS_REJECTED } : record));
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Verifications</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Recruiter identity and company review</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground/80 font-mono bg-foreground/5 px-3 py-1.5 rounded-lg border border-foreground/10">
          {dateStr}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-xs text-muted-foreground">Total Recruiters</p>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">{stats.total}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-mono font-bold text-amber-700 dark:text-amber-400 mt-1">{stats.pending}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-muted-foreground">Verified</p>
          <p className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-1">{stats.verified}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-xs text-muted-foreground">Rejected</p>
          <p className="text-2xl font-mono font-bold text-rose-700 dark:text-rose-400 mt-1">{stats.rejected}</p>
        </GlassCard>
      </div>

      <GlassCard className="p-4 flex gap-4 flex-wrap items-center bg-foreground/[0.02]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by recruiter, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-foreground/5 dark:bg-black/20 border border-foreground/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-cyan-500/50 outline-none placeholder:text-muted-foreground/80"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-foreground/5 dark:bg-black/20 border border-foreground/10 rounded-lg px-4 py-2.5 pr-8 text-sm text-foreground outline-none appearance-none cursor-pointer hover:border-foreground/20"
          >
            <option value="All">Status: All</option>
            <option value={STATUS_PENDING}>Pending</option>
            <option value={STATUS_VERIFIED}>Verified</option>
            <option value={STATUS_REJECTED}>Rejected</option>
          </select>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
          Filter
        </Button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden bg-card border border-border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Verification Queue</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{filteredRecords.length} records shown</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/5 text-muted-foreground text-xs uppercase tracking-widest pl-2">
                <th className="p-4 pl-6 font-semibold">Recruiter</th>
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold hidden md:table-cell">Joined</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Last Active</th>
                <th className="p-4 pr-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-foreground/[0.02] transition-colors group hover:bg-cyan-500/[0.02]">
                  <td className="p-4 pl-6 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-foreground shrink-0 border border-foreground/10 group-hover:border-cyan-500/30 transition-colors">
                        {record.name.split(" ").map((w) => w[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground leading-snug tracking-tight">{record.name}</p>
                        <p className="text-xs text-muted-foreground/80">{record.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground font-medium">{record.company}</p>
                      {record.companyUrl && (
                        <a
                          href={`https://${record.companyUrl}`}
                          className="text-xs text-cyan-600 dark:text-cyan-400 inline-flex items-center gap-1 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {record.companyUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${statusPill(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{record.joined}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{record.lastActive}</span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        onClick={() => handleApprove(record.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10"
                        onClick={() => handleReject(record.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Reject
                      </Button>
                    </div>
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

