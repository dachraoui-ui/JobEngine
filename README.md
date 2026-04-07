# 🚀 JobEngine — Where Talent Meets Opportunity

<div align="center">

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-University%20PFA-blue)
![Team](https://img.shields.io/badge/Team-4%20Devs-green)
![Deadline](https://img.shields.io/badge/Deadline-May%2026%2C%202026-red)

**An AI-powered intelligent recruitment platform that automates candidate-job matching using NLP and machine learning.**

[Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Setup](#-getting-started) · [Team](#-team-structure) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. MongoDB Setup](#1-mongodb-local-setup)
  - [2. Backend Setup (Spring Boot)](#2-backend-setup-spring-boot)
  - [3. Frontend Setup (Next.js)](#3-frontend-setup-nextjs)
  - [4. AI Microservice Setup (Python)](#4-ai-microservice-setup-python)
  - [5. n8n Automation Setup (Docker)](#5-n8n-automation-setup-docker)
- [Team Structure](#-team-structure)
- [Data Models](#-data-models)
- [API Reference](#-api-reference)
- [Shared Conventions](#-shared-conventions)
- [Sprint Plan](#-sprint-plan--7-weeks)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing--git-workflow)

---

## 📋 Project Overview

**JobEngine** is a university PFA (Projet de Fin d'Année) project — an intelligent web-based recruitment platform that connects recruiters with candidates through AI-powered matching.

### What It Does

| For Recruiters | For Candidates | For Admins |
|---|---|---|
| Post job offers with required skills & culture values | Upload CV and get it auto-analyzed | Manage all users & system settings |
| Get candidates auto-ranked by AI matching score | See recommended jobs with compatibility score | Verify recruiter accounts |
| Manage recruitment pipeline (Kanban board) | Track application status in real-time | View platform analytics |
| Auto-reject low-score candidates | Get career advice & skill gap analysis | Configure matching thresholds |
| Auto-schedule interviews via n8n | Control profile visibility | — |

### What It Does NOT Include (MVP Scope)

- ❌ Social networking features
- ❌ Real-time messaging/chat
- ❌ Mobile native app (web only)
- ❌ LinkedIn/external platform integration

---

## ✨ Key Features

### 🤖 AI-Powered Matching
- **CV Parsing**: Extracts text from PDF/DOCX files automatically
- **NLP Skill Extraction**: Detects skills, experience years, education from CV text
- **TF-IDF + Cosine Similarity**: Calculates a matching score between candidate profiles and job requirements
- **Weighted Scoring**: Skills (60%) + Experience (25%) + Culture Fit (15%)
- **Career Intelligence**: Auto-generated CV feedback, skill gap analysis, and career path suggestions

### 📋 Recruitment Pipeline
- **Kanban Board** with drag & drop (Applied → Shortlisted → Interview → Rejected → Hired)
- Full status change history with timestamps

### ⚡ Automation (via n8n)
- Auto-reject candidates below score threshold
- Auto-send emails on status changes
- Auto-create Google Calendar events for interviews

### 🔐 Security
- JWT-based authentication
- Role-based access control (Admin / Recruiter / Candidate)
- BCrypt password encryption
- RGPD-compliant data handling

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS (Browser)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND — Next.js + Tailwind CSS                  │
│                    (Deployed on Vercel)                          │
│                                                                 │
│  ┌──────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │Auth Pages│  │Candidate Dash │  │Recruiter Dash │            │
│  │Login     │  │- Jobs List    │  │- Post Jobs    │            │
│  │Register  │  │- Applications │  │- Pipeline     │            │
│  │          │  │- Profile      │  │- Candidates   │            │
│  │          │  │- Career Intel │  │- Analytics    │            │
│  └──────────┘  └───────────────┘  └───────────────┘            │
│                    ┌──────────────┐                              │
│                    │ Admin Dash   │                              │
│                    │- Users Mgmt  │                              │
│                    │- Settings    │                              │
│                    └──────────────┘                              │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND — Spring Boot + Spring Security            │
│                    (Deployed on Render)                          │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │Auth Ctrl   │  │Job Ctrl    │  │Pipeline Ctrl│               │
│  │- Register  │  │- CRUD Jobs │  │- Status Mgmt│               │
│  │- Login     │  │- Apply     │  │- History    │               │
│  │- JWT       │  │- Search    │  │- Webhooks   │               │
│  └────────────┘  └────────────┘  └─────┬───────┘               │
│  ┌────────────┐  ┌────────────┐        │                       │
│  │User Ctrl   │  │CV Ctrl     │        │ Webhook POST          │
│  │- Profile   │  │- Upload    │        ▼                       │
│  │- Admin     │  │- Parse req │  ┌────────────┐               │
│  └────────────┘  └─────┬──────┘  │  n8n        │               │
│                        │         │  - Auto-rej  │               │
│                        │ REST    │  - Emails    │               │
│                        ▼         │  - Calendar  │               │
│              ┌──────────────┐    └────────────┘               │
│              │Python AI Svc │                                  │
│              │(FastAPI)     │                                  │
│              │- CV Parser   │                                  │
│              │- NLP Extract │                                  │
│              │- TF-IDF Match│                                  │
│              │- Career Intel│                                  │
│              └──────┬───────┘                                  │
│                     │                                          │
└─────────────────────┼──────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MongoDB (Local / Atlas)                         │
│                                                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐            │
│  │ users  │ │  jobs  │ │  cvs   │ │ applications │            │
│  └────────┘ └────────┘ └────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Service Communication

| From | To | Protocol | Port |
|---|---|---|---|
| Browser | Next.js Frontend | HTTPS | 3000 (dev) |
| Next.js | Spring Boot Backend | REST/JSON | 8080 |
| Spring Boot | Python AI Service | REST/JSON | 8000 |
| Spring Boot | n8n (Webhooks) | HTTP POST | 5678 |
| Spring Boot | MongoDB | MongoDB Protocol | 27017 |
| Python AI | MongoDB | MongoDB Protocol | 27017 |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | [Next.js](https://nextjs.org/) (App Router) | React framework with SSR & routing |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **HTTP Client** | [Axios](https://axios-http.com/) | API communication |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) | Kanban board interactions |
| **Charts** | [Recharts](https://recharts.org/) | Dashboard visualizations |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling & validation |
| **Icons** | [Lucide React](https://lucide.dev/) | Icon library |
| **Backend** | [Spring Boot 3.x](https://spring.io/projects/spring-boot) | Java REST API framework |
| **Security** | [Spring Security](https://spring.io/projects/spring-security) + [JWT](https://jwt.io/) | Authentication & authorization |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL document database |
| **ODM** | [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb) | MongoDB object mapping |
| **AI Service** | [FastAPI](https://fastapi.tiangolo.com/) (Python) | AI microservice framework |
| **CV Parsing** | [pdfplumber](https://github.com/jsvine/pdfplumber) + [python-docx](https://python-docx.readthedocs.io/) | PDF/DOCX text extraction |
| **NLP/ML** | [scikit-learn](https://scikit-learn.org/) | TF-IDF vectorization + Cosine similarity |
| **Automation** | [n8n](https://n8n.io/) (self-hosted) | Workflow automation (emails, calendar) |
| **Containerization** | [Docker](https://www.docker.com/) | n8n hosting |

---

## 📁 Project Structure

```
jobengine/
│
├── jobengine-frontend/          # Next.js application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/          # Login, Register (public routes)
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/     # Protected dashboard routes
│   │   │   │   ├── candidate/
│   │   │   │   │   ├── jobs/page.tsx          # Browse & search jobs
│   │   │   │   │   ├── applications/page.tsx  # Track applications
│   │   │   │   │   ├── profile/page.tsx       # Edit profile & skills
│   │   │   │   │   └── career/page.tsx        # Career intelligence
│   │   │   │   ├── recruiter/
│   │   │   │   │   ├── jobs/page.tsx          # Manage job postings
│   │   │   │   │   ├── pipeline/page.tsx      # Kanban board
│   │   │   │   │   ├── candidates/page.tsx    # Search candidates
│   │   │   │   │   └── analytics/page.tsx     # Recruitment stats
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/page.tsx     # System overview
│   │   │   │       ├── users/page.tsx         # User management
│   │   │   │       └── settings/page.tsx      # System config
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Landing page
│   │   ├── components/
│   │   │   ├── ui/              # Button, Modal, Input, Card, Badge, etc.
│   │   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   │   ├── kanban/          # KanbanBoard, KanbanColumn, KanbanCard
│   │   │   └── charts/          # ScoreChart, StatsCard, etc.
│   │   ├── lib/
│   │   │   ├── api.ts           # Axios instance + request/response interceptors
│   │   │   ├── auth.ts          # JWT decode, token storage helpers
│   │   │   └── utils.ts         # Date formatters, score formatters, etc.
│   │   ├── hooks/
│   │   │   ├── useAuth.ts       # Authentication hook
│   │   │   ├── useJobs.ts       # Job fetching hook
│   │   │   └── useApplications.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Global auth state provider
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces (User, Job, Application, etc.)
│   │   └── middleware.ts        # Next.js route protection middleware
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── jobengine-backend/           # Spring Boot application
│   ├── src/main/java/com/jobengine/
│   │   ├── JobEngineApplication.java        # Main entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java          # Spring Security + CORS setup
│   │   │   ├── MongoConfig.java             # MongoDB configuration
│   │   │   └── WebConfig.java               # Web MVC config
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java        # JWT generation & validation
│   │   │   ├── JwtAuthenticationFilter.java # Intercept & validate JWT on each request
│   │   │   └── CustomUserDetailsService.java
│   │   ├── controller/
│   │   │   ├── AuthController.java          # POST /api/v1/auth/register, /login
│   │   │   ├── UserController.java          # GET/PUT /api/v1/users/**
│   │   │   ├── JobController.java           # CRUD /api/v1/jobs/**
│   │   │   ├── CvController.java            # POST /api/v1/cv/upload, GET /api/v1/cv/{id}
│   │   │   ├── ApplicationController.java   # POST /api/v1/applications/**, status updates
│   │   │   ├── MatchingController.java      # GET /api/v1/matching/** (calls Python AI)
│   │   │   └── AdminController.java         # Admin-only endpoints
│   │   ├── model/
│   │   │   ├── User.java                    # @Document("users")
│   │   │   ├── CandidateProfile.java        # @Document("candidate_profiles")
│   │   │   ├── RecruiterProfile.java        # @Document("recruiter_profiles")
│   │   │   ├── Job.java                     # @Document("jobs")
│   │   │   ├── Cv.java                      # @Document("cvs")
│   │   │   └── Application.java             # @Document("applications")
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── JobRequest.java
│   │   │   ├── JobResponse.java
│   │   │   ├── ApplicationResponse.java
│   │   │   └── MatchingScoreResponse.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── JobRepository.java
│   │   │   ├── CvRepository.java
│   │   │   └── ApplicationRepository.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── UserService.java
│   │   │   ├── JobService.java
│   │   │   ├── CvService.java
│   │   │   ├── ApplicationService.java
│   │   │   ├── MatchingService.java         # Calls Python AI service via RestTemplate
│   │   │   └── WebhookService.java          # Sends events to n8n
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java  # @ControllerAdvice
│   │       ├── ResourceNotFoundException.java
│   │       └── UnauthorizedException.java
│   ├── src/main/resources/
│   │   └── application.yml                  # Config: MongoDB URI, JWT secret, AI service URL
│   ├── src/test/java/com/jobengine/         # JUnit tests
│   ├── pom.xml                              # Maven dependencies
│   ├── Dockerfile                           # For Render deployment
│   └── .env.example                         # Environment variables template
│
├── jobengine-ai/                # Python FastAPI microservice
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── Procfile                 # For Render deployment: web: uvicorn main:app ...
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── cv_parser.py     # POST /api/ai/parse — accepts PDF/DOCX, returns extracted data
│   │   │   ├── matcher.py       # POST /api/ai/match — accepts job + candidate, returns score
│   │   │   └── career.py        # POST /api/ai/career-advice — returns feedback & suggestions
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── parser_service.py    # PDF (pdfplumber) & DOCX (python-docx) text extraction
│   │   │   ├── nlp_service.py       # Skill extraction, experience detection, education parsing
│   │   │   ├── matching_service.py  # TF-IDF vectorization + Cosine similarity scoring
│   │   │   └── career_service.py    # CV feedback generation, skill gap analysis
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic request/response models
│   │   └── data/
│   │       └── skills_dictionary.json  # Master skills taxonomy (built from scratch)
│   └── tests/
│       ├── test_parser.py
│       ├── test_matcher.py
│       └── sample_cvs/          # Test CV files (PDF/DOCX)
│
├── docker-compose.n8n.yml       # n8n self-hosted setup
├── .gitignore
└── README.md                    # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Download |
|---|---|---|
| **Java JDK** | 17 or 21 | [Eclipse Temurin](https://adoptium.net/) |
| **Maven** | 3.8+ | [Maven](https://maven.apache.org/download.cgi) (or use `./mvnw` wrapper) |
| **Node.js** | 18+ | [Node.js](https://nodejs.org/) |
| **Python** | 3.10+ | [Python](https://www.python.org/downloads/) |
| **MongoDB** | 7.0+ | [MongoDB Community](https://www.mongodb.com/try/download/community) |
| **Docker Desktop** | Latest | [Docker](https://www.docker.com/products/docker-desktop/) |
| **Git** | Latest | [Git](https://git-scm.com/) |

Verify installations:
```bash
java --version       # Should print 17+ or 21+
mvn --version        # Should print 3.8+
node --version       # Should print 18+
python --version     # Should print 3.10+
mongosh --version    # Should print 2.x
docker --version     # Should print 24+
git --version        # Should print 2.x
```

---

### 1. MongoDB Local Setup

```bash
# === Windows ===
# Download MongoDB Community Server MSI from:
# https://www.mongodb.com/try/download/community
# Select: Windows x64, MSI package, version 7.0+

# During installation wizard:
#   ✅ "Complete" setup type
#   ✅ "Install MongoDB as a Service" (auto-starts on boot)
#   ✅ "Install MongoDB Compass" (GUI database browser)
#   Leave default data directory: C:\Program Files\MongoDB\Server\7.0\data\

# After installation, open a terminal and verify:
mongosh

# Create the database and initial collections:
use jobengine
db.createCollection("users")
db.createCollection("jobs")
db.createCollection("cvs")
db.createCollection("applications")
db.createCollection("candidate_profiles")
db.createCollection("recruiter_profiles")

# Verify:
show collections

# Exit:
exit
```

> **Connection string**: `mongodb://localhost:27017/jobengine`
>
> **MongoDB Compass**: Open Compass (installed alongside MongoDB), connect to `mongodb://localhost:27017`, and you'll see the `jobengine` database with all collections. Use this to visually browse and debug your data during development.

---

### 2. Backend Setup (Spring Boot)

```bash
# Clone the repo (if not done yet)
git clone https://github.com/YOUR_ORG/jobengine.git
cd jobengine

# Navigate to backend
cd jobengine-backend

# Copy environment template and configure
cp .env.example .env
# Edit .env with your local settings (see Environment Variables section below)

# Install dependencies and build
./mvnw clean install -DskipTests

# Run the backend server
./mvnw spring-boot:run

# Backend will start on: http://localhost:8080
# Swagger API docs at: http://localhost:8080/swagger-ui.html
```

**application.yml** (key settings):
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/jobengine
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

jwt:
  secret: ${JWT_SECRET:my-super-secret-key-that-is-at-least-256-bits-long}
  expiration: 86400000  # 24 hours in milliseconds

ai:
  service:
    url: http://localhost:8000  # Python AI microservice URL

n8n:
  webhook:
    base-url: http://localhost:5678/webhook  # n8n webhook endpoint

server:
  port: 8080
```

**pom.xml key dependencies:**
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Swagger / OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
</dependencies>
```

---

### 3. Frontend Setup (Next.js)

```bash
cd jobengine/jobengine-frontend

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Run development server
npm run dev

# Frontend will start on: http://localhost:3000
```

**Key dependencies** (`package.json`):
```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "axios": "^1.7.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x",
    "lucide-react": "^0.400.x",
    "recharts": "^2.x",
    "sonner": "^1.x"
  }
}
```

---

### 4. AI Microservice Setup (Python)

```bash
cd jobengine/jobengine-ai

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the AI service
uvicorn main:app --reload --port 8000

# AI service will start on: http://localhost:8000
# API docs at: http://localhost:8000/docs (auto-generated by FastAPI)
```

**requirements.txt:**
```
fastapi==0.110.0
uvicorn==0.27.1
pdfplumber==0.11.0
python-docx==1.1.0
scikit-learn==1.4.1
pymongo==4.6.2
python-multipart==0.0.9
```

**Key API Endpoints:**

| Method | Endpoint | Description | Input | Output |
|---|---|---|---|---|
| `POST` | `/api/ai/parse` | Parse a CV file | PDF/DOCX file | `{ extractedText, skills[], yearsExperience, education }` |
| `POST` | `/api/ai/match` | Calculate matching score | `{ jobSkills[], candidateSkills[], jobExperience, candidateExperience, jobValues[], candidateValues[] }` | `{ score, breakdown, matchedSkills[], missingSkills[] }` |
| `POST` | `/api/ai/career-advice` | Generate career advice | `{ skills[], experience, targetJobs[] }` | `{ feedback, skillGaps[], suggestions[] }` |

---

### 5. n8n Automation Setup (Docker)

```bash
cd jobengine

# Start n8n using Docker Compose
docker compose -f docker-compose.n8n.yml up -d

# Access n8n dashboard:
# URL:      http://localhost:5678
# Username: admin
# Password: changeme  (change this!)

# Stop n8n:
docker compose -f docker-compose.n8n.yml down

# View logs:
docker logs jobengine-n8n -f
```

**docker-compose.n8n.yml:**
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    container_name: jobengine-n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - GENERIC_TIMEZONE=Africa/Tunis
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

**n8n Workflows to Create:**

| # | Workflow Name | Trigger | Actions |
|---|---|---|---|
| 1 | **Auto-Reject Low Score** | Webhook: `POST /webhook/auto-reject` | If score < threshold → Update application status to "Rejected" → Send rejection email |
| 2 | **Interview Scheduler** | Webhook: `POST /webhook/interview` | Create Google Calendar event → Send interview invite email to candidate |
| 3 | **Status Change Notify** | Webhook: `POST /webhook/status-change` | Send email to candidate with new status update |
| 4 | **New Application Alert** | Webhook: `POST /webhook/new-application` | Send email to recruiter: "New application received for [Job Title]" |

> **How it works**: Spring Boot sends HTTP POST requests (webhooks) to n8n when events occur. n8n receives these, processes them, and triggers actions (emails, calendar events).

---

## 👥 Team Structure

### Feature-Based Assignment

Each developer owns their feature **end-to-end** (frontend pages + backend API + database models).

| Developer | Feature | Scope |
|---|---|---|
| **Dev A** | 🔐 Auth & User Management | Registration, Login, JWT, Spring Security, Role-based access, Profile management, Admin dashboard, Recruiter verification, System settings |
| **Dev B** | 💼 Jobs & Applications | Job CRUD (create, read, update, delete), Job listing/search/filters, CV upload (PDF/DOCX), Apply to job, Candidate application tracker, Search candidates |
| **Dev C** | 📋 Pipeline & Automation | Kanban board (drag & drop), Pipeline status management, Status change history, n8n setup/workflows, Email automation, Google Calendar integration, Profile visibility settings |
| **Dev D** | 🤖 AI Engine | Python microservice (FastAPI), CV parsing (PDF + DOCX), NLP skill extraction, Skills dictionary, TF-IDF + Cosine similarity matching, Score API, Career intelligence (feedback, skill gaps, career paths) |

### Integration Dependencies

```
Dev A (Auth) ──► provides JWT & User model to ALL devs (Week 1)
Dev B (Jobs) ──► provides Job & Application model to Dev C & Dev D (Week 2)
Dev D (AI)   ──► provides Score API to Dev B (Week 3-4)
Dev C (Pipeline) ──► consumes Application model from Dev B (Week 3)
Dev C (Pipeline) ──► sends Webhooks to n8n (Week 4)
```

> **⚠️ Critical**: Dev A must share the JWT token format and User model structure by end of Week 1. Dev D should start independently on the Python microservice from Day 1.

---

## 📊 Data Models

### User
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (BCrypt hashed)",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "role": "ADMIN | RECRUITER | CANDIDATE",
  "isVerified": "boolean (for recruiters)",
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Candidate Profile
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "skills": ["string"],
  "experienceLevel": "JUNIOR | MID | SENIOR",
  "preferences": {
    "jobType": "FULL_TIME | PART_TIME | INTERNSHIP",
    "location": "string",
    "remoteOk": "boolean"
  },
  "values": ["string"],
  "visibility": "PUBLIC | VERIFIED_ONLY | PRIVATE",
  "cvId": "ObjectId (ref: cvs)"
}
```

### Recruiter Profile
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "companyName": "string",
  "companyDescription": "string",
  "companyValues": ["string"],
  "industry": "string",
  "website": "string"
}
```

### Job
```json
{
  "_id": "ObjectId",
  "recruiterId": "ObjectId (ref: users)",
  "title": "string",
  "description": "string",
  "location": "string",
  "type": "FULL_TIME | PART_TIME | INTERNSHIP",
  "requiredSkills": ["string"],
  "experienceLevel": "JUNIOR | MID | SENIOR",
  "companyValues": ["string"],
  "status": "OPEN | CLOSED | DRAFT",
  "createdAt": "Date",
  "deadline": "Date"
}
```

### CV
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "originalFileName": "string",
  "fileType": "PDF | DOCX",
  "fileData": "Binary",
  "extractedText": "string",
  "detectedSkills": ["string"],
  "yearsExperience": "number",
  "education": "string",
  "languages": ["string"],
  "uploadedAt": "Date"
}
```

### Application
```json
{
  "_id": "ObjectId",
  "candidateId": "ObjectId (ref: users)",
  "jobId": "ObjectId (ref: jobs)",
  "cvId": "ObjectId (ref: cvs)",
  "status": "APPLIED | SHORTLISTED | INTERVIEW | REJECTED | HIRED",
  "matchingScore": "number (0-100)",
  "scoreBreakdown": {
    "skills": "number",
    "experience": "number",
    "culture": "number"
  },
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "appliedAt": "Date",
  "statusHistory": [
    {
      "status": "string",
      "changedAt": "Date",
      "changedBy": "ObjectId"
    }
  ]
}
```

---

## 📡 API Reference

### Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://your-backend.onrender.com/api/v1`

### Authentication Endpoints (Dev A)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ Public | Register a new user |
| `POST` | `/auth/login` | ❌ Public | Login, returns JWT token |
| `GET` | `/auth/me` | 🔒 JWT | Get current user info |
| `PUT` | `/auth/change-password` | 🔒 JWT | Change password |

### User / Profile Endpoints (Dev A)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users` | 🔒 Admin | List all users |
| `GET` | `/users/{id}` | 🔒 JWT | Get user by ID |
| `PUT` | `/users/{id}` | 🔒 JWT (own) | Update user profile |
| `PUT` | `/users/{id}/verify` | 🔒 Admin | Verify a recruiter |
| `DELETE` | `/users/{id}` | 🔒 Admin | Deactivate user |
| `GET` | `/users/{id}/candidate-profile` | 🔒 JWT | Get candidate profile |
| `PUT` | `/users/{id}/candidate-profile` | 🔒 Candidate | Update candidate profile |
| `PUT` | `/users/{id}/visibility` | 🔒 Candidate | Set profile visibility |

### Job Endpoints (Dev B)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/jobs` | 🔒 Recruiter | Create a job |
| `GET` | `/jobs` | 🔒 JWT | List jobs (with filters & search) |
| `GET` | `/jobs/{id}` | 🔒 JWT | Get job details |
| `PUT` | `/jobs/{id}` | 🔒 Recruiter (own) | Update a job |
| `DELETE` | `/jobs/{id}` | 🔒 Recruiter (own) | Delete a job |
| `GET` | `/jobs/recommended` | 🔒 Candidate | Get AI-recommended jobs |

### CV Endpoints (Dev B)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/cv/upload` | 🔒 JWT | Upload CV (PDF/DOCX, max 10MB) |
| `GET` | `/cv/{id}` | 🔒 JWT | Get CV metadata + extracted data |
| `GET` | `/cv/{id}/download` | 🔒 JWT | Download original CV file |
| `DELETE` | `/cv/{id}` | 🔒 JWT (own) | Delete a CV |

### Application Endpoints (Dev B + Dev C)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/applications` | 🔒 Candidate | Apply to a job |
| `GET` | `/applications` | 🔒 JWT | List applications (candidate: own, recruiter: for their jobs) |
| `GET` | `/applications/{id}` | 🔒 JWT | Get application details + score |
| `PUT` | `/applications/{id}/status` | 🔒 Recruiter | Update application status (triggers n8n webhook) |
| `GET` | `/applications/job/{jobId}` | 🔒 Recruiter | Get all applications for a job (ranked by score) |
| `GET` | `/applications/job/{jobId}/pipeline` | 🔒 Recruiter | Get applications grouped by pipeline status |

### Matching / AI Endpoints (Dev D)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/matching/score/{applicationId}` | 🔒 JWT | Get matching score for an application |
| `GET` | `/matching/job/{jobId}/ranked` | 🔒 Recruiter | Get candidates ranked by score |
| `GET` | `/matching/candidate/recommendations` | 🔒 Candidate | Get recommended jobs for current candidate |
| `GET` | `/matching/candidate/missing-skills/{jobId}` | 🔒 Candidate | Get missing skills for a specific job |
| `GET` | `/career/feedback` | 🔒 Candidate | Get AI feedback on CV |
| `GET` | `/career/skill-gaps` | 🔒 Candidate | Get skill gap analysis |
| `GET` | `/career/suggestions` | 🔒 Candidate | Get career path suggestions |

### Admin Endpoints (Dev A)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard` | 🔒 Admin | System stats (user count, job count, etc.) |
| `GET` | `/admin/settings` | 🔒 Admin | Get system settings |
| `PUT` | `/admin/settings` | 🔒 Admin | Update system settings (thresholds, etc.) |
| `GET` | `/admin/pending-recruiters` | 🔒 Admin | List unverified recruiters |

---

## 📐 Shared Conventions

### API Response Format

**All API responses** must follow this structure:

```json
// ✅ Success
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// ❌ Error
{
  "success": false,
  "error": "Descriptive error message",
  "statusCode": 400
}

// 📄 Paginated List
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

### Authentication Header
```
Authorization: Bearer <jwt-token>
```

### JWT Token Payload
```json
{
  "sub": "user-email@example.com",
  "userId": "ObjectId",
  "role": "ADMIN | RECRUITER | CANDIDATE",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### HTTP Status Codes

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Successful GET/PUT |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation error, malformed input |
| `401` | Unauthorized | Missing or invalid JWT |
| `403` | Forbidden | Valid JWT but insufficient role |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate (e.g., email already exists) |
| `500` | Internal Server Error | Unexpected server error |

### Naming Conventions

| Context | Convention | Example |
|---|---|---|
| API endpoints | kebab-case | `/api/v1/candidate-profile` |
| JSON fields | camelCase | `firstName`, `matchingScore` |
| MongoDB collections | snake_case | `candidate_profiles` |
| Java classes | PascalCase | `ApplicationController.java` |
| TypeScript types | PascalCase | `interface Job { ... }` |
| React components | PascalCase | `KanbanBoard.tsx` |
| CSS classes (Tailwind) | kebab-case | `bg-primary-500` |

---

## 📅 Sprint Plan — 7 Weeks

| Week | Dev A (Auth) | Dev B (Jobs) | Dev C (Pipeline) | Dev D (AI) |
|---|---|---|---|---|
| **1** | User model, Register/Login API, JWT, Spring Security | Job model, CRUD API, validation | Study n8n, install Docker, design pipeline model | Python project setup, PDF/DOCX parser |
| **2** | Auth pages (Next.js), protected routes, token management | Job listing/detail pages, CV upload API + drag & drop UI | Application model, Pipeline status API, status transitions | NLP skill extraction, skills dictionary, experience detection |
| **3** | Admin dashboard, Recruiter verification, Account management | Apply-to-job flow, Application tracker page, Recruiter application list | Kanban board UI (drag & drop), 5 status columns | TF-IDF + Cosine similarity, weighted score formula |
| **4** | Profile management (skills, preferences), Visibility settings, RBAC hardening | Integrate matching scores, Search/filter candidates, Min score filter | n8n workflows: auto-reject, email notifications, Webhook endpoints | Score API endpoint, Ranked candidates, Score breakdown, Recommended jobs |
| **5** | System settings page, Matching threshold config | Missing skills view, Edge cases & validation | Google Calendar integration, Interview scheduling, Email templates | Career intelligence: CV feedback, Skill gaps, Career suggestions |
| **6** | 🐛 Bug fixes, integration testing, UI polish, responsive design | 🐛 Bug fixes, integration testing, UI polish, responsive design | 🐛 Bug fixes, integration testing, UI polish, responsive design | 🐛 Bug fixes, integration testing, UI polish, responsive design |
| **7** | 🚀 Deploy, final testing, demo prep, documentation | 🚀 Deploy, final testing, demo prep, documentation | 🚀 Deploy, final testing, demo prep, documentation | 🚀 Deploy, final testing, demo prep, documentation |

---

## 🌐 Deployment

| Service | Platform | URL Pattern |
|---|---|---|
| Frontend (Next.js) | **Vercel** | `https://jobengine.vercel.app` |
| Backend (Spring Boot) | **Render** | `https://jobengine-api.onrender.com` |
| AI Service (Python) | **Render** | `https://jobengine-ai.onrender.com` |
| n8n Automation | **Self-hosted** (Docker) | Local only / VPS for production |
| MongoDB | **Local** (dev) / **Atlas** (prod) | `mongodb+srv://...` |

> **⚠️ Important**: For production deployment, MongoDB must be migrated from local to **MongoDB Atlas** (free tier: 512MB) since Render/Vercel cannot access your local MongoDB.

---

## 🔐 Environment Variables

### Backend (.env)
```env
# MongoDB
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/jobengine

# JWT
JWT_SECRET=your-256-bit-secret-key-change-in-production
JWT_EXPIRATION=86400000

# AI Service
AI_SERVICE_URL=http://localhost:8000

# n8n Webhooks
N8N_WEBHOOK_BASE_URL=http://localhost:5678/webhook

# Server
SERVER_PORT=8080
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### AI Service (.env)
```env
MONGODB_URI=mongodb://localhost:27017/jobengine
PORT=8000
```

---

## 🤝 Contributing & Git Workflow

### Branch Strategy
```
main            ← Production-ready code (deploy from here)
  └── develop   ← Integration branch (merge features here weekly)
       ├── feature/auth       ← Dev A's branch
       ├── feature/jobs       ← Dev B's branch
       ├── feature/pipeline   ← Dev C's branch
       └── feature/ai         ← Dev D's branch
```

### Workflow
1. Always work on your **feature branch**
2. Commit frequently with clear messages: `feat: add login API`, `fix: JWT expiration bug`
3. Push to remote daily
4. Create **Pull Request** to `develop` at end of each week (or when feature is ready)
5. At least **1 team member reviews** the PR before merging
6. At **Week 6**: merge `develop` → `main` for final release

### Commit Message Format
```
type: short description

Types:
  feat:     New feature
  fix:      Bug fix
  docs:     Documentation
  style:    Formatting (no code change)
  refactor: Code restructuring
  test:     Adding tests
  chore:    Build/config changes
```

---

## 📞 Running All Services Together

```bash
# Terminal 1 — MongoDB (if not running as service)
mongosh

# Terminal 2 — Spring Boot Backend
cd jobengine-backend
./mvnw spring-boot:run

# Terminal 3 — Python AI Service
cd jobengine-ai
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Terminal 4 — Next.js Frontend
cd jobengine-frontend
npm run dev

# Terminal 5 — n8n (if needed)
docker compose -f docker-compose.n8n.yml up

# ✅ All services should now be running:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# AI:        http://localhost:8000
# AI Docs:   http://localhost:8000/docs
# n8n:       http://localhost:5678
# MongoDB:   mongodb://localhost:27017
```

---

<div align="center">

**Built with ❤️ by the JobEngine Team — University PFA 2026**

</div>
