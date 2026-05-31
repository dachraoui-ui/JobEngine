import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Plus, Users, Pencil, Trash2, ArrowRight, Briefcase, MapPin, Check, ChevronRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import api from "@/lib/api";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { getSwalTheme } from "@/lib/swal";

export default function Jobs() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Active");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/my-jobs");
      setJobs(res.data.data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: any) => {
    try {
      const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
      await api.put(`/jobs/${job.id}`, {
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        experienceLevel: job.experienceLevel,
        requiredSkills: job.requiredSkills,
        companyValues: job.companyValues,
        status: newStatus
      });
      toast.success(`Job status updated to ${newStatus === "OPEN" ? "Active" : "Closed"}`);
      fetchJobs();
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast.error(error?.response?.data?.message || "Failed to update job status");
    }
  };

  const handleDeleteJob = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This job mission will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      ...getSwalTheme(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/jobs/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your job has been deleted.",
            icon: "success",
            confirmButtonColor: "#06b6d4",
            ...getSwalTheme(),
          });
          fetchJobs();
        } catch (error: any) {
          console.error("Error deleting job:", error);
          toast.error(error?.response?.data?.message || "Failed to delete job");
        }
      }
    });
  };

  const tabMap: Record<string, string> = {
    "Active": "OPEN",
    "Draft": "DRAFT",
    "Closed": "CLOSED"
  };

  const filteredJobs = jobs.filter(j => j.status === tabMap[filter]);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === "OPEN").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">{activeJobs} Active Missions</p>
        </div>
        <Button 
          onClick={() => {
            setEditingJob(null);
            setCreateModalOpen(true);
          }}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold shadow-[0_0_15px_rgba(0,212,255,0.4)]"
        >
          <Plus className="w-5 h-5 mr-2" /> New Job
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <PulseOrb score={80} size="sm" />
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">{totalJobs}</div>
            <div className="text-xs text-muted-foreground">Total Jobs</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="relative">
            {activeJobs > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </>
            )}
            <PulseOrb score={90} size="sm" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">{activeJobs}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">{totalApplicants}</div>
            <div className="text-xs text-muted-foreground">Total Applicants</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <PulseOrb score={74} size="sm" />
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">74%</div>
            <div className="text-xs text-muted-foreground">Avg Match Score</div>
          </div>
        </GlassCard>
      </div>

      <div className="flex bg-foreground/5 border border-foreground/10 w-fit rounded-lg p-1">
        {["Active", "Draft", "Closed"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab 
                ? "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/10 dark:border-cyan-500/30" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab} <span className="ml-1 opacity-50">({jobs.filter(j => j.status === tabMap[tab]).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="text-muted-foreground text-sm font-medium">Fetching missions...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <GlassCard key={job.id} className="p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 hover:border-cyan-500/30 transition-colors">
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 rounded-full font-medium">{job.location}</span>
                  <span className="px-2 py-1 bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 rounded-full font-medium">
                    {job.type === "FULL_TIME" ? "Full-Time" : job.type === "PART_TIME" ? "Part-Time" : "Internship"}
                  </span>
                  <span className="px-2 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full font-medium">
                    {job.experienceLevel ? job.experienceLevel.charAt(0) + job.experienceLevel.slice(1).toLowerCase() : "Mid"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">{s}</span>
                  )) || <span className="text-xs text-muted-foreground/60 italic">No skills listed</span>}
                </div>
                <p className="text-xs text-muted-foreground/80">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                  {job.deadline && ` • Closes ${new Date(job.deadline).toLocaleDateString()}`}
                </p>
              </div>

              {/* Center Metrics */}
              <div className="flex flex-col items-center justify-center px-4 lg:border-x lg:border-foreground/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-mono font-bold text-foreground">{job.applicantCount || 0}</span>
                </div>
                <div className="flex items-end gap-1 h-6 shrink-0">
                  <div className="w-1.5 bg-rose-500/50 rounded-t h-[20%]" title="0-20 score" />
                  <div className="w-1.5 bg-amber-500/50 rounded-t h-[40%]" title="20-40 score" />
                  <div className="w-1.5 bg-emerald-500/50 rounded-t h-[80%]" title="40-60 score" />
                  <div className="w-1.5 bg-cyan-500/50 rounded-t h-[60%]" title="60-80 score" />
                  <div className="w-1.5 bg-violet-500/80 rounded-t h-[100%] shadow-[0_0_5px_rgba(139,92,246,0.5)]" title="80-100 score" />
                </div>
                <span className="text-[10px] text-muted-foreground/80 mt-1 uppercase tracking-wider">Score Dist</span>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col items-end gap-4 min-w-[200px]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {job.status === "OPEN" ? "Active" : job.status === "DRAFT" ? "Draft" : "Closed"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={job.status === "OPEN"} 
                      onChange={() => handleToggleStatus(job)} 
                    />
                    <div className="w-9 h-5 bg-foreground/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.2)]"></div>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingJob(job);
                      setCreateModalOpen(true);
                    }} 
                    className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 text-muted-foreground transition-colors"
                    title="Edit Job"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteJob(job.id)} 
                    className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-muted-foreground transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {job.status !== 'DRAFT' && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/pipeline?jobId=${job.id}`)}
                    className="w-full border-cyan-500/50 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/10 mt-2 text-xs"
                  >
                    Open Pipeline <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground/80">No {filter.toLowerCase()} jobs found.</div>
          )}
        </div>
      )}

      <CreateJobModal 
        open={isCreateModalOpen} 
        onOpenChange={setCreateModalOpen} 
        editingJob={editingJob} 
        onSuccess={fetchJobs} 
      />
    </div>
  );
}

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJob: any;
  onSuccess: () => void;
}

function CreateJobModal({ open, onOpenChange, editingJob, onSuccess }: CreateJobModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOk, setRemoteOk] = useState(true);
  const [type, setType] = useState<"FULL_TIME" | "PART_TIME" | "INTERNSHIP">("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState<"JUNIOR" | "MID" | "SENIOR">("MID");
  const [skillInput, setSkillInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [companyValues, setCompanyValues] = useState<string[]>(["Innovation", "Teamwork", "Remote-First"]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title || "");
      setDescription(editingJob.description || "");
      setLocation(editingJob.location || "");
      setRemoteOk(editingJob.location?.toLowerCase().includes("remote") || false);
      setType(editingJob.type || "FULL_TIME");
      setExperienceLevel(editingJob.experienceLevel || "MID");
      setRequiredSkills(editingJob.requiredSkills || []);
      setCompanyValues(editingJob.companyValues || []);
    } else {
      setTitle("");
      setDescription("");
      setLocation("");
      setRemoteOk(true);
      setType("FULL_TIME");
      setExperienceLevel("MID");
      setRequiredSkills([]);
      setCompanyValues(["Innovation", "Teamwork", "Remote-First"]);
    }
    setStep(1);
  }, [editingJob, open]);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleToggleValue = (val: string) => {
    if (companyValues.includes(val)) {
      setCompanyValues(companyValues.filter(v => v !== val));
    } else {
      if (companyValues.length < 6) {
        setCompanyValues([...companyValues, val]);
      } else {
        toast.warning("You can select up to 6 values");
      }
    }
  };

  const handlePublish = async (statusOverride?: 'DRAFT' | 'OPEN') => {
    if (!title.trim()) {
      toast.error("Job title is required");
      setStep(1);
      return;
    }
    if (!description.trim()) {
      toast.error("Job description is required");
      setStep(1);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title,
        description,
        location: remoteOk ? "Remote" + (location ? ` (${location})` : "") : location || "Onsite",
        type,
        experienceLevel,
        requiredSkills,
        companyValues,
        status: statusOverride || (editingJob ? editingJob.status : "OPEN")
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, payload);
        toast.success("Job updated successfully");
      } else {
        await api.post("/jobs", payload);
        toast.success(statusOverride === "DRAFT" ? "Draft saved successfully" : "Job published successfully");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast.error(error?.response?.data?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const valuesOptions = ["Innovation", "Teamwork", "Diversity", "Work-Life Balance", "Growth", "Transparency", "Remote-First", "Fast-Paced", "Mentorship"];

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!saving) { onOpenChange(val); if (!val) setTimeout(() => setStep(1), 300); } }}>
      <DialogContent className="max-w-[640px] bg-card border-border backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-foreground/10 -z-10" />
            <div className="flex justify-between w-1/2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${step === i ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-125' : step > i ? 'bg-cyan-500/50' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          <div className="min-h-[380px]">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">{editingJob ? "Edit Basics" : "The Basics"}</h2>
                  <p className="text-sm text-muted-foreground mb-4">Core details about the position.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Job Title (e.g. Senior Frontend Engineer)" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" 
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Job Description..." 
                      rows={4} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50 resize-none" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                      <input 
                        type="text" 
                        placeholder="Location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-lg pl-9 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" 
                      />
                    </div>
                    <label className="flex items-center gap-2 px-4 border border-foreground/10 bg-foreground/5 rounded-lg cursor-pointer hover:bg-foreground/10 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={remoteOk}
                        onChange={(e) => setRemoteOk(e.target.checked)}
                        className="accent-cyan-500 w-4 h-4" 
                      />
                      <span className="text-sm text-muted-foreground">Remote OK</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Job Type</label>
                      <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-1 gap-1">
                        {(["FULL_TIME", "PART_TIME", "INTERNSHIP"] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                              type === t 
                                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {t === "FULL_TIME" ? "Full" : t === "PART_TIME" ? "Part" : "Intern"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Experience Level</label>
                      <div className="flex bg-foreground/5 border border-foreground/10 rounded-lg p-1 gap-1">
                        {(["JUNIOR", "MID", "SENIOR"] as const).map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setExperienceLevel(lvl)}
                            className={`flex-1 py-1.5 rounded text-xs font-medium transition-all ${
                              experienceLevel === lvl 
                                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {lvl === "JUNIOR" ? "Jr" : lvl === "MID" ? "Mid" : "Sr"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Required Skills</h2>
                  <p className="text-sm text-muted-foreground mb-4">Define what makes a great candidate.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm text-muted-foreground font-medium">Must-Have Skills</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a skill and press Add or Enter..." 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        className="flex-1 bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" 
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddSkill} 
                        className="bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 dark:border-cyan-500/30"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {requiredSkills.map(s => (
                         <span key={s} className="pl-3 pr-1 py-1 bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/20 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs flex items-center gap-1">
                           {s} 
                           <button 
                             type="button" 
                             onClick={() => handleRemoveSkill(s)} 
                             className="hover:bg-foreground/20 rounded-full p-0.5"
                           >
                             <Plus className="w-3 h-3 rotate-45" />
                           </button>
                         </span>
                       ))}
                       {requiredSkills.length === 0 && (
                         <span className="text-xs text-muted-foreground italic">No skills added yet.</span>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Culture & Values</h2>
                  <p className="text-sm text-muted-foreground mb-4">Select the traits that fit your team. (Max 6)</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {valuesOptions.map((v) => {
                    const isSelected = companyValues.includes(v);
                    return (
                      <button 
                        key={v} 
                        type="button"
                        onClick={() => handleToggleValue(v)}
                        className={`px-3 py-3 rounded-lg text-sm transition-all border flex items-center justify-between ${
                          isSelected 
                            ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/50 text-cyan-700 dark:text-cyan-300 shadow-[inset_0_0_15px_rgba(0,212,255,0.1)]' 
                            : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:border-foreground/20'
                        }`}
                      >
                        {v} {isSelected && <Check className="w-4 h-4 ml-2 text-cyan-700 dark:text-cyan-400" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Review & Publish</h2>
                  <p className="text-sm text-muted-foreground mb-4">Final check before going live.</p>
                </div>
                <GlassCard className="p-5 bg-foreground/[0.02] space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{title || "Untitled Job"}</h3>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 
                        {remoteOk ? "Remote" + (location ? ` (${location})` : "") : location || "Onsite"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> 
                        {type === "FULL_TIME" ? "Full-Time" : type === "PART_TIME" ? "Part-Time" : "Internship"}
                      </span>
                    </div>
                  </div>
                  
                  {requiredSkills.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground/80 uppercase tracking-widest mb-1.5 font-semibold">Skills Required</p>
                      <div className="flex flex-wrap gap-1.5">
                        {requiredSkills.map(s => (
                          <span key={s} className="text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs border border-cyan-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {companyValues.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground/80 uppercase tracking-widest mb-1.5 font-semibold">Culture Match</p>
                      <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                        {companyValues.join(" • ")}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-foreground/5 border-t border-border p-4 flex justify-between">
          {step > 1 ? (
            <Button 
              variant="ghost" 
              onClick={prevStep} 
              disabled={saving}
              className="text-muted-foreground hover:text-foreground"
            >
              Back
            </Button>
          ) : <div/>}

          <div className="flex gap-3">
            {step === 4 && (
              <Button 
                variant="ghost" 
                onClick={() => handlePublish("DRAFT")} 
                disabled={saving}
                className="text-muted-foreground hover:text-foreground"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save as Draft"}
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={nextStep} 
                className="bg-foreground text-background hover:opacity-90"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={() => handlePublish()} 
                disabled={saving}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(0,212,255,0.5)]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  editingJob ? "Save Changes ✨" : "Publish Job ✨"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
