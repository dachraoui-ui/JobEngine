import { useState, useEffect } from "react";
import { BrainCircuit, CheckCircle2, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip, PolarRadiusAxis } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";

interface SkillGalaxyItem {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

interface SkillGapItem {
  skill: string;
  current: string;
  needed: string;
  gap: string;
  color: string;
}

interface CareerPathwayItem {
  title: string;
  duration: string;
  salary: string;
  score: number;
  skills: string[];
}

export default function CareerAI() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [reScanning, setReScanning] = useState(false);
  const [cvScore, setCvScore] = useState(74);
  const [cvStrengthLabel, setCvStrengthLabel] = useState("Good");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [skillGalaxy, setSkillGalaxy] = useState<SkillGalaxyItem[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [pathways, setPathways] = useState<CareerPathwayItem[]>([]);

  const fetchAdviceData = async (isRescan = false) => {
    if (!user) return;
    if (isRescan) setReScanning(true);
    else setLoading(true);

    try {
      // 1. Fetch Candidate Profile to get real skills and experience level
      const profileRes = await api.get(`/users/${user.id}/candidate-profile`);
      const profile = profileRes.data.data;
      const skills = profile?.skills ?? [];
      const expLevel = profile?.experienceLevel ?? "JUNIOR";

      // Map experience string to int years
      let yearsExperience = 1;
      if (expLevel === "MID") yearsExperience = 4;
      else if (expLevel === "SENIOR") yearsExperience = 8;

      // 2. Query AI/fallback advice from the backend
      const adviceRes = await api.post("/matching/career-advice", {
        skills,
        yearsExperience,
        targetJobTitles: ["Full Stack Engineer", "DevOps Engineer", "Solutions Architect"]
      });

      const data = adviceRes.data.data;
      if (data) {
        setCvScore(data.cvScore ?? 60);
        setCvStrengthLabel(data.cvStrengthLabel ?? "Good");
        setStrengths(data.strengths ?? []);
        setImprovements(data.improvements ?? []);
        setSkillGalaxy(data.skillGalaxy ?? []);
        setSkillGaps(data.skillGaps ?? []);
        setPathways(data.pathways ?? []);
      }

      if (isRescan) {
        toast.success("Neural scan refreshed successfully!");
      }
    } catch (err) {
      console.error("Failed to perform neural scan", err);
      toast.error("Could not complete the neural scan. Please try again.");
    } finally {
      setLoading(false);
      setReScanning(false);
    }
  };

  useEffect(() => {
    fetchAdviceData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-pulse">
        <div className="relative w-24 h-24">
          {/* Cybernetic outer spinning rings */}
          <div className="absolute inset-0 rounded-full border-4 border-t-violet-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin duration-1000" />
          <div className="absolute inset-2 rounded-full border-4 border-b-violet-400 border-t-transparent border-l-cyan-400 border-r-transparent animate-spin duration-700" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-4 rounded-full bg-violet-950/40 border border-violet-500/30 flex items-center justify-center">
            <BrainCircuit className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Initializing Neural Scan...</h2>
          <p className="text-sm text-muted-foreground animate-pulse text-center max-w-xs">Comparing profile skills against global tech industry talent requirements.</p>
        </div>
      </div>
    );
  }

  const borderColors = ["border-t-cyan-400", "border-t-violet-400", "border-t-emerald-400"];
  const textColors = ["text-cyan-400", "text-violet-400", "text-emerald-400"];
  const hoverColors = ["hover:text-cyan-400", "hover:text-violet-400", "hover:text-emerald-400"];

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-violet-400" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Neural Lab</h1>
        </div>
        <p className="text-muted-foreground">AI-powered career intelligence and skill gap analysis.</p>
      </div>

      {/* Ambient background effects */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: CV Neural Scan */}
        <GlassCard className="p-0 border-violet-500/20 relative overflow-hidden group col-span-1 lg:col-span-2">
          <div className="absolute inset-0 border-[2px] border-transparent transition-all duration-1000 group-hover:border-violet-500/30 rounded-2xl" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(139,92,246,0.1)) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">CV Neural Scan</h2>
                <p className="text-sm text-muted-foreground">Real-time matching profile assessment</p>
              </div>
              <Button 
                variant="outline" 
                disabled={reScanning}
                onClick={() => fetchAdviceData(true)}
                className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
              >
                {reScanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Re-scan
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Main Visual */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={60 * 2 * Math.PI} strokeDashoffset={60 * 2 * Math.PI * (1 - cvScore / 100)} className="text-cyan-400 transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-foreground shadow-[0_0_15px_rgba(0,212,255,0.3)]">{cvScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <span className="mt-4 font-medium text-emerald-400">CV Strength: {cvStrengthLabel}</span>
              </div>

              {/* Strengths & Improvements */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 w-fit px-3 py-1 rounded-full">Strengths</h3>
                  <ul className="space-y-3">
                    {strengths.length > 0 ? (
                      strengths.map((str, index) => (
                        <li key={index} className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10 animate-fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> 
                          {str}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground bg-foreground/5 p-3.5 rounded-lg border border-foreground/10 italic">
                        No technical strengths recorded yet. Update your skills in your Profile to scan again!
                      </li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 w-fit px-3 py-1 rounded-full">Improvements</h3>
                  <ul className="space-y-3">
                    {improvements.length > 0 ? (
                      improvements.map((imp, index) => (
                        <li key={index} className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-amber-500/20 animate-fade-in">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" /> 
                          {imp}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground bg-foreground/5 p-3.5 rounded-lg border border-foreground/10 italic">
                        No critical improvements suggestions generated. Make sure your profile has recent skills!
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 2: Skill Galaxy */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Skill Galaxy</h2>
              <p className="text-sm text-muted-foreground mt-1">Your skills mapped against market demand</p>
            </div>
          </div>

          <div className="h-[280px] w-full mt-4 flex items-center justify-center">
            {skillGalaxy.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillGalaxy}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: 13 }}
                  />
                  {/* Market Demand (Outlined) */}
                  <Radar name="Market Demand" dataKey="B" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                  {/* You (Filled) */}
                  <Radar name="You" dataKey="A" stroke="#00D4FF" strokeWidth={2} fill="#00D4FF" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center p-6 border border-dashed border-border rounded-xl w-full h-full bg-foreground/[0.02]">
                <BrainCircuit className="w-10 h-10 text-muted-foreground/40 animate-pulse" />
                <p className="text-sm text-muted-foreground max-w-xs">Restart your backend server to load and chart your Dynamic Skill Galaxy.</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {skillGaps.map((gap, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-foreground/5 border border-foreground/5 gap-3">
                <div className="flex-1">
                  <span className="font-semibold text-foreground block mb-1">{gap.skill}</span>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground w-full sm:w-48">
                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 bg-cyan-400" style={{ width: gap.current === 'None' ? '5%' : gap.current === 'Beginner' ? '35%' : '65%' }} />
                    </div>
                    <span>vs</span>
                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 bg-violet-400" style={{ width: gap.needed === 'Advanced' ? '90%' : '65%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${gap.color}`}>{gap.gap}</span>
                  <a 
                    href={`https://www.google.com/search?q=learn+${encodeURIComponent(gap.skill)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    📚 Learn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* SECTION 3: Neural Pathways */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-1">Neural Pathways</h2>
          <p className="text-sm text-muted-foreground mb-6">AI-generated career trajectories</p>

          <div className="space-y-4">
            {pathways.length > 0 ? (
              pathways.map((path, idx) => {
                const borderCol = borderColors[idx % borderColors.length];
                const textCol = textColors[idx % textColors.length];
                const hoverCol = hoverColors[idx % hoverColors.length];

                return (
                  <div key={idx} className={`border-t-2 ${borderCol} bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-semibold text-lg text-foreground group-hover:${textCol} transition-colors`}>{path.title}</h3>
                        <p className={`text-sm ${textCol} mt-0.5`}>{path.duration} • {path.salary}</p>
                      </div>
                      <PulseOrb score={path.score} size="md" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {path.skills.map((sk) => (
                        <span key={sk} className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">
                          {sk}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(path.title)}`} 
                        target="_blank"
                        rel="noreferrer" 
                        className={`text-sm ${textCol} ${hoverCol} group-hover:underline flex items-center gap-1`}
                      >
                        Explore Path <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground bg-foreground/5 p-4 rounded-xl border border-foreground/10 italic text-center">
                Restart backend to load tailored career paths.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
