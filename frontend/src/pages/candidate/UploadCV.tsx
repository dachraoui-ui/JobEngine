import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, FileText, Download, Trash2, Star, BrainCircuit, X, Edit2, Network, Loader2, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { getSwalTheme, getSwalCustomClass } from "@/lib/swal";

export default function UploadCV() {
  const { user } = useAuth();

  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "scanning" | "mapping" | "profiling" | "complete">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [activeCv, setActiveCv] = useState<any>(null);
  const [cvFileName, setCvFileName] = useState("resume.pdf");
  const [cvFileSize, setCvFileSize] = useState("0 MB");
  const [cvStrengthScore, setCvStrengthScore] = useState(72);
  const [skills, setSkills] = useState<{ name: string; conf: string }[]>([]);
  const [experience, setExperience] = useState("3 years");
  const [education, setEducation] = useState("Bachelor of Science");
  const [languages, setLanguages] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchActiveCv = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cv/active");
      const cv = res.data.data;
      if (cv) {
        setActiveCv(cv);
        setCvFileName(cv.originalFileName);
        setCvFileSize(cv.fileSize ?? "Unknown");
        setSkills((cv.detectedSkills ?? []).map((s: string) => ({ name: s, conf: "High" })));
        setExperience(`${cv.yearsExperience} years`);
        setEducation(cv.education || "Bachelor of Science");
        setLanguages(cv.languages ?? ["English"]);
        setCvStrengthScore(cv.cvStrengthScore ?? 70);
        setUploadState("complete");
      } else {
        setActiveCv(null);
        setUploadState("idle");
      }
    } catch (err) {
      console.error("Failed to load active CV", err);
    }
  };

  useEffect(() => {
    fetchActiveCv();
  }, [user?.id]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUploadSequence(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startUploadSequence(e.target.files[0]);
    }
  };

  const startUploadSequence = async (file: File) => {
    setUploadState("uploading");
    setCvFileName(file.name);
    setCvFileSize(String((file.size / (1024 * 1024)).toFixed(1)) + " MB");

    try {
      // Simulate real-time cybernetic parsing stages alongside the request
      setTimeout(() => setUploadState("scanning"), 400);
      setTimeout(() => setUploadState("mapping"), 1200);
      setTimeout(() => setUploadState("profiling"), 2000);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/cv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data.data;
      if (data) {
        setTimeout(() => {
          setSkills((data.detectedSkills ?? []).map((s: string) => ({ name: s, conf: "High" })));
          setExperience(`${data.yearsExperience} years`);
          setEducation(data.education);
          setLanguages(data.languages ?? ["English"]);
          setCvStrengthScore(data.cvStrengthScore ?? 70);
          setUploadState("complete");
          fetchActiveCv();
          toast.success("CV uploaded and successfully parsed by neural engine!");
        }, 2800);
      }
    } catch (err: any) {
      console.error(err);
      setUploadState("idle");
      toast.error(err.response?.data?.message || "Failed to upload or parse CV.");
    }
  };

  const removeSkill = (name: string) => {
    setSkills(s => s.filter(x => x.name !== name));
  };

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
    setSkills([...skills, { name: name.trim(), conf: "High" }]);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const mappedSkills = skills.map(s => s.name);
      
      let experienceLevel: "JUNIOR" | "MID" | "SENIOR" = "MID";
      const years = parseInt(experience);
      if (years >= 6) experienceLevel = "SENIOR";
      else if (years <= 2) experienceLevel = "JUNIOR";

      await api.put(`/users/${user.id}/candidate-profile`, {
        skills: mappedSkills,
        experienceLevel,
        summary: `Highly skilled professional specialized in ${mappedSkills.slice(0, 3).join(", ")}. Profile parsed and synched from ${cvFileName}.`,
        preferences: {
          jobType: "FULL_TIME",
          location: "Remote",
          remoteOk: true
        }
      });

      toast.success("Profile synchronized with parsed CV!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (cvId: string) => {
    Swal.fire({
      title: "Delete CV Archive?",
      text: "This will remove your resume from the neural network and clear your profile stats.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      ...getSwalTheme(),
      customClass: getSwalCustomClass("border-cyan-500/20"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        try {
          await api.delete(`/cv/${cvId}`);
          toast.success("CV deleted successfully!");
          setActiveCv(null);
          setUploadState("idle");
          setSkills([]);
          setExperience("0 years");
          setEducation("");
        } catch (err) {
          console.error("Failed to delete CV", err);
          toast.error("Failed to delete CV.");
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleDownload = async (cvId: string) => {
    try {
      const response = await api.get(`/cv/${cvId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", cvFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download CV", err);
      toast.error("Failed to download CV file.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 text-center items-center">
        <div className="flex items-center gap-2">
           <BrainCircuit className="w-8 h-8 text-cyan-400" />
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Neural Uplink</h1>
        </div>
        <p className="text-muted-foreground">Upload your CV and let the AI analyze your professional DNA.</p>
      </div>

      {uploadState === "idle" && (
        <GlassCard 
          className={`h-[240px] flex items-center justify-center transition-all duration-300 border-2 border-dashed ${dragActive ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_rgba(0,212,255,0.2)] scale-[1.02]' : 'border-cyan-500/30 hover:border-cyan-400/60 bg-foreground/[0.02]'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${dragActive ? 'scale-125 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,212,255,0.3)]' : 'bg-foreground/5'}`}>
              <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Drop your CV into the neural network</h3>
            <div className="flex items-center gap-4 text-muted-foreground w-full max-w-[240px] mb-4">
              <div className="h-px bg-foreground/10 flex-1" />
              <span className="text-xs uppercase tracking-widest font-semibold">or</span>
              <div className="h-px bg-foreground/10 flex-1" />
            </div>
            
            <label htmlFor="cv-upload">
              <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.1)]" asChild>
                <span>Select File</span>
              </Button>
              <input id="cv-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleChange} />
            </label>
            
            <p className="text-xs text-muted-foreground/80 mt-4 font-medium uppercase tracking-widest">PDF or DOCX • Max 10MB</p>
          </div>
        </GlassCard>
      )}

      {uploadState !== "idle" && uploadState !== "complete" && (
        <GlassCard className="h-[240px] flex items-center justify-center relative overflow-hidden border-cyan-500/40 animate-in fade-in duration-500 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
          {uploadState === "scanning" && (
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-[20%] animate-scan border-b border-cyan-500/50 z-0" />
          )}
          {uploadState === "mapping" && (
             <div className="absolute inset-0 flex items-center justify-center opacity-20 z-0 text-cyan-400 animate-pulse">
                <Network className="w-64 h-64" />
             </div>
          )}
          {uploadState === "profiling" && (
             <div className="absolute inset-0 bg-cyan-500/20 animate-flash z-0" />
          )}

          <div className="relative z-10 w-full max-w-[400px]">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-foreground/10">
                <span className="text-foreground font-medium flex items-center gap-2 truncate max-w-[280px]"><FileText className="text-cyan-400 w-5 h-5 shrink-0"/> {cvFileName}</span>
                <span className="text-muted-foreground text-sm font-mono shrink-0">{cvFileSize}</span>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground text-sm">File received</span>
                   </div>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {uploadState === "scanning" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      <span className={uploadState === "scanning" ? "text-cyan-300 text-sm font-medium animate-pulse" : "text-muted-foreground text-sm"}>Extracting neural data...</span>
                   </div>
                </div>

                {(uploadState === "mapping" || uploadState === "profiling") && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         {uploadState === "mapping" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                         <span className={uploadState === "mapping" ? "text-cyan-300 text-sm font-medium animate-pulse" : "text-muted-foreground text-sm"}>Mapping skill constellation...</span>
                      </div>
                   </div>
                )}

                {uploadState === "profiling" && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />
                         <span className="text-cyan-300 text-sm font-medium animate-pulse">Profiling complete...</span>
                      </div>
                   </div>
                )}
             </div>

             <svg className="absolute inset-x-0 inset-y-[-40px] w-full h-[calc(100%+80px)] -z-10 opacity-30 transform -rotate-90 pointer-events-none stroke-cyan-400" fill="none" strokeWidth="2">
                <rect width="100%" height="100%" rx="16" strokeDasharray="1000" strokeDashoffset={uploadState === 'scanning' ? 700 : uploadState === 'mapping' ? 300 : uploadState === 'profiling' ? 50 : 0} className="transition-all duration-1000" />
             </svg>
          </div>
        </GlassCard>
      )}

      {uploadState === "complete" && (
        <GlassCard className="p-0 overflow-hidden relative shadow-[0_0_30px_rgba(0,212,255,0.15)] animate-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                     <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Neural Profile Generated</h2>
                </div>
                <p className="text-muted-foreground ml-13">Successfully extracted from <span className="text-foreground font-mono bg-foreground/5 px-2 py-0.5 rounded">{cvFileName}</span></p>
              </div>
              <div className="flex flex-col flex-end text-center shrink-0">
                 <p className="text-[10px] text-muted-foreground/80 uppercase tracking-widest font-semibold mb-2">CV Strength</p>
                 <PulseOrb score={cvStrengthScore} size="lg" />
              </div>
            </div>

            <div className="space-y-8 bg-foreground/[0.02] p-6 rounded-xl border border-foreground/5">
              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Detected Skills</h3>
                   <button onClick={() => setIsEditing(!isEditing)} className={`text-xs flex items-center gap-1 font-medium transition-colors ${isEditing ? 'text-cyan-400' : 'text-muted-foreground/80 hover:text-foreground'}`}>
                      <Edit2 className="w-3 h-3" /> {isEditing ? "Done" : "Edit"}
                   </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map(skill => (
                    <div key={skill.name} className="flex flex-col items-center gap-1 group relative">
                       <span className={`px-4 py-2 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${isEditing ? 'pr-2' : ''}`}>
                         {skill.name} 
                         {isEditing && (
                           <button onClick={() => removeSkill(skill.name)} className="w-5 h-5 rounded-full hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors">
                              <X className="w-3 h-3" />
                           </button>
                         )}
                       </span>
                       {!isEditing && (
                          <span className={`text-[10px] font-semibold w-full text-center ${
                             skill.conf === 'High' ? 'text-emerald-400' : skill.conf === 'Medium' ? 'text-amber-400' : 'text-muted-foreground/80'
                          }`}>
                             {skill.conf === 'High' ? 'High ✓' : skill.conf === 'Medium' ? 'Medium ~' : 'Review ?'}
                          </span>
                       )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="flex gap-2 items-center animate-fade-in">
                      <input
                        type="text"
                        placeholder="Add technology..."
                        value={newSkillText}
                        onChange={(e) => setNewSkillText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill(newSkillText);
                            setNewSkillText("");
                          }
                        }}
                        className="bg-transparent text-sm w-36 outline-none text-cyan-700 dark:text-cyan-300 placeholder:text-muted-foreground/60 py-1.5 px-3 border border-dashed border-cyan-500/30 rounded-full focus:border-cyan-400 h-[38px]"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          addSkill(newSkillText);
                          setNewSkillText("");
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-full h-8 px-3 text-xs animate-pulse"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-foreground/10">
                {/* Experience */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Experience</h3>
                  {isEditing ? (
                     <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} className="bg-cyan-500/5 border border-cyan-500/30 rounded-lg p-2 text-cyan-700 dark:text-cyan-300 font-mono w-full focus:outline-none focus:border-cyan-400 font-bold" />
                  ) : (
                     <div className="bg-foreground/5 rounded-lg p-3 border border-transparent text-cyan-700 dark:text-cyan-300 font-mono font-bold">{experience}</div>
                  )}
                </div>
                {/* Education */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Education</h3>
                  {isEditing ? (
                     <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="bg-foreground/5 border border-foreground/20 rounded-lg p-2 text-foreground w-full focus:outline-none focus:border-foreground/40 font-semibold" />
                  ) : (
                     <div className="bg-foreground/5 rounded-lg p-3 border border-transparent text-foreground truncate font-semibold">{education}</div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Languages</h3>
                 <div className="flex gap-2">
                    {languages.map(lang => (
                       <span key={lang} className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-muted-foreground font-medium">{lang}</span>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-foreground/10">
              <Button disabled={isSaving} onClick={handleSaveProfile} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                 Save Neural Profile
              </Button>
              <Button variant="ghost" onClick={() => { setUploadState("idle"); setIsEditing(false); }} className="text-muted-foreground hover:text-foreground">
                 Scrap & Re-scan CV
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Archives Section */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-foreground mb-4">Your Neural Archives</h3>
        {activeCv ? (
          <GlassCard className="p-0 overflow-hidden text-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-foreground/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                   <FileText className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-0.5 truncate max-w-[280px]">{activeCv.originalFileName}</p>
                  <div className="flex items-center gap-2">
                     <p className="text-xs text-muted-foreground/80 font-mono">{activeCv.fileSize ?? "Unknown"}</p>
                     <span className="w-1 h-1 rounded-full bg-slate-600"/>
                     <p className="text-xs text-muted-foreground/80">Active Neural Source</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                  <Star className="w-3 h-3 fill-emerald-400 animate-pulse" /> Active
                </span>
                <div className="flex gap-2">
                   <button onClick={() => handleDownload(activeCv.id)} title="Download CV File" className="text-muted-foreground hover:text-foreground p-2 hover:bg-foreground/10 rounded-full transition-colors"><Download className="w-4 h-4" /></button>
                   <button disabled={isDeleting} onClick={() => handleDelete(activeCv.id)} title="Delete CV" className="text-muted-foreground hover:text-rose-400 p-2 hover:bg-rose-500/20 rounded-full transition-colors">
                     {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                   </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-8 text-center text-muted-foreground italic border-dashed border-foreground/10">
             No resumes stored in your neural archives yet. Upload one above to catalog your toolkit.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
