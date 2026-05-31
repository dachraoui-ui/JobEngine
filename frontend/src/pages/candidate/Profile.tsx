import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Globe, Lock } from "lucide-react";

export default function Profile() {
  const { user, login } = useAuth();
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Basic Info States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Candidate Profile States
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"JUNIOR" | "MID" | "SENIOR">("JUNIOR");
  const [jobType, setJobType] = useState<"FULL_TIME" | "PART_TIME" | "INTERNSHIP">("FULL_TIME");
  const [location, setLocation] = useState("");
  const [remoteOk, setRemoteOk] = useState(false);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  useEffect(() => {
    if (!user) return;
    
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhone(user.phone || "");

    // Fetch Candidate Profile
    api.get(`/users/${user.id}/candidate-profile`)
      .then((res) => {
        const profile = res.data.data;
        if (profile) {
          setSkills(profile.skills || []);
          setSummary(profile.summary || "");
          setExperienceLevel(profile.experienceLevel || "JUNIOR");
          setVisibility(profile.visibility || "PUBLIC");
          
          if (profile.preferences) {
            setJobType(profile.preferences.jobType || "FULL_TIME");
            setLocation(profile.preferences.location || "");
            setRemoteOk(profile.preferences.remoteOk || false);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load candidate profile", err);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Update basic user details
      const userRes = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        phone,
      });

      // Update local storage and context
      login(
        localStorage.getItem("token") || "",
        localStorage.getItem("refreshToken") || "",
        userRes.data.data
      );

      // 2. Update candidate profile preferences and details
      await api.put(`/users/${user.id}/candidate-profile`, {
        skills,
        experienceLevel,
        summary,
        preferences: {
          jobType,
          location,
          remoteOk,
        },
      });

      // 3. Update visibility
      await api.put(`/users/${user.id}/visibility?visibility=${visibility}`);

      toast.success("Profile saved successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "NT";

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and neural preferences.</p>
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-black hover:bg-primary/90 glow-shadow self-start md:self-auto min-w-[120px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Avatar Card */}
          <GlassCard className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
              <span className="text-3xl font-bold text-primary">{initials}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={visibility === "PUBLIC" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
                {visibility === "PUBLIC" ? <Globe className="w-3.5 h-3.5 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}
                {visibility === "PUBLIC" ? "Public Profile" : "Private Profile"}
              </Badge>
            </div>
          </GlassCard>

          {/* Visibility Controls */}
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Profile Visibility</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visibility-toggle" className="text-sm font-medium">Public Search</Label>
                <p className="text-xs text-muted-foreground">Allow recruiters to discover your profile.</p>
              </div>
              <Switch 
                id="visibility-toggle"
                checked={visibility === "PUBLIC"}
                onCheckedChange={(checked) => setVisibility(checked ? "PUBLIC" : "PRIVATE")}
              />
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">First Name</label>
                  <Input 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-foreground/5 border-foreground/10 text-foreground focus:border-primary/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Last Name</label>
                  <Input 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-foreground/5 border-foreground/10 text-foreground focus:border-primary/50" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Email (Read Only)</label>
                  <Input 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-black/20 border-foreground/5 text-muted-foreground/80 opacity-70 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Phone Number</label>
                  <Input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="bg-foreground/5 border-foreground/10 text-foreground focus:border-primary/50" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Professional Summary</label>
                <Textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Tell recruiters about your skills and goals..."
                  className="bg-foreground/5 border-foreground/10 text-foreground focus:border-primary/50 h-24" 
                />
              </div>
            </div>
          </GlassCard>

          {/* Preferences & Experience */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Preferences & Level</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Experience Level</label>
                  <select 
                    value={experienceLevel}
                    onChange={(e: any) => setExperienceLevel(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="JUNIOR" className="bg-card text-foreground">Junior</option>
                    <option value="MID" className="bg-card text-foreground">Mid</option>
                    <option value="SENIOR" className="bg-card text-foreground">Senior</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Preferred Job Type</label>
                  <select 
                    value={jobType}
                    onChange={(e: any) => setJobType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="FULL_TIME" className="bg-card text-foreground">Full-Time</option>
                    <option value="PART_TIME" className="bg-card text-foreground">Part-Time</option>
                    <option value="INTERNSHIP" className="bg-card text-foreground">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Preferred Location</label>
                  <Input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Paris, New York"
                    className="bg-foreground/5 border-foreground/10 text-foreground focus:border-primary/50" 
                  />
                </div>
                <div className="flex items-center justify-between sm:pt-8">
                  <div className="space-y-0.5">
                    <Label htmlFor="remote-toggle" className="text-sm font-medium">Open to Remote</Label>
                    <p className="text-xs text-muted-foreground">Show interest in fully remote roles.</p>
                  </div>
                  <Switch 
                    id="remote-toggle"
                    checked={remoteOk}
                    onCheckedChange={(checked) => setRemoteOk(checked)}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Skills Management */}
          <GlassCard className="p-6 border-secondary/20 relative overflow-hidden">
            <div className="absolute w-full h-1 bg-gradient-to-r from-primary to-secondary top-0 left-0" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Neural Skills</h3>
              <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">Auto-synced with CV</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm flex items-center gap-1 group cursor-pointer hover:bg-primary/20 transition-colors">
                  {skill} 
                  <span className="opacity-60 hover:opacity-100 transition-opacity ml-1 text-xs" onClick={() => setSkills(skills.filter(s => s !== skill))}>×</span>
                </span>
              ))}
              <input 
                type="text" 
                placeholder="+ Add Skill" 
                className="bg-transparent text-sm w-24 outline-none text-muted-foreground placeholder:text-muted-foreground/80 py-1.5 px-3 border border-dashed border-foreground/20 rounded-full focus:border-primary/50" 
                onKeyDown={(e: any) => { 
                  if (e.key === 'Enter') { 
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.target.value.trim()) {
                      if (!skills.includes(e.target.value.trim())) {
                        setSkills([...skills, e.target.value.trim()]);
                      }
                      e.target.value = ''; 
                    }
                  } 
                }} 
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </form>
  );
}

function Badge({ children, className }: any) {
  return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</div>;
}
