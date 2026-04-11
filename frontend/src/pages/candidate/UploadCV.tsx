import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, FileText, Download, Trash2, Star, BrainCircuit, X, Edit2, Network, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { PulseOrb } from "@/components/ui/PulseOrb";

export default function UploadCV() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "scanning" | "mapping" | "profiling" | "complete">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      startUploadSequence();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startUploadSequence();
    }
  };

  const startUploadSequence = () => {
    setUploadState("uploading");
    
    // Simulate complex AI scanning process
    setTimeout(() => {
      setUploadState("scanning");
      setTimeout(() => {
        setUploadState("mapping");
        setTimeout(() => {
          setUploadState("profiling");
          setTimeout(() => {
            setUploadState("complete");
          }, 1000);
        }, 2000);
      }, 2000);
    }, 500); // instant receive
  };

  const [skills, setSkills] = useState([
    { name: "React", conf: "High" },
    { name: "JavaScript", conf: "High" },
    { name: "TypeScript", conf: "High" },
    { name: "Node.js", conf: "High" },
    { name: "MongoDB", conf: "Medium" },
    { name: "Python", conf: "Review" },
    { name: "Docker", conf: "Medium" },
    { name: "Git", conf: "High" },
  ]);

  const removeSkill = (name: string) => {
    setSkills(s => s.filter(x => x.name !== name));
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
            <h3 className="text-xl font-bold text-white mb-2">Drop your CV into the neural network</h3>
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
                <span className="text-white font-medium flex items-center gap-2"><FileText className="text-cyan-400 w-5 h-5"/> resume_ahmed.pdf</span>
                <span className="text-muted-foreground text-sm font-mono">2.4 MB</span>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">File received</span>
                   </div>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {uploadState === "scanning" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      <span className={uploadState === "scanning" ? "text-cyan-300 font-medium animate-pulse" : "text-muted-foreground"}>Extracting neural data...</span>
                   </div>
                </div>

                {(uploadState === "mapping" || uploadState === "profiling") && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         {uploadState === "mapping" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                         <span className={uploadState === "mapping" ? "text-cyan-300 font-medium animate-pulse" : "text-muted-foreground"}>Mapping skill constellation...</span>
                      </div>
                   </div>
                )}

                {uploadState === "profiling" && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />
                         <span className="text-cyan-300 font-medium animate-pulse">Profiling complete...</span>
                      </div>
                   </div>
                )}
             </div>

             {/* Circular Progress border ring simulating overall progress */}
             <svg className="absolute inset-x-0 inset-y-[-40px] w-full h-[calc(100%+80px)] -z-10 opacity-30 transform -rotate-90 pointer-events-none stroke-cyan-400" fill="none" strokeWidth="2">
                <rect width="100%" height="100%" rx="16" strokeDasharray="1000" strokeDashoffset={uploadState === 'scanning' ? 700 : uploadState === 'mapping' ? 300 : uploadState === 'profiling' ? 50 : 0} className="transition-all duration-1000" />
             </svg>
          </div>
        </GlassCard>
      )}

      {uploadState === "complete" && (
        <GlassCard className="p-0 overflow-hidden relative shadow-[0_0_30px_rgba(0,212,255,0.15)] animate-in slide-in-from-bottom-8 duration-700">
           {/* Animated gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                     <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Neural Profile Generated</h2>
                </div>
                <p className="text-muted-foreground ml-13">Successfully extracted from <span className="text-white font-mono bg-foreground/5 px-2 py-0.5 rounded">resume_ahmed.pdf</span></p>
              </div>
              <div className="flex flex-col flex-end text-center shrink-0">
                 <p className="text-[10px] text-muted-foreground/80 uppercase tracking-widest font-semibold mb-2">CV Strength</p>
                 <PulseOrb score={72} size="lg" />
              </div>
            </div>

            <div className="space-y-8 bg-foreground/[0.02] p-6 rounded-xl border border-foreground/5">
              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Detected Skills</h3>
                   <button onClick={() => setIsEditing(!isEditing)} className={`text-xs flex items-center gap-1 font-medium transition-colors ${isEditing ? 'text-cyan-400' : 'text-muted-foreground/80 hover:text-white'}`}>
                      <Edit2 className="w-3 h-3" /> {isEditing ? "Done" : "Edit"}
                   </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map(skill => (
                    <div key={skill.name} className="flex flex-col items-center gap-1 group relative">
                       <span className={`px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${isEditing ? 'pr-2' : ''}`}>
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
                    <button className="px-4 py-2 bg-transparent border border-dashed border-foreground/20 rounded-full text-sm text-muted-foreground hover:text-white hover:border-foreground/40 xl-self-start transition-colors h-[38px]">
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-foreground/10">
                {/* Experience */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Experience</h3>
                  {isEditing ? (
                     <input type="text" defaultValue="4 years" className="bg-cyan-500/5 border border-cyan-500/30 rounded-lg p-2 text-cyan-300 font-mono w-full focus:outline-none focus:border-cyan-400" />
                  ) : (
                     <div className="bg-foreground/5 rounded-lg p-3 border border-transparent text-cyan-300 font-mono">4 years</div>
                  )}
                </div>
                {/* Education */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Education</h3>
                  {isEditing ? (
                     <input type="text" defaultValue="BS Computer Science — INSAT" className="bg-foreground/5 border border-foreground/20 rounded-lg p-2 text-white w-full focus:outline-none focus:border-foreground/40" />
                  ) : (
                     <div className="bg-foreground/5 rounded-lg p-3 border border-transparent text-white truncate">BS Computer Science — INSAT</div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Languages</h3>
                 <div className="flex gap-2">
                    {["English", "French", "Arabic"].map(lang => (
                       <span key={lang} className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-lg text-sm text-muted-foreground">{lang}</span>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-foreground/10">
              <Button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                 Save Neural Profile
              </Button>
              <Button variant="ghost" onClick={() => { setUploadState("idle"); setIsEditing(false); }} className="text-muted-foreground hover:text-white">
                 Scrap & Re-scan CV
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Archives Section */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-white mb-4">Your Neural Archives</h3>
        <GlassCard className="p-0 overflow-hidden text-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-foreground/5 hover:bg-foreground/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                 <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="mb-2 md:mb-0">
                <p className="font-medium text-white mb-0.5">resume_ahmed_2026.pdf</p>
                <div className="flex items-center gap-2">
                   <p className="text-xs text-muted-foreground/80 font-mono">2.4 MB</p>
                   <span className="w-1 h-1 rounded-full bg-slate-600"/>
                   <p className="text-xs text-muted-foreground/80">Mar 10, 2026</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                <Star className="w-3 h-3 fill-emerald-400" /> Active
              </span>
              <div className="flex gap-2">
                 <button className="text-muted-foreground hover:text-white p-2 hover:bg-foreground/10 rounded-full transition-colors"><Download className="w-4 h-4" /></button>
                 <button className="text-muted-foreground hover:text-rose-400 p-2 hover:bg-rose-500/20 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-foreground/5 transition-colors opacity-60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-foreground/5 rounded-lg border border-foreground/10">
                 <FileText className="w-5 h-5 text-muted-foreground" />
               </div>
              <div className="mb-2 md:mb-0">
                <p className="font-medium text-muted-foreground mb-0.5">dev_resume_old.docx</p>
                <div className="flex items-center gap-2">
                   <p className="text-xs text-muted-foreground/80 font-mono">1.1 MB</p>
                   <span className="w-1 h-1 rounded-full bg-slate-600"/>
                   <p className="text-xs text-muted-foreground/80">Jan 15, 2026</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
              <button className="text-muted-foreground hover:text-white text-xs font-semibold px-3 py-1.5 border border-foreground/10 hover:border-foreground/30 rounded-md transition-colors">Set Active ⭐</button>
              <div className="flex gap-2">
                 <button className="text-muted-foreground hover:text-white p-2 hover:bg-foreground/10 rounded-full transition-colors"><Download className="w-4 h-4" /></button>
                 <button className="text-muted-foreground hover:text-rose-400 p-2 hover:bg-rose-500/20 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Internal icon proxy for Sparkles if not exported from lucide directly in some versions
import { Sparkles as Intersect } from "lucide-react";
const Sparkles = Intersect;
