import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Brain,
  Zap,
  Target,
  Rocket,
  Sparkles,
  KanbanSquare,
  Upload,
  Trophy,
  Quote,
  Star,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Animated counter hook ─── */
function useCountUp(end: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return value;
}

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Data ─── */
const features = [
  {
    icon: Brain,
    name: "Neural Matching",
    desc: "Our AI analyzes skills, experience, and culture values using TF-IDF & Cosine Similarity to find perfect matches.",
    color: "text-primary",
    glow: "glow-cyan",
    bg: "bg-primary/10",
  },
  {
    icon: KanbanSquare,
    name: "Smart Pipeline",
    desc: "Drag & drop recruitment pipeline with automated status tracking, email triggers, and interview scheduling.",
    color: "text-secondary",
    glow: "glow-violet",
    bg: "bg-secondary/10",
  },
  {
    icon: Sparkles,
    name: "Career Intelligence",
    desc: "AI-powered CV feedback, skill gap analysis, and personalized career path recommendations for candidates.",
    color: "text-accent",
    glow: "glow-mint",
    bg: "bg-accent/10",
  },
];

const steps = [
  { num: "01", icon: Upload, title: "Upload CV", desc: "PDF or DOCX, analyzed in seconds", color: "text-primary", bg: "bg-primary/10" },
  { num: "02", icon: Brain, title: "AI Analysis", desc: "Skills, experience, and education extracted automatically", color: "text-secondary", bg: "bg-secondary/10" },
  { num: "03", icon: Target, title: "Neural Match", desc: "Scored against jobs using our matching engine", color: "text-accent", bg: "bg-accent/10" },
  { num: "04", icon: Rocket, title: "Get Hired", desc: "Track progress through automated pipeline", color: "text-warning", bg: "bg-warning/10" },
];

const testimonials = [
  { quote: "JobEngine cut our hiring time by 75%. The AI matching is scarily accurate — we found our CTO in 3 days.", name: "Sarah Chen", title: "VP People", company: "TechScale", avatar: "SC" },
  { quote: "As a candidate, the match score gave me confidence I was applying to the right roles. Landed my dream job in 2 weeks.", name: "Marcus Rivera", title: "Senior Engineer", company: "Stripe", avatar: "MR" },
  { quote: "The pipeline automation alone saved us 20 hours per week. It's like having an extra recruiter on the team.", name: "Aisha Patel", title: "Head of Talent", company: "Vercel", avatar: "AP" },
];

const companyLogos = ["Acme Corp", "TechScale", "Nova AI", "Quantum", "Hyperion"];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const metrics = useInView(0.3);
  const cv = useCountUp(50000, 2000, metrics.inView);
  const acc = useCountUp(94, 1500, metrics.inView);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-foreground/[0.06]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center glow-cyan">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tighter text-foreground">JobEngine</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl glow-cyan hover:brightness-110 transition-all">Launch Your Career</Link>
          </div>
          <button className="md:hidden text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-0 border-t border-foreground/[0.06] px-6 py-4 space-y-3 animate-fade-in">
            <a href="#features" className="block text-sm text-muted-foreground">Features</a>
            <a href="#how-it-works" className="block text-sm text-muted-foreground">How It Works</a>
            <a href="#pricing" className="block text-sm text-muted-foreground">Pricing</a>
            <Link to="/login" className="block text-sm text-primary">Sign In</Link>
            <Link to="/register" className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl text-center">Launch Your Career</Link>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 dot-grid">
        {/* Mesh gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.08] blur-[150px] animate-pulse-ring-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/[0.06] blur-[140px] animate-pulse-ring-slow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm text-muted-foreground mb-8 shimmer-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Recruitment Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tighter leading-[1.1] mb-6">
            The Intelligent Engine That
            <br />
            <span className="text-gradient-cyan">Connects Talent to Opportunity</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-[560px] mx-auto mb-10 leading-relaxed">
            JobEngine uses neural matching to analyze CVs, rank candidates by compatibility score, and automate your entire recruitment pipeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register" className="px-8 py-3.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl glow-cyan hover:brightness-110 transition-all animate-pulse-glow">
              Start Hiring
            </Link>
            <Link to="/register" className="px-8 py-3.5 text-sm font-semibold border border-primary/40 text-primary rounded-xl hover:bg-primary/5 transition-all">
              Find Your Job
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Trusted by 500+ companies</p>
          <div className="flex items-center justify-center gap-8">
            {companyLogos.map((name) => (
              <span key={name} className="text-xs font-medium text-muted-foreground/40 tracking-wide uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METRICS BAR ─── */}
      <div ref={metrics.ref} className="relative z-20 max-w-[1000px] mx-auto -mt-20 px-6">
        <GlassCard glow glowColor="cyan" className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { value: `${cv.toLocaleString()}+`, label: "CVs Analyzed", icon: Brain, color: "text-primary" },
              { value: "< 3 sec", label: "Analysis Speed", icon: Zap, color: "text-secondary" },
              { value: `${acc}%`, label: "Match Accuracy", icon: Target, color: "text-accent" },
              { value: "10x", label: "Faster Hiring", icon: Rocket, color: "text-warning" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center py-8 px-4 gap-2">
                <m.icon className={cn("w-5 h-5 mb-1", m.color)} />
                <span className={cn("text-2xl md:text-3xl font-bold font-mono", m.color)}>{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">What Makes JobEngine Different</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Built with AI at its core, not as an afterthought.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <GlassCard key={f.name} hover glow glowColor={f.name === "Neural Matching" ? "cyan" : f.name === "Smart Pipeline" ? "violet" : "mint"} className="p-8 text-center group">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6", f.bg, f.glow)}>
                  <f.icon className={cn("w-7 h-7", f.color)} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{f.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="light-leak w-[500px] h-[500px] bg-primary top-0 left-1/2 -translate-x-1/2" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">From Upload to Hired in 4 Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-px border-t border-dashed border-primary/30" />
            {steps.map((s) => (
              <GlassCard key={s.num} hover className="p-6 text-center relative z-10">
                <span className="text-xs font-mono text-muted-foreground mb-4 block">{s.num}</span>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5", s.bg)}>
                  <s.icon className={cn("w-6 h-6", s.color)} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DUAL CTA ─── */}
      <section className="py-32 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Glowing divider */}
          <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center z-20">
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-xs text-muted-foreground font-medium glow-cyan my-2">or</div>
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
          </div>

          {/* Recruiters */}
          <GlassCard hover className="p-8 border-primary/10">
            <h3 className="text-xl font-bold text-foreground mb-2">For Recruiters</h3>
            <p className="text-muted-foreground text-sm mb-6">Find the top 10% of candidates — automatically.</p>
            <ul className="space-y-3 mb-8">
              {["AI ranking", "Pipeline automation", "Auto-scheduling", "Score-based filtering"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/register" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
              Start Hiring <ChevronRight className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* Candidates */}
          <GlassCard hover className="p-8 border-secondary/10">
            <h3 className="text-xl font-bold text-foreground mb-2">For Candidates</h3>
            <p className="text-muted-foreground text-sm mb-6">Get matched to jobs that truly fit you.</p>
            <ul className="space-y-3 mb-8">
              {["CV intelligence", "Match scores", "Career advice", "Application tracking"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/register" className="text-sm font-medium text-secondary flex items-center gap-1 hover:gap-2 transition-all">
              Find Your Job <ChevronRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Loved by Teams Everywhere</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <GlassCard key={t.name} hover className="p-8">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-sm text-foreground italic leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}, {t.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />)}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-secondary/[0.05] to-transparent" />
        <div className="light-leak w-[600px] h-[600px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Ready to Revolutionize Your Hiring?</h2>
          <p className="text-muted-foreground mb-10">Join 500+ companies already using JobEngine.</p>
          <Link to="/register" className="inline-block px-10 py-4 text-sm font-semibold bg-foreground text-background rounded-xl hover:opacity-90 transition-all">
            Get Started Free
          </Link>
          <p className="text-xs text-muted-foreground mt-6">No credit card required • Free forever for candidates</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border dot-grid py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {[
            { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Community", "Support"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="text-xs text-muted-foreground">© 2026 JobEngine. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
