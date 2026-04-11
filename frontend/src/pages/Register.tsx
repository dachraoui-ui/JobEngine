import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Zap, User, Building2, ChevronRight, Mail, Lock, Eye, EyeOff,
  Globe, Loader2, Check, ShieldCheck, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type Role = "candidate" | "recruiter" | null;

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Strong", "Excellent ✓"];
  const colors = ["", "bg-destructive", "bg-warning", "bg-primary", "bg-accent"];
  const textColors = ["", "text-destructive", "text-warning", "text-primary", "text-accent"];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5 animate-fade-in">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i <= strength ? colors[strength] : "bg-foreground/10")} />
        ))}
      </div>
      <p className={cn("text-[11px] font-medium", textColors[strength])}>{labels[strength]}</p>
    </div>
  );
}

function AnimatedCheckmark() {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center glow-mint">
        <svg viewBox="0 0 52 52" className="w-10 h-10">
          <circle cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-draw-circle" />
          <path fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" className="animate-draw-check" />
        </svg>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep(3);
  };

  const industries = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Media", "Other"];

  return (
    <div className="min-h-screen bg-background dot-grid relative flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Light leaks */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.12] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.08] blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[520px] animate-scale-in">
        <GlassCard className="p-8 sm:p-10 overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-cyan animate-pulse-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>

          {step < 3 && (
            <>
              <h1 className="text-2xl font-bold text-foreground text-center tracking-tighter mb-1">Join JobEngine</h1>
              <p className="text-sm text-muted-foreground text-center mb-8">Create your account and start connecting</p>
            </>
          )}

          {/* Progress dots */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((d) => (
                <div key={d} className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  d <= step ? "bg-primary glow-cyan" : "bg-foreground/10"
                )} />
              ))}
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}

          {/* ─── STEP 1: Role ─── */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <p className="text-sm font-medium text-foreground text-center">I am a...</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Candidate */}
                <button
                  onClick={() => setRole("candidate")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "candidate"
                      ? "border-primary/40 bg-primary/5 scale-[1.02] glow-cyan"
                      : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.12]"
                  )}
                >
                  {role === "candidate" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "candidate" ? "bg-primary/20" : "bg-foreground/5")}>
                    <User className={cn("w-5 h-5", role === "candidate" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Candidate</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find jobs matched to your skills by AI</p>
                </button>

                {/* Recruiter */}
                <button
                  onClick={() => setRole("recruiter")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "recruiter"
                      ? "border-secondary/40 bg-secondary/5 scale-[1.02] glow-violet"
                      : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.12]"
                  )}
                >
                  {role === "recruiter" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center animate-scale-in">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "recruiter" ? "bg-secondary/20" : "bg-foreground/5")}>
                    <Building2 className={cn("w-5 h-5", role === "recruiter" ? "text-secondary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Recruiter</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find perfect candidates with neural matching</p>
                </button>
              </div>

              <button
                onClick={() => { if (role) setStep(2); }}
                disabled={!role}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-200 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─── STEP 2: Form ─── */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="animate-slide-in-right space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 pl-10 pr-11 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                </div>
              </div>

              {/* Recruiter extra fields */}
              {role === "recruiter" && (
                <div className="space-y-4 pt-2 animate-fade-in">
                  <div className="h-px bg-border" />
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Company Details</p>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-surface border border-border text-sm text-foreground outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all appearance-none cursor-pointer">
                      <option value="" className="bg-surface text-muted-foreground">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-surface text-foreground">{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Website <span className="normal-case text-muted-foreground/50">(optional)</span></label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://company.com" className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v as boolean)} className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="h-11 px-5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">Back</button>
                <button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-200 disabled:opacity-70 flex items-center justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {/* ─── STEP 3: Success ─── */}
          {step === 3 && (
            <div className="text-center animate-scale-in py-4">
              <AnimatedCheckmark />
              <h2 className="text-2xl font-bold text-foreground tracking-tighter mb-2">Welcome to JobEngine! 🚀</h2>
              {role === "candidate" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Let's upload your CV and start matching.</p>
                  <button onClick={() => navigate("/candidate/upload-cv")} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Upload CV
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Your account is pending verification. We'll review it within 24 hours.</p>
                  <button onClick={() => navigate("/dashboard")} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center gap-2">
                    Go to Dashboard <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Login link */}
          {step < 3 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign in →</Link>
            </p>
          )}
        </GlassCard>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground/50">Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
