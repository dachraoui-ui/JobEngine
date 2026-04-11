import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mail, Calendar, X, Eye, ArrowRight, FileText, ChevronDown } from "lucide-react";

export default function Pipeline() {
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const columns = [
    { id: "applied", title: "Applied", count: 8, color: "bg-slate-500", glow: "" },
    { id: "shortlisted", title: "Shortlisted", count: 5, color: "bg-amber-500", glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]" },
    { id: "interview", title: "Interview", count: 3, color: "bg-violet-500", glow: "shadow-[0_0_10px_rgba(139,92,246,0.5)]" },
    { id: "rejected", title: "Rejected", count: 4, color: "bg-rose-500", glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]" },
    { id: "hired", title: "Hired", count: 1, color: "bg-emerald-500", glow: "shadow-[0_0_15px_rgba(52,211,153,0.6)]" },
  ];

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    setDraggedCard(cardId);
    e.dataTransfer.setData("cardId", cardId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="animate-fade-in flex flex-col h-full overflow-hidden absolute inset-0 pt-6 px-6 pb-2">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <GlassCard className="p-2 px-4 cursor-pointer hover:bg-foreground/10 flex items-center justify-between w-[300px]">
          <span className="font-bold text-lg text-white">Senior React Developer</span>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </GlassCard>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-white font-mono text-lg font-bold">23</span> Candidates</div>
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-cyan-400 font-mono text-lg font-bold">74%</span> Avg Score</div>
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-emerald-400 font-mono text-lg font-bold">5.2d</span> Pipeline Avg</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {columns.map(col => (
          <div key={col.id} className="min-w-[280px] w-[280px] flex flex-col h-full rounded-xl bg-foreground/[0.02] border border-foreground/5 relative overflow-hidden" onDragOver={handleDragOver}>
            {/* Accent Strip */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${col.color} ${col.glow}`} />
            
            <div className="p-4 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.01]">
              <h3 className="font-semibold text-white">{col.title}</h3>
              <span className="bg-foreground/10 text-muted-foreground text-xs px-2 py-0.5 rounded-full font-mono">{col.count}</span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {/* Fake candidate mapping based on column for realistic data feel */}
              {[...Array(col.count)].map((_, i) => (
                <div 
                  key={`${col.id}-${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onClick={() => setSelectedCandidate({ name: "Alex Chen", score: 92, colId: col.id })}
                  className={`bg-foreground/5 border border-foreground/10 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-200 group relative ${col.id === 'rejected' ? 'opacity-70' : ''} hover:border-${col.color.split('-')[1]}-500/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">AC</div>
                       <span className="text-sm font-bold text-white shrink-0">Alex Chen</span>
                    </div>
                    <PulseOrb score={92 - (i*5)} size="sm" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-foreground/5 border border-foreground/10 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">React</span>
                    <span className="bg-foreground/5 border border-foreground/10 px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">TS</span>
                  </div>

                  {col.id === 'interview' && (
                    <div className="mb-2 text-[11px] text-violet-400 bg-violet-500/10 py-1 px-2 rounded-md flex items-center border border-violet-500/20">
                      📅 Mar 22, 2:00 PM
                    </div>
                  )}

                  <div className="text-[11px] text-muted-foreground/80 flex justify-between items-center">
                    Applied 3d ago
                    
                    {/* Hover actions */}
                    <div className="hidden group-hover:flex gap-1">
                       <button className="p-1 hover:text-white transition-colors" title="Quick View"><Eye className="w-3.5 h-3.5"/></button>
                       <button className="p-1 hover:text-white transition-colors" title="Email"><Mail className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>

                  {col.id === 'hired' && (
                     <div className="absolute inset-0 pointer-events-none rounded-lg border border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse" />
                  )}
                </div>
              ))}

              {col.count === 0 && (
                <div className="h-32 border-2 border-dashed border-foreground/10 rounded-lg flex items-center justify-center text-muted-foreground/80 text-sm">
                  Drag candidates here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="max-w-[720px] bg-[#0A0A0A]/95 border-foreground/10 backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col md:flex-row">
               {/* Left Section */}
               <div className="w-full md:w-[60%] p-6 border-b md:border-b-0 md:border-r border-foreground/10 relative">
                  <button onClick={() => setSelectedCandidate(null)} className="absolute top-4 right-4 text-muted-foreground/80 hover:text-white"><X className="w-5 h-5"/></button>
                  
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/30">AC</div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Alex Chen</h2>
                      <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                        <span>alex.chen@example.com</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-foreground/20 text-white hover:bg-foreground/10 mb-8">
                    <FileText className="w-4 h-4 mr-2" /> Download Full CV
                  </Button>

                  {/* Vertical Timeline Status */}
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Pipeline Status</h3>
                  <div className="relative border-l border-foreground/10 ml-2 pl-6 space-y-6">
                     <div className="relative">
                        <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-slate-500 shadow-[0_0_10px_currentColor] top-1" />
                        <p className="text-sm font-medium text-white mb-0.5">Applied</p>
                        <p className="text-xs text-muted-foreground/80">Mar 15, 2026</p>
                     </div>
                     <div className="relative">
                        <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_currentColor] top-1" />
                        <p className="text-sm font-medium text-white mb-0.5">Shortlisted</p>
                        <p className="text-xs text-muted-foreground/80">Mar 18, 2026</p>
                     </div>
                     <div className="relative p-3 bg-violet-500/10 rounded-lg border border-violet-500/20 -ml-2 -mt-2">
                        <span className="absolute -left-[24px] w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_currentColor] top-4 animate-pulse" />
                        <p className="text-sm font-medium text-violet-300 mb-0.5">Interview</p>
                        <p className="text-xs text-violet-400">Action Required</p>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <Button className="col-span-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)]">Move to Hired ✨</Button>
                    <Button variant="outline" className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10"><Calendar className="w-4 h-4 mr-2"/> Schedule</Button>
                    <Button variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10">Reject</Button>
                  </div>
               </div>

               {/* Right Section */}
               <div className="w-full md:w-[40%] bg-foreground/[0.02] p-6 flex flex-col items-center">
                  <div className="text-center mb-8">
                     <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">AI Match Analysis</p>
                     <PulseOrb score={92} size="lg" className="mx-auto" />
                  </div>

                  <div className="w-full space-y-4 mb-8">
                     <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Skills Match</span><span className="text-emerald-400">95%</span></div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[95%]" /></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Experience</span><span className="text-emerald-400">90%</span></div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[90%]" /></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Culture Fit</span><span className="text-amber-400">82%</span></div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-[82%]" /></div>
                     </div>
                  </div>

                  <div className="w-full space-y-4 flex-1">
                     <div>
                        <p className="text-xs text-muted-foreground mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-2">
                           <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">React ✓</span>
                           <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">TypeScript ✓</span>
                           <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">Node.js ✓</span>
                        </div>
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                           <span className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded text-xs border border-rose-500/20">GraphQL ✗</span>
                        </div>
                     </div>
                  </div>

                  <a href="#" className="flex items-center text-sm text-cyan-400 hover:underline mt-4">View Full Profile <ArrowRight className="w-4 h-4 ml-1" /></a>
               </div>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
