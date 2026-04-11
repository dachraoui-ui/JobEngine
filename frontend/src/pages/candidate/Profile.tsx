import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "MongoDB", "Python"]);
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and neural preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Avatar Card */}
          <GlassCard className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              <span className="text-3xl font-bold text-primary">NT</span>
            </div>
            <h2 className="text-xl font-bold text-white">Neural Talent</h2>
            <p className="text-sm text-muted-foreground mb-4">Software Engineer</p>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit cursor-pointer">
              🌐 Public Profile
            </Badge>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">First Name</label>
                  <Input defaultValue="Neural" className="bg-foreground/5 border-foreground/10 text-white focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Last Name</label>
                  <Input defaultValue="Talent" className="bg-foreground/5 border-foreground/10 text-white focus:border-primary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email (Read Only)</label>
                <Input defaultValue="talent@neural.org" disabled className="bg-black/20 border-foreground/5 text-muted-foreground/80 opacity-70" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Professional Summary</label>
                <Textarea defaultValue="Passionate software engineer focused on building scalable web applications. AI and neural networks enthusiast." className="bg-foreground/5 border-foreground/10 text-white focus:border-primary/50 h-24" />
              </div>
            </div>
            <Button className="mt-6 bg-primary text-black hover:bg-primary/90 glow-shadow">Save Changes</Button>
          </GlassCard>

          {/* Skills Management */}
          <GlassCard className="p-6 border-secondary/20 relative overflow-hidden">
             <div className="absolute w-full h-1 bg-gradient-to-r from-primary to-secondary top-0 left-0" />
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-white">Neural Skills</h3>
               <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">Auto-synced with CV</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm flex items-center gap-1 group cursor-pointer hover:bg-primary/20 transition-colors">
                  {skill} <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-xs" onClick={() => setSkills(skills.filter(s => s !== skill))}>×</span>
                </span>
              ))}
              <input type="text" placeholder="+ Add Skill" className="bg-transparent text-sm w-24 outline-none text-muted-foreground placeholder:text-muted-foreground/80 py-1.5 px-3 border border-dashed border-foreground/20 rounded-full focus:border-primary/50" onKeyDown={(e: any) => { if (e.key === 'Enter' && e.target.value) { setSkills([...skills, e.target.value]); e.target.value = ''; } }} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
// Add the Badge component import if needed or simple inline style
function Badge({ children, className, variant }: any) {
  return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</div>
}
