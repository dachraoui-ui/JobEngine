
# JobEngine — Premium Dark Recruitment Platform

## Summary
Build a stunning, dark-first recruitment dashboard called "JobEngine" with the tagline "Where Talent Meets Opportunity." The design follows a "Neural Engine" aesthetic inspired by Linear, Raycast, and Vercel — featuring glassmorphism, animated glow effects, and a living, breathing UI.

## Pages & Features

### 1. Design System Setup
- Custom CSS variables for the full color palette (deepest black, surface navy, elevated panels, glass effects)
- Import Plus Jakarta Sans + JetBrains Mono from Google Fonts
- Dot grid background pattern, light leak gradients, glow utilities
- Custom component variants: glass cards, glow borders, pulse orbs, cyan/violet/mint badges
- Animation keyframes: pulse rings, gradient border rotation, fade-in, hover lifts

### 2. Sidebar Navigation (Constellation Style)
- 72px collapsed / 260px expanded with smooth transition
- Navigation items: Dashboard, Jobs, Candidates, Pipeline, Analytics, Settings
- Constellation hairlines connecting nav icons vertically
- Active state with cyan glow indicator
- Responsive: becomes bottom tab bar on tablet/mobile

### 3. Dashboard Page (Home)
- Hero stats row: Open Positions, Active Candidates, Interviews Today, Hire Rate — each in a glass card with icon and animated accent
- "AI Match Score" section with Pulse Orb visualizations — glowing animated circles showing top candidate matches (score-based color spectrum)
- Recent Activity feed with timeline-style entries (new applications, status changes, interviews scheduled)
- Pipeline funnel mini-chart showing candidates per stage (Applied → Screened → Interview → Offer → Hired)

### 4. Jobs Page
- Grid/list view toggle for job postings
- Each job card: title, department, location, posted date, applicant count, status badge (Active/Paused/Closed)
- Glow border animation on featured/urgent roles
- Search bar + filters (department, location, status)
- "Create Job" button with modal form

### 5. Candidates Page
- Table/card view of candidates with: name, avatar, role applied, match score (Pulse Orb), status, applied date
- Score spectrum coloring (cyan-mint for 80+, amber for 60-79, coral for <60)
- Click to expand candidate detail panel (slide-in from right): resume summary, skills, AI match breakdown, interview notes, action buttons
- Search + filter by score range, status, role

### 6. Pipeline Page (Kanban Board)
- Drag-style columns: Applied → Screening → Interview → Offer → Hired
- Candidate cards with mini pulse orb scores
- Column counts and stage-specific accent colors
- Glass card style for each candidate in pipeline

### 7. Analytics Page
- Key metrics in glass cards: Time to Hire, Cost per Hire, Offer Acceptance Rate, Source Effectiveness
- Visual charts (bar/donut) for hiring funnel, source breakdown, department hiring trends
- Score distribution histogram
- All numbers in JetBrains Mono

### 8. Top Bar
- Transparent, blending with content background
- Search command palette trigger (⌘K style)
- Notification bell with cyan dot indicator
- User avatar dropdown

### 9. Responsive Design
- 1440px: Full sidebar + content layout
- 768px: Sidebar collapses to bottom tab bar, content goes full width
- 375px: Stacked mobile layout, cards go single column

## Visual Signature Elements
- **Pulse Orbs**: Animated glowing circles for match scores with CSS keyframe rings
- **Glow Borders**: Animated conic-gradient borders on featured cards
- **Dot Grid**: Subtle 24px interval dot pattern on content background
- **Light Leaks**: Radial gradient blurs of cyan/violet behind hero sections
- **Constellation Lines**: Thin vertical lines connecting sidebar nav items

## Tech Approach
- All client-side with React + Tailwind + shadcn/ui components restyled to match the dark glass aesthetic
- Mock data for candidates, jobs, pipeline stages, and analytics
- CSS animations for pulse orbs, glow borders, and transitions
- Responsive via Tailwind breakpoints
