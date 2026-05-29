import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Building2, ChevronRight, Mail, Lock, Eye, EyeOff,
  Globe, Loader2, Check, ShieldCheck, Sparkles, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";

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

/* ── Inline logo for mobile ── */
function LogoMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse-glow">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
          <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
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

  const { login } = useAuth();
  
  const handleStep2Submit = (e: React.FormEvent) => {
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
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "recruiter") {
      if (!companyName || !industry) {
        setError("Please fill in company name and industry.");
        return;
      }
    }

    if (!agreed) {
      setError("You must agree to the terms.");
      return;
    }

    try {
      setLoading(true);
      const payload = { firstName, lastName, email, password, phone: "", role: role?.toUpperCase() };
      const res = await api.post('/auth/register', payload);
      const { token, refreshToken, role: userRole, ...userData } = res.data.data;
      login(token, refreshToken, { ...userData, role: userRole });
      setStep(4);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to register. Email may be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!role) {
      setError("Please select a role before continuing with Google.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential,
        role: role.toUpperCase(),
        isRegistration: true
      });
      const { token, refreshToken, role: userRole, ...userData } = res.data.data;
      login(token, refreshToken, { ...userData, role: userRole });
      setStep(4);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
      setError("");
    } else if (step === 1) {
      if (window.history.length > 2) navigate(-1);
      else navigate("/");
    }
  };

  const industries = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Media", "Other"];

  return (
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden md:flex md:w-[45%] relative flex-col items-center justify-center bg-secondary text-white p-12 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative z-10 max-w-[380px]">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
                <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-2xl text-white">
              <span className="text-white/80">Job</span>Engine
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Join the future of hiring
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-10">
            Create an account to discover opportunities perfectly matched to your unique skills and experience.
          </p>

          {[
            { val: "AI-Powered", label: "Smart matching" },
            { val: "1-Click",    label: "Easy apply" },
            { val: "100%",       label: "Privacy first" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 mb-4">
              <span className="text-lg font-bold text-white font-mono-score w-28">{s.val}</span>
              <span className="text-white/60 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Register form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <button
          onClick={goBack}
          className={cn(
            "absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors text-sm font-medium z-50 bg-background/50 px-3 py-1.5 rounded-lg border border-border backdrop-blur-sm",
            step >= 4 && "hidden"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[420px] animate-scale-in">
          <div className="md:hidden flex justify-center mb-8">
            <LogoMark />
          </div>

          {step < 4 && (
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1.5">Join JobEngine</h1>
              <p className="text-sm text-muted-foreground">Create your account and start connecting</p>
            </div>
          )}

          {step < 4 && (
            <div className="flex items-center gap-2 mb-8">
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

          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <p className="text-sm font-medium text-foreground">I am a...</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("candidate")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "candidate"
                      ? "border-primary/40 bg-primary/5 scale-[1.02] glow-cyan"
                      : "border-border bg-card hover:border-foreground/20"
                  )}
                >
                  {role === "candidate" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "candidate" ? "bg-primary/20" : "bg-muted/50")}>
                    <User className={cn("w-5 h-5", role === "candidate" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Candidate</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find jobs matched to your skills</p>
                </button>

                <button
                  onClick={() => setRole("recruiter")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "recruiter"
                      ? "border-secondary/40 bg-secondary/5 scale-[1.02] glow-violet"
                      : "border-border bg-card hover:border-foreground/20"
                  )}
                >
                  {role === "recruiter" && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center animate-scale-in">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "recruiter" ? "bg-secondary/20" : "bg-muted/50")}>
                    <Building2 className={cn("w-5 h-5", role === "recruiter" ? "text-secondary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Recruiter</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find perfect candidates</p>
                </button>
              </div>

              <button
                onClick={() => { if (role) setStep(2); }}
                disabled={!role}
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-105 transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Continue with Email <ChevronRight className="w-4 h-4" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="flex justify-center w-full" onClick={() => { if (!role) setError("Please select a role first."); }}>
                <div className={cn(!role && "opacity-50 pointer-events-none")}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google authentication failed")}
                    useOneTap
                    theme="filled_black"
                    shape="rectangular"
                    text="signup_with"
                    width="420px"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="animate-slide-in-right space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">First Name</label>
                  <input autoFocus value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 pl-10 pr-11 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="animate-slide-in-right space-y-4">
              {role === "recruiter" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input autoFocus value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all appearance-none cursor-pointer">
                      <option value="" className="text-muted-foreground">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="text-foreground">{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Website <span className="normal-case text-muted-foreground/50">(optional)</span></label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://company.com" className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all" />
                    </div>
                  </div>
                  <div className="h-px bg-border my-4" />
                </div>
              )}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v as boolean)} className="mt-0.5 data-[state=checked]:bg-primary" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-105 transition-all duration-200 disabled:opacity-70 flex items-center justify-center">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center animate-scale-in py-4">
              <AnimatedCheckmark />
              <h2 className="text-2xl font-bold text-foreground tracking-tighter mb-2">Welcome! 🚀</h2>
              {role === "candidate" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Let's upload your CV and start matching.</p>
                  <button onClick={() => navigate("/candidate/upload-cv")} className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-105 transition-all flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Upload CV
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Your account is pending verification.</p>
                  <button onClick={() => navigate("/dashboard")} className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:brightness-105 transition-all flex items-center justify-center gap-2">
                    Go to Dashboard <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {step < 4 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign in →</Link>
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-6">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-[11px] text-muted-foreground/50">Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
