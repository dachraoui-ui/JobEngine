import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { cn } from "@/lib/utils";
import {
  Search, X, Bookmark, BookmarkCheck, ChevronRight, MapPin, Clock, SlidersHorizontal, Loader2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapJobType(type: string): string {
  switch (type) {
    case "FULL_TIME": return "Full-Time";
    case "PART_TIME": return "Part-Time";
    case "INTERNSHIP": return "Internship";
    default: return type ?? "Full-Time";
  }
}

function mapExperience(level: string): string {
  switch (level) {
    case "SENIOR": return "Senior";
    case "MID": return "Mid";
    case "JUNIOR": return "Junior";
    default: return level ?? "Junior";
  }
}

function mapLocationType(type: string, location: string): string {
  if (!type && !location) return "On-site";
  const t = (type ?? "").toUpperCase();
  if (t === "REMOTE") return "Remote";
  if (t === "HYBRID") return "Hybrid";
  const loc = (location ?? "").toLowerCase();
  if (loc.includes("remote")) return "Remote";
  if (loc.includes("hybrid")) return "Hybrid";
  return "On-site";
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1w ago";
  return `${weeks}w ago`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  locationType: string;
  type: string;
  experience: string;
  postedAgo: string;
  description: string;
  skills: string[];
  matchedSkills: string[];
  score: number;
}

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship"];
const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior"];
const LOCATION_TYPES = ["Remote", "On-site", "Hybrid"];
const SORT_OPTIONS = ["Best Match", "Newest", "Highest Score"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExploreJobs() {
  const { user } = useAuth();

  const [allJobs, setAllJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("Best Match");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showAllCards, setShowAllCards] = useState(false);

  // ── Fetch jobs + candidate profile ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, profileRes] = await Promise.all([
          api.get("/jobs?size=100"),
          api.get(`/users/${user.id}/candidate-profile`),
        ]);

        const rawJobs: any[] = jobsRes.data.data?.content ?? jobsRes.data.data ?? [];
        const profile = profileRes.data.data;
        const candidateSkills: string[] = profile?.skills ?? [];

        const normalized: NormalizedJob[] = rawJobs.map((job: any) => {
          const required: string[] = job.requiredSkills ?? [];
          const matched = required.filter((s) =>
            candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
          );
          const score =
            required.length > 0
              ? Math.round((matched.length / required.length) * 100)
              : 60; // neutral fallback

          return {
            id: job.id,
            title: job.title ?? "Untitled Position",
            company: job.companyName || job.recruiterName || "Unknown Company",
            companyLogo: (job.companyName || job.recruiterName || "C").charAt(0).toUpperCase(),
            location: job.location ?? "Remote",
            locationType: mapLocationType(job.locationType ?? "", job.location ?? ""),
            type: mapJobType(job.type ?? ""),
            experience: mapExperience(job.experienceLevel ?? ""),
            postedAgo: timeAgo(job.createdAt ?? ""),
            description: job.description ?? "No description available.",
            skills: required,
            matchedSkills: matched,
            score,
          };
        });

        setAllJobs(normalized);
      } catch (err) {
        console.error("Failed to load explore jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // ── Filtering + sorting ──────────────────────────────────────────────────────
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
    let result = allJobs.filter((j) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.company.toLowerCase().includes(q) &&
          !j.location.toLowerCase().includes(q) &&
          !j.skills.some((s) => s.toLowerCase().includes(q))
        )
          return false;
      }
      if (activeTypes.length && !activeTypes.includes(j.type)) return false;
      if (activeExperience.length && !activeExperience.includes(j.experience)) return false;
      if (activeLocation.length && !activeLocation.includes(j.locationType)) return false;
      if (j.score < minScore) return false;
      return true;
    });

    if (sortBy === "Newest") result = [...result]; // already in API order (newest first)
    else if (sortBy === "Highest Score") result.sort((a, b) => b.score - a.score);
    else result.sort((a, b) => b.score - a.score); // Best Match = highest score first

    return result;
  }, [allJobs, searchQuery, activeTypes, activeExperience, activeLocation, minScore, sortBy]);

  const displayedJobs = showAllCards ? filtered : filtered.slice(0, 6);

  // ─── Render ──────────────────────────────────────────────────────────────────
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
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggle(activeTypes, t, setActiveTypes)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeTypes.includes(t)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {EXPERIENCE_LEVELS.map((t) => (
            <button
              key={t}
              onClick={() => toggle(activeExperience, t, setActiveExperience)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeExperience.includes(t)
                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggle(activeLocation, t, setActiveLocation)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeLocation.includes(t)
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Score slider + Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Min Score: {minScore}%</span>
            <Slider
              value={[minScore]}
              onValueChange={(v) => setMinScore(v[0])}
              max={100}
              step={5}
              className="w-40 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.relative>div]:bg-primary"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-8 px-3 rounded-lg bg-surface border border-border text-xs text-foreground outline-none focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-surface">
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
            {activeFilters.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs"
              >
                {f.label}
                <button onClick={f.clear}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          {loading ? "Loading jobs..." : `Showing ${filtered.length} job${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </GlassCard>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Fetching jobs from the neural engine…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center border-dashed border-foreground/10">
          <p className="text-foreground font-medium mb-2">No jobs match your filters</p>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or clearing some filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTypes([]);
              setActiveExperience([]);
              setActiveLocation([]);
              setMinScore(0);
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </GlassCard>
      ) : (
        <>
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayedJobs.map((job) => (
              <GlassCard key={job.id} hover className="p-5 group flex flex-col gap-3">
                {/* Top row: company info + score */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {job.companyLogo}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{job.company}</p>
                      <p className="text-xs text-muted-foreground">{job.postedAgo}</p>
                    </div>
                  </div>
                  <PulseOrb score={job.score} size="md" />
                </div>

                {/* Title */}
                <Link
                  to={`/candidate/job/${job.id}`}
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors tracking-tight"
                >
                  {job.title}
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    <MapPin className="w-3 h-3" /> {job.locationType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                </div>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px] border-l-2",
                          job.matchedSkills.includes(skill)
                            ? "bg-primary/5 text-primary border-primary/40"
                            : "bg-foreground/[0.02] text-muted-foreground border-border"
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded text-[11px] text-muted-foreground bg-foreground/[0.02]">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Description — clean line-clamp, no gradient overlay */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      job.experience === "Senior"
                        ? "bg-warning/10 text-warning"
                        : job.experience === "Mid"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {job.experience}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/candidate/job/${job.id}`}
                      className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {bookmarked.has(job.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Load More */}
          {filtered.length > 6 && !showAllCards && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowAllCards(true)}
                className="px-8 py-3 rounded-xl glass-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/10 transition-all"
              >
                Load More ({filtered.length - 6} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
