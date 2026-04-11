export const candidates = [
  { id: "1", name: "Sarah Chen", role: "Senior Frontend Engineer", score: 94, status: "Interview", avatar: "SC", appliedDate: "2026-04-01", skills: ["React", "TypeScript", "Node.js", "GraphQL"], experience: "8 years", stage: "interview" },
  { id: "2", name: "Marcus Johnson", role: "Product Designer", score: 87, status: "Screening", avatar: "MJ", appliedDate: "2026-04-02", skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"], experience: "6 years", stage: "screening" },
  { id: "3", name: "Aisha Patel", role: "Backend Engineer", score: 91, status: "Offer", avatar: "AP", appliedDate: "2026-03-28", skills: ["Go", "PostgreSQL", "Kubernetes", "AWS"], experience: "7 years", stage: "offer" },
  { id: "4", name: "James Wright", role: "DevOps Engineer", score: 73, status: "Applied", avatar: "JW", appliedDate: "2026-04-04", skills: ["Docker", "Terraform", "CI/CD", "Linux"], experience: "5 years", stage: "applied" },
  { id: "5", name: "Elena Volkov", role: "Data Scientist", score: 82, status: "Interview", avatar: "EV", appliedDate: "2026-03-30", skills: ["Python", "TensorFlow", "SQL", "Statistics"], experience: "4 years", stage: "interview" },
  { id: "6", name: "David Kim", role: "Senior Frontend Engineer", score: 56, status: "Screening", avatar: "DK", appliedDate: "2026-04-03", skills: ["Vue.js", "CSS", "JavaScript"], experience: "3 years", stage: "screening" },
  { id: "7", name: "Priya Sharma", role: "Engineering Manager", score: 96, status: "Hired", avatar: "PS", appliedDate: "2026-03-15", skills: ["Leadership", "Agile", "System Design", "Mentoring"], experience: "12 years", stage: "hired" },
  { id: "8", name: "Tom Andersson", role: "ML Engineer", score: 88, status: "Interview", avatar: "TA", appliedDate: "2026-03-29", skills: ["PyTorch", "MLOps", "Python", "Computer Vision"], experience: "5 years", stage: "interview" },
  { id: "9", name: "Lisa Nakamura", role: "Product Designer", score: 45, status: "Applied", avatar: "LN", appliedDate: "2026-04-05", skills: ["Sketch", "Adobe XD"], experience: "2 years", stage: "applied" },
  { id: "10", name: "Carlos Rivera", role: "Backend Engineer", score: 78, status: "Screening", avatar: "CR", appliedDate: "2026-04-01", skills: ["Java", "Spring Boot", "MySQL"], experience: "6 years", stage: "screening" },
];

export const jobs = [
  { id: "1", title: "Senior Frontend Engineer", department: "Engineering", location: "San Francisco, CA", type: "Full-time", postedDate: "2026-03-20", applicants: 34, status: "Active", featured: true, salary: "$160k - $200k" },
  { id: "2", title: "Product Designer", department: "Design", location: "Remote", type: "Full-time", postedDate: "2026-03-25", applicants: 22, status: "Active", featured: false, salary: "$130k - $170k" },
  { id: "3", title: "Backend Engineer", department: "Engineering", location: "New York, NY", type: "Full-time", postedDate: "2026-03-18", applicants: 41, status: "Active", featured: true, salary: "$150k - $190k" },
  { id: "4", title: "DevOps Engineer", department: "Infrastructure", location: "Remote", type: "Full-time", postedDate: "2026-04-01", applicants: 12, status: "Active", featured: false, salary: "$140k - $180k" },
  { id: "5", title: "Data Scientist", department: "Data", location: "Austin, TX", type: "Full-time", postedDate: "2026-03-22", applicants: 28, status: "Paused", featured: false, salary: "$145k - $185k" },
  { id: "6", title: "Engineering Manager", department: "Engineering", location: "San Francisco, CA", type: "Full-time", postedDate: "2026-03-10", applicants: 15, status: "Closed", featured: false, salary: "$180k - $230k" },
  { id: "7", title: "ML Engineer", department: "AI/ML", location: "Remote", type: "Full-time", postedDate: "2026-03-28", applicants: 19, status: "Active", featured: true, salary: "$170k - $220k" },
  { id: "8", title: "QA Engineer", department: "Engineering", location: "Seattle, WA", type: "Contract", postedDate: "2026-04-02", applicants: 8, status: "Active", featured: false, salary: "$120k - $150k" },
];

export const pipelineStages = [
  { id: "applied", label: "Applied", count: 45, color: "primary" },
  { id: "screening", label: "Screening", count: 28, color: "secondary" },
  { id: "interview", label: "Interview", count: 14, color: "warning" },
  { id: "offer", label: "Offer", count: 6, color: "accent" },
  { id: "hired", label: "Hired", count: 3, color: "accent" },
];

export const activities = [
  { id: "1", type: "application", message: "Sarah Chen applied for Senior Frontend Engineer", time: "2 hours ago", icon: "user-plus" },
  { id: "2", type: "interview", message: "Interview scheduled with Elena Volkov for Data Scientist", time: "4 hours ago", icon: "calendar" },
  { id: "3", type: "status", message: "Aisha Patel moved to Offer stage", time: "6 hours ago", icon: "arrow-right" },
  { id: "4", type: "hired", message: "Priya Sharma accepted offer — Engineering Manager", time: "1 day ago", icon: "check-circle" },
  { id: "5", type: "application", message: "James Wright applied for DevOps Engineer", time: "1 day ago", icon: "user-plus" },
  { id: "6", type: "status", message: "Marcus Johnson advanced to Screening", time: "2 days ago", icon: "arrow-right" },
];

export const analyticsData = {
  timeToHire: 23,
  costPerHire: 4250,
  offerAcceptance: 87,
  sourceEffectiveness: 72,
  hiringFunnel: [
    { stage: "Applied", count: 245 },
    { stage: "Screened", count: 142 },
    { stage: "Interview", count: 68 },
    { stage: "Offer", count: 24 },
    { stage: "Hired", count: 18 },
  ],
  sourceBreakdown: [
    { source: "LinkedIn", count: 98, percentage: 40 },
    { source: "Referrals", count: 54, percentage: 22 },
    { source: "Website", count: 42, percentage: 17 },
    { source: "Indeed", count: 31, percentage: 13 },
    { source: "Other", count: 20, percentage: 8 },
  ],
  monthlyHires: [
    { month: "Oct", hires: 4 },
    { month: "Nov", hires: 6 },
    { month: "Dec", hires: 3 },
    { month: "Jan", hires: 7 },
    { month: "Feb", hires: 5 },
    { month: "Mar", hires: 8 },
  ],
};
