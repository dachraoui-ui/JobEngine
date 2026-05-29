import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Brain, Zap, Target, Rocket, Sparkles, KanbanSquare,
  Upload, Trophy, Quote, Star, Github, Linkedin, Twitter,
  ChevronRight, Menu, X, ArrowRight, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Animated counter ── */
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

/* ── Intersection observer ── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Logo wordmark ── */
function LogoWordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="white" strokeWidth="2"/>
          <path d="M13.5 13.5L17 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <span className={cn("font-extrabold leading-none", text)}>
        <span className="text-primary">Job</span>
        <span className="text-foreground">Engine</span>
      </span>
    </div>
  );
}

/* ── Data ── */
const features = [
  {
    icon: Brain,
    name: "Neural Matching",
    desc: "Our AI analyzes skills, experience, and culture values using TF-IDF & Cosine Similarity to find perfect matches.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accent: "border-primary/20 hover:border-primary/40",
  },
  {
    icon: KanbanSquare,
    name: "Smart Pipeline",
    desc: "Drag & drop recruitment pipeline with automated status tracking, email triggers, and interview scheduling.",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    accent: "border-accent/20 hover:border-accent/40",
  },
  {
    icon: Sparkles,
    name: "Career Intelligence",
    desc: "AI-powered CV feedback, skill gap analysis, and personalized career path recommendations for candidates.",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    accent: "border-warning/20 hover:border-warning/40",
  },
];

const steps = [
  { num: "01", icon: Upload,  title: "Upload CV",      desc: "PDF or DOCX, analyzed in seconds",                          color: "text-primary",  bg: "bg-primary/10" },
  { num: "02", icon: Brain,   title: "AI Analysis",    desc: "Skills, experience, and education extracted automatically",  color: "text-accent",   bg: "bg-accent/10" },
  { num: "03", icon: Target,  title: "Neural Match",   desc: "Scored against jobs using our matching engine",             color: "text-warning",  bg: "bg-warning/10" },
  { num: "04", icon: Rocket,  title: "Get Hired",      desc: "Track progress through automated pipeline",                 color: "text-success",  bg: "bg-success/10" },
];

const testimonials = [
  { quote: "JobEngine cut our hiring time by 75%. The AI matching is scarily accurate — we found our CTO in 3 days.", name: "Sarah Chen",    title: "VP People",       company: "TechScale", avatar: "SC" },
  { quote: "As a candidate, the match score gave me confidence I was applying to the right roles. Landed my dream job in 2 weeks.", name: "Marcus Rivera", title: "Senior Engineer", company: "Stripe",    avatar: "MR" },
  { quote: "The pipeline automation alone saved us 20 hours per week. It's like having an extra recruiter on the team.", name: "Aisha Patel",   title: "Head of Talent",  company: "Vercel",    avatar: "AP" },
];

const companyLogos = ["Acme Corp", "TechScale", "Nova AI", "Quantum", "Hyperion"];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const metrics = useInView(0.3);
  const cv  = useCountUp(50000, 2000, metrics.inView);
  const acc = useCountUp(94,    1500, metrics.inView);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ═══ NAVBAR ═══ */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center">
            <LogoWordmark />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl shadow-md shadow-primary/25 hover:shadow-primary/40 hover:brightness-105 transition-all"
            >
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 space-y-3 animate-fade-in">
            <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground">How It Works</a>
            <a href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</a>
            <div className="pt-2 border-t border-border flex gap-3">
              <Link to="/login" className="flex-1 text-center py-2 text-sm text-muted-foreground border border-border rounded-xl">Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold bg-primary text-white rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-pulse-ring-slow" />
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[120px] pointer-events-none animate-pulse-ring-slow" style={{ animationDelay: "2s" }} />
        <div className="dot-grid absolute inset-0 opacity-60" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-sm text-primary font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Recruitment Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold tracking-tight leading-[1.08] mb-6 text-foreground">
            The Intelligent Engine That{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">Connects Talent to Opportunity</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-[560px] mx-auto mb-10 leading-relaxed">
            JobEngine uses neural matching to analyze CVs, rank candidates by compatibility score,
            and automate your entire recruitment pipeline.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-3.5 text-sm font-semibold bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:brightness-105 transition-all animate-pulse-glow"
            >
              Start Hiring Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold border-2 border-border text-foreground rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              Find Your Job
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">Trusted by 500+ companies</p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {companyLogos.map((name) => (
              <span key={name} className="text-xs font-semibold text-muted-foreground/40 tracking-widest uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METRICS BAR ═══ */}
      <div ref={metrics.ref} className="relative z-20 max-w-[960px] mx-auto -mt-16 px-6">
        <div className="glass-card border border-border shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border divide-y md:divide-y-0">
            {[
              { value: `${cv.toLocaleString()}+`, label: "CVs Analyzed",   icon: Brain,  color: "text-primary" },
              { value: "< 3 sec",                  label: "Analysis Speed",  icon: Zap,    color: "text-accent" },
              { value: `${acc}%`,                   label: "Match Accuracy",  icon: Target, color: "text-warning" },
              { value: "10x",                        label: "Faster Hiring",   icon: Rocket, color: "text-success" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col items-center py-8 px-4 gap-2">
                <m.icon className={cn("w-5 h-5 mb-1", m.color)} />
                <span className={cn("text-2xl md:text-3xl font-bold font-mono-score", m.color)}>{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Why JobEngine</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">What Makes Us Different</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Built with AI at its core, not as an afterthought.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.name}
                className={cn(
                  "glass-card p-8 border transition-all duration-300 group",
                  f.accent
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", f.iconBg)}>
                  <f.icon className={cn("w-7 h-7", f.iconColor)} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{f.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="light-leak w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">From Upload to Hired in 4 Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[44px] left-[14%] right-[14%] h-px border-t border-dashed border-primary/25" />
            {steps.map((s, i) => (
              <div key={s.num} className="glass-card p-6 text-center relative z-10 border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-1">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 relative",
                  s.bg
                )}>
                  <s.icon className={cn("w-6 h-6", s.color)} />
                  {i < steps.length - 1 && (
                    <span className="absolute -right-[calc(50%+12px)] top-1/2 -translate-y-1/2 text-border hidden lg:block text-lg font-light">→</span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold text-muted-foreground/50 mb-3 block">{s.num}</span>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DUAL CTA ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recruiters */}
          <div className="glass-card p-8 border border-primary/15 hover:border-primary/35 transition-all duration-200 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">For Recruiters</h3>
            <p className="text-muted-foreground text-sm mb-6">Find the top 10% of candidates — automatically.</p>
            <ul className="space-y-2.5 mb-8">
              {["AI ranking", "Pipeline automation", "Auto-scheduling", "Score-based filtering"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all">
              Start Hiring <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Candidates */}
          <div className="glass-card p-8 border border-accent/15 hover:border-accent/35 transition-all duration-200 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">For Candidates</h3>
            <p className="text-muted-foreground text-sm mb-6">Get matched to jobs that truly fit you.</p>
            <ul className="space-y-2.5 mb-8">
              {["CV intelligence", "Match scores", "Career advice", "Application tracking"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-3 transition-all">
              Find Your Job <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">Social Proof</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">Loved by Teams Everywhere</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-8 border border-border hover:border-primary/25 transition-all duration-200 hover:-translate-y-1">
                <Quote className="w-7 h-7 text-primary/25 mb-4" />
                <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}, {t.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-accent/4" />
        <div className="light-leak w-[500px] h-[500px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
            Ready to Revolutionize Your Hiring?
          </h2>
          <p className="text-muted-foreground mb-10">Join 500+ companies already using JobEngine.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm font-bold bg-primary text-white rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:brightness-105 transition-all"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground mt-6">No credit card required • Free forever for candidates</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-16 px-6 bg-sidebar">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <LogoWordmark size="sm" />
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[160px]">
                Intelligent recruitment platform powered by AI.
              </p>
            </div>

            {[
              { title: "Product",   links: ["Features", "Pricing", "Integrations", "Changelog"] },
              { title: "Company",   links: ["About", "Careers", "Blog", "Press"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Community", "Support"] },
              { title: "Legal",     links: ["Privacy", "Terms", "Security", "GDPR"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4">
            <p className="text-xs text-muted-foreground">© 2026 JobEngine. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
