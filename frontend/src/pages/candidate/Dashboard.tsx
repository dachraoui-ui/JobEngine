import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase, FileText, Target, BrainCircuit, ChevronRight } from "lucide-react";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Neural Talent</h1>
        <p className="text-muted-foreground">Your AI profile is active. You have 3 new highly compatible job matches today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Profile Strength", value: "88/100", icon: <BrainCircuit className="w-5 h-5 text-primary" />, color: "border-primary/20", bg: "bg-primary/5" },
          { label: "Active Applications", value: "8", icon: <Briefcase className="w-5 h-5 text-secondary" />, color: "border-secondary/20", bg: "bg-secondary/5" },
          { label: "Interviews", value: "2", icon: <Target className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20", bg: "bg-emerald-500/5" },
          { label: "Profile Views", value: "45", icon: <FileText className="w-5 h-5 text-amber-400" />, color: "border-amber-500/20", bg: "bg-amber-500/5" },
        ].map((stat, i) => (
          <GlassCard key={i} className={`p-5 border ${stat.color} ${stat.bg}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className="p-2 rounded-lg bg-foreground/5 shrink-0">{stat.icon}</div>
            </div>
            <span className="text-3xl font-mono font-bold text-foreground">{stat.value}</span>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Top Neural Matches</h2>
            <Link to="/candidate/explore" className="text-sm text-primary hover:underline flex items-center">View all <ChevronRight className="w-4 h-4 ml-1" /></Link>
          </div>
          
          {[
            { id: 101, title: "Senior React Developer", company: "TechCorp", location: "Remote", score: 95 },
            { id: 102, title: "Frontend Lead", company: "DataSync", location: "New York, NY", score: 88 },
            { id: 103, title: "Full Stack Engineer", company: "Neurolab", location: "Remote", score: 84 },
          ].map((job) => (
            <GlassCard key={job.id} className="p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center font-bold text-xl text-primary shrink-0">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PulseOrb score={job.score} size="md" />
                <Link to={`/candidate/job/${job.id}`} className="hidden sm:flex text-sm text-muted-foreground hover:text-foreground transition-colors">View Details</Link>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Action Center */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Action Center</h2>
          
          <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
            <h3 className="font-semibold text-foreground mb-1">Interview Scheduled</h3>
            <p className="text-sm text-muted-foreground mb-3">With DataFlow Systems</p>
            <p className="text-xs text-amber-400 font-mono">Tomorrow, 10:00 AM</p>
          </GlassCard>

          <GlassCard className="p-5 border-secondary/20 relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-20">
              <BrainCircuit className="w-32 h-32 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 relative z-10">AI Pro Tip</h3>
            <p className="text-sm text-muted-foreground mb-4 relative z-10">Adding "GraphQL" to your skills can increase your match rate by 15% for current open roles.</p>
            <Link to="/candidate/career-ai" className="text-sm text-secondary hover:underline relative z-10">Explore Career AI →</Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
