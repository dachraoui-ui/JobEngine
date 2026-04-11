# 🎨 JobEngine — Lovable AI Prompts (Premium UI Templates)

> **Design Concept: "Neural Engine"**
> The core metaphor is a living, intelligent engine making neural connections between talent and opportunity. The UI feels alive — matching scores pulse like heartbeats, skills form constellation graphs, and the pipeline flows like electrical current. Dark-first luxury aesthetic inspired by Linear, Raycast, and Stripe, with bioluminescent accents.

---

## 🎯 Design System Prompt (PASTE THIS FIRST)

```
Create a premium, dark-first recruitment platform called "JobEngine" with tagline "Where Talent Meets Opportunity".

DESIGN CONCEPT — "Neural Engine":
The entire interface should feel like a living intelligent system. Data visualizations pulse, connections glow, and the UI breathes with subtle animation. Think: if an AI had a physical control room, this is what it would look like.

VISUAL IDENTITY:
- Aesthetic: Ultra-premium dark SaaS — inspired by Linear.app, Raycast, Vercel's dashboard, and Stripe
- NO generic corporate look. This should feel like a next-generation AI product.

COLOR PALETTE:
- Background layers:
  - Deepest: #07070E (near-black with blue undertone)
  - Surface: #0D0D1A (dark navy, main content bg)
  - Elevated: #13132B (cards, panels)
  - Glass: rgba(255,255,255,0.03) with 1px border rgba(255,255,255,0.06) — frosted glass
- Accent colors:
  - Primary: Electric cyan #00D4FF (used for primary actions, highlights, active states)
  - Secondary: Aurora violet #8B5CF6 (used for AI features, scores, secondary actions)
  - Tertiary: Neon mint #34D399 (used for success, positive scores, hired status)
- Score spectrum:
  - 80-100: Cyan-to-mint gradient glow
  - 60-79: Amber glow #F59E0B
  - Below 60: Coral glow #F43F5E
- Text:
  - Primary: #F1F5F9 (off-white, never pure #FFF)
  - Secondary: #64748B (muted slate)
  - Tertiary: #334155 (subtle labels)
- Gradient meshes: Use multi-color mesh gradients (cyan + violet + dark) for hero backgrounds and accent sections. Very subtle, like aurora borealis.

TYPOGRAPHY:
- Font: "Plus Jakarta Sans" (Google Font) — geometric, modern, techy
- Headings: Bold, tight letter-spacing (-0.02em), large sizes
- Body: Regular weight, relaxed line-height (1.6)
- Monospace for scores/numbers: "JetBrains Mono" or "Fira Code"

COMPONENTS STYLE:
- Cards: Dark glass morphism — bg rgba(255,255,255,0.03), border 1px solid rgba(255,255,255,0.06), backdrop-blur-xl, border-radius 16px
- Buttons: 
  - Primary: Cyan bg (#00D4FF), dark text (#07070E), rounded-xl, subtle glow shadow (0 0 20px rgba(0,212,255,0.3))
  - Secondary: Transparent, 1px cyan border, cyan text
  - Ghost: Transparent, slate text, hover:bg-white/5
  - Danger: Deep rose (#F43F5E), with red glow
- Inputs: Dark bg (#0D0D1A), 1px border (#1E293B), rounded-xl, focus:border-cyan with glow, placeholder in slate
- Badges/Pills: Rounded-full, semi-transparent colored bg with matching text (e.g., cyan/10 bg + cyan text)
- Tooltips: Glass card style, appears with fade+scale
- Modals: Glass card, centered, with dark overlay (bg-black/60 backdrop-blur-sm)
- Transitions: All hover/focus transitions 200ms ease, cards lift slightly on hover (translateY -2px + shadow increase)

SIGNATURE ELEMENTS (what makes this unique):
1. "Pulse Orbs" — Match scores displayed as glowing orbs with animated pulse rings (CSS keyframe). Higher score = faster/brighter pulse
2. "Glow borders" — Important cards have animated gradient borders (cyan → violet → back) using CSS conic-gradient animation
3. "Grid background" — Subtle dot grid pattern (dots at 24px intervals, color #1E293B) on the main background, like a digital blueprint
4. "Light leaks" — Subtle radial gradient blurs of cyan and violet placed strategically behind key content sections, creating a moody atmosphere
5. "Constellation lines" — Navigation items in sidebar connected by thin hairline lines, like a constellation map

LAYOUT:
- Sidebar: 72px collapsed (icon-only) / 260px expanded, bg #07070E, with constellation line connecting nav items
- Content area: bg #0D0D1A with subtle dot grid pattern
- Top bar: Transparent, blending with content
- Max content width: 1200px, centered with generous padding (32px)

RESPONSIVE: Works on 1440px desktop, 768px tablet (sidebar becomes bottom tab bar), 375px mobile
```

---

## 1. 🏠 Landing Page — "The Neural Gateway"

```
Create a landing page for "JobEngine — Where Talent Meets Opportunity", an AI-powered recruitment platform. Use the dark neural engine design system described previously.

HERO SECTION (full viewport, dark):
- Background: Deep #07070E with animated mesh gradient — large (600px), soft, blurred blobs of cyan (#00D4FF, 10% opacity) and violet (#8B5CF6, 8% opacity) slowly drifting/morphing. Overlaid with subtle dot grid pattern.
- Navigation (fixed top, glass morphism bar): 
  - Left: "JE" logomark (stylized, cyan accent) + "JobEngine" text
  - Center: Features, How It Works, Pricing (link style, slate text, hover:white)
  - Right: "Sign In" ghost button + "Launch Your Career" primary cyan button with glow
- Hero content (centered):
  - Eyebrow badge: "✨ AI-Powered Recruitment Engine" (glass pill badge with subtle shimmer animation on the border)
  - Heading (56px, bold, white): "The Intelligent Engine That" + second line with gradient text (cyan→violet): "Connects Talent to Opportunity"
  - Subheading (18px, slate, max-width 560px): "JobEngine uses neural matching to analyze CVs, rank candidates by compatibility score, and automate your entire recruitment pipeline."
  - Two CTA buttons:
    - "Start Hiring" (cyan bg, dark text, large, with subtle glow pulse animation)
    - "Find Your Job" (transparent, cyan border, cyan text)
  - Below buttons: "Trusted by 500+ companies" + row of 5 faded company logos (gray, low opacity)

LIVE METRICS BAR (glass morphism card, floating below hero, -40px overlap):
  - 4 metrics side by side, separated by subtle vertical dividers:
  - "50,000+" → "CVs Analyzed" (with brain icon, cyan)
  - "< 3 sec" → "Analysis Speed" (with zap icon, violet)
  - "94%" → "Match Accuracy" (with target icon, mint)
  - "10x" → "Faster Hiring" (with rocket icon, amber)
  - Numbers displayed in monospace font (JetBrains Mono), large size, with animated count-up on scroll

FEATURES SECTION ("What Makes JobEngine Different"):
- Section heading: "What Makes JobEngine Different" (centered, white, bold)
- Subtitle: "Built with AI at its core, not as an afterthought"
- 3 large feature cards (horizontal row), glass morphism, each with:
  - Animated icon area (64px, inside a glowing circle): unique icon per feature
  - Feature name (18px, bold, white)
  - Description (14px, slate)
  - Subtle animated glow border (conic-gradient rotating slowly)
- Features:
  1. "Neural Matching" — brain icon inside pulsing cyan orb → "Our AI analyzes skills, experience, and culture values using TF-IDF & Cosine Similarity to find perfect matches"
  2. "Smart Pipeline" — kanban icon with flowing electric lines → "Drag & drop recruitment pipeline with automated status tracking, email triggers, and interview scheduling"
  3. "Career Intelligence" — sparkle icon with radar pulse → "AI-powered CV feedback, skill gap analysis, and personalized career path recommendations for candidates"

HOW IT WORKS (4-step horizontal flow):
- Title: "From Upload to Hired in 4 Steps"
- 4 steps connected by an animated flowing line (dashed, with a glowing dot traveling along it, like electricity):
  - Step 1: Upload icon → "Upload CV" → "PDF or DOCX, analyzed in seconds"
  - Step 2: Brain/scan icon → "AI Analysis" → "Skills, experience, and education extracted automatically"
  - Step 3: Target/match icon → "Neural Match" → "Scored against jobs using our matching engine"
  - Step 4: Rocket/trophy icon → "Get Hired" → "Track progress through automated pipeline"
- Each step: numbered (01-04) in monospace, inside a glass card, with the icon in a colored orb (cyan, violet, mint, amber respectively)

DUAL CTA SECTION (split view):
- Left panel (glass card, cyan accent): 
  - "For Recruiters" 
  - "Find the top 10% of candidates — automatically"
  - 4 bullet points with cyan dots: AI ranking, Pipeline automation, Auto-scheduling, Score-based filtering
  - "Start Hiring →" link
- Right panel (glass card, violet accent):
  - "For Candidates"
  - "Get matched to jobs that truly fit you"
  - 4 bullet points with violet dots: CV intelligence, Match scores, Career advice, Application tracking
  - "Find Your Job →" link
- Between them: a glowing vertical divider with a pulsing "or" circle

TESTIMONIALS (horizontal scroll/carousel):
- 3 testimonial cards (glass, with quote mark icon):
  - Quote text (italic, white)
  - Person: avatar + name + title + company
  - Star rating (5 stars, amber)

FINAL CTA (full-width, mesh gradient background cyan→violet):
- "Ready to Revolutionize Your Hiring?" (36px, bold)
- "Join 500+ companies already using JobEngine" (slate)
- Large "Get Started Free" button (white bg, dark text)
- "No credit card required • Free forever for candidates"

FOOTER (dark, #07070E):
- Column layout: Product links, Company links, Resources, Legal
- Bottom: © 2026 JobEngine + social icons (GitHub, LinkedIn, Twitter)
- Subtle dot grid continues into footer
```

---

## 2. 🔐 Login Page — "The Entry Portal"

```
Create a login page for JobEngine with the dark neural engine design.

FULL DARK PAGE — no split screen. Everything centered.

BACKGROUND:
- Full page #07070E with dot grid pattern
- Two large blurred light leaks: one cyan (top left quarter, 30% opacity) and one violet (bottom right quarter, 20% opacity) — creates a moody, cinematic atmosphere
- Optional: very subtle particle effect (tiny dots slowly floating upward)

CENTERED LOGIN CARD (max-width 440px, glass morphism):
- Top: "JE" logomark (animated subtle glow) 
- Heading: "Welcome back" (28px, bold, white)
- Subtitle: "Sign in to your neural network" (14px, slate)

- Email field: 
  - Label "Email" (12px, uppercase, letter-spaced, slate)
  - Dark input with left mail icon, placeholder "you@company.com"
  - Focus state: cyan border glow
  
- Password field:
  - Label "Password"
  - Dark input with left lock icon + right eye toggle
  - Focus state: cyan border glow

- Row: "Remember me" toggle switch (small, cyan when on) + "Forgot password?" link (cyan text)

- "Sign In" button (full width, cyan bg, dark text, rounded-xl, glow shadow)
  - Hover: intensified glow
  - Loading state: spinner replacing text

- Divider: thin line with "or" text centered (in a small pill bg)

- "Continue with Google" button (full width, glass card style, Google icon left)

- Bottom: "New to JobEngine?" + "Create an account →" (cyan link)

- Below card: "🔒 Secured with 256-bit encryption" (tiny, slate text, lock icon)

ANIMATIONS:
- Card entrance: fade up + scale from 0.95 to 1.0 (300ms)
- Input focus: border transitions to cyan with box-shadow glow
- Button hover: glow intensifies
- Error shake: card shakes horizontally on wrong password, input borders flash red
```

---

## 3. 📝 Register Page — "Neural Onboarding"

```
Create a registration page for JobEngine with the dark neural engine design.

Same dark background with dot grid + light leaks as login.

CENTERED CARD (max-width 520px, glass morphism):

**TOP**: Logo + "Join JobEngine" heading + "Create your account and start connecting" subtitle

**STEP 1: ROLE SELECTION** (shown first)
- "I am a..." heading
- Two role cards side by side (glass, selectable):
  - CANDIDATE card: 
    - Illustration: abstract person icon with orbiting skill nodes (cyan accent)
    - "Candidate" title (bold)
    - "Find jobs matched to your skills by AI"
    - Selected state: cyan glow border, cyan checkmark badge in corner, slight scale-up (1.02)
  - RECRUITER card:
    - Illustration: abstract building icon with connecting lines (violet accent)
    - "Recruiter" title (bold)
    - "Find perfect candidates with neural matching"
    - Selected state: violet glow border, violet checkmark

- "Continue →" button (full width, cyan) — appears after selection

**STEP 2: PERSONAL INFO** (slides in from right, replacing step 1)
- Progress indicator: 3 dots at top (dot 1: filled cyan, dot 2: filled cyan, dot 3: empty)
- First Name + Last Name (two inputs in a row)
- Email input
- Password input with inline strength meter:
  - Below the input: 4 small bar segments
  - Weak: 1 bar red
  - Fair: 2 bars amber
  - Strong: 3 bars cyan
  - Excellent: 4 bars mint with "Strong password ✓" text
- Confirm Password input

- If RECRUITER was selected, show extra fields with smooth height animation:
  - Company Name input
  - Industry dropdown (glass dropdown style, dark options)
  - Company Website (optional, with globe icon)

- "Create Account" button (full width, cyan bg, glow)
- Terms checkbox: "I agree to the Terms of Service and Privacy Policy" (links in cyan)

**STEP 3: SUCCESS** (replaces form with animation)
- Large animated checkmark (draws itself, green/cyan)
- "Welcome to JobEngine! 🚀" heading
- If Candidate: "Let's upload your CV and start matching" → "Upload CV" button
- If Recruiter: "Your account is pending verification. We'll review it within 24 hours." → "Go to Dashboard" button

ANIMATIONS:
- Step transitions: current step slides left + fades, new step slides in from right
- Role card selection: smooth border-color transition + scale
- Checkmark: SVG path animation (stroke-dasharray draw effect)
```

---

## 4. 📊 Candidate Dashboard — Job Listings — "The Neural Feed"

```
Create a job exploration page for candidates on JobEngine with the dark neural engine design.

LAYOUT:
- LEFT SIDEBAR (72px collapsed / 260px expanded, #07070E):
  - Top: "JE" logomark (cyan)
  - Toggle: hamburger icon to expand/collapse
  - Nav items (icon-only when collapsed, icon+text when expanded):
    - 🏠 Dashboard (constellation dot, connected by thin line to next)
    - 🔍 Explore Jobs (active — cyan text + left cyan accent bar + icon filled)
    - 📋 My Applications
    - 👤 Profile
    - 🧠 Career AI
    - 📤 Upload CV
  - Bottom: avatar circle (32px) + settings gear
  - CONSTELLATION LINES: thin hairlines (1px, #1E293B) connecting each nav dot vertically, like a star constellation. Active item's dot glows cyan.

- TOP BAR (transparent, blending with content):
  - Left: "Explore Jobs" (20px, bold) 
  - Right: 
    - Search input (glass, compact, with ⌘K shortcut hint)
    - Notification bell (with ping dot if new)
    - Avatar dropdown

- CONTENT AREA (#0D0D1A, dot grid bg):

**SEARCH & FILTER SECTION** (sticky, glass card):
- Large search input spanning full width: "Search by title, skill, company, or location..." (with animated typing cursor placeholder)
- Filter row below:
  - Smart filter pills (glass buttons, toggle on/off):
    - "Full-Time" / "Part-Time" / "Internship" (job type)
    - "Junior" / "Mid" / "Senior" (experience)
    - "Remote" / "On-site" / "Hybrid" (location type)
  - Score filter: "Min Score: 70%" with small range slider (cyan track)
  - Sort dropdown: "Best Match" / "Newest" / "Highest Score"
- Active filters shown as removable pills (cyan bg/10, cyan text, x button)
- Results count: "Showing 142 jobs" (small, slate)

**JOB CARDS** (2-column grid, gap-16px):

Each job card (glass morphism, rounded-2xl, hover:glow-border):
- Top row: 
  - Company mini-logo (40px, rounded-lg, inside glass circle)
  - Company name (14px, slate)
  - Posted time: "2d ago" (12px, slate, right-aligned)
- Job title (18px, bold, white, clickable)
- Location + type tags (glass pills): "🌎 Remote" (cyan/10 bg) + "⏰ Full-Time" (violet/10 bg)
- Skills row: small rounded pills: "React" "TypeScript" "Node.js" "MongoDB" — max 4 visible + "+3 more"
  - Each skill pill has a subtle left border color (cyan for matched, slate for unmatched)
- Description preview (2 lines, slate, truncated with fade-out gradient instead of "...")

- **MATCH SCORE — PULSE ORB** (right side or bottom-right):
  - Circular orb (56px) with the score number inside (monospace font, bold)
  - Orb appearance varies by score:
    - 80-100: Cyan-to-mint gradient, bright glow, fast pulse ring animation
    - 60-79: Amber gradient, medium glow, normal pulse
    - Below 60: Coral/rose gradient, dim glow, slow pulse
  - The pulse is a ring that expands outward from the orb and fades (CSS animation)

- Bottom row:
  - Experience badge: "Senior" (glass pill)
  - "View Details →" text link (cyan)
  - Bookmark icon (outline, fills on click)

- HOVER EFFECT: Card lifts 2px, border gains subtle cyan glow, shadow increases

Show 6 job cards with realistic data and varied scores (92, 87, 74, 68, 53, 41)

**PAGINATION**: "Load More" button (glass, centered) or infinite scroll indicator
```

---

## 5. 📋 Job Detail + Apply — "The Match Report"

```
Create a job detail page for candidates on JobEngine. Dark neural engine design.

Same sidebar + top bar layout.

CONTENT (single column, max-width 860px, centered):

**HERO CARD** (glass, large, rounded-2xl):
- Company logo (56px, in glass circle) + company name + "Verified ✓" badge (mint)
- Job title: "Senior Full Stack Developer" (28px, bold, white)
- Tag row: "Full-Time" (cyan pill) + "Remote" (violet pill) + "Senior" (amber pill)
- Meta row (slate, small): "📍 San Francisco (Remote OK)" · "💰 $120k—$160k" · "📅 Posted 3 days ago"
- "Closes in 12 days" countdown (amber text)
- Two buttons: "Apply Now" (cyan, glow, large) + "Save" (glass, bookmark icon)

**NEURAL MATCH CARD** (special card — animated gradient border rotating slowly, conic-gradient cyan→violet):
- Inside: glass bg
- Title: "🧠 Your Neural Match" (bold, 20px)
- CENTER: Large pulse orb (80px) with score "87" in monospace, cyan-mint gradient, animated pulse rings
- Three score bars (horizontal, below the orb):
  - Skills: 92% (cyan bar on dark track, with percentage label)
  - Experience: 85% (cyan bar)
  - Culture Fit: 78% (amber bar — because it's < 80)
- SKILL CONSTELLATION (unique element):
  - Instead of simple skill pills, show a mini node graph:
  - Your skills as filled dots (cyan), required skills as ring dots
  - Connected by thin lines
  - Matched skills: cyan filled + label + "✓"
  - Missing skills: dim dots + label + "✗" in coral
  - Example: React ✓—TypeScript ✓—Node.js ✓—MongoDB ✓—Docker ✓—Kubernetes ✗—GraphQL ✗
  - (Simpler fallback: two rows of pills — "Matched Skills" in cyan pills, "Missing Skills" in coral pills)
- Pro tip banner (glass, small): "💡 Picking up Kubernetes and GraphQL could boost your score to 95%"

**JOB DESCRIPTION SECTION** (glass card):
- "About This Role" — formatted paragraphs (white text)
- "What You'll Do" — bullet list with cyan dot markers
- "What We Need" — bullet list with items tagged as ✓ "You have this" (cyan) or ✗ "Gap" (coral)
- "Nice to Have" — bullet list in slate color (less emphasis)

**COMPANY CULTURE** (glass card):
- "Culture & Values"
- Value tags: "Innovation" "Remote-First" "Work-Life Balance" "Diversity"
- Your matching values highlighted with cyan glow, non-matching values stay dim
- Match indicator: "3/4 values align" (small, cyan text)

**APPLY MODAL** (triggered by "Apply Now"):
- Glass modal, centered, overlay backdrop-blur
- Title: "Apply to Senior Full Stack Developer"
- Company logo + name
- "Select your CV" — dropdown of uploaded CVs (showing file name + date), or "Upload New" button
- Optional cover note textarea (dark input, placeholder: "Add a personal note...")
- Match score reminder: pulse orb in corner showing 87%
- "Submit Application ✨" button (cyan, glow)
- "Cancel" ghost button
- SUCCESS STATE: Modal content crossfades to:
  - Animated checkmark (draws itself, cyan)
  - "Application Sent! 🚀"
  - "We'll notify you when TechCorp reviews your profile"
  - "View My Applications →" link
```

---

## 6. 📄 Applications Tracker — "Mission Control"

```
Create an application tracking dashboard for candidates. Dark neural engine design.

Same sidebar layout.

**HEADER**: "Mission Control" (24px, bold) + "Track your application journey"

**STATS ROW** (4 glass metric cards in a row):
Each card has:
- Top: icon in small colored orb
- Large number (monospace, bold, white)
- Label (small, slate)
- Cards:
  - "12" → "Total Applied" (cyan orb)
  - "3" → "Shortlisted" (amber orb)
  - "2" → "Interviews" (violet orb)
  - "1" → "Offers" (mint orb)

**FILTER TABS** (glass pills, horizontal):
- All (12) | In Progress (8) | Interviews (2) | Completed (4)
- Active tab: cyan bg, dark text. Others: ghost style.

**APPLICATION CARDS** (vertical list, full width):

Each card (glass, rounded-xl, expandable):
- LEFT (16px): Status accent bar (vertical, colored stripe):
  - Applied: slate
  - Shortlisted: amber
  - Interview: violet, pulsing glow
  - Rejected: coral
  - Hired: mint, pulsing glow
- CONTENT:
  - Row 1: Company logo (40px) + Company name (slate) + applied date "Applied Mar 15" (small, slate)
  - Row 2: Job title (18px, bold, white)
  - Row 3: Skill pills (small, 3-4 visible)
- RIGHT: 
  - Status badge (glass pill, colored text): "Shortlisted" / "Interview" / etc.
  - Pulse orb (40px): match score "87"

- **EXPANDED STATE** (click to toggle, smooth height animation):
  - TIMELINE (vertical, on the left):
    - Glowing line connecting timeline dots
    - Each event: dot + timestamp + description
    - ✅ "Applied" — Mar 15, 2026 (completed, cyan dot, filled)
    - ✅ "CV Reviewed" — Mar 17, 2026 (completed, cyan dot)
    - ✅ "Shortlisted" — Mar 18, 2026 (completed, amber dot)
    - 🔵 "Interview Scheduled" — Mar 22, 2026, 2:00 PM (current, violet dot, pulsing)
    - ⚪ "Decision" — pending (future, dim dot, dashed line)
  - Score breakdown bars (right side of timeline):
    - Skills: 92%, Experience: 85%, Culture: 78%
  - Action row: "Withdraw Application" (coral ghost button) + "View Job" link

Show 6 applications at different statuses. One should show the INTERVIEW state with a special highlight: "📅 Interview in 2 days" alert banner with violet glow.

**EMPTY STATE** (if no applications):
- Constellation illustration (abstract dots and lines, dim)
- "No applications yet"
- "Your mission begins with finding the right match"
- "Explore Jobs →" button (cyan)
```

---

## 7. 🧠 Career Intelligence — "The Neural Lab"

```
Create a Career Intelligence page for candidates. Dark neural engine design. This is the AI-powered career advisor — it should feel like an advanced AI lab.

Same sidebar layout. "Career AI" nav item active (use a sparkle or brain icon with violet accent).

**HEADER**: "🧠 Neural Lab" (24px, bold) + "AI-powered career intelligence"

**SECTION 1: CV NEURAL SCAN** (glass card with animated gradient border):
- Title: "CV Neural Scan" + "Last scan: 2 hours ago" + "Re-scan" button (violet outline)
- MAIN VISUAL: Large circular gauge (120px):
  - Score ring: animated fill (SVG circle with stroke-dasharray animation), color based on score
  - Score inside: "74" (monospace, large, bold) + "/100" (small, slate)
  - Label below: "CV Strength: Good" (or "Excellent" / "Needs Work")
- TWO COLUMNS below gauge:
  - LEFT: "Strengths" (5 items, each with cyan ✓ dot):
    - "Strong technical skills — 12 relevant technologies detected"
    - "Clear career progression — 4 years, 2 companies"
    - "Education matches target roles"
    - "Multiple programming languages detected"
    - "Good project descriptions"
  - RIGHT: "Improvements" (4 items, each with amber ⚠ icon):
    - "Add quantifiable achievements (metrics, numbers, percentages)"
    - "Missing professional summary section"
    - "Consider adding certifications"
    - "Soft skills section could be expanded"

**SECTION 2: SKILL GALAXY** (glass card):
- Title: "Skill Galaxy" + "Your skills mapped against market demand"
- VISUAL: Radar/spider chart (dark bg, 6 axes):
  - Axes: Frontend, Backend, DevOps, Databases, AI/ML, Soft Skills
  - Two layers: 
    - "You" — filled area, cyan with 20% opacity fill + cyan border
    - "Market Demand" — outlined area, violet dashed border
  - Interactive: hover on an axis to see detail tooltip
- Below chart — SKILL GAP TABLE (glass sub-cards, 4 items):
  Each card:
  - Skill name (bold): "Docker"
  - Two bars side by side: "You: Beginner" (short cyan bar) vs "Needed: Advanced" (long violet bar outline)
  - Gap indicator: "HIGH GAP" (coral badge) / "MEDIUM" (amber) / "LOW" (cyan)
  - "📚 Learn" link (small, cyan)

**SECTION 3: CAREER PATHS — NEURAL PATHWAYS** (glass card):
- Title: "Neural Pathways" + "AI-generated career trajectories based on your profile"
- 3 path cards (horizontal, glass, each with colored top accent):
  - PATH 1 (cyan accent):
    - "Full Stack → Tech Lead" 
    - "~2-3 years journey"
    - Required skills: leadership, system design, architecture (as small pills)
    - Salary range: "$130k—$180k"
    - Match: "72% aligned" (pulse orb)
  - PATH 2 (violet accent):
    - "Full Stack → DevOps Engineer"
    - "~1-2 years"
    - Skills: Docker, Kubernetes, CI/CD, AWS
    - "$120k—$170k"
    - "68% aligned"
  - PATH 3 (mint accent):
    - "Full Stack → Solutions Architect"
    - "~3-5 years"
    - Skills: Cloud architecture, microservices
    - "$150k—$200k"
    - "55% aligned"
  - Each card: "Explore Path →" link

AMBIENT: This page should feel more experimental/lab-like. Add a subtle animated element — perhaps floating particles in the background, or periodic "scan line" animation across the CV scan section.
```

---

## 8. 💼 Recruiter — My Jobs — "Command Center"

```
Create a recruiter job management page for JobEngine. Dark neural engine design.

SIDEBAR (recruiter nav):
- 🏠 Dashboard
- 💼 My Jobs (active — cyan)
- 📋 Pipeline
- 👥 Candidates
- 📊 Analytics
- ⚙️ Settings

**HEADER ROW**:
- Left: "Command Center" (24px, bold) + "5 Active Missions" (slate)
- Right: "+ New Job" button (cyan, glow, with plus icon)

**STATS ROW** (4 glass cards):
- "8" → "Total Jobs" (cyan orb)
- "5" → "Active" (mint orb, with pulsing green dot)
- "127" → "Total Applicants" (violet orb)
- "74%" → "Avg Match Score" (shown as small pulse orb)

**TABS**: Active (5) | Draft (2) | Closed (1)

**JOB LIST** (vertical cards, full width):

Each job card (glass, rounded-xl):
- LEFT SECTION:
  - Job title (18px, bold, white): "Senior React Developer"
  - Tags: "Remote" (cyan pill) + "Full-Time" (violet pill) + "Senior" (amber pill)
  - Skills: "React" "TypeScript" "Node.js" "+2 more" (small glass pills)
  - "Posted 5 days ago • Closes in 10 days" (small, slate)
- CENTER METRICS:
  - "23" applicants (people icon, large monospace number)
  - Mini horizontal bar chart showing score distribution (tiny, 5 bars representing 0-20, 20-40, 40-60, 60-80, 80-100 applicants)
- RIGHT ACTIONS:
  - Active/Closed toggle switch (cyan when active)
  - Action buttons (glass icon buttons, 32px):
    - Eye icon → View applicants
    - Pencil icon → Edit
    - Trash icon → Delete (hover:red glow)
  - "Open Pipeline →" button (cyan outline, small)

**CREATE JOB MODAL** (multi-step, glass modal, max-width 640px):

Step indicator: 4 dots at top, connected by line. Current dot glows cyan.

- STEP 1: "The Basics"
  - Job Title input
  - Description textarea (dark, tall)
  - Row: Location input + "Remote OK" toggle
  - Row: Job Type (3 selectable glass cards: Full-Time/Part-Time/Internship) + Experience Level (3 glass cards: Junior/Mid/Senior)
  
- STEP 2: "Required Skills"
  - Tag input: Type to search ("start typing a skill..."), shows dropdown suggestions from skills dictionary
  - Added skills appear as removable glass pills below (cyan, with X)
  - "Nice to have" — separate tag input (violet pills)
  
- STEP 3: "Culture & Values"
  - Grid of selectable value tags (glass buttons, toggle on/off, max 6):
    Innovation, Teamwork, Diversity, Work-Life Balance, Growth, Transparency, Remote-First, Fast-Paced, Mentorship
  - Selected: cyan fill + check icon
  
- STEP 4: "Review & Publish"
  - Summary of all inputs (clean, organized)
  - "Publish Job ✨" (cyan, large, glow) + "Save as Draft" (ghost)
```

---

## 9. 📋 Pipeline — "The Flow Board" — Kanban

```
Create a recruitment pipeline Kanban board for recruiters. Dark neural engine design. This is the CENTERPIECE of the recruiter experience.

Same recruiter sidebar.

**TOP SECTION**:
- Job selector (large glass dropdown): "Senior React Developer ▼" — click to switch jobs
- Metrics row: "23 Candidates" · "Avg Score: 74%" · "Pipeline Duration: 5.2 days avg"

**KANBAN BOARD** (horizontal layout, full width, overflow-x scroll with custom scrollbar):

5 COLUMNS, each column is a glass card (rounded-xl, flex column, min-width 260px):

Column header:
- Title + Count badge (e.g., "Applied  8")
- Colored accent strip at top (3px height):
  - Applied: Slate (#475569)
  - Shortlisted: Amber (#F59E0B) with subtle glow
  - Interview: Violet (#8B5CF6) with subtle glow
  - Rejected: Coral (#F43F5E) with subtle glow
  - Hired: Mint (#34D399) with celebration sparkle

CANDIDATE CARDS (inside columns, draggable):
Each card (dark glass, rounded-lg, 240px wide):
- Three dots drag handle (top right, visible on hover only)
- Avatar circle (36px, with initials, random bg colors: cyan, violet, mint, amber)
- Name (14px, bold, white)
- Score pulse orb (32px, right-aligned):
  - High: cyan pulse
  - Medium: amber pulse
  - Low: coral (no pulse, dim)
- Skill pills (2-3 visible, tiny, glass)
- "Applied 3d ago" (12px, slate)
- HOVER: card lifts, border gains subtle glow of column's accent color, shows action icons:
  - 👁️ Quick view
  - ✉️ Email
  - ↕️ Move (shows move arrows)

DRAG & DROP VISUALS:
- When dragging: card becomes semi-transparent (opacity 0.7) with stronger glow border
- Valid drop zone: column border changes to dashed cyan, bg lightens slightly
- Drop animation: card slides into position with spring physics feel

COLUMN STATES:
- Applied: 8 cards (most populated)
- Shortlisted: 5 cards
- Interview: 3 cards — these cards have extra "📅 Interview: Mar 22, 2:00 PM" line visible
- Rejected: 4 cards — slightly dimmed/lower opacity (0.7)
- Hired: 1 card — special celebration style: mint glow border, subtle confetti/sparkle on the card, "🎉" emoji

EMPTY COLUMN: Shows dashed border placeholder "Drag candidates here" (slate text)

**CANDIDATE DETAIL MODAL** (when clicking a card's view button):
Glass modal (wide, 720px):
- Left section (60%):
  - Avatar (64px) + Name + Email + Phone
  - "Download CV" button (glass outline)
  - STATUS TIMELINE (vertical, animated):
    - Each step: colored dot + line + timestamp + description
    - LED-style: completed dots glow, current pulsing, future dim
  - Action buttons row:
    - "Move to [next stage]" (accent color button matching next column)
    - "Schedule Interview" (violet)
    - "Reject" (coral outline)
    - "Send Email" (glass outline)
- Right section (40%):
  - MATCH SCORE — large pulse orb (64px) with score
  - Score breakdown bars (3 bars, labeled)
  - Matched skills (cyan pills with ✓)
  - Missing skills (coral pills with ✗)
  - "View Full Profile" link

Show realistic data with 20+ candidate cards distributed across the columns.
```

---

## 10. 👥 Candidate Search — "The Neural Scanner"

```
Create a candidate search/discovery page for recruiters. Dark neural engine design.

Same recruiter sidebar. "Candidates" nav active.

**HEADER**: "Neural Scanner" + "Discover and connect with top talent"

**SEARCH PANEL** (glass card, prominent):
- "Scan for candidates matching..." helper text
- Skills tag input (large): type + add skills, shown as removable cyan pills
  - Example pre-filled: "React" "TypeScript" "Node.js"
- Row of filters:
  - Experience: checkboxes (Junior □ Mid ☑ Senior ☑)
  - Min Score slider: 60 → 100 (cyan track, current: 70)
  - Availability: All / Active / Open
- "Scan 🔍" button (cyan, glow) + "Clear" ghost button

**RESULTS** (grid or list toggle):
- "47 candidates found" + sort: "Best Match" / "Experience" / "Recent"

**CANDIDATE CARDS** (2-column grid):
Each card (glass, rounded-xl):
- LEFT: Large avatar circle (56px, with initials)
- CENTER:
  - Name (18px, bold, white) + "Full Stack Developer" (slate)
  - "4 years experience" (monospace, cyan text)
  - Education: "BS Computer Science" (small, slate)
  - Skills: 5-6 glass pills (matched skills have cyan left border, unmatched are neutral)
- RIGHT: 
  - Score pulse orb (48px) — if comparing against a specific job
  - Visibility badge: "🌐 Public" / "🔒 Verified Only" (small glass pill)
- BOTTOM: 
  - "View Profile" button (glass) + "Invite to Apply" button (cyan outline)

**CANDIDATE DETAIL SLIDE PANEL** (slides from right, 440px wide, glass):
- Close button (X, top right)
- Avatar (80px) + Name + Contact
- Score section with breakdown (if a job is selected for comparison)
- Skills section with categorized pills:
  - "Frontend: React, TypeScript, Next.js" (cyan category)
  - "Backend: Node.js, Python" (violet category)
  - "DevOps: Docker, AWS" (mint category)
- Experience + Education
- Culture values (compared with your job if selected)
- "Download CV" button
- "Invite to Apply ✨" full-width button (cyan)

Show 8 sample candidates with varied scores and skill sets.
```

---

## 11. 🛡️ Admin Dashboard — "System Core"

```
Create an admin dashboard for JobEngine. Dark neural engine design. This should feel like a mission control system.

Admin sidebar:
- 🏠 System Core (active)
- 👥 Users
- ✅ Verifications
- ⚙️ Configuration
- 📊 Reports

**HEADER**: "System Core" + "Platform health and metrics" + current date

**ALERT BANNER** (if pending items, amber glow border glass card):
- "⚡ 3 recruiters awaiting verification" + "Review Now →" button

**METRICS GRID** (5 cards, top row):
Each metric card (glass, with icon in colored orb):
- "1,247" → "Total Users" + "↑ 12%" (cyan orb + green indicator)
- "89" → "Recruiters" + "↑ 5%" (violet orb)
- "1,142" → "Candidates" + "↑ 15%" (mint orb)
- "234" → "Active Jobs" (amber orb)
- "47" → "Today's Applications" (coral orb)
- Percentage change shown as small colored text (green for up, coral for down)
- Numbers in monospace, bold, large

**CHARTS ROW** (2 charts side by side, glass cards):
- LEFT: LINE CHART — "User Growth" (6 months)
  - Two lines: Candidates (cyan, filled area below) + Recruiters (violet, filled area below)
  - Dark grid, glowing data points on hover
  - Axis labels in slate
- RIGHT: DONUT CHART — "Distribution"
  - Segments: Candidates 90% (cyan), Recruiters 7% (violet), Admins 3% (amber)
  - Center: total number "1,247"
  - Glowing segment borders

**SECOND ROW** (2 charts):
- LEFT: BAR CHART — "Weekly Applications" (8 weeks, vertical bars, cyan with rounded tops)
- RIGHT: HORIZONTAL BAR CHART — "Top Skills in Demand"
  - React: ████████ 234 (cyan bar)
  - Python: ██████ 189 (violet bar)
  - TypeScript: ████ 156 (mint bar)
  - Java: ████ 142 (amber bar)
  - AWS: ███ 98 (slate bar)

**RECENT ACTIVITY** (glass card, table):
- Table columns: User | Action | Role | Time | Status
- Dark table with slight row hover highlight
- 8 rows of sample data:
  - "Ahmed Ben Ali" | "Registered as Recruiter" | Recruiter badge | "2h ago" | "Pending ⏳"
  - "Sarah Johnson" | "Uploaded CV" | Candidate badge | "4h ago" | "Complete ✓"
  - etc.
- "View All →" link at bottom
```

---

## 12. 📤 CV Upload — "The Neural Uplink"

```
Create a CV upload page for candidates. Dark neural engine design. This should feel like uploading data to an AI brain.

Same candidate sidebar.

**HEADER**: "Neural Uplink" + "Upload your CV and let the AI analyze your professional DNA"

**UPLOAD ZONE** (centered, max-width 600px):
- Large glass card (240px tall), dashed border (cyan dashed, 2px)
- Center: Upload icon — animated circuit/brain icon (subtle pulse, cyan)
- "Drop your CV into the neural network" (bold, white)
- "or" (slate)
- "Select File" button (cyan outline)
- "PDF or DOCX • Max 10MB" (small, slate)
- DRAG OVER STATE: border turns solid cyan with glow, background gains subtle cyan tint, icon scales up

**PROCESSING STATE** (replaces upload zone with smooth crossfade):
- File info: "📄 resume_ahmed.pdf — 2.4 MB" (with progress bar dissolving)
- NEURAL SCAN ANIMATION:
  - 4 steps appearing sequentially (each with animated entrance):
  - Each step: icon → text → spinner/checkmark
  - ⏳ → ✅ "File received" (instant)
  - ⏳ → ✅ "Extracting neural data..." (2 sec) — scanning line animation
  - ⏳ → ✅ "Mapping skill constellation..." (2 sec) — dots connecting animation
  - ⏳ → ✅ "Profiling complete" (1 sec) — final flash
  - Overall: circular progress ring animating around the section

**RESULTS CARD** (appears after scan, glass, animated gradient border):
- "✨ Neural Profile Generated" (heading, bold)
- SCORE: CV strength gauge (72/100, same style as career page)

- **DETECTED SKILLS** (editable):
  - Title: "Detected Skills" + "Edit" toggle
  - Skills as glass pills (cyan): "React" "JavaScript" "TypeScript" "Node.js" "MongoDB" "Python" "Docker" "Git"
  - Each pill has X to remove (in edit mode)
  - "+ Add Skill" button (glass, dashed border)
  - AI confidence label under each: "High ✓" (cyan) / "Medium ~" (amber) / "Review ?" (slate)

- **EXPERIENCE**: "4 years" — editable input (monospace, cyan text)
- **EDUCATION**: "BS Computer Science — INSAT" — editable
- **LANGUAGES**: "English, French, Arabic" — editable tag pills

- ACTIONS:
  - "Save Neural Profile" button (cyan, glow, full width)
  - "Re-scan CV" button (ghost)

**PREVIOUS UPLOADS** section (below, glass card):
- "Your Neural Archives"
- Table/list:
  - File icon + name + date + "Active" badge (only one active, mint glow)
  - Actions: Download ↓ | Set Active ⭐ | Delete 🗑️
```

---

## 13. 🔐 Admin — User Management

```
Create a user management page for the admin. Dark neural engine design.

Same admin sidebar. "Users" nav active.

**HEADER**: "User Registry" + "1,247 users" + "Export" button (glass outline)

**FILTERS** (glass bar):
- Search input: "Search by name or email..." (with ⌘K hint)
- Role dropdown: All / Admin / Recruiter / Candidate (glass dropdown, dark)
- Status: All / Active / Inactive / Pending
- "Filter" button (cyan)

**USER TABLE** (glass card, clean dark table):
- Table header: Checkbox | User | Role | Status | Joined | Last Active | Actions
- Table rows (hover: row highlight with subtle cyan/5 bg):
  - Checkbox
  - User: Avatar (32px) + Name + Email stacked (name in white, email in slate)
  - Role: badge pill (Admin=coral, Recruiter=violet, Candidate=cyan)
  - Status: dot + text (🟢 Active / 🔴 Inactive / 🟡 Pending)
  - Joined: date (slate)
  - Last Active: relative time (slate)
  - Actions: 3-dot menu → View, Edit, Activate/Deactivate, Delete (red text)

- BULK ACTIONS (appears when checkboxes selected):
  - Glass bar sliding down: "3 selected" + "Activate" (cyan) + "Deactivate" (amber) + "Delete" (coral)

- PAGINATION (bottom): "1-20 of 1,247" + page buttons (glass) + rows-per-page selector

Show 10 varied users. One recruiter should have "Pending Verification 🟡" status.

**USER DETAIL MODAL** (glass, when clicking View):
- Full info: avatar (80px), name, email, phone, role badge, status, dates
- If Recruiter: company info, verification status + "Verify ✓" / "Reject ✗" buttons
- If Candidate: skills list, CV status, application count
- Action buttons at bottom: Edit, Toggle Status, Reset Password, Delete (coral)
```

---

## 📱 Responsive & Ambient Notes

```
RESPONSIVE for all pages:
- Desktop 1440px: full sidebar + content
- Tablet 1024px: sidebar collapses to 72px icon-only mode
- Mobile 768px: sidebar becomes bottom tab bar (5 main nav items as icons), content goes full-width
- Cards: 2-col → 1-col on mobile
- Tables: horizontal scroll or switch to card layout
- Kanban: horizontal scroll with visible grab-to-scroll indicator
- Modals: become full-screen sheets on mobile

AMBIENT ELEMENTS (apply subtly to all pages):
- Dot grid background: 24px spacing, dots are #1E293B (barely visible)
- Light leaks: 1-2 blurred gradient circles (600px, 8-15% opacity) per page, placed behind key content
- All cards: slight backdrop-blur for true glass effect
- Page transitions: content fades in with subtle translateY (16px → 0)
- Smooth scroll behavior
- Custom scrollbar: thin (6px), track transparent, thumb #1E293B, hover:#334155
```
