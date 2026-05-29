import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mail, Calendar, X, Eye, ArrowRight, FileText, ChevronDown, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Pipeline() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [draggedSourceCol, setDraggedSourceCol] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [pipelineData, setPipelineData] = useState<Record<string, any[]>>({
    applied: [],
    shortlisted: [],
    interview: [],
    rejected: [],
    hired: []
  });
  const [candidatesMap, setCandidatesMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [notifyOnDrag, setNotifyOnDrag] = useState(false);
  const [sendEmailNotify, setSendEmailNotify] = useState(false);

  const columns = [
    { id: "applied", title: "Applied", color: "bg-slate-500", glow: "" },
    { id: "shortlisted", title: "Shortlisted", color: "bg-amber-500", glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]" },
    { id: "interview", title: "Interview", color: "bg-violet-500", glow: "shadow-[0_0_10px_rgba(139,92,246,0.5)]" },
    { id: "rejected", title: "Rejected", color: "bg-rose-500", glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]" },
    { id: "hired", title: "Hired", color: "bg-emerald-500", glow: "shadow-[0_0_15px_rgba(52,211,153,0.6)]" },
  ];

  const statusMap: Record<string, string> = {
    applied: "APPLIED",
    shortlisted: "SHORTLISTED",
    interview: "INTERVIEW",
    rejected: "REJECTED",
    hired: "HIRED"
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/my-jobs");
      const jobsList = res.data.data || [];
      setJobs(jobsList);
      
      const jobIdParam = searchParams.get("jobId");
      let jobToSelect = null;
      if (jobIdParam) {
        jobToSelect = jobsList.find((j: any) => j.id === jobIdParam);
      }
      
      if (!jobToSelect && jobsList.length > 0) {
        jobToSelect = jobsList[0];
        navigate(`/pipeline?jobId=${jobToSelect.id}`, { replace: true });
      }
      
      setSelectedJob(jobToSelect);
    } catch (err) {
      console.error("Error fetching jobs", err);
      toast.error("Failed to load recruiter jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchPipeline = async (jobId: string, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await api.get(`/applications/job/${jobId}/pipeline`);
      const backendMap = res.data.data || {};
      
      const allRes = await api.get(`/applications/job/${jobId}`);
      const applicationsList: any[] = allRes.data.data || [];
      
      const uniqueCandidateIds = Array.from(new Set(applicationsList.map(app => app.candidateId)));
      const candidateDetails: Record<string, any> = {};
      
      if (uniqueCandidateIds.length > 0) {
        const userPromises = uniqueCandidateIds.map(async (id) => {
          try {
            const userRes = await api.get(`/users/${id}`);
            candidateDetails[id] = userRes.data.data;
          } catch (err) {
            console.error(`Failed to fetch user details for ${id}`, err);
            candidateDetails[id] = { id, firstName: "Unknown", lastName: "Candidate", email: "" };
          }
        });
        await Promise.all(userPromises);
      }
      setCandidatesMap(candidateDetails);
      
      const cols: Record<string, any[]> = {
        applied: backendMap.APPLIED || [],
        shortlisted: backendMap.SHORTLISTED || [],
        interview: backendMap.INTERVIEW || [],
        rejected: backendMap.REJECTED || [],
        hired: backendMap.HIRED || []
      };
      
      setPipelineData(cols);
    } catch (err) {
      console.error("Error fetching pipeline", err);
      toast.error("Failed to load job pipeline");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  useEffect(() => {
    if (selectedJob?.id) {
      fetchPipeline(selectedJob.id);
    }
  }, [selectedJob]);

  const handleDragStart = (e: React.DragEvent, cardId: string, sourceCol: string) => {
    setDraggedCard(cardId);
    setDraggedSourceCol(sourceCol);
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("sourceCol", sourceCol);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId") || draggedCard;
    const sourceCol = e.dataTransfer.getData("sourceCol") || draggedSourceCol;
    
    setDraggedCard(null);
    setDraggedSourceCol(null);

    if (!cardId || !sourceCol || sourceCol === targetCol) return;
    
    const backendStatus = statusMap[targetCol];
    if (!backendStatus) return;
    
    // 1. Save original pipeline state for rollback on error
    const originalPipelineData = { ...pipelineData };

    // 2. Perform optimistic update instantly
    const sourceCards = [...(pipelineData[sourceCol] || [])];
    const targetCards = [...(pipelineData[targetCol] || [])];
    
    const cardIndex = sourceCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const [movedCard] = sourceCards.splice(cardIndex, 1);
    const updatedCard = { ...movedCard, status: backendStatus };
    targetCards.push(updatedCard);
    
    setPipelineData(prev => ({
      ...prev,
      [sourceCol]: sourceCards,
      [targetCol]: targetCards
    }));
    
    try {
      await api.put(`/applications/${cardId}/status`, {
        status: backendStatus,
        sendEmail: notifyOnDrag
      });
      
      toast.success(`Candidate moved to ${targetCol.charAt(0).toUpperCase() + targetCol.slice(1)}`);
      if (selectedJob) {
        // Fetch in background (silent refresh) to stay perfectly in sync
        await fetchPipeline(selectedJob.id, false);
      }
    } catch (err: any) {
      console.error("Error updating status", err);
      toast.error(err?.response?.data?.message || "Failed to move candidate status");
      // Rollback to original state on failure
      setPipelineData(originalPipelineData);
    }
  };

  const handleUpdateStatus = async (appId: string, targetStatus: string) => {
    const originalPipelineData = { ...pipelineData };
    
    // 1. Perform optimistic update instantly
    const nextPipelineData = { ...pipelineData };
    let foundApp: any = null;
    let sourceCol: string = "";
    
    for (const colKey of Object.keys(nextPipelineData)) {
      const idx = nextPipelineData[colKey].findIndex(a => a.id === appId);
      if (idx !== -1) {
        [foundApp] = nextPipelineData[colKey].splice(idx, 1);
        sourceCol = colKey;
        break;
      }
    }
    
    if (foundApp) {
      const targetCol = Object.keys(statusMap).find(k => statusMap[k] === targetStatus) || "applied";
      const updatedApp = { ...foundApp, status: targetStatus };
      nextPipelineData[targetCol] = [...(nextPipelineData[targetCol] || []), updatedApp];
      setPipelineData(nextPipelineData);
    }

    try {
      await api.put(`/applications/${appId}/status`, { 
        status: targetStatus,
        sendEmail: sendEmailNotify
      });
      toast.success(`Candidate status updated successfully`);
      setSelectedCandidate(null);
      if (selectedJob) {
        // Fetch in background (silent refresh) to stay perfectly in sync
        await fetchPipeline(selectedJob.id, false);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update status");
      // Rollback to original state on failure
      setPipelineData(originalPipelineData);
    }
  };

  const allApps = Object.values(pipelineData).flat();
  const avgScore = allApps.length > 0
    ? Math.round(allApps.reduce((sum, app) => sum + app.matchingScore, 0) / allApps.length)
    : 74;

  return (
    <div className="animate-fade-in flex flex-col h-full overflow-hidden absolute inset-0 pt-6 px-6 pb-2">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div className="relative">
          <select
            value={selectedJob?.id || ""}
            onChange={(e) => {
              const job = jobs.find(j => j.id === e.target.value);
              if (job) {
                setSelectedJob(job);
                navigate(`/pipeline?jobId=${job.id}`);
              }
            }}
            className="w-[320px] bg-background/5 border border-foreground/10 backdrop-blur-xl rounded-xl px-4 py-2.5 font-bold text-lg text-foreground focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer pr-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id} className="bg-card text-foreground font-medium text-sm">
                {j.title}
              </option>
            ))}
            {jobs.length === 0 && (
              <option value="" className="bg-card text-foreground font-medium text-sm">
                No jobs available
              </option>
            )}
          </select>
          <ChevronDown className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex gap-6 items-center text-sm">
          <div className="flex items-center gap-2 text-muted-foreground border-r border-foreground/10 pr-6">
            <input
              type="checkbox"
              id="notifyOnDrag"
              checked={notifyOnDrag}
              onChange={(e) => setNotifyOnDrag(e.target.checked)}
              className="w-4 h-4 rounded border-foreground/20 text-cyan-500 focus:ring-cyan-500/50 bg-background/5 accent-cyan-500 cursor-pointer"
            />
            <label htmlFor="notifyOnDrag" className="text-xs font-semibold cursor-pointer select-none">
              Email Candidate on Drag
            </label>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-foreground font-mono text-lg font-bold">{allApps.length}</span> Candidates
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-cyan-700 dark:text-cyan-400 font-mono text-lg font-bold">{avgScore}%</span> Avg Score
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-emerald-400 font-mono text-lg font-bold">Live</span> Pipeline sync
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          <span className="text-muted-foreground text-sm font-medium">Updating board...</span>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {columns.map(col => {
            const cards = pipelineData[col.id] || [];
            return (
              <div 
                key={col.id} 
                className="min-w-[280px] w-[280px] flex flex-col h-full rounded-xl bg-foreground/[0.02] border border-foreground/5 relative overflow-hidden" 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Accent Strip */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${col.color} ${col.glow}`} />
                
                <div className="p-4 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.01]">
                  <h3 className="font-semibold text-foreground">{col.title}</h3>
                  <span className="bg-foreground/10 text-muted-foreground text-xs px-2 py-0.5 rounded-full font-mono">{cards.length}</span>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {cards.map((app) => {
                    const cand = candidatesMap[app.candidateId];
                    return (
                      <div 
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id, col.id)}
                        onClick={() => setSelectedCandidate({ ...app, name: cand ? `${cand.firstName} ${cand.lastName}` : "Candidate", email: cand?.email })}
                        className={`bg-foreground/5 border border-foreground/10 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-200 group relative ${col.id === 'rejected' ? 'opacity-70' : ''} hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                              {cand ? (cand.firstName.charAt(0) + cand.lastName.charAt(0)).toUpperCase() : "CD"}
                            </div>
                            <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                              {cand ? `${cand.firstName} ${cand.lastName}` : "Loading..."}
                            </span>
                          </div>
                          <PulseOrb score={Math.round(app.matchingScore)} size="sm" />
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {app.matchedSkills?.slice(0, 3).map((s: string) => (
                            <span key={s} className="bg-foreground/5 border border-foreground/10 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">{s}</span>
                          ))}
                          {(!app.matchedSkills || app.matchedSkills.length === 0) && (
                            <span className="text-[10px] text-muted-foreground/60 italic">No skill match</span>
                          )}
                        </div>

                        {col.id === 'interview' && (
                          <div className="mb-2 text-[11px] text-violet-700 dark:text-violet-400 bg-violet-500/10 py-1 px-2 rounded-md flex items-center border border-violet-500/20">
                            📅 Interview scheduled
                          </div>
                        )}

                        <div className="text-[11px] text-muted-foreground/80 flex justify-between items-center">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                          
                          <div className="hidden group-hover:flex gap-1">
                            <button className="p-1 hover:text-foreground transition-colors" title="Quick View"><Eye className="w-3.5 h-3.5"/></button>
                            <button className="p-1 hover:text-foreground transition-colors" title="Email"><Mail className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>

                        {col.id === 'hired' && (
                          <div className="absolute inset-0 pointer-events-none rounded-lg border border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse" />
                        )}
                      </div>
                    );
                  })}

                  {cards.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-foreground/10 rounded-lg flex items-center justify-center text-muted-foreground/80 text-sm">
                      Drag candidates here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Modal */}
      {selectedCandidate && (
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="max-w-[720px] bg-card border-border backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col md:flex-row">
               {/* Left Section */}
               <div className="w-full md:w-[60%] p-6 border-b md:border-b-0 md:border-r border-border relative">
                  <button onClick={() => setSelectedCandidate(null)} className="absolute top-4 right-4 text-muted-foreground/80 hover:text-foreground"><X className="w-5 h-5"/></button>
                  
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/30">
                      {selectedCandidate.name.split(" ").map((n: string) => n.charAt(0)).join("").toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedCandidate.name}</h2>
                      <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                        <span>{selectedCandidate.email}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-foreground/10 mb-8">
                    <FileText className="w-4 h-4 mr-2" /> Download CV / Resume
                  </Button>

                  {/* Vertical Timeline Status */}
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Pipeline Status</h3>
                  <div className="relative border-l border-foreground/10 ml-2 pl-6 space-y-6 max-h-[160px] overflow-y-auto">
                     {selectedCandidate.statusHistory?.map((h: any, idx: number) => (
                       <div key={idx} className="relative">
                          <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-cyan-500/50 shadow-[0_0_10px_currentColor] top-1" />
                          <p className="text-sm font-medium text-foreground mb-0.5">
                            {h.status.charAt(0) + h.status.slice(1).toLowerCase()}
                          </p>
                          <p className="text-xs text-muted-foreground/80">{new Date(h.changedAt).toLocaleString()}</p>
                       </div>
                     ))}
                     {(!selectedCandidate.statusHistory || selectedCandidate.statusHistory.length === 0) && (
                       <div className="relative">
                          <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-slate-500 top-1" />
                          <p className="text-sm font-medium text-foreground mb-0.5">Applied</p>
                          <p className="text-xs text-muted-foreground/80">{new Date(selectedCandidate.appliedAt).toLocaleString()}</p>
                       </div>
                     )}
                  </div>

                  {/* Notification Choice */}
                  <div className="flex items-center gap-2 mb-4 mt-6">
                    <input
                      type="checkbox"
                      id="sendEmailNotify"
                      checked={sendEmailNotify}
                      onChange={(e) => setSendEmailNotify(e.target.checked)}
                      className="w-4 h-4 rounded border-foreground/20 text-cyan-500 focus:ring-cyan-500/50 bg-background/5 accent-cyan-500 cursor-pointer"
                    />
                    <label htmlFor="sendEmailNotify" className="text-xs font-semibold cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors">
                      Send email notification to candidate
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => handleUpdateStatus(selectedCandidate.id, "HIRED")}
                      className="col-span-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                    >
                      Move to Hired ✨
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Scheduling feature integration coming soon!")}
                      className="border-violet-500/50 text-violet-700 dark:text-violet-400 hover:bg-violet-500/10"
                    >
                      <Calendar className="w-4 h-4 mr-2"/> Schedule
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(selectedCandidate.id, "REJECTED")}
                      className="border-rose-500/50 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10"
                    >
                      Reject
                    </Button>
                  </div>
               </div>

               {/* Right Section */}
               <div className="w-full md:w-[40%] bg-foreground/[0.02] p-6 flex flex-col items-center">
                  <div className="text-center mb-8">
                     <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">AI Match Analysis</p>
                     <PulseOrb score={Math.round(selectedCandidate.matchingScore)} size="lg" className="mx-auto" />
                  </div>

                  <div className="w-full space-y-4 mb-8">
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Skills Match</span>
                          <span className="text-emerald-500">{Math.round(selectedCandidate.scoreBreakdown?.skills || 0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${selectedCandidate.scoreBreakdown?.skills || 0}%` }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Experience</span>
                          <span className="text-emerald-500">{Math.round(selectedCandidate.scoreBreakdown?.experience || 0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${selectedCandidate.scoreBreakdown?.experience || 0}%` }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Culture Fit</span>
                          <span className="text-amber-500">{Math.round(selectedCandidate.scoreBreakdown?.culture || 0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${selectedCandidate.scoreBreakdown?.culture || 0}%` }} />
                        </div>
                     </div>
                  </div>

                  <div className="w-full space-y-4 flex-1">
                     <div>
                        <p className="text-xs text-muted-foreground mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedCandidate.matchedSkills?.map((s: string) => (
                             <span key={s} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">{s} ✓</span>
                           ))}
                           {(!selectedCandidate.matchedSkills || selectedCandidate.matchedSkills.length === 0) && (
                             <span className="text-xs text-muted-foreground/60 italic">None matched</span>
                           )}
                        </div>
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedCandidate.missingSkills?.map((s: string) => (
                             <span key={s} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-1 rounded text-xs border border-rose-500/20">{s} ✗</span>
                           ))}
                           {(!selectedCandidate.missingSkills || selectedCandidate.missingSkills.length === 0) && (
                             <span className="text-xs text-muted-foreground/60 italic">None missing</span>
                           )}
                        </div>
                     </div>
                  </div>

                  <a href="#" className="flex items-center text-sm text-cyan-700 dark:text-cyan-400 hover:underline mt-4">
                    View Full Profile <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
               </div>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
