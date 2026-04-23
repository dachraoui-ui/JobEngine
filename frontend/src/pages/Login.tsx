import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      
      const { token, role, ...userData } = res.data.data;
      
      // Store in auth context
      login(token, { ...userData, role });

      // Navigate based on assigned role
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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential
      });
      
      const { token, role, ...userData } = res.data.data;
      login(token, { ...userData, role });

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

          <form onSubmit={handleSubmit} className="space-y-5">            {/* Email */}
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
          <div className="flex justify-center mt-2 w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google authentication failed");
                triggerShake();
              }}
              useOneTap
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
              width="360px"
            />
          </div>

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
