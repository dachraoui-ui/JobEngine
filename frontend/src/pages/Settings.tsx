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
import { 
  User as UserIcon, 
  Building2, 
  ShieldCheck, 
  Bell, 
  Loader2, 
  Check, 
  Globe, 
  Phone, 
  Mail, 
  Lock,
  Building
} from "lucide-react";

export default function Settings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "company" | "security" | "notifications">("profile");

  // Profile Form States
  const [profileLoading, setProfileLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Company Form States
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Security Form States
  const [securityLoading, setSecurityLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification States (Persisted in localStorage)
  const [notifyNewApplications, setNotifyNewApplications] = useState(true);
  const [notifyInterviews, setNotifyInterviews] = useState(true);
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(false);
  const [notifyAutoRejections, setNotifyAutoRejections] = useState(false);

  const availableValues = [
    "Innovation", "Teamwork", "Diversity & Inclusion", "Work-Life Balance",
    "Growth & Learning", "Transparency", "Remote-First", "Fast-Paced"
  ];

  // Load Initial User & Recruiter Profile Data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");

      // Load company profile
      api.get(`/users/${user.id}/recruiter-profile`)
        .then(res => {
          const profile = res.data.data;
          if (profile) {
            setCompanyName(profile.companyName || "");
            setIndustry(profile.industry || "Technology");
            setCompanySize(profile.companySize || "51-200");
            setWebsite(profile.website || "");
            setCompanyDescription(profile.companyDescription || "");
            setSelectedValues(profile.companyValues || []);
          }
        })
        .catch(err => {
          console.error("Failed to load recruiter company profile:", err);
        });
    }

    // Load Notification Settings from localStorage
    const savedNewApps = localStorage.getItem("setting_notify_new_apps");
    if (savedNewApps !== null) setNotifyNewApplications(savedNewApps === "true");

    const savedInterviews = localStorage.getItem("setting_notify_interviews");
    if (savedInterviews !== null) setNotifyInterviews(savedInterviews === "true");

    const savedWeekly = localStorage.getItem("setting_notify_weekly");
    if (savedWeekly !== null) setNotifyWeeklySummary(savedWeekly === "true");

    const savedAutoReject = localStorage.getItem("setting_notify_autoreject");
    if (savedAutoReject !== null) setNotifyAutoRejections(savedAutoReject === "true");
  }, [user]);

  // Handle Personal Profile Update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);

    try {
      const res = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        phone
      });

      if (res.data.success) {
        // Sync local storage & auth state
        const updatedUser = {
          ...user,
          firstName,
          lastName,
          phone
        };
        const token = localStorage.getItem("token") || "";
        const refreshToken = localStorage.getItem("refreshToken") || "";
        login(token, refreshToken, updatedUser);

        toast.success("Personal profile updated successfully");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile settings");
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Company Profile Update
  const handleCompanySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCompanyLoading(true);

    try {
      const res = await api.put(`/users/${user.id}/recruiter-profile`, {
        companyName,
        industry,
        companySize,
        website,
        companyDescription,
        companyValues: selectedValues
      });

      if (res.data.success) {
        toast.success("Company profile saved successfully");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save company settings");
    } finally {
      setCompanyLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSecurityLoading(true);

    try {
      const res = await api.put("/auth/change-password", {
        oldPassword,
        newPassword
      });

      if (res.data.success) {
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Incorrect current password");
    } finally {
      setSecurityLoading(false);
    }
  };

  // Handle Notification Preference Changes
  const handleNotificationChange = (type: "apps" | "interviews" | "weekly" | "autoreject", val: boolean) => {
    if (type === "apps") {
      setNotifyNewApplications(val);
      localStorage.setItem("setting_notify_new_apps", String(val));
    } else if (type === "interviews") {
      setNotifyInterviews(val);
      localStorage.setItem("setting_notify_interviews", String(val));
    } else if (type === "weekly") {
      setNotifyWeeklySummary(val);
      localStorage.setItem("setting_notify_weekly", String(val));
    } else if (type === "autoreject") {
      setNotifyAutoRejections(val);
      localStorage.setItem("setting_notify_autoreject", String(val));
    }
    toast.success("Notification preferences updated");
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  // Get Initials for Avatar
  const getInitials = () => {
    if (!firstName && !lastName) return "R";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text">
          Recruiter Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your personal account details, company visibility, security configurations, and application notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === "profile"
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"
            }`}
          >
            <UserIcon className="w-[18px] h-[18px]" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === "company"
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"
            }`}
          >
            <Building2 className="w-[18px] h-[18px]" />
            <span>Company Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === "security"
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"
            }`}
          >
            <ShieldCheck className="w-[18px] h-[18px]" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeTab === "notifications"
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"
            }`}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Form Panel Content */}
        <div className="md:col-span-3">
          {/* PROFILE DETAILS TAB */}
          {activeTab === "profile" && (
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="border-b border-foreground/10 pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep your recruiter contact info up to date so candidates and teammates can reach you.
                </p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/30 to-violet-500/20 border border-primary/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(139,92,246,0.1)] text-2xl font-black text-primary select-none">
                    {getInitials()}
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <h3 className="font-bold text-foreground text-lg">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                      <Mail className="w-3.5 h-3.5 text-primary" /> {user?.email}
                    </p>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-wider font-extrabold text-primary">
                      {user?.role || "RECRUITER"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">First Name</Label>
                    <Input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                      className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Last Name</Label>
                    <Input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe"
                      className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email (Login Identity)</Label>
                    <div className="relative">
                      <Input
                        disabled
                        value={user?.email || ""}
                        className="bg-foreground/5 border-foreground/10 text-muted-foreground cursor-not-allowed pr-10"
                      />
                      <Mail className="w-4 h-4 text-muted-foreground/50 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone Number</Label>
                    <div className="relative">
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +1 555-0199"
                        className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                      />
                      <Phone className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/5 flex gap-3">
                  <Button
                    type="submit"
                    disabled={profileLoading}
                    style={{ backgroundColor: '#8B5CF6' }}
                    className="text-white hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all min-w-[120px]"
                  >
                    {profileLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* COMPANY PROFILE TAB */}
          {activeTab === "company" && (
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="border-b border-foreground/10 pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Company & Organization Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  This public profile details is displayed directly to candidates looking at your jobs.
                </p>
              </div>

              <form onSubmit={handleCompanySave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Name</Label>
                    <div className="relative">
                      <Input
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. TechCorp Solutions"
                        className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                      />
                      <Building className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Website URL</Label>
                    <div className="relative">
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="e.g. https://techcorp.com"
                        className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                      />
                      <Globe className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Industry</Label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border text-foreground border-foreground/10 bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option className="bg-card text-foreground" value="Technology">Technology & SaaS</option>
                      <option className="bg-card text-foreground" value="Finance">Finance & Fintech</option>
                      <option className="bg-card text-foreground" value="Healthcare">Healthcare & Biotech</option>
                      <option className="bg-card text-foreground" value="Education">Education & Edtech</option>
                      <option className="bg-card text-foreground" value="Consulting">Professional Services</option>
                      <option className="bg-card text-foreground" value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Company Size (Employees)</Label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="flex h-10 w-full items-center justify-between rounded-md border text-foreground border-foreground/10 bg-foreground/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option className="bg-card text-foreground" value="1-10">1 - 10 employees</option>
                      <option className="bg-card text-foreground" value="11-50">11 - 50 employees</option>
                      <option className="bg-card text-foreground" value="51-200">51 - 200 employees</option>
                      <option className="bg-card text-foreground" value="201-500">201 - 500 employees</option>
                      <option className="bg-card text-foreground" value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">About Your Company</Label>
                  <Textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Provide a description of your company mission, projects, and work environment..."
                    className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground min-h-[120px] rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Culture & Core Values</Label>
                  <div className="flex flex-wrap gap-2.5">
                    {availableValues.map((val) => {
                      const isSelected = selectedValues.includes(val);
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => toggleValue(val)}
                          className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                              : "bg-foreground/5 text-muted-foreground border-foreground/10 hover:border-foreground/30 hover:text-foreground"
                          }`}
                        >
                          {isSelected ? `✓ ${val}` : val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/5 flex gap-3">
                  <Button
                    type="submit"
                    disabled={companyLoading}
                    style={{ backgroundColor: '#8B5CF6' }}
                    className="text-white hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all min-w-[120px]"
                  >
                    {companyLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Profile
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* SECURITY & PASSWORD TAB */}
          {activeTab === "security" && (
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="border-b border-foreground/10 pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Account Security
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Change your password periodically to ensure your workspace and candidate information remains secure.
                </p>
              </div>

              <form onSubmit={handlePasswordSave} className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Password</Label>
                  <div className="relative">
                    <Input
                      required
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</Label>
                  <div className="relative">
                    <Input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="bg-foreground/5 border-foreground/10 focus:border-primary/50 text-foreground pl-10"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/5">
                  <Button
                    type="submit"
                    disabled={securityLoading}
                    style={{ backgroundColor: '#8B5CF6' }}
                    className="text-white hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all min-w-[150px]"
                  >
                    {securityLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 mr-2" />
                    )}
                    Update Password
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <GlassCard className="p-6 md:p-8 space-y-6">
              <div className="border-b border-foreground/10 pb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Recruiter Notifications
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose what events you would like to be alerted for. Saves automatically on change.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 transition-all hover:bg-foreground/8">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="text-sm font-bold text-foreground">New Applications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive an immediate email alert when a candidate applies to any of your posted jobs.
                    </p>
                  </div>
                  <Switch
                    checked={notifyNewApplications}
                    onCheckedChange={(val) => handleNotificationChange("apps", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 transition-all hover:bg-foreground/8">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="text-sm font-bold text-foreground">Interview Schedules</Label>
                    <p className="text-xs text-muted-foreground">
                      Get real-time notification alerts when a candidate accepts an interview request or reschedules.
                    </p>
                  </div>
                  <Switch
                    checked={notifyInterviews}
                    onCheckedChange={(val) => handleNotificationChange("interviews", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 transition-all hover:bg-foreground/8">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="text-sm font-bold text-foreground">Weekly Digest Summary</Label>
                    <p className="text-xs text-muted-foreground">
                      A curated email summary sent every Monday morning featuring resume matches, application counts, and overall funnel stats.
                    </p>
                  </div>
                  <Switch
                    checked={notifyWeeklySummary}
                    onCheckedChange={(val) => handleNotificationChange("weekly", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 transition-all hover:bg-foreground/8">
                  <div className="space-y-0.5 max-w-[80%]">
                    <Label className="text-sm font-bold text-foreground">Auto-Rejection Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications for applicants who are auto-rejected by the matching engine when their resume score falls below threshold.
                    </p>
                  </div>
                  <Switch
                    checked={notifyAutoRejections}
                    onCheckedChange={(val) => handleNotificationChange("autoreject", val)}
                  />
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
