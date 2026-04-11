import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"candidate" | "recruiter" | "admin">("candidate");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }

    setLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    
    if (role === "candidate") navigate("/candidate");
    else if (role === "recruiter") navigate("/dashboard");
    else navigate("/admin");
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-background dot-grid relative flex items-center justify-center overflow-hidden px-4">
      {/* Light leaks */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.12] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.08] blur-[160px] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20 animate-float-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: `-5%`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className={cn(
        "relative z-10 w-full max-w-[440px] animate-scale-in",
        shake && "animate-shake"
      )}>
        <GlassCard className="p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-cyan animate-pulse-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center tracking-tighter mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">Sign in to your neural network</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mock Role Selection for Demo Purposes */}
            <div className="flex bg-surface border border-border rounded-lg p-1 mb-6">
               <button type="button" onClick={() => setRole("candidate")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${role === "candidate" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>Candidate</button>
               <button type="button" onClick={() => setRole("recruiter")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${role === "recruiter" ? "bg-secondary/20 text-secondary" : "text-muted-foreground hover:text-foreground"}`}>Recruiter</button>
               <button type="button" onClick={() => setRole("admin")} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${role === "admin" ? "bg-amber-500/20 text-amber-500" : "text-muted-foreground hover:text-foreground"}`}>Admin</button>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={cn(
                    "w-full h-11 pl-10 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
                    "focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)]",
                    error && !email && "border-destructive"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-11 pl-10 pr-11 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
                    "focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)]",
                    error && !password && "border-destructive"
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
              <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-cyan hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-surface border border-border">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button className="w-full h-11 rounded-xl glass-card border border-foreground/[0.06] text-sm font-medium text-foreground flex items-center justify-center gap-3 hover:bg-foreground/5 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            New to JobEngine?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Create an account →
            </Link>
          </p>
        </GlassCard>

        {/* Security note */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground/50">Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
