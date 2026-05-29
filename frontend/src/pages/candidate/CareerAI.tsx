import { BrainCircuit, Star, Target, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip, PolarRadiusAxis } from "recharts";

const skillData = [
  { subject: "Frontend", A: 85, B: 90, fullMark: 100 },
  { subject: "Backend", A: 65, B: 80, fullMark: 100 },
  { subject: "DevOps", A: 40, B: 60, fullMark: 100 },
  { subject: "Databases", A: 75, B: 85, fullMark: 100 },
  { subject: "AI/ML", A: 20, B: 50, fullMark: 100 },
  { subject: "Soft Skills", A: 90, B: 85, fullMark: 100 },
];

export default function CareerAI() {
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
                <p className="text-sm text-muted-foreground">Last scan: 2 hours ago</p>
              </div>
              <Button variant="outline" className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300">Re-scan</Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Main Visual */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={60 * 2 * Math.PI} strokeDashoffset={60 * 2 * Math.PI * (1 - 0.74)} className="text-cyan-400 transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-foreground shadow-[0_0_15px_rgba(0,212,255,0.3)]">74</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <span className="mt-4 font-medium text-emerald-400">CV Strength: Good</span>
              </div>

              {/* Strengths & Improvements */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 w-fit px-3 py-1 rounded-full">Strengths</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Strong technical skills — 12 relevant technologies</li>
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Clear career progression — 4 years, 2 companies</li>
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Education matches target roles</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest bg-amber-400/10 w-fit px-3 py-1 rounded-full">Improvements</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-rose-500/20"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Add quantifiable achievements (metrics, numbers)</li>
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-amber-500/20"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Missing professional summary section</li>
                    <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Consider adding relevant certifications</li>
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
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
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
          </div>

          <div className="mt-6 space-y-3">
            {[
              { skill: "Docker", current: "Beginner", needed: "Advanced", gap: "HIGH GAP", color: "bg-rose-500/20 text-rose-400" },
              { skill: "Kubernetes", current: "None", needed: "Intermediate", gap: "CRITICAL", color: "bg-rose-500/20 text-rose-400" },
              { skill: "GraphQL", current: "Beginner", needed: "Intermediate", gap: "MEDIUM", color: "bg-amber-500/20 text-amber-400" },
            ].map((gap, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-foreground/5 border border-foreground/5 gap-3">
                <div className="flex-1">
                  <span className="font-semibold text-foreground block mb-1">{gap.skill}</span>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground w-full sm:w-48">
                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 bg-cyan-400" style={{ width: gap.current === 'None' ? '5%' : '30%' }} />
                    </div>
                    <span>vs</span>
                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 bg-violet-400" style={{ width: gap.needed === 'Advanced' ? '85%' : '50%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${gap.color}`}>{gap.gap}</span>
                  <a href="#" className="flex items-center text-sm text-cyan-400 hover:text-cyan-300">📚 Learn</a>
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
            {/* Path 1 */}
            <div className="border-t-2 border-t-cyan-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-cyan-400 transition-colors">Full Stack → Tech Lead</h3>
                  <p className="text-sm text-cyan-500 mt-0.5">~2-3 years journey • $130k—$180k</p>
                </div>
                <PulseOrb score={72} size="md" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Leadership</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">System Design</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Architecture</span>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-sm text-cyan-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
              </div>
            </div>

            {/* Path 2 */}
            <div className="border-t-2 border-t-violet-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-violet-400 transition-colors">Full Stack → DevOps Engineer</h3>
                  <p className="text-sm text-violet-400 mt-0.5">~1-2 years journey • $120k—$170k</p>
                </div>
                <PulseOrb score={68} size="md" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Docker</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Kubernetes</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">CI/CD</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">AWS</span>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-sm text-violet-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
              </div>
            </div>

            {/* Path 3 */}
            <div className="border-t-2 border-t-emerald-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-emerald-400 transition-colors">Full Stack → Solutions Architect</h3>
                  <p className="text-sm text-emerald-400 mt-0.5">~3-5 years journey • $150k—$200k</p>
                </div>
                <PulseOrb score={55} size="md" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Cloud Architecture</span>
                <span className="px-2 py-1 bg-foreground/5 text-muted-foreground rounded text-xs border border-foreground/10">Microservices</span>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-sm text-emerald-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>
    </div>
  );
}
