import { useState } from "react";
import { Search, MoreVertical, Download, X, Edit2, UserX, Trash2, Mail, ExternalLink, CalendarClock, Briefcase, FileText, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ADMIN_MOCK_USERS } from "@/data/adminMockData";


const CANDIDATE_DETAILS: Record<string, { skills: string[]; cv: string; apps: number }> = {
  "amina.haddad@example.com": { skills: ["React", "TypeScript", "Tailwind"], cv: "Uploaded", apps: 4 },
  "lucas.meyer@example.com": { skills: ["Node.js", "PostgreSQL"], cv: "Uploaded", apps: 2 },
  "sofia.rossi@example.com": { skills: ["Python", "SQL"], cv: "Uploaded", apps: 3 },
  "omar.khalil@example.com": { skills: ["Python", "FastAPI"], cv: "Uploaded", apps: 1 },
  "lina.benali@example.com": { skills: ["UX", "Figma"], cv: "Uploaded", apps: 5 },
  "hugo.martin@example.com": { skills: ["Java", "Spring"], cv: "Uploaded", apps: 2 },
  "nina.petrova@example.com": { skills: ["Go", "Docker"], cv: "Uploaded", apps: 3 },
  "karim.bensalem@example.com": { skills: ["React", "Redux"], cv: "Uploaded", apps: 6 },
  "salma.farah@example.com": { skills: ["Product", "Agile"], cv: "Uploaded", apps: 1 },
  "adam.kowalski@example.com": { skills: ["Data", "Pandas"], cv: "Uploaded", apps: 2 },
  "yasmine.nouri@example.com": { skills: ["TypeScript", "Next.js"], cv: "Uploaded", apps: 4 },
  "noah.dubois@example.com": { skills: ["QA", "Playwright"], cv: "Uploaded", apps: 1 },
  "layla.saeed@example.com": { skills: ["UI", "CSS"], cv: "Uploaded", apps: 3 },
  "matteo.ricci@example.com": { skills: ["Java", "Kafka"], cv: "Uploaded", apps: 2 },
  "farid.idrissi@example.com": { skills: ["Cloud", "AWS"], cv: "Uploaded", apps: 5 },
  "clara.nguyen@example.com": { skills: ["Analytics", "SQL"], cv: "Uploaded", apps: 2 },
  "gezeniamin@gmail.com": { skills: ["Java", "Spring"], cv: "Uploaded", apps: 1 },
  "dachraouia193@gmail.com": { skills: ["React", "Node.js"], cv: "Uploaded", apps: 2 },
  "ahmed.dachraoui03@gmail.com": { skills: ["React", "TypeScript"], cv: "Uploaded", apps: 1 },
  "dachraouia903@gmail.com": { skills: ["Support", "CRM"], cv: "Outdated", apps: 0 }
};

const RECRUITER_DETAILS: Record<string, { company: string; companyUrl: string }> = {
  "oubaied29@gmail.com": { company: "Oubaied Group", companyUrl: "oubaiedgroup.com" },
  "emma.laurent@example.com": { company: "Aurora Labs", companyUrl: "auroralabs.com" },
  "rami.kader@example.com": { company: "Northwind HR", companyUrl: "northwindhr.com" },
  "sara.elamrani@example.com": { company: "BluePeak Talent", companyUrl: "bluepeaktalent.com" },
  "julien.costa@example.com": { company: "Seaside Tech", companyUrl: "seasidetech.com" },
  "maha.zahid@example.com": { company: "BrightPath Careers", companyUrl: "brightpath.com" },
  "victor.silva@example.com": { company: "Silverline Hiring", companyUrl: "silverline.io" },
  "dalia.haddad@example.com": { company: "Atlas Systems", companyUrl: "atlasy.io" },
  "aziz.rahman@example.com": { company: "Vertex Staffing", companyUrl: "vertexstaffing.com" }
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const formatRelative = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
};

const buildStatus = (user: { role: string; isVerified?: boolean; isActive?: boolean }) => {
  const isActive = user.isActive !== false;
  const isVerified = user.isVerified !== false;
  if (user.role === "RECRUITER" && !isVerified) return "Pending Verification 🟡";
  if (!isActive) return "Inactive 🔴";
  return "Active 🟢";
};

const toRoleLabel = (role: string) => {
  if (role === "ADMIN") return "Admin";
  if (role === "RECRUITER") return "Recruiter";
  return "Candidate";
};

const mockUsers = [...ADMIN_MOCK_USERS]
  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  .map((user, index) => {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
    const role = toRoleLabel(user.role);
    const status = buildStatus(user);
    const lastActiveAt = user.createdAt;
    const candidateProfile = role === "Candidate" ? (CANDIDATE_DETAILS[user.email] || { skills: [], cv: "Not Uploaded", apps: 0 }) : undefined;
    const recruiterProfile = role === "Recruiter" ? RECRUITER_DETAILS[user.email] : undefined;

    return {
      id: index + 1,
      name,
      email: user.email,
      role,
      status,
      joined: formatDate(user.createdAt),
      lastActive: formatRelative(lastActiveAt),
      skills: candidateProfile?.skills,
      cv: candidateProfile?.cv,
      apps: candidateProfile?.apps,
      company: recruiterProfile?.company,
      companyUrl: recruiterProfile?.companyUrl
    };
  });

const toCsvValue = (value: string | number) => {
  const escaped = String(value ?? "").replace(/"/g, '""');
  return `"${escaped}"`;
};

const downloadCsv = (filename: string, rows: Array<Record<string, string | number>>) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => toCsvValue(row[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function Users() {
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewUser, setViewUser] = useState<typeof mockUsers[0] | null>(null);

  const getStatusDisplay = (statusStr: string) => {
     const text = statusStr.slice(0, -2).trim();
     const icon = statusStr.slice(-1);
     const color = icon === '🟢'
       ? 'text-emerald-700 dark:text-emerald-400'
       : icon === '🟡'
         ? 'text-amber-700 dark:text-amber-400'
         : 'text-rose-700 dark:text-rose-400';
     const dotClass = icon === '🟢'
       ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
       : icon === '🟡'
         ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
         : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
     return (
        <span className="flex items-center text-sm gap-2">
           <span className={`w-2 h-2 rounded-full ${dotClass}`} />
           <span className={color}>{text}</span>
        </span>
     );
  }

  const roleStyle = (role: string) => {
     if (role === 'Admin') return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
     if (role === 'Recruiter') return "bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-400";
     return "bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400";
  }

  const filteredUsers = mockUsers.filter(u => {
     const textMatch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
     const roleMatch = filterRole === "All" || u.role === filterRole;
     const stStatus = u.status.slice(0, -2).trim(); // Remove emoji
     const reqStatus = filterStatus === "All" ? "All" : filterStatus === "Pending" ? "Pending Verification" : filterStatus;
     const statusMatch = filterStatus === "All" || stStatus === reqStatus;
     return textMatch && roleMatch && statusMatch;
  });

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.includes(u.id));

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredUsers.map(u => u.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleExport = () => {
    const exportUsers = selectedIds.length > 0
      ? filteredUsers.filter((u) => selectedIds.includes(u.id))
      : filteredUsers;

    const rows = exportUsers.map((u) => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Status: u.status.slice(0, -2).trim(),
      Joined: u.joined,
      "Last Active": u.lastActive
    }));

    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`users-${today}.csv`, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Registry</h1>
          <p className="text-muted-foreground mt-1">{filteredUsers.length} of {mockUsers.length} users</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-border text-foreground bg-foreground/5 hover:bg-foreground/10 backdrop-blur-md">
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
            className="w-full bg-foreground/5 dark:bg-black/20 border border-foreground/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-cyan-500/50 outline-none placeholder:text-muted-foreground/80"
          />
        </div>
        <div className="relative">
           <select 
             value={filterRole} onChange={e => setFilterRole(e.target.value)}
             className="bg-foreground/5 dark:bg-black/20 border border-foreground/10 rounded-lg px-4 py-2.5 pr-8 text-sm text-foreground outline-none appearance-none cursor-pointer hover:border-foreground/20"
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
               className="bg-foreground/5 dark:bg-black/20 border border-foreground/10 rounded-lg px-4 py-2.5 pr-8 text-sm text-foreground outline-none appearance-none cursor-pointer hover:border-foreground/20"
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
                 <Button size="sm" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30">Deactivate</Button>
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
                <th className="p-4 pl-6 w-12"><input type="checkbox" onChange={toggleSelectAll} checked={allFilteredSelected} className="rounded border-foreground/20 accent-cyan-500 cursor-pointer" /></th>
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
