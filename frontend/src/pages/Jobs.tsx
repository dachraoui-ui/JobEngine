import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Plus, Users, Eye, Pencil, Trash2, ArrowRight, Briefcase, MapPin, Check, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockJobs = [
  { id: 1, title: "Senior React Developer", type: "Full-Time", location: "Remote", level: "Senior", skills: ["React", "TypeScript", "Node.js", "+2 more"], posted: "5 days ago", closes: "10 days", applicants: 23, status: "Active" },
  { id: 2, title: "Backend Engineer (Go)", type: "Full-Time", location: "New York", level: "Mid", skills: ["Go", "PostgreSQL", "Docker", "+1 more"], posted: "2 days ago", closes: "15 days", applicants: 45, status: "Active" },
  { id: 3, title: "Frontend Intern", type: "Internship", location: "Remote", level: "Junior", skills: ["CSS", "HTML", "JS"], posted: "1 day ago", closes: "20 days", applicants: 12, status: "Draft" },
  { id: 4, title: "Data Scientist", type: "Full-Time", location: "London", level: "Senior", skills: ["Python", "PyTorch", "SQL"], posted: "30 days ago", closes: "Closed", applicants: 89, status: "Closed" },
  { id: 5, title: "Product Designer", type: "Full-Time", location: "Remote", level: "Mid", skills: ["Figma", "UI/UX", "Prototyping"], posted: "4 days ago", closes: "11 days", applicants: 34, status: "Active" },
];

export default function Jobs() {
  const [filter, setFilter] = useState("Active");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const filteredJobs = mockJobs.filter(j => j.status === filter);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">5 Active Missions</p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold shadow-[0_0_15px_rgba(0,212,255,0.4)]"
        >
          <Plus className="w-5 h-5 mr-2" /> New Job
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4">
          <PulseOrb score={80} size="sm" />
          <div>
            <div className="text-2xl font-mono font-bold text-white">8</div>
            <div className="text-xs text-muted-foreground">Total Jobs</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            <PulseOrb score={90} size="sm" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">5</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white">127</div>
            <div className="text-xs text-muted-foreground">Total Applicants</div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex items-center gap-4">
          <PulseOrb score={74} size="sm" />
          <div>
            <div className="text-2xl font-mono font-bold text-white">74%</div>
            <div className="text-xs text-muted-foreground">Avg Match Score</div>
          </div>
        </GlassCard>
      </div>

      <div className="flex bg-foreground/5 border border-foreground/10 w-fit rounded-lg p-1">
        {["Active", "Draft", "Closed"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${filter === tab ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:text-white"}`}
          >
            {tab} <span className="ml-1 opacity-50">({mockJobs.filter(j => j.status === tab).length})</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <GlassCard key={job.id} className="p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 hover:border-cyan-500/30 transition-colors">
            {/* Left Section */}
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-bold text-white">{job.title}</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-medium">{job.location}</span>
                <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-full font-medium">{job.type}</span>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full font-medium">{job.level}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">{s}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/80">Posted {job.posted} • Closes in {job.closes}</p>
            </div>

            {/* Center Metrics (Only for active/closed) */}
            <div className="flex flex-col items-center justify-center px-4 lg:border-x lg:border-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-mono font-bold text-white">{job.applicants}</span>
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
                <span className="text-xs text-muted-foreground">{job.status}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={job.status === 'Active'} onChange={() => {}} />
                  <div className="w-9 h-5 bg-foreground/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 shadow-[0_0_10px_rgba(0,212,255,0.2)]"></div>
                </label>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 text-muted-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-foreground/10 text-muted-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-muted-foreground transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              {job.status !== 'Draft' && (
                <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 mt-2 text-xs">
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

      <CreateJobModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}

function CreateJobModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if (!val) setTimeout(() => setStep(1), 300); }}>
      <DialogContent className="max-w-[640px] bg-[#0A0A0A]/95 border-foreground/10 backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-foreground/10 -z-10" />
            <div className="flex justify-between w-1/2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${step === i ? 'bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.8)] scale-125' : step > i ? 'bg-cyan-400/50' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          <div className="min-h-[350px]">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">The Basics</h2>
                  <p className="text-sm text-muted-foreground mb-4">Core details about the position.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <input type="text" placeholder="Job Title (e.g. Senior Frontend Engineer)" className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" />
                  </div>
                  <div>
                    <textarea placeholder="Job Description..." rows={4} className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50 resize-none" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
                      <input type="text" placeholder="Location" className="w-full bg-foreground/5 border border-foreground/10 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" />
                    </div>
                    <label className="flex items-center gap-2 px-4 border border-foreground/10 bg-foreground/5 rounded-lg cursor-pointer hover:bg-foreground/10 transition-colors">
                      <input type="checkbox" className="accent-cyan-500 w-4 h-4" defaultChecked />
                      <span className="text-sm text-muted-foreground">Remote OK</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                     <button className="border border-foreground/10 bg-foreground/5 px-2 py-2 rounded text-sm text-muted-foreground hover:bg-foreground/10 hover:border-foreground/20">Part-Time</button>
                     <button className="border border-cyan-500/50 bg-cyan-500/10 px-2 py-2 rounded text-sm text-cyan-400 shadow-[inset_0_0_10px_rgba(0,212,255,0.1)]">Full-Time</button>
                     <button className="border border-foreground/10 bg-foreground/5 px-2 py-2 rounded text-sm text-muted-foreground hover:bg-foreground/10 hover:border-foreground/20">Internship</button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Required Skills</h2>
                  <p className="text-sm text-muted-foreground mb-4">Define what makes a great candidate.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm text-muted-foreground font-medium">Must-Have Skills</label>
                    <input type="text" placeholder="Start typing a skill..." className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-cyan-500/50" />
                    <div className="flex flex-wrap gap-2">
                       <span className="pl-3 pr-1 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-xs flex items-center gap-1">React <button className="hover:bg-foreground/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button></span>
                       <span className="pl-3 pr-1 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-xs flex items-center gap-1">TypeScript <button className="hover:bg-foreground/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button></span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-foreground/10 pt-4">
                    <label className="text-sm text-muted-foreground font-medium">Nice-to-Have</label>
                    <input type="text" placeholder="Optional skills..." className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground/80 focus:outline-none focus:border-violet-500/50" />
                    <div className="flex flex-wrap gap-2">
                       <span className="pl-3 pr-1 py-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-full text-xs flex items-center gap-1">GraphQL <button className="hover:bg-foreground/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Culture & Values</h2>
                  <p className="text-sm text-muted-foreground mb-4">Select the traits that fit your team. (Max 6)</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Innovation", "Teamwork", "Diversity", "Work-Life Balance", "Growth", "Transparency", "Remote-First", "Fast-Paced", "Mentorship"].map((v, i) => {
                    const isSelected = i === 0 || i === 1 || i === 6;
                    return (
                      <button key={v} className={`px-3 py-3 rounded-lg text-sm transition-all border flex items-center justify-between ${isSelected ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-[inset_0_0_15px_rgba(0,212,255,0.1)]' : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:border-foreground/20'}`}>
                        {v} {isSelected && <Check className="w-4 h-4 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                 <div>
                  <h2 className="text-xl font-bold text-white mb-1">Review & Publish</h2>
                  <p className="text-sm text-muted-foreground mb-4">Final check before going live.</p>
                </div>
                <GlassCard className="p-5 bg-foreground/[0.02]">
                  <h3 className="text-lg font-bold text-white mb-2">Senior Frontend Engineer</h3>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-foreground/10">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Full-Time</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground/80 uppercase tracking-widest mb-2 font-semibold">Skills Required</p>
                    <div className="flex gap-2"><span className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded text-xs">React</span></div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/80 uppercase tracking-widest mb-2 font-semibold">Culture Match</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">Innovation • Teamwork • Remote-First</div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-foreground/5 border-t border-foreground/10 p-4 flex justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-white">Back</Button>
            ) : <div/>}

            <div className="flex gap-3">
              {step === 4 && <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-white">Save as Draft</Button>}
              
              {step < totalSteps ? (
                <Button onClick={nextStep} className="bg-white text-slate-900 hover:bg-slate-200">Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
              ) : (
                <Button onClick={() => onOpenChange(false)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold shadow-[0_0_20px_rgba(0,212,255,0.5)]">Publish Job ✨</Button>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
