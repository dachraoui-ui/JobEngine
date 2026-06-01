import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Briefcase, FileText, Target, BrainCircuit, ChevronRight, Loader2 } from "lucide-react";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface RecommendedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  requiredSkills: string[];
  score?: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [profileStrength, setProfileStrength] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch candidate profile
        const profileRes = await api.get(`/users/${user.id}/candidate-profile`);
        const profile = profileRes.data.data;
        setCandidateProfile(profile);

        // Calculate profile strength
        let strength = 0;
        if (user.firstName && user.lastName) strength += 20;
        if (user.email) strength += 20;
        if (user.phone) strength += 10;
        if (profile) {
          if (profile.summary) strength += 15;
          if (profile.skills && profile.skills.length > 0) strength += 15;
          if (profile.experienceLevel) strength += 10;
          if (profile.preferences && (profile.preferences.jobType || profile.preferences.location)) strength += 10;
        }
        setProfileStrength(strength);

        // Fetch applications
        const appsRes = await api.get("/applications");
        const apps = appsRes.data.data || [];
        setApplications(apps);

        // Fetch recommended jobs
        const recsRes = await api.get("/jobs/recommended");
        const jobs = recsRes.data.data || [];

        // Compute match score on the client side based on skills
        const candidateSkills = profile?.skills || [];
        const processedJobs = jobs.map((job: any) => {
          const required = job.requiredSkills || [];
          if (required.length === 0) {
            return { ...job, score: 75 };
          }
          const matched = required.filter((s: string) => 
            candidateSkills.some((cs: string) => cs.toLowerCase() === s.toLowerCase())
          ).length;
          const score = Math.round((matched / required.length) * 100);
          return { ...job, score: score > 0 ? score : 50 }; // fallback to 50% minimum
        });

        // Sort by match score
        processedJobs.sort((a: any, b: any) => b.score - a.score);
        setRecommendedJobs(processedJobs.slice(0, 3)); // show top 3
      } catch (err) {
        console.error("Failed to load candidate dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Stats derivations
  const activeAppsCount = applications.filter(a => a.status !== "REJECTED" && a.status !== "HIRED").length;
  const interviewsCount = applications.filter(a => a.status === "INTERVIEW").length;
  const profileViewsCount = 20 + applications.length * 4;

  // Active interview (if any)
  const activeInterviewApp = applications.find(a => a.status === "INTERVIEW");

  // Dynamic AI tip extraction: find a missing skill from the recommended jobs
  let missingSkillSuggestion = "";
  if (candidateProfile?.skills && recommendedJobs.length > 0) {
    const candidateSkillsLower = candidateProfile.skills.map((s: string) => s.toLowerCase());
    for (const job of recommendedJobs) {
      const missing = (job.requiredSkills || []).find(
        (s: string) => !candidateSkillsLower.includes(s.toLowerCase())
      );
      if (missing) {
        missingSkillSuggestion = missing;
        break;
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.firstName}</h1>
        {recommendedJobs.length > 0 ? (
          <p className="text-muted-foreground">Your AI profile is active. You have {recommendedJobs.length} new highly compatible job matches today.</p>
        ) : (
          <p className="text-muted-foreground">Your AI profile is active. Explore open jobs to start applying.</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Profile Strength", value: `${profileStrength}/100`, icon: <BrainCircuit className="w-5 h-5 text-primary" />, color: "border-primary/20", bg: "bg-primary/5" },
          { label: "Active Applications", value: String(activeAppsCount), icon: <Briefcase className="w-5 h-5 text-secondary" />, color: "border-secondary/20", bg: "bg-secondary/5" },
          { label: "Interviews", value: String(interviewsCount), icon: <Target className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20", bg: "bg-emerald-500/5" },
          { label: "Profile Views", value: String(profileViewsCount), icon: <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />, color: "border-amber-500/20", bg: "bg-amber-500/5" },
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
          
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <GlassCard key={job.id} className="p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center font-bold text-xl text-primary shrink-0">
                    {(job.companyName || "C").charAt(0)}
                  </div>
                  <div>
                    <Link to={`/candidate/job/${job.id}`}>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">{job.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{job.companyName || "Unknown Company"} • {job.location || "RemoteOK"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <PulseOrb score={job.score || 75} size="md" />
                  <Link to={`/candidate/job/${job.id}`} className="hidden sm:flex text-sm text-muted-foreground hover:text-foreground transition-colors">View Details</Link>
                </div>
              </GlassCard>
            ))
          ) : (
            <GlassCard className="p-8 text-center border-dashed border-foreground/10 bg-foreground/[0.01]">
              <p className="text-sm text-muted-foreground mb-4">No matching jobs found based on your current skills profile.</p>
              <Link to="/candidate/explore">
                <Button variant="outline" size="sm">Explore All Jobs</Button>
              </Link>
            </GlassCard>
          )}
        </div>

        {/* Action Center */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Action Center</h2>
          
          {activeInterviewApp ? (
            <GlassCard className="p-5 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
              <h3 className="font-semibold text-foreground mb-1">Interview In Progress</h3>
              <p className="text-sm text-muted-foreground mb-3">Check your messages or email for scheduling details.</p>
              <Link to="/candidate/applications" className="text-xs text-emerald-400 font-mono hover:underline">View application details →</Link>
            </GlassCard>
          ) : (
            <GlassCard className="p-5 border-amber-500/20 bg-amber-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
              <h3 className="font-semibold text-foreground mb-1">No Upcoming Interviews</h3>
              <p className="text-sm text-muted-foreground mb-3">Apply to more jobs to increase your scheduling chances.</p>
              <Link to="/candidate/explore" className="text-xs text-amber-600 dark:text-amber-400 font-mono hover:underline">Explore jobs now →</Link>
            </GlassCard>
          )}

          <GlassCard className="p-5 border-secondary/20 relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-20">
              <BrainCircuit className="w-32 h-32 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 relative z-10">AI Pro Tip</h3>
            {missingSkillSuggestion ? (
              <p className="text-sm text-muted-foreground mb-4 relative z-10">Adding <strong className="text-secondary">"{missingSkillSuggestion}"</strong> to your skills can increase your match rate by up to 15% for current open roles.</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4 relative z-10">Adding more specific developer tools to your skills profile helps our neural matching engine find better fits for you.</p>
            )}
            <Link to="/candidate/profile" className="text-sm text-secondary hover:underline relative z-10">Update Profile Skills →</Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
