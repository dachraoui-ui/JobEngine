import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { exploreJobs } from "@/data/candidateJobsData";
import { cn } from "@/lib/utils";
import {
  Search, X, Bookmark, BookmarkCheck, ChevronRight, MapPin, Clock, SlidersHorizontal,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const jobTypes = ["Full-Time", "Part-Time", "Internship"];
const experienceLevels = ["Junior", "Mid", "Senior"];
const locationTypes = ["Remote", "On-site", "Hybrid"];
const sortOptions = ["Best Match", "Newest", "Highest Score"];

export default function ExploreJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("Best Match");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showAllCards, setShowAllCards] = useState(false);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeFilters = [
    ...activeTypes.map((t) => ({ label: t, clear: () => setActiveTypes((p) => p.filter((v) => v !== t)) })),
    ...activeExperience.map((t) => ({ label: t, clear: () => setActiveExperience((p) => p.filter((v) => v !== t)) })),
    ...activeLocation.map((t) => ({ label: t, clear: () => setActiveLocation((p) => p.filter((v) => v !== t)) })),
    ...(minScore > 0 ? [{ label: `Min Score: ${minScore}%`, clear: () => setMinScore(0) }] : []),
  ];

  const filtered = useMemo(() => {
    let result = exploreJobs.filter((j) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.company.toLowerCase().includes(q) &&
          !j.location.toLowerCase().includes(q) &&
          !j.skills.some((s) => s.toLowerCase().includes(q))
        ) return false;
      }
      if (activeTypes.length && !activeTypes.includes(j.type)) return false;
      if (activeExperience.length && !activeExperience.includes(j.experience)) return false;
      if (activeLocation.length && !activeLocation.includes(j.locationType)) return false;
      if (j.score < minScore) return false;
      return true;
    });

    if (sortBy === "Newest") result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    else if (sortBy === "Highest Score") result.sort((a, b) => b.score - a.score);
    else result.sort((a, b) => b.score - a.score);

    return result;
  }, [searchQuery, activeTypes, activeExperience, activeLocation, minScore, sortBy]);

  const displayedJobs = showAllCards ? filtered : filtered.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search & Filters */}
      <GlassCard className="p-5 sticky top-0 z-20">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, skill, company, or location..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1" />
          {jobTypes.map((t) => (
            <button key={t} onClick={() => toggle(activeTypes, t, setActiveTypes)} className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeTypes.includes(t) ? "bg-primary/10 text-primary border border-primary/20" : "glass-card text-muted-foreground hover:text-foreground"
            )}>{t}</button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {experienceLevels.map((t) => (
            <button key={t} onClick={() => toggle(activeExperience, t, setActiveExperience)} className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeExperience.includes(t) ? "bg-secondary/10 text-secondary border border-secondary/20" : "glass-card text-muted-foreground hover:text-foreground"
            )}>{t}</button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {locationTypes.map((t) => (
            <button key={t} onClick={() => toggle(activeLocation, t, setActiveLocation)} className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeLocation.includes(t) ? "bg-accent/10 text-accent border border-accent/20" : "glass-card text-muted-foreground hover:text-foreground"
            )}>{t}</button>
          ))}
        </div>

        {/* Score slider + Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Min Score: {minScore}%</span>
            <Slider value={[minScore]} onValueChange={(v) => setMinScore(v[0])} max={100} step={5} className="w-40 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.relative>div]:bg-primary" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-8 px-3 rounded-lg bg-surface border border-border text-xs text-foreground outline-none focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {sortOptions.map((o) => <option key={o} value={o} className="bg-surface">{o}</option>)}
          </select>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
            {activeFilters.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {f.label}
                <button onClick={f.clear}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">Showing {filtered.length} jobs</p>
      </GlassCard>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayedJobs.map((job) => (
          <GlassCard key={job.id} hover className="p-5 group relative">
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-xs font-bold text-primary">{job.companyLogo}</div>
                <div>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="text-xs text-muted-foreground/60">{job.postedAgo}</p>
                </div>
              </div>
              <PulseOrb score={job.score} size="md" />
            </div>

            {/* Title */}
            <Link to={`/candidate/job/${job.id}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors tracking-tight block mb-3">
              {job.title}
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                <MapPin className="w-3 h-3" /> {job.locationType}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                <Clock className="w-3 h-3" /> {job.type}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.skills.slice(0, 4).map((skill) => (
                <span key={skill} className={cn(
                  "px-2 py-0.5 rounded text-[11px] border-l-2",
                  job.matchedSkills.includes(skill)
                    ? "bg-primary/5 text-primary border-primary/40"
                    : "bg-foreground/[0.02] text-muted-foreground border-border"
                )}>{skill}</span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-2 py-0.5 rounded text-[11px] text-muted-foreground bg-foreground/[0.02]">+{job.skills.length - 4} more</span>
              )}
            </div>

            {/* Description */}
            <div className="relative mb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[rgba(13,13,26,0.8)] to-transparent pointer-events-none" />
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                job.experience === "Senior" ? "bg-warning/10 text-warning" : job.experience === "Mid" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"
              )}>{job.experience}</span>
              <div className="flex items-center gap-3">
                <Link to={`/candidate/job/${job.id}`} className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => toggleBookmark(job.id)} className="text-muted-foreground hover:text-primary transition-colors">
                  {bookmarked.has(job.id) ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Load More */}
      {filtered.length > 6 && !showAllCards && (
        <div className="flex justify-center pt-4">
          <button onClick={() => setShowAllCards(true)} className="px-8 py-3 rounded-xl glass-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/10 transition-all">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
