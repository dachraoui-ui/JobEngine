import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";

/* ── Inline logo ── */
function LogoMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse-glow">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
          <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="font-extrabold text-xl leading-none">
        <span className="text-primary">Job</span>
        <span className="text-foreground">Engine</span>
      </span>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep]                 = useState(1);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [shake, setShake]               = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email."); triggerShake(); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) { setError("Please enter your password."); triggerShake(); return; }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token, refreshToken, role, ...userData } = res.data.data;
      login(token, refreshToken, { ...userData, role });
      if (role === "CANDIDATE") navigate("/candidate");
      else if (role === "RECRUITER") navigate("/dashboard");
      else navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/google", { 
        credential: credentialResponse.credential,
        isRegistration: false
      });
      const { token, refreshToken, role, ...userData } = res.data.data;
      login(token, refreshToken, { ...userData, role });
      if (role === "CANDIDATE") navigate("/candidate");
      else if (role === "RECRUITER") navigate("/dashboard");
      else navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google authentication failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setError("");
    } else {
      navigate("/");
    }
  };


  return (
    <div className="min-h-screen bg-background relative flex overflow-hidden">
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden md:flex md:w-[45%] relative flex-col items-center justify-center bg-secondary text-white p-12 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative z-10 max-w-[380px]">
          {/* Big logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
                <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-2xl text-white">
              <span className="text-primary">Job</span>Engine
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Your next great hire is waiting
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10">
            AI-powered matching that connects the right candidates with the right opportunities — faster than ever before.
          </p>

          {/* Stats */}
          {[
            { val: "50 000+", label: "CVs analyzed" },
            { val: "94%",     label: "Match accuracy" },
            { val: "10x",     label: "Faster hiring" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 mb-4">
              <span className="text-xl font-bold text-primary font-mono-score w-20">{s.val}</span>
              <span className="text-white/60 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <button
          onClick={goBack}
          className="absolute top-8 left-8 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors text-sm font-medium z-50 bg-surface/50 px-3 py-1.5 rounded-lg border border-border backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Subtle background blobs */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-primary/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <div className={cn(
          "relative z-10 w-full max-w-[420px] animate-scale-in",
          shake && "animate-shake"
        )}>
          {/* Logo (mobile) */}
          <div className="lg:hidden flex justify-center mb-8">
            <LogoMark />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1.5">
              {step === 1 ? "Welcome back" : "Enter your password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? "Sign in to your JobEngine account" : email}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-5 animate-fade-in">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoFocus
                    className={cn(
                      "w-full h-11 pl-10 pr-4 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
                      "focus:border-primary focus:ring-2 focus:ring-primary/15",
                      error && !email ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
              </div>

              {/* Next */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Continue</span><ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-slide-in-right">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                    className={cn(
                      "w-full h-11 pl-10 pr-11 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
                      "focus:border-primary focus:ring-2 focus:ring-primary/15",
                      error && !password ? "border-destructive" : "border-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={remember} onCheckedChange={setRemember} className="data-[state=checked]:bg-primary h-5 w-9" />
                  <span className="text-xs text-muted-foreground">Remember me</span>
                </div>
                <a href="#" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">Forgot password?</a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-105 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          )}

          {step === 1 && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground px-2">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google */}
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => { setError("Google authentication failed"); triggerShake(); }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  text="continue_with"
                  width="380px"
                />
              </div>
            </>
          )}

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            New to JobEngine?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Create an account →
            </Link>
          </p>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/40" />
            <span className="text-[11px] text-muted-foreground/40">Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

