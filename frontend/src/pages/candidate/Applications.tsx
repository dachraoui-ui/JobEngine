import { useState } from "react";
import { Briefcase, CheckCircle2, Clock, MapPin, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const applications = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "TechNexus",
    location: "Remote",
    appliedDate: "Mar 15, 2026",
    status: "Shortlisted",
    score: 92,
  },
  {
    id: 2,
    title: "Vite/React Frontend Developer",
    company: "SpeedyWeb",
    location: "San Francisco, CA",
    appliedDate: "Mar 12, 2026",
    status: "Interview",
    score: 85,
  },
  {
    id: 3,
    title: "Backend Service Architect",
    company: "DataFlow Systems",
    location: "Remote",
    appliedDate: "Mar 10, 2026",
    status: "Applied",
    score: 74,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudCore",
    location: "Seattle, WA",
    appliedDate: "Mar 01, 2026",
    status: "Rejected",
    score: 58,
  },
];

const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Applied: { bg: "bg-slate-500/20", text: "text-muted-foreground", icon: <Clock className="w-4 h-4 mr-1" /> },
  Shortlisted: { bg: "bg-amber-500/20", text: "text-amber-400", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> },
  Interview: { bg: "bg-violet-500/20", text: "text-violet-400", icon: <Clock className="w-4 h-4 mr-1" /> },
  Rejected: { bg: "bg-rose-500/20", text: "text-rose-400", icon: <XCircle className="w-4 h-4 mr-1" /> },
  Hired: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> },
};

export default function Applications() {
  const [filter, setFilter] = useState("All");

  const filteredApps = filter === "All" ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mission Control</h1>
        <p className="text-muted-foreground">Track your application journey and neural matches.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applied", value: applications.length, color: "bg-blue-500/20 text-blue-400" },
          { label: "Shortlisted", value: applications.filter(a => a.status === "Shortlisted").length, color: "bg-amber-500/20 text-amber-400" },
          { label: "Interviews", value: applications.filter(a => a.status === "Interview").length, color: "bg-violet-500/20 text-violet-400" },
          { label: "Offers", value: applications.filter(a => a.status === "Hired").length, color: "bg-emerald-500/20 text-emerald-400" }
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-mono font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</span>
            <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Applied", "Shortlisted", "Interview", "Rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === tab ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,212,255,0.3)]" : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
            }`}
          >
            {tab} {tab !== "All" && `(${applications.filter(a => a.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">No applications found</h3>
            <p className="text-muted-foreground mt-2">Start exploring the neural feed to find your next opportunity.</p>
          </GlassCard>
        ) : (
          filteredApps.map((app) => (
            <ExpandableAppCard key={app.id} app={app} />
          ))
        )}
      </div>
    </div>
  );
}

function ExpandableAppCard({ app }: { app: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard className="p-0 overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
      {/* Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyles[app.status].bg.replace('/20', '')}`} />
      
      <div className="p-5 pl-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 flex gap-4 w-full">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-lg text-primary shrink-0">
            {app.company.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
              <span className="font-medium text-muted-foreground">{app.company}</span>
              <span>•</span>
              <span>Applied {app.appliedDate}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{app.title}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">React</span>
              <span className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">TypeScript</span>
              <span className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">Node.js</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-6 sm:mt-0 mt-4">
          <Badge variant="outline" className={`flex items-center ${statusStyles[app.status].bg} ${statusStyles[app.status].text} border-transparent`}>
            {app.status}
          </Badge>
          <PulseOrb score={app.score} size="md" />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-foreground/10 p-5 pl-6 flex flex-col md:flex-row gap-8 animate-in slide-in-from-top-2 duration-300 bg-foreground/[0.02]">
          {/* Timeline */}
          <div className="flex-1 relative border-l border-foreground/10 ml-2 pl-6 space-y-6 py-2">
            <div className="relative">
              <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_currentColor] top-1" />
              <p className="text-sm font-medium text-white mb-0.5">Applied</p>
              <p className="text-xs text-muted-foreground">Mar 15, 2026</p>
            </div>
            
            {(app.status === "Shortlisted" || app.status === "Interview" || app.status === "Hired") && (
              <div className="relative">
                <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_currentColor] top-1" />
                <p className="text-sm font-medium text-white mb-0.5">Shortlisted by recruiter</p>
                <p className="text-xs text-muted-foreground">Mar 18, 2026</p>
              </div>
            )}

            {(app.status === "Interview" || app.status === "Hired") && (
              <div className="relative bg-violet-500/10 p-3 rounded-lg border border-violet-500/20 -ml-2 -mt-2">
                <span className="absolute -left-[24px] w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_10px_currentColor] animate-pulse top-4" />
                <p className="text-sm font-medium text-violet-300 mb-0.5">Interview Scheduled</p>
                <p className="text-xs text-violet-400/80">Mar 22, 2026, 2:00 PM</p>
              </div>
            )}
            
            {app.status !== "Hired" && app.status !== "Rejected" && (
              <div className="relative">
                <span className="absolute -left-[31px] w-3 h-3 bg-transparent border-2 border-slate-600 rounded-full top-1" />
                <p className="text-sm font-medium text-muted-foreground/80 mb-0.5">Decision</p>
                <p className="text-xs text-slate-600">Pending</p>
              </div>
            )}
            
            {app.status === "Hired" && (
              <div className="relative">
                <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor] top-1" />
                <p className="text-sm font-medium text-emerald-400 mb-0.5">Hired ✨</p>
                <p className="text-xs text-emerald-400/80">Offer accepted</p>
              </div>
            )}
            
            {app.status === "Rejected" && (
              <div className="relative">
                <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_10px_currentColor] top-1" />
                <p className="text-sm font-medium text-rose-400 mb-0.5">Application Closed</p>
              </div>
            )}
          </div>

          {/* Scores & Actions */}
          <div className="w-full md:w-[300px] flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Skills Match</span><span className="text-primary">92%</span></div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[92%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Experience Match</span><span className="text-primary">85%</span></div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[85%]" /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Culture Fit</span><span className="text-primary">78%</span></div>
                <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[78%]" /></div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 basis-1/2 border-foreground/10 text-white hover:bg-foreground/10">View Job</Button>
              {app.status !== "Rejected" && app.status !== "Hired" && (
                <Button variant="ghost" className="flex-1 basis-1/2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">Withdraw</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
