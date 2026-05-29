import { useState } from "react";
import { Search, MoreVertical, Download, X, Edit2, Shield, UserX, UserCheck, Trash2, Mail, ExternalLink, CalendarClock, Briefcase, FileText, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const mockUsers = [
  { id: 1, name: "Neural Talent", email: "talent@neural.org", role: "Candidate", status: "Active 🟢", joined: "Mar 10, 2026", lastActive: "2h ago", skills: ["React", "TypeScript", "Node.js"], cv: "Uploaded", apps: 12 },
  { id: 2, name: "TechCorp Labs", email: "hr@techcorp.com", role: "Recruiter", status: "Active 🟢", joined: "Feb 28, 2026", lastActive: "1d ago", company: "TechCorp Labs", companyUrl: "techcorp.com" },
  { id: 3, name: "John Doe", email: "john@example.com", role: "Recruiter", status: "Pending Verification 🟡", joined: "Mar 15, 2026", lastActive: "5h ago", company: "NextGen Software", companyUrl: "nextgen.io" },
  { id: 4, name: "System Admin", email: "admin@jobengine.io", role: "Admin", status: "Active 🟢", joined: "Jan 01, 2026", lastActive: "Now" },
  { id: 5, name: "Jane Smith", email: "jane.smith@dev.net", role: "Candidate", status: "Inactive 🔴", joined: "Jan 20, 2026", lastActive: "1mo ago", skills: ["Product Management"], cv: "Outdated", apps: 0 },
  { id: 6, name: "CloudWorks Info", email: "careers@cloudworks.io", role: "Recruiter", status: "Active 🟢", joined: "Mar 01, 2026", lastActive: "2d ago", company: "CloudWorks", companyUrl: "cloudworks.io" },
  { id: 7, name: "Sarah Connor", email: "s.connor@sky.net", role: "Candidate", status: "Active 🟢", joined: "Feb 10, 2026", lastActive: "10m ago", skills: ["AI", "Robotics", "Python"], cv: "Uploaded", apps: 3 },
  { id: 8, name: "Felix Wagner", email: "felix.w@design.co", role: "Candidate", status: "Active 🟢", joined: "Mar 22, 2026", lastActive: "1h ago", skills: ["UI/UX", "Figma", "CSS"], cv: "Uploaded", apps: 7 },
  { id: 9, name: "DataFlow Ltd.", email: "hr@dataflow.com", role: "Recruiter", status: "Inactive 🔴", joined: "Oct 15, 2025", lastActive: "6mo ago", company: "DataFlow", companyUrl: "dataflow.com" },
  { id: 10, name: "Omar Nabil", email: "omar@data-science.org", role: "Candidate", status: "Pending Verification 🟡", joined: "Mar 25, 2026", lastActive: "30m ago", skills: ["Python", "Machine Learning"], cv: "Uploaded", apps: 1 },
];

export default function Users() {
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewUser, setViewUser] = useState<typeof mockUsers[0] | null>(null);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(mockUsers.map(u => u.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const getStatusDisplay = (statusStr: string) => {
     const text = statusStr.slice(0, -2).trim();
     const icon = statusStr.slice(-1);
     const color = icon === '🟢' ? 'text-emerald-400' : icon === '🟡' ? 'text-amber-400' : 'text-rose-400';
     const dotClass = icon === '🟢' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : icon === '🟡' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
     return (
        <span className="flex items-center text-sm gap-2">
           <span className={`w-2 h-2 rounded-full ${dotClass}`} />
           <span className={color}>{text}</span>
        </span>
     );
  }

  const roleStyle = (role: string) => {
     if (role === 'Admin') return "bg-coral-500/10 border-coral-500/20 text-[#FF7A59]"; // approx coral
     if (role === 'Recruiter') return "bg-violet-500/10 border-violet-500/20 text-violet-400";
     return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
  }

  const filteredUsers = mockUsers.filter(u => {
     const textMatch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
     const roleMatch = filterRole === "All" || u.role === filterRole;
     const stStatus = u.status.slice(0, -2).trim(); // Remove emoji
     const reqStatus = filterStatus === "All" ? "All" : filterStatus === "Pending" ? "Pending Verification" : filterStatus;
     const statusMatch = filterStatus === "All" || stStatus === reqStatus;
     return textMatch && roleMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Registry</h1>
          <p className="text-muted-foreground mt-1">1,247 users</p>
        </div>
        <Button variant="outline" className="border-border text-foreground bg-foreground/5 hover:bg-foreground/10 backdrop-blur-md">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex gap-4 flex-wrap items-center bg-foreground/[0.02]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name or email... (⌘K)" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-foreground/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-cyan-500/50 outline-none placeholder:text-muted-foreground/80" 
          />
        </div>
        <div className="relative">
           <select 
             value={filterRole} onChange={e => setFilterRole(e.target.value)}
             className="bg-black/20 border border-foreground/10 rounded-lg px-4 py-2.5 pr-8 text-sm text-muted-foreground outline-none appearance-none cursor-pointer hover:border-foreground/20"
           >
             <option value="All">All Roles</option>
             <option value="Admin">Admin</option>
             <option value="Recruiter">Recruiter</option>
             <option value="Candidate">Candidate</option>
           </select>
        </div>
        <div className="relative">
           <select 
             value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
             className="bg-black/20 border border-foreground/10 rounded-lg px-4 py-2.5 pr-8 text-sm text-muted-foreground outline-none appearance-none cursor-pointer hover:border-foreground/20"
           >
             <option value="All">Status: All</option>
             <option value="Active">Active</option>
             <option value="Inactive">Inactive</option>
             <option value="Pending">Pending</option>
           </select>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(0,212,255,0.3)]">Filter</Button>
      </GlassCard>

      {/* Bulk Actions Sliding Bar */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <GlassCard className="flex items-center gap-6 px-6 py-3 border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(0,212,255,0.15)] bg-card">
             <span className="font-semibold text-foreground">{selectedIds.length} selected</span>
             <div className="h-4 w-px bg-foreground/20" />
             <div className="flex gap-2">
                <Button size="sm" className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20">Activate</Button>
                <Button size="sm" className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">Deactivate</Button>
                <Button size="sm" className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20">Delete</Button>
             </div>
          </GlassCard>
      </div>

      {/* User Table */}
      <GlassCard className="p-0 overflow-hidden bg-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/5 text-muted-foreground text-xs uppercase tracking-widest pl-2">
                <th className="p-4 pl-6 w-12"><input type="checkbox" onChange={toggleSelectAll} checked={mockUsers.length > 0 && selectedIds.length === mockUsers.length} className="rounded border-foreground/20 accent-cyan-500 cursor-pointer" /></th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold hidden md:table-cell">Joined</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Last Active</th>
                <th className="p-4 font-semibold pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={`border-b border-foreground/[0.02] transition-colors group ${selectedIds.includes(user.id) ? 'bg-cyan-500/[0.04]' : 'hover:bg-cyan-500/[0.02]'}`}>
                  <td className="p-4 pl-6"><input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelect(user.id)} className="rounded border-foreground/20 accent-cyan-500 cursor-pointer" /></td>
                  <td className="p-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-foreground shrink-0 border border-foreground/10 group-hover:border-cyan-500/30 transition-colors">
                        {user.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground leading-snug tracking-tight">{user.name}</p>
                        <p className="text-xs text-muted-foreground/80">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${roleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusDisplay(user.status)}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{user.joined}</td>
                  <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{user.lastActive}</td>
                  <td className="p-4 pr-6 text-right relative group/menu">
                    <button className="text-muted-foreground/80 hover:text-foreground p-2 rounded-full hover:bg-foreground/10 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    {/* Hover menu mock */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 w-40 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 flex flex-col py-1">
                       <button onClick={() => setViewUser(user)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-left w-full">View Details</button>
                       <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-left w-full">Edit</button>
                       <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-left w-full">Toggle Status</button>
                       <button className="px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left w-full border-t border-foreground/5 mt-1 pt-2">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination bar */}
         <div className="px-6 py-4 border-t border-foreground/5 flex items-center justify-between text-sm text-muted-foreground">
            <span>1-10 of 1,247</span>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Rows per page: <select className="bg-transparent text-foreground outline-none"><option className="bg-card">10</option><option className="bg-card">20</option></select></span>
              <div className="flex gap-1">
                 <button className="px-3 py-1 rounded bg-foreground/5 hover:bg-foreground/10">&lt;</button>
                 <button className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400">1</button>
                 <button className="px-3 py-1 rounded bg-foreground/5 hover:bg-foreground/10">2</button>
                 <button className="px-3 py-1 rounded bg-foreground/5 hover:bg-foreground/10">3</button>
                 <button className="px-3 py-1 rounded bg-foreground/5 hover:bg-foreground/10">&gt;</button>
              </div>
           </div>
        </div>
      </GlassCard>

      {/* User Detail Modal */}
      {viewUser && (
        <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
          <DialogContent className="max-w-md bg-card border border-border backdrop-blur-xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.7)]">
             {/* Dynamic Top Accent Bar */}
             <div className={`h-[3px] w-full ${viewUser.role === 'Admin' ? 'bg-[#FF7A59]' : viewUser.role === 'Recruiter' ? 'bg-violet-500' : 'bg-cyan-500'}`} />
             
             <div className="p-6">
                <button onClick={() => setViewUser(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-foreground/10"><X className="w-5 h-5"/></button>
                
                <div className="flex flex-col items-center mb-6">
                   <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center font-bold text-3xl text-foreground border-2 border-foreground/10 mb-4 shadow-xl">
                      {viewUser.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
                   </div>
                   <h2 className="text-xl font-bold text-foreground mb-1">{viewUser.name}</h2>
                   <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 border rounded-full text-xs font-semibold ${roleStyle(viewUser.role)}`}>{viewUser.role}</span>
                      {getStatusDisplay(viewUser.status)}
                   </div>
                   <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"><Mail className="w-4 h-4"/> {viewUser.email}</span>
                   </div>
                </div>

                <div className="space-y-4 bg-foreground/[0.02] rounded-xl p-4 border border-foreground/5">
                   <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><CalendarClock className="w-4 h-4"/> Joined {viewUser.joined}</span>
                      <span>Last active {viewUser.lastActive}</span>
                   </div>

                   {/* Conditional Role Details */}
                   {viewUser.role === 'Recruiter' && (
                      <div className="pt-4 border-t border-foreground/10 mt-4">
                         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-3">Company Information</p>
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-foreground/5 rounded"><Briefcase className="w-4 h-4 text-violet-400"/></div>
                                <div>
                                   <p className="font-semibold text-foreground text-sm">{viewUser.company}</p>
                                   <a href="#" className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">{viewUser.companyUrl} <ExternalLink className="w-3 h-3"/></a>
                                </div>
                             </div>
                          </div>

                         {viewUser.status.includes("Pending Verification") && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-foreground/10">
                               <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Verify Company</Button>
                               <Button size="sm" variant="outline" className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"><UserX className="w-4 h-4 mr-1.5"/> Reject</Button>
                            </div>
                         )}
                      </div>
                   )}

                   {viewUser.role === 'Candidate' && (
                      <div className="pt-4 border-t border-foreground/10 mt-4">
                         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80 mb-3">Candidate Profile</p>
                         
                          <div className="grid grid-cols-2 gap-4 mb-4">
                             <div className="bg-foreground/5 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">Applications</p>
                                <p className="font-mono text-lg text-foreground font-bold">{viewUser.apps}</p>
                             </div>
                             <div className="bg-foreground/5 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">CV Status</p>
                                <p className="font-semibold text-sm text-cyan-400 flex items-center gap-1.5 mt-0.5"><FileText className="w-4 h-4"/> {viewUser.cv}</p>
                             </div>
                          </div>

                         {viewUser.skills && (
                            <div>
                               <p className="text-xs text-muted-foreground mb-2">Detected Skills</p>
                               <div className="flex flex-wrap gap-1.5">
                                  {viewUser.skills.map(s => (
                                     <span key={s} className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 rounded text-xs text-muted-foreground">{s}</span>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                   )}
                </div>

                 <div className="mt-8 pt-4 border-t border-foreground/10 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2"><Edit2 className="w-4 h-4 mr-1.5"/> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 text-xs">Reset Pwd</Button>
                    </div>
                   <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2"><Trash2 className="w-4 h-4 mr-1.5"/> Delete User</Button>
                </div>
             </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
