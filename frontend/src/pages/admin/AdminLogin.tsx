import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, AlertTriangle, Terminal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

/* ── Animated terminal line ── */
function TerminalLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return visible ? (
    <p className="text-xs font-mono text-amber-400/70 leading-relaxed">
      <span className="text-amber-500/50">$ </span>{text}
    </p>
  ) : null;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [shake, setShake]               = useState(false);

  // Already logged in as admin → go to admin dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") navigate("/admin");
    // If logged in as a different role, don't redirect — admin portal is separate
  }, [isAuthenticated, user, navigate]);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields are required."); triggerShake(); return; }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token, refreshToken, role, ...userData } = res.data.data;

      if (role !== "ADMIN") {
        setError("Access denied. This portal is restricted to system administrators only.");
        triggerShake();
        setLoading(false);
        return;
      }

      login(token, refreshToken, { ...userData, role });
      navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Authentication failed. Check your credentials.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d14] flex overflow-hidden">

      {/* ── Left Panel — Security Aesthetic ── */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] to-[#080d14] border-r border-amber-500/10">

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        {/* Glowing orb */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg">
                <span className="text-amber-400">Job</span>
                <span className="text-white">Engine</span>
              </span>
              <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest leading-none mt-0.5">
                Admin Console
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-400/80 uppercase tracking-widest">Restricted Access</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              System<br />
              <span className="text-amber-400">Control</span><br />
              Panel
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              This portal is exclusively reserved for authorized system administrators.
              All access attempts are logged and monitored.
            </p>
          </div>

          {/* Terminal block */}
          <div className="mt-auto">
            <div className="bg-black/40 rounded-xl border border-amber-500/10 p-5 font-mono">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-amber-500/60" />
                <span className="text-xs text-amber-500/50 font-semibold uppercase tracking-widest">System Log</span>
              </div>
              <div className="space-y-1.5">
                <TerminalLine text="JobEngine v2.4.1 — System Core initialized" delay={200} />
                <TerminalLine text="Authentication module: ACTIVE" delay={600} />
                <TerminalLine text="Audit logging: ENABLED" delay={1000} />
                <TerminalLine text="Session encryption: AES-256" delay={1400} />
                <TerminalLine text="Awaiting administrator credentials..." delay={1800} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 relative">

        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent pointer-events-none" />

        <div className="w-full max-w-[420px] relative">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold">
                <span className="text-amber-400">Job</span>
                <span className="text-white">Engine</span>
              </span>
              <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest leading-none">Admin Console</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Administrator Login</h2>
            <p className="text-slate-400 text-sm">Enter your admin credentials to access the control panel.</p>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-8">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400/80 leading-relaxed">
              Unauthorized access is strictly prohibited. All login attempts are recorded.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-5 ${shake ? "animate-shake" : ""}`}>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@jobengine.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/5 animate-in slide-in-from-top-1">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" /> Access Control Panel</>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-xs text-slate-600 mt-8">
            Not an administrator?{" "}
            <a href="/login" className="text-slate-400 hover:text-white transition-colors underline underline-offset-2">
              Return to main portal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
