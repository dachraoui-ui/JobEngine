import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { exploreJobs } from "@/data/candidateJobsData";
import { cn } from "@/lib/utils";
import {
  MapPin, DollarSign, Calendar, Clock, Bookmark, BookmarkCheck, CheckCircle, XCircle,
  ShieldCheck, Lightbulb, X, Sparkles, ChevronRight, Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";

function SkillConstellation({ matched, missing }: { matched: string[]; missing: string[] }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-muted-foreground mb-2">Matched Skills</p>
        <div className="flex flex-wrap gap-2">
          {matched.length > 0 ? (
            matched.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <CheckCircle className="w-3 h-3" /> {s}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">None matched yet</span>
          )}
        </div>
      </div>
      {missing.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Missing Skills</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                <XCircle className="w-3 h-3" /> {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApplyModal({ job, candidateProfile, onClose, onApplied }: { job: any; candidateProfile: any; onClose: () => void; onApplied: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverNote, setCoverNote] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/applications", {
        jobId: job.id,
        cvId: candidateProfile?.cvId || null,
      });
      setSubmitted(true);
      onApplied();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit application. You might have already applied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-[480px] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <GlassCard className="p-8">
          {!submitted ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight">Apply to {job.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded glass-card flex items-center justify-center text-[10px] font-bold text-primary">
                      {job.companyLogo || (job.company || "C").charAt(0)}
                    </div>
                    <span className="text-sm text-muted-foreground">{job.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PulseOrb score={job.score || 75} size="sm" />
                  <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
              </div>

              {/* CV info */}
              <div className="space-y-1.5 mb-6">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Uplink CV Status</label>
                <div className="p-3 rounded-xl bg-surface border border-border text-sm flex items-center justify-between">
                  <span className="text-foreground text-xs font-mono truncate">
                    {candidateProfile?.cvId ? "✓ Primary CV Linked (Auto-synced)" : "No CV uploaded in profile"}
                  </span>
                  <Link to="/candidate/upload-cv" className="text-xs text-primary hover:underline">
                    Upload
                  </Link>
                </div>
              </div>

              {/* Cover note */}
              <div className="space-y-1.5 mb-6">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Cover Note <span className="normal-case text-muted-foreground/50">(optional)</span></label>
                <textarea
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself to the recruiter..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="px-5 h-11 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">Cancel</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <><Sparkles className="w-4 h-4" /> Submit Application</>}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 animate-scale-in">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center glow-mint">
                  <svg viewBox="0 0 52 52" className="w-8 h-8">
                    <circle cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-draw-circle" />
                    <path fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" className="animate-draw-check" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Application Sent! 🚀</h3>
              <p className="text-sm text-muted-foreground mb-6">We'll notify you when {job.company} reviews your profile.</p>
              <Link to="/candidate/applications" className="text-sm text-primary font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all">
                View My Applications <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJobDetails = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch Candidate Profile to calculate scores
      const profileRes = await api.get(`/users/${user.id}/candidate-profile`);
      const profile = profileRes.data.data;
      setCandidateProfile(profile);
      const candSkills = profile?.skills || [];

      // 2. Fetch Job Details (mock or real)
      if (id && id.startsWith("ej")) {
        const mockJob = exploreJobs.find((j) => j.id === id);
        if (mockJob) {
          // Calculate matching skills based on candidate's real profile skills
          const required = mockJob.skills || [];
          const matched = required.filter(s => candSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
          const missing = required.filter(s => !candSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
          const score = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 75;

          setJob({
            ...mockJob,
            matchedSkills: matched,
            missingSkills: missing,
            score,
            scoreBreakdown: { skills: score, experience: 85, cultureFit: 80 }
          });
        }
      } else {
        const jobRes = await api.get(`/jobs/${id}`);
        const realJob = jobRes.data.data;

        if (realJob) {
          const required = realJob.requiredSkills || [];
          const matched = required.filter((s: string) => candSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
          const missing = required.filter((s: string) => !candSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
          const score = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 75;

          setJob({
            id: realJob.id,
            title: realJob.title,
            company: realJob.companyName || "Unknown Company",
            companyLogo: (realJob.companyName || "C").charAt(0),
            location: realJob.location || "Remote",
            locationType: realJob.type === "REMOTE" ? "Remote" : "On-site",
            type: realJob.type === "FULL_TIME" ? "Full-Time" : realJob.type === "PART_TIME" ? "Part-Time" : "Internship",
            experience: realJob.experienceLevel === "SENIOR" ? "Senior" : realJob.experienceLevel === "MID" ? "Mid" : "Junior",
            salary: "$100k — $140k", // mockup salary range
            postedAgo: "Recent",
            closesIn: 14,
            description: realJob.description,
            aboutRole: realJob.description,
            whatYoullDo: [
              "Work as a key contributor to build and extend features",
              "Maintain code quality, readability, and performance standards",
              "Collaborate across multi-disciplinary product teams"
            ],
            whatWeNeed: required.map((s: string) => ({
              skill: s,
              matched: candSkills.some(cs => cs.toLowerCase() === s.toLowerCase())
            })),
            niceToHave: ["Familiarity with cloud environments (AWS/GCP)", "Experience writing clean tests"],
            cultureValues: realJob.companyValues && realJob.companyValues.length > 0 ? realJob.companyValues : ["Innovation", "Work-Life Balance", "Transparency"],
            matchingValues: ["Innovation"],
            verified: true,
            matchedSkills: matched,
            missingSkills: missing,
            score,
            scoreBreakdown: { skills: score, experience: 80, cultureFit: 75 }
          });
        }
      }

      // Check if user has already applied to this job
      const appsRes = await api.get("/applications");
      const userApps = appsRes.data.data || [];
      const applied = userApps.some((app: any) => app.jobId === id);
      setHasApplied(applied);

    } catch (err) {
      console.error("Failed to load job details page data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GlassCard className="p-8 text-center">
          <p className="text-foreground font-medium">Job not found.</p>
          <Link to="/candidate/explore" className="text-sm text-primary mt-2 block">← Back to Explore</Link>
        </GlassCard>
      </div>
    );
  }

  const { scoreBreakdown } = job;

  return (
    <div className="space-y-6 max-w-[860px] mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/candidate/explore" className="hover:text-foreground transition-colors">Explore Jobs</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{job.title}</span>
      </div>

      {/* Hero Card */}
      <GlassCard className="p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center text-lg font-bold text-primary glow-cyan">
            {job.companyLogo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{job.company}</span>
              {job.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-[28px] font-bold text-foreground tracking-tighter mt-1">{job.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{job.type}</span>
          <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{job.locationType}</span>
          <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">{job.experience}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Posted {job.postedAgo}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-warning" />
          <span className="text-sm text-warning font-medium">Closes in {job.closesIn} days</span>
        </div>

        <div className="flex gap-3">
          {hasApplied ? (
            <button disabled className="px-8 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent font-semibold text-sm cursor-not-allowed">
              ✓ Applied
            </button>
          ) : (
            <button onClick={() => setShowApplyModal(true)} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all">
              Apply Now
            </button>
          )}
          <button onClick={() => setSaved(!saved)} className={cn(
            "px-5 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2",
            saved ? "border-primary/30 text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          )}>
            {saved ? <Bookmark className="w-4 h-4 text-primary fill-primary" /> : <Bookmark className="w-4 h-4" />} {saved ? "Saved" : "Save"}
          </button>
        </div>
      </GlassCard>

      {/* Neural Match Card */}
      <div className="relative rounded-2xl p-[1px] overflow-hidden glow-border-animated">
        <GlassCard className="p-8 relative z-10">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">🧠 Your Neural Match</h2>

          <div className="flex flex-col items-center mb-8">
            <PulseOrb score={job.score} size="lg" />
          </div>

          {/* Score bars */}
          <div className="space-y-4 mb-8">
            {[
              { label: "Skills Alignment", value: scoreBreakdown.skills },
              { label: "Experience Fit", value: scoreBreakdown.experience },
              { label: "Culture Match", value: scoreBreakdown.cultureFit },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-mono text-foreground">{bar.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-foreground/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      bar.value >= 80 ? "bg-primary" : bar.value >= 60 ? "bg-warning" : "bg-destructive"
                    )}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skill constellation */}
          <SkillConstellation matched={job.matchedSkills} missing={job.missingSkills} />

          {/* Pro tip */}
          {job.missingSkills.length > 0 && (
            <div className="mt-6 px-4 py-3 rounded-xl glass-card border border-primary/10 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Picking up <span className="text-primary font-medium">{job.missingSkills.slice(0, 3).join(" or ")}</span> could boost your score to <span className="text-accent font-mono font-bold">95%</span>.
              </p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Job Description */}
      <GlassCard className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">About This Role</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.aboutRole}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">What You'll Do</h2>
          <ul className="space-y-2.5">
            {job.whatYoullDo.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">What We Need</h2>
          <ul className="space-y-2.5">
            {job.whatWeNeed ? (
              job.whatWeNeed.map((item: any, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  {item.matched ? (
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <span className={item.matched ? "text-foreground" : "text-muted-foreground"}>
                    {item.skill}
                    {item.matched && <span className="text-xs text-primary ml-2">You have this</span>}
                    {!item.matched && <span className="text-xs text-destructive ml-2">Gap</span>}
                  </span>
                </li>
              ))
            ) : (
              job.skills.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {s}
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Nice to Have</h2>
          <ul className="space-y-2.5">
            {job.niceToHave.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Culture & Values */}
      <GlassCard className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Culture & Values</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {job.cultureValues.map((val: string) => {
            const isMatch = job.matchingValues.includes(val);
            return (
              <span key={val} className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                isMatch ? "bg-primary/10 text-primary border-primary/20 glow-cyan" : "bg-foreground/[0.02] text-muted-foreground border-foreground/[0.06]"
              )}>{val}</span>
            );
          })}
        </div>
        <p className="text-xs text-primary font-medium">{job.matchingValues.length}/{job.cultureValues.length} values align</p>
      </GlassCard>

      {showApplyModal && (
        <ApplyModal 
          job={job} 
          candidateProfile={candidateProfile} 
          onClose={() => setShowApplyModal(false)} 
          onApplied={() => setHasApplied(true)}
        />
      )}
    </div>
  );
}
