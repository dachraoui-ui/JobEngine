import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RecruiterProfile() {
  const companyValues = ["Innovation", "Teamwork", "Diversity & Inclusion", "Work-Life Balance", "Growth & Learning", "Transparency", "Remote-First", "Fast-Paced"];
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Company Profile</h1>
        <p className="text-muted-foreground">This information is shown to candidates when they view your job postings.</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center relative group overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <span className="text-4xl font-bold text-violet-400">TC</span>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white uppercase font-medium tracking-wider">Change Logo</span>
              </div>
            </div>
          </div>
          
          <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                <Input defaultValue="TechCorp" className="bg-foreground/5 border-foreground/10 focus:border-violet-500/50 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Industry</label>
                 <select className="flex h-10 w-full items-center justify-between rounded-md border text-white border-foreground/10 bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Company Size</label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border text-white border-foreground/10 bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>1-10</option>
                  <option selected>51-200</option>
                  <option>500+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <Input defaultValue="https://techcorp.ai" className="bg-foreground/5 border-foreground/10 focus:border-violet-500/50 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">About Your Company</label>
              <Textarea defaultValue="We build advanced AI solutions for modern businesses." className="bg-foreground/5 border-foreground/10 focus:border-violet-500/50 text-white min-h-[100px]" />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Culture & Values</label>
              <div className="flex flex-wrap gap-2">
                {companyValues.map((value, i) => (
                  <button key={value} className={`px-4 py-2 rounded-full border text-sm transition-all text-left ${i < 3 ? 'bg-violet-500/20 text-violet-300 border-violet-500/50' : 'bg-foreground/5 text-muted-foreground border-foreground/10 hover:border-foreground/20'}`}>
                    {i < 3 && '✓ '}{value}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.4)]">Save Profile</Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-foreground/10">Discard Changes</Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
