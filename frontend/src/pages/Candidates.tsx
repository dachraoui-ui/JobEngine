import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Search, X, Download, Plus, SlidersHorizontal, LayoutGrid, List, Globe, Lock, Mail, Sparkles } from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const SKILL_COLORS: Record<string, string> = {
  React: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10",
  TypeScript: "border-cyan-500/50 text-cyan-400 bg-cyan-500/10",
  "Node.js": "border-cyan-500/50 text-cyan-400 bg-cyan-500/10",
  Python: "border-violet-500/50 text-violet-400 bg-violet-500/10",
  Docker: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
  AWS: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
  GraphQL: "border-amber-500/50 text-amber-400 bg-amber-500/10",
};

const skillPillClass = (skill: string, matched: string[]) =>
  matched.includes(skill)
    ? `${SKILL_COLORS[skill] ?? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10"} border-l-2`
    : "border-foreground/10 text-muted-foreground bg-foreground/5";

const mockCandidates = [
  {
    id: "c1", initials: "AC", avatarColor: "bg-cyan-500/20 text-cyan-400", name: "Alex Chen",
    role: "Full Stack Developer", experience: "4 years", education: "BS Computer Science, MIT",
    score: 92, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "Next.js"], Backend: ["Node.js", "Python"], DevOps: ["Docker", "AWS"] },
    values: ["Remote-First", "Innovation", "Growth"],
  },
  {
    id: "c2", initials: "MR", avatarColor: "bg-violet-500/20 text-violet-400", name: "Maya Rodriguez",
    role: "Frontend Engineer", experience: "3 years", education: "BS Software Engineering, Stanford",
    score: 87, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "Vue.js"], Backend: ["Node.js"], DevOps: [] },
    values: ["Teamwork", "Innovation"],
  },
  {
    id: "c3", initials: "JB", avatarColor: "bg-amber-500/20 text-amber-400", name: "James Boateng",
    role: "Backend Engineer", experience: "6 years", education: "BS Computer Engineering, UC Berkeley",
    score: 84, visibility: "Verified Only",
    skills: { Frontend: [], Backend: ["Python", "Node.js", "Go"], DevOps: ["Docker", "AWS", "Kubernetes"] },
    values: ["Transparency", "Remote-First"],
  },
  {
    id: "c4", initials: "SL", avatarColor: "bg-emerald-500/20 text-emerald-400", name: "Sara Liu",
    role: "DevOps Engineer", experience: "5 years", education: "BS Systems Engineering, Carnegie Mellon",
    score: 79, visibility: "Public",
    skills: { Frontend: [], Backend: ["Python"], DevOps: ["AWS", "Docker", "Terraform", "CI/CD"] },
    values: ["Fast-Paced", "Innovation"],
  },
  {
    id: "c5", initials: "KA", avatarColor: "bg-rose-500/20 text-rose-400", name: "Kenji Aizawa",
    role: "Mobile Developer", experience: "2 years", education: "BS Computer Science, Tokyo University",
    score: 72, visibility: "Public",
    skills: { Frontend: ["React", "React Native"], Backend: ["Node.js"], DevOps: [] },
    values: ["Growth", "Mentorship"],
  },
  {
    id: "c6", initials: "NN", avatarColor: "bg-indigo-500/20 text-indigo-400", name: "Nina Novak",
    role: "Data Scientist", experience: "4 years", education: "MSc Data Science, ETH Zurich",
    score: 76, visibility: "Verified Only",
    skills: { Frontend: [], Backend: ["Python", "R"], DevOps: ["Docker"] },
    values: ["Innovation", "Growth"],
  },
  {
    id: "c7", initials: "TP", avatarColor: "bg-teal-500/20 text-teal-400", name: "Tom Park",
    role: "Solutions Architect", experience: "8 years", education: "BS Computer Science, KAIST",
    score: 95, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript"], Backend: ["Node.js", "Python", "Java"], DevOps: ["AWS", "Docker"] },
    values: ["Remote-First", "Transparency", "Innovation"],
  },
  {
    id: "c8", initials: "ZM", avatarColor: "bg-pink-500/20 text-pink-400", name: "Zoe Martin",
    role: "UI/UX + Frontend Developer", experience: "3 years", education: "BS HCI, Carnegie Mellon",
    score: 81, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "CSS"], Backend: [], DevOps: [] },
    values: ["Teamwork", "Work-Life Balance"],
  },
];

const MATCHED_SKILLS = ["React", "TypeScript", "Node.js"];

// ─── Sub-components ──────────────────────────────────────────────────────────
function SkillPill({ skill, matched }: { skill: string; matched: string[] }) {
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${skillPillClass(skill, matched)}`}>
      {skill}
    </span>
  );
}

function DetailPanel({ candidate, onClose }: { candidate: typeof mockCandidates[0]; onClose: () => void }) {
  const allSkills = Object.values(candidate.skills).flat();
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-full ${candidate.avatarColor} flex items-center justify-center text-2xl font-bold border border-foreground/10 shrink-0`}>
            {candidate.initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{candidate.name}</h2>
            <p className="text-sm text-muted-foreground">{candidate.role}</p>
            <div className="flex items-center gap-2 mt-2">
              {candidate.visibility === "Public"
                ? <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"><Globe className="w-3 h-3" /> Public</span>
                : <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><Lock className="w-3 h-3" /> Verified Only</span>
              }
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-foreground/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Score */}
      <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 font-semibold">AI Match Score</p>
        <div className="flex items-center gap-4">
          <PulseOrb score={candidate.score} size="lg" />
          <div className="flex-1 space-y-3">
            {[["Skills Match", 95], ["Experience", 88], ["Culture Fit", 80]].map(([label, pct]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-emerald-400">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-semibold">Skills</p>
        {Object.entries(candidate.skills).map(([category, skills]) => skills.length > 0 && (
          <div key={category}>
            <p className={`text-xs font-semibold mb-2 ${category === "Frontend" ? "text-cyan-400" : category === "Backend" ? "text-violet-400" : "text-emerald-400"}`}>
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <SkillPill key={s} skill={s} matched={MATCHED_SKILLS} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Experience & Education */}
      <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 mb-6 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-1 font-semibold">Experience</p>
          <p className="text-sm text-white font-mono">{candidate.experience}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-1 font-semibold">Education</p>
          <p className="text-sm text-muted-foreground">{candidate.education}</p>
        </div>
      </div>

      {/* Culture Values */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 font-semibold">Culture Values</p>
        <div className="flex flex-wrap gap-2">
          {candidate.values.map(v => (
            <span key={v} className="px-3 py-1 bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20 text-xs">{v}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <Button variant="outline" className="w-full border-foreground/20 text-white hover:bg-foreground/10">
          <Download className="w-4 h-4 mr-2" /> Download CV
        </Button>
        <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)]">
          <Sparkles className="w-4 h-4 mr-2" /> Invite to Apply
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Candidates() {
  const [searchSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [minScore, setMinScore] = useState(70);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Best Match");
  const [scanned, setScanned] = useState(true);

  const selectedCandidate = mockCandidates.find(c => c.id === selectedId);

  const sorted = [...mockCandidates]
    .filter(c => c.score >= minScore)
    .sort((a, b) => sort === "Best Match" ? b.score - a.score : a.name.localeCompare(b.name));

  return (
    <div className="flex gap-0 h-full animate-fade-in relative">
      {/* Main Content */}
      <div className={`flex-1 min-w-0 space-y-6 pb-10 transition-all duration-300 ${selectedCandidate ? "pr-4" : ""}`}>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-7 h-7 text-cyan-400" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Neural Scanner</h1>
          </div>
          <p className="text-muted-foreground ml-9">Discover and connect with top talent</p>
        </div>

        {/* Search Panel */}
        <GlassCard className="p-6 border-primary/20" glow glowColor="cyan">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">Scan for candidates matching...</p>

          {/* Skills Tag Input */}
          <div className="flex flex-wrap gap-2 mb-4 bg-foreground/5 border border-foreground/10 rounded-lg p-3">
            {searchSkills.map(skill => (
              <span key={skill} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-sm">
                {skill}
                <button className="hover:bg-foreground/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ Add skill..."
              className="flex-1 min-w-[120px] bg-transparent text-white placeholder:text-slate-600 focus:outline-none text-sm"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-6 items-start md:items-center">
            {/* Experience */}
            <div>
              <p className="text-xs text-muted-foreground/80 mb-2 font-medium uppercase tracking-widest">Experience</p>
              <div className="flex gap-4">
                {["Junior", "Mid", "Senior"].map((lvl, i) => (
                  <label key={lvl} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-white">
                    <input
                      type="checkbox"
                      defaultChecked={i > 0}
                      className="accent-cyan-500 w-4 h-4 rounded"
                    />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            {/* Score Slider */}
            <div className="flex-1 min-w-[180px]">
              <div className="flex justify-between mb-2">
                <p className="text-xs text-muted-foreground/80 font-medium uppercase tracking-widest">Min Score</p>
                <span className="text-xs text-cyan-400 font-mono font-bold">{minScore}</span>
              </div>
              <input
                type="range" min={0} max={100} value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-foreground/10 cursor-pointer accent-cyan-400"
                style={{ accentColor: '#00D4FF' }}
              />
            </div>

            {/* Availability */}
            <div>
              <p className="text-xs text-muted-foreground/80 mb-2 font-medium uppercase tracking-widest">Availability</p>
              <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5">
                {["All", "Active", "Open"].map((opt, i) => (
                  <button key={opt} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${i === 2 ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-white"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scan Actions */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-foreground/10">
            <Button
              onClick={() => setScanned(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            >
              <Search className="w-4 h-4 mr-2" /> Scan 🔍
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-foreground/10">
              Clear
            </Button>
          </div>
        </GlassCard>

        {/* Results Bar */}
        {scanned && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-muted-foreground">
              <span className="text-white font-bold font-mono">{sorted.length}</span> candidates found
            </p>
            <div className="flex items-center gap-3">
              <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5">
                {["Best Match", "Experience", "Recent"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sort === s ? "bg-foreground/10 text-white" : "text-muted-foreground hover:text-white"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-foreground/10 text-white" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-foreground/10 text-white" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Grid */}
        {scanned && (
          <div className={view === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "space-y-3"}>
            {sorted.map(candidate => {
              const allSkills = Object.values(candidate.skills).flat().slice(0, 5);
              const isSelected = selectedId === candidate.id;
              return (
                <GlassCard
                  key={candidate.id}
                  className={`p-5 flex gap-4 cursor-pointer transition-all duration-200 hover:border-cyan-500/30 hover:-translate-y-0.5 ${isSelected ? "border-cyan-500/50 shadow-[0_0_20px_rgba(0,212,255,0.1)]" : ""}`}
                  onClick={() => setSelectedId(isSelected ? null : candidate.id)}
                >
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full ${candidate.avatarColor} flex items-center justify-center text-xl font-bold border border-foreground/10 shrink-0`}>
                    {candidate.initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <PulseOrb score={candidate.score} size="md" />
                        {candidate.visibility === "Public"
                          ? <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"><Globe className="w-2.5 h-2.5" /> Public</span>
                          : <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"><Lock className="w-2.5 h-2.5" /> Verified</span>
                        }
                      </div>
                    </div>

                    <p className="text-sm font-mono text-cyan-400 mb-1">{candidate.experience} experience</p>
                    <p className="text-xs text-muted-foreground/80 mb-3">{candidate.education}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {allSkills.map(skill => <SkillPill key={skill} skill={skill} matched={MATCHED_SKILLS} />)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-foreground/20 text-muted-foreground hover:bg-foreground/10 text-xs">
                        View Profile
                      </Button>
                      <Button size="sm" className="bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-xs">
                        <Mail className="w-3.5 h-3.5 mr-1.5" /> Invite to Apply
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide Panel */}
      <div className={`shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${selectedCandidate ? "w-[440px] opacity-100 pl-6" : "w-0 opacity-0"}`}>
        {selectedCandidate && (
          <div className="w-[440px] sticky top-0 h-[calc(100vh-6rem)] overflow-y-auto">
            <GlassCard className="p-6 h-full border-foreground/10 shadow-[-20px_0_60px_rgba(0,0,0,0.3)]">
              <DetailPanel candidate={selectedCandidate} onClose={() => setSelectedId(null)} />
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
