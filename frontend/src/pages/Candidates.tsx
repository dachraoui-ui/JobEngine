import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, LayoutGrid, List, Globe, Lock, Mail, Sparkles, Check, Loader2, ArrowLeft, UserPlus, Phone, Briefcase, Tag, Compass } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Candidate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  
  // Profile fields
  skills: string[] | null;
  experienceLevel: "JUNIOR" | "MID" | "SENIOR" | null;
  values: string[] | null;
  visibility: "PUBLIC" | "VERIFIED_ONLY" | "PRIVATE" | null;
  cvId: string | null;
}

const skillPillClass = (skill: string, searchSkills: string[]) => {
  const isMatched = searchSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  if (isMatched) {
    return "border-violet-500/50 text-violet-700 dark:text-violet-300 bg-violet-500/20 border-l-2";
  }
  return "border-foreground/10 text-muted-foreground bg-foreground/5";
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "CN";
};

const getAvatarBg = (id: string) => {
  const colors = [
    "bg-violet-500/20 text-violet-600 dark:text-violet-400",
    "bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400",
    "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    "bg-amber-500/20 text-amber-600 dark:text-amber-400",
    "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    "bg-rose-500/20 text-rose-600 dark:text-rose-400"
  ];
  if (!id) return colors[0];
  const charCodeSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const calculateScore = (c: Partial<Candidate>) => {
  let score = 30; // base for registration
  if (c.phone) score += 15;
  if (c.isVerified) score += 15;
  if (c.skills && c.skills.length > 0) score += 20;
  if (c.values && c.values.length > 0) score += 20;
  return Math.min(100, score);
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function SkillPill({ skill, searchSkills }: { skill: string; searchSkills: string[] }) {
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${skillPillClass(skill, searchSkills)}`}>
      {skill}
    </span>
  );
}

function DetailPanel({ 
  candidate, 
  onClose,
  onAssign
}: { 
  candidate: Candidate; 
  onClose: () => void;
  onAssign: (c: Candidate) => void;
}) {
  const allSkills = candidate.skills || [];
  const score = calculateScore(candidate);
  
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-full ${getAvatarBg(candidate.id)} flex items-center justify-center text-2xl font-bold border border-foreground/10 shrink-0`}>
            {getInitials(candidate.firstName, candidate.lastName)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
              {candidate.firstName} {candidate.lastName}
            </h2>
            <p className="text-sm text-muted-foreground break-all">{candidate.email}</p>
            {candidate.phone && (
              <p className="text-xs text-muted-foreground/80 mt-0.5 font-mono">{candidate.phone}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {candidate.visibility === "PUBLIC" || !candidate.visibility ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                  <Globe className="w-3 h-3" /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium">
                  <Lock className="w-3 h-3" /> Verified Only
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-foreground/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Score */}
      <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 font-bold">Profile Completeness</p>
        <div className="flex items-center gap-4">
          <PulseOrb score={score} size="lg" />
          <div className="flex-1 space-y-3">
            {[
              ["Contact Details & Verification", candidate.isVerified ? 100 : 50],
              ["Skills Inventory", candidate.skills && candidate.skills.length > 0 ? 100 : 0],
              ["Preferences & Culture Values", candidate.values && candidate.values.length > 0 ? 100 : 0]
            ].map(([label, pct]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="text-violet-600 dark:text-violet-400 font-bold">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 dark:bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-4 mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold">Skills Inventory</p>
        {allSkills.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(s => <SkillPill key={s} skill={s} searchSkills={[]} />)}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
        )}
      </div>

      {/* Experience & Education */}
      <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-4 mb-6 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-1 font-bold">Experience Level</p>
          <p className="text-sm text-slate-800 dark:text-slate-200 font-mono font-bold capitalize">
            {candidate.experienceLevel ? candidate.experienceLevel.toLowerCase() : "Not Specified"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-1 font-bold">Registration Date</p>
          <p className="text-sm text-muted-foreground font-mono">
            {new Date(candidate.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Culture Values */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 font-bold">Culture Values</p>
        {candidate.values && candidate.values.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.values.map(v => (
              <span key={v} className="px-3 py-1 bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-full border border-violet-500/20 text-xs font-semibold">
                {v}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No values listed yet.</p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <Button 
          onClick={() => onAssign(candidate)}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2" /> Assign to Job / Pipeline
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout View State: "list" or "add"
  const [activeView, setActiveView] = useState<"list" | "add">("list");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSkills, setSearchSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceFilters, setExperienceFilters] = useState<string[]>(["JUNIOR", "MID", "SENIOR"]);
  const [minScore, setMinScore] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Recent");

  // Modals state
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningCandidate, setAssigningCandidate] = useState<Candidate | null>(null);
  const [assignJobId, setAssignJobId] = useState("");
  
  // Submit loadings
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Add candidate form state
  const [newCandidate, setNewCandidate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
    experienceLevel: "MID",
    values: "",
    location: "",
    jobType: "FULL_TIME",
    remoteOk: false
  });

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/candidates");
      setCandidates(res.data.data || []);
    } catch (error: any) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(res.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!searchSkills.includes(skillInput.trim())) {
        setSearchSkills([...searchSkills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSearchSkills(searchSkills.filter(s => s !== skill));
  };

  const handleExperienceCheckbox = (level: string) => {
    if (experienceFilters.includes(level)) {
      setExperienceFilters(experienceFilters.filter(item => item !== level));
    } else {
      setExperienceFilters([...experienceFilters, level]);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Register candidate user
      const registerRes = await api.post("/auth/register", {
        email: newCandidate.email,
        password: newCandidate.password,
        firstName: newCandidate.firstName,
        lastName: newCandidate.lastName,
        phone: newCandidate.phone,
        role: "CANDIDATE"
      });

      const userId = registerRes.data.data?.userId || registerRes.data.data?.id;
      if (!userId) {
        throw new Error("Could not retrieve user ID from response");
      }

      // 2. Update their candidate profile
      const skillsArray = newCandidate.skills
        ? newCandidate.skills.split(",").map(s => s.trim()).filter(s => s.length > 0)
        : [];
      const valuesArray = newCandidate.values
        ? newCandidate.values.split(",").map(v => v.trim()).filter(v => v.length > 0)
        : [];

      await api.put(`/users/${userId}/candidate-profile`, {
        skills: skillsArray,
        experienceLevel: newCandidate.experienceLevel,
        values: valuesArray,
        preferences: {
          jobType: newCandidate.jobType,
          location: newCandidate.location,
          remoteOk: newCandidate.remoteOk
        }
      });

      Swal.fire({
        title: "Registered!",
        text: "Candidate has been successfully registered and profile populated.",
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        color: document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a"
      });

      setNewCandidate({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        skills: "",
        experienceLevel: "MID",
        values: "",
        location: "",
        jobType: "FULL_TIME",
        remoteOk: false
      });
      
      setActiveView("list");
      fetchCandidates();
    } catch (error: any) {
      console.error("Error adding candidate:", error);
      toast.error(error?.response?.data?.message || "Failed to register candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignClick = (c: Candidate) => {
    setAssigningCandidate(c);
    setAssignJobId("");
    setAssignModalOpen(true);
  };

  const handleAssignCandidate = async () => {
    if (!assigningCandidate || !assignJobId) return;
    setIsAssigning(true);
    try {
      await api.post("/applications/recruiter-add", {
        candidateId: assigningCandidate.id,
        jobId: assignJobId
      });
      
      Swal.fire({
        title: "Assigned!",
        text: `${assigningCandidate.firstName} has been successfully added to the job pipeline.`,
        icon: "success",
        confirmButtonColor: "#8b5cf6",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        color: document.documentElement.classList.contains("dark") ? "#f8fafc" : "#0f172a"
      });
      
      setAssignModalOpen(false);
      setAssignJobId("");
      setAssigningCandidate(null);
    } catch (error: any) {
      console.error("Error assigning candidate:", error);
      toast.error(error?.response?.data?.message || "Failed to assign candidate to job");
    } finally {
      setIsAssigning(false);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedId);

  // Filter logic
  const filtered = candidates
    .filter(c => {
      const score = calculateScore(c);
      if (score < minScore) return false;

      const nameEmailPhone = `${c.firstName} ${c.lastName} ${c.email} ${c.phone || ""}`.toLowerCase();
      if (searchQuery && !nameEmailPhone.includes(searchQuery.toLowerCase())) return false;

      // Filter by experience Level (JUNIOR, MID, SENIOR)
      const matchesExperience = experienceFilters.length === 0 || 
        (c.experienceLevel && experienceFilters.includes(c.experienceLevel));
      if (!matchesExperience) return false;

      // Filter by skills
      const matchesSkills = searchSkills.length === 0 ||
        searchSkills.every(s => 
          c.skills && c.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
        );
      if (!matchesSkills) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "Best Match") {
        return calculateScore(b) - calculateScore(a);
      } else if (sort === "Name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="h-full relative text-slate-800 dark:text-slate-100 overflow-x-hidden">
      
      {activeView === "list" ? (
        /* ─── DIRECTORY LIST VIEW ─────────────────────────────────────────── */
        <div className="space-y-6 pb-10 animate-fade-in">
          
          {/* Header */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-7 h-7 text-violet-500" />
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Neural Scanner</h1>
              </div>
              <p className="text-muted-foreground ml-9 font-medium">Discover and connect with top talent</p>
            </div>

            <Button 
              onClick={() => setActiveView("add")}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Candidate
            </Button>
          </div>

          {/* Search Panel */}
          <GlassCard className="p-6 border-violet-500/20" glow glowColor="violet">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Scan for candidates...</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 text-sm"
                />
              </div>

              {/* Skills Tag Input */}
              <div className="flex flex-wrap gap-2 bg-foreground/5 border border-foreground/10 rounded-lg p-2 min-h-[40px] items-center">
                {searchSkills.map(skill => (
                  <span key={skill} className="flex items-center gap-1.5 pl-3 pr-1.5 py-0.5 bg-violet-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-semibold">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:bg-foreground/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={searchSkills.length === 0 ? "Filter by skills (Press Enter to add)..." : "+ Add skill..."}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 min-w-[150px] bg-transparent text-slate-900 dark:text-white placeholder:text-muted-foreground focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-6 items-start md:items-center">
              {/* Experience */}
              <div>
                <p className="text-xs text-muted-foreground/80 mb-2 font-bold uppercase tracking-widest">Experience</p>
                <div className="flex gap-4">
                  {["JUNIOR", "MID", "SENIOR"].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
                      <input
                        type="checkbox"
                        checked={experienceFilters.includes(lvl)}
                        onChange={() => handleExperienceCheckbox(lvl)}
                        className="accent-violet-500 w-4 h-4 rounded"
                      />
                      {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>

              {/* Score Slider */}
              <div className="flex-1 min-w-[180px]">
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-muted-foreground/80 font-bold uppercase tracking-widest">Min Completeness</p>
                  <span className="text-xs text-violet-600 dark:text-violet-400 font-mono font-bold">{minScore}%</span>
                </div>
                <input
                  type="range" min={0} max={100} value={minScore}
                  onChange={e => setMinScore(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-foreground/10 cursor-pointer accent-violet-500"
                  style={{ accentColor: "#8b5cf6" }}
                />
              </div>
            </div>
          </GlassCard>

          {/* Results Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-muted-foreground font-medium">
              <span className="text-slate-900 dark:text-white font-bold font-mono">{filtered.length}</span> candidates found
            </p>
            <div className="flex items-center gap-3">
              <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5">
                {["Best Match", "Name", "Recent"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${sort === s ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-slate-900 dark:hover:text-white"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-0.5">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-foreground/10 text-slate-900 dark:text-white" : "text-muted-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-foreground/10 text-slate-900 dark:text-white" : "text-muted-foreground"}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
              <p className="text-muted-foreground text-sm font-medium">Scanning candidates database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Candidates Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                There are no candidates matching your current scan filters. Clear some criteria or add a new candidate.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSearchSkills([]);
                  setMinScore(0);
                  setExperienceFilters(["JUNIOR", "MID", "SENIOR"]);
                }}
                className="border-foreground/20 text-slate-900 dark:text-white hover:bg-foreground/10"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            /* Candidates List/Grid */
            <div className={view === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4 animate-fade-in" : "space-y-3 animate-fade-in"}>
              {filtered.map(candidate => {
                const allSkills = candidate.skills || [];
                const isSelected = selectedId === candidate.id;
                const score = calculateScore(candidate);
                return (
                  <GlassCard
                    key={candidate.id}
                    className={`p-5 flex gap-4 cursor-pointer transition-all duration-200 hover:border-violet-500/30 hover:-translate-y-0.5 ${isSelected ? "border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]" : ""}`}
                    onClick={() => setSelectedId(isSelected ? null : candidate.id)}
                  >
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-full ${getAvatarBg(candidate.id)} flex items-center justify-center text-xl font-bold border border-foreground/10 shrink-0`}>
                      {getInitials(candidate.firstName, candidate.lastName)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5 break-all">{candidate.email}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <PulseOrb score={score} size="md" />
                          {candidate.visibility === "PUBLIC" || !candidate.visibility ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold"><Globe className="w-2.5 h-2.5" /> Public</span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold"><Lock className="w-2.5 h-2.5" /> Verified</span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-mono text-violet-600 dark:text-violet-400 mb-1 font-bold capitalize">
                        {candidate.experienceLevel ? candidate.experienceLevel.toLowerCase() : "No experience listed"}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mb-3">Registered on {new Date(candidate.createdAt).toLocaleDateString()}</p>

                      {/* Skills */}
                      {allSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {allSkills.slice(0, 5).map(skill => (
                            <SkillPill key={skill} skill={skill} searchSkills={searchSkills} />
                          ))}
                          {allSkills.length > 5 && (
                            <span className="text-[10px] text-muted-foreground bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded font-medium">
                              +{allSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-foreground/20 text-slate-800 dark:text-slate-200 hover:bg-foreground/10 text-xs font-semibold"
                          onClick={() => setSelectedId(isSelected ? null : candidate.id)}
                        >
                          {isSelected ? "Hide Profile" : "View Profile"}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignClick(candidate)}
                          className="bg-transparent border border-violet-500/50 text-violet-700 dark:text-violet-400 hover:bg-violet-500/10 text-xs font-semibold"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" /> Assign to Job
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ─── ADD CANDIDATE PREMIER PAGE VIEW ──────────────────────────────── */
        <div className="space-y-6 pb-10 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-foreground/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveView("list")}
                className="p-2 rounded-full border border-foreground/10 bg-foreground/5 text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-foreground/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-violet-500" />
                  Add New Candidate
                </h1>
                <p className="text-sm text-muted-foreground">Register account and build a searchable professional candidate profile</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveView("list")} 
              className="border-foreground/20 text-slate-900 dark:text-white hover:bg-foreground/10"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Pane: Interactive Dynamic Preview Card */}
            <div className="space-y-6 lg:sticky lg:top-4">
              <div className="p-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Real-time Profile Preview</p>
                <GlassCard className="p-5 flex gap-4 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden bg-background/50">
                  
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xl font-bold border border-foreground/10 shrink-0">
                    {getInitials(newCandidate.firstName, newCandidate.lastName) || "?"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {newCandidate.firstName || "First Name"} {newCandidate.lastName || "Last Name"}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{newCandidate.email || "email@candidate.com"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <PulseOrb score={calculateScore({
                          email: newCandidate.email,
                          firstName: newCandidate.firstName,
                          lastName: newCandidate.lastName,
                          phone: newCandidate.phone,
                          skills: newCandidate.skills ? newCandidate.skills.split(",").map(s => s.trim()).filter(s => s) : [],
                          values: newCandidate.values ? newCandidate.values.split(",").map(v => v.trim()).filter(v => v) : [],
                          isVerified: true
                        })} size="md" />
                      </div>
                    </div>

                    <p className="text-sm font-mono text-violet-600 dark:text-violet-400 mb-1 font-bold capitalize">
                      {newCandidate.experienceLevel ? newCandidate.experienceLevel.toLowerCase() : "MID"} experience
                    </p>
                    <p className="text-xs text-muted-foreground/80 mb-3 truncate">{newCandidate.phone || "No phone listed"}</p>

                    {/* Skills tags */}
                    {newCandidate.skills && newCandidate.skills.trim() ? (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {newCandidate.skills.split(",").slice(0, 4).map(skill => skill.trim() && (
                          <span key={skill} className="px-2 py-0.5 rounded border border-foreground/10 text-muted-foreground bg-foreground/5 text-xs font-semibold">
                            {skill.trim()}
                          </span>
                        ))}
                        {newCandidate.skills.split(",").length > 4 && (
                          <span className="text-[10px] text-muted-foreground bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded font-medium">
                            +{newCandidate.skills.split(",").length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic mb-4">No skills entered yet.</p>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Dynamic Hints */}
              <GlassCard className="p-5 border-foreground/10 bg-foreground/5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <Compass className="w-4 h-4 text-violet-500" />
                  Neural Scanning Tip
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Adding precise **skills comma-separated** matches candidate queries faster during recruiter keyword scans. Dynamic profile completeness ranks their matches significantly higher in the "Neural Scanner" results.
                </p>
              </GlassCard>
            </div>

            {/* Right Pane: Spectacular Glass Form */}
            <div className="lg:col-span-2">
              <GlassCard className="p-8 border-violet-500/20" glow glowColor="violet">
                <form onSubmit={handleAddCandidate} className="space-y-6">
                  
                  {/* Account Information Section */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
                      1. Account Registration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">First Name *</label>
                        <input
                          type="text" required
                          placeholder="e.g. Jean"
                          value={newCandidate.firstName}
                          onChange={e => setNewCandidate({...newCandidate, firstName: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Last Name *</label>
                        <input
                          type="text" required
                          placeholder="e.g. Dupont"
                          value={newCandidate.lastName}
                          onChange={e => setNewCandidate({...newCandidate, lastName: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email Address *</label>
                        <input
                          type="email" required
                          placeholder="candidate@email.com"
                          value={newCandidate.email}
                          onChange={e => setNewCandidate({...newCandidate, email: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Password *</label>
                        <input
                          type="password" required
                          placeholder="••••••••"
                          value={newCandidate.password}
                          onChange={e => setNewCandidate({...newCandidate, password: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Details Section */}
                  <div className="pt-4 border-t border-foreground/10">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
                      2. Professional Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-violet-500" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+216 99 999 999"
                          value={newCandidate.phone}
                          onChange={e => setNewCandidate({...newCandidate, phone: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-violet-500" /> Experience Level
                        </label>
                        <select
                          value={newCandidate.experienceLevel}
                          onChange={e => setNewCandidate({...newCandidate, experienceLevel: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        >
                          <option value="JUNIOR">Junior (1-2 years)</option>
                          <option value="MID">Mid (3-4 years)</option>
                          <option value="SENIOR">Senior (5+ years)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-violet-500" /> Technical Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. React, TypeScript, Node.js, Python, MongoDB"
                          value={newCandidate.skills}
                          onChange={e => setNewCandidate({...newCandidate, skills: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Culture Values (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Remote-First, Collaboration, Transparency, Autonomy"
                          value={newCandidate.values}
                          onChange={e => setNewCandidate({...newCandidate, values: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Career Preferences Section */}
                  <div className="pt-4 border-t border-foreground/10">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
                      3. Preferences & Logistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Location Preference</label>
                        <input
                          type="text"
                          placeholder="e.g. Tunis, Tunisia"
                          value={newCandidate.location}
                          onChange={e => setNewCandidate({...newCandidate, location: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Job Style</label>
                        <select
                          value={newCandidate.jobType}
                          onChange={e => setNewCandidate({...newCandidate, jobType: e.target.value})}
                          className="w-full px-3.5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-violet-500/50 transition-all focus:ring-1 focus:ring-violet-500/20"
                        >
                          <option value="FULL_TIME">Full Time</option>
                          <option value="PART_TIME">Part Time</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="INTERNSHIP">Internship</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 md:pt-7">
                        <input
                          type="checkbox"
                          id="remoteOk"
                          checked={newCandidate.remoteOk}
                          onChange={e => setNewCandidate({...newCandidate, remoteOk: e.target.checked})}
                          className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
                        />
                        <label htmlFor="remoteOk" className="text-sm text-slate-800 dark:text-slate-200 cursor-pointer font-bold select-none">
                          Open to Remote Work
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submission Actions */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-foreground/10">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveView("list")} 
                      className="border-foreground/20 text-slate-900 dark:text-white hover:bg-foreground/10"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all gap-1.5"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Register Candidate
                    </Button>
                  </div>

                </form>
              </GlassCard>
            </div>

          </div>

        </div>
      )}

      {/* ─── FIXED SLIDING OVERLAY PANEL DRAWER (NO SCROLL INTERFERENCE) ─────── */}
      {selectedCandidate && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          onClick={() => setSelectedId(null)}
        />
      )}

      <div className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-l border-foreground/10 p-6 shadow-[-10px_0_30px_rgba(0,0,0,0.15)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out ${selectedCandidate ? "translate-x-0" : "translate-x-full"}`}>
        {selectedCandidate && (
          <DetailPanel 
            candidate={selectedCandidate} 
            onClose={() => setSelectedId(null)} 
            onAssign={handleAssignClick}
          />
        )}
      </div>

      {/* ─── ASSIGN TO JOB DIALOG MODAL ────────────────────────────────────── */}
      {isAssignModalOpen && assigningCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-md border-violet-500/30 p-6 flex flex-col gap-6 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-foreground/10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Assign to Job / Pipeline
              </h2>
              <button onClick={() => setAssignModalOpen(false)} className="text-muted-foreground hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Assign <span className="font-bold text-slate-900 dark:text-white">{assigningCandidate.firstName} {assigningCandidate.lastName}</span> to one of your active jobs:
              </p>

              {jobs.length === 0 ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-semibold">
                  You don't have any active jobs. Create a job first to assign candidates.
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Select Job</label>
                  <select
                    value={assignJobId}
                    onChange={e => setAssignJobId(e.target.value)}
                    className="w-full px-3 py-2 bg-foreground/5 border border-foreground/10 rounded-lg text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="">-- Choose Job --</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-foreground/10">
              <Button variant="outline" onClick={() => setAssignModalOpen(false)} className="border-foreground/20 text-slate-900 dark:text-white hover:bg-foreground/10">
                Cancel
              </Button>
              <Button
                disabled={!assignJobId || isAssigning}
                onClick={handleAssignCandidate}
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
              >
                {isAssigning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Assign to Pipeline
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
}
