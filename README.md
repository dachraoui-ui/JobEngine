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

## 🎥 Démo 

### Démo vidéo
[![Watch the demo](https://drive.google.com/file/d/1qV8ArRyePCXO4UX3kqi049FTlonFL78t/view?usp=drive_link)
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

## 👥 Team Structure & Work Partitions

> Each developer owns their feature **end-to-end**: Next.js pages + Spring Boot APIs + MongoDB models.
> Branch naming: `feature/auth`, `feature/jobs`, `feature/pipeline`, `feature/ai`

### Overview

| Developer | Feature | Branch | Effort |
|---|---|---|---|
| **Dev A** | 🔐 Auth & User Management + Admin | `feature/auth` | ~30% of codebase |
| **Dev B** | 💼 Jobs & Applications + CV Upload | `feature/jobs` | ~25% of codebase |
| **Dev C** | 📋 Pipeline & Automation (n8n) | `feature/pipeline` | ~20% of codebase |
| **Dev D** | 🤖 AI Engine (Python Microservice) | `feature/ai` | ~25% of codebase |

---

### 🔐 Dev A — Auth & User Management + Admin Dashboard

**Owns**: Everything related to users — registration, login, authentication, authorization, profiles, admin panel.

#### Files Owned — Backend (Spring Boot)

| File | Purpose |
|---|---|
| `config/SecurityConfig.java` | Spring Security configuration, CORS, route protection per role |
| `config/WebConfig.java` | Web MVC configuration |
| `security/JwtTokenProvider.java` | JWT token generation (sign), validation (verify), and parsing |
| `security/JwtAuthenticationFilter.java` | Filter that intercepts every request, extracts JWT from `Authorization` header, and sets authentication |
| `security/CustomUserDetailsService.java` | Loads user from MongoDB for Spring Security |
| `model/User.java` | `@Document("users")` — email, password, firstName, lastName, phone, role, isVerified, isActive, timestamps |
| `model/CandidateProfile.java` | `@Document("candidate_profiles")` — skills, experienceLevel, preferences, values, visibility, cvId |
| `model/RecruiterProfile.java` | `@Document("recruiter_profiles")` — companyName, companyDescription, companyValues, industry |
| `model/enums/Role.java` | Enum: `ADMIN`, `RECRUITER`, `CANDIDATE` |
| `model/enums/Visibility.java` | Enum: `PUBLIC`, `VERIFIED_ONLY`, `PRIVATE` |
| `dto/RegisterRequest.java` | Request body for registration (email, password, firstName, lastName, role) |
| `dto/LoginRequest.java` | Request body for login (email, password) |
| `dto/AuthResponse.java` | Response: JWT token + user info |
| `dto/UserResponse.java` | Response: user profile data (no password) |
| `dto/UpdateProfileRequest.java` | Request body for profile updates |
| `repository/UserRepository.java` | `findByEmail()`, `existsByEmail()` |
| `repository/CandidateProfileRepository.java` | `findByUserId()` |
| `repository/RecruiterProfileRepository.java` | `findByUserId()` |
| `controller/AuthController.java` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/change-password` |
| `controller/UserController.java` | `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}` |
| `controller/AdminController.java` | `GET /admin/dashboard`, `GET /admin/pending-recruiters`, `PUT /admin/verify/{id}`, `GET/PUT /admin/settings` |
| `service/AuthService.java` | Register logic (BCrypt hash, save user, generate JWT), Login logic (verify password, generate JWT) |
| `service/UserService.java` | Profile CRUD, candidate/recruiter profile management, visibility settings |
| `service/AdminService.java` | Dashboard stats, recruiter verification, user management |
| `exception/GlobalExceptionHandler.java` | `@ControllerAdvice` — handles all exceptions globally |
| `exception/ResourceNotFoundException.java` | 404 error |
| `exception/UnauthorizedException.java` | 401 error |
| `exception/DuplicateResourceException.java` | 409 error (email already exists) |

#### Files Owned — Frontend (Next.js)

| File | Purpose |
|---|---|
| `src/app/(auth)/login/page.tsx` | Login page — email + password form, calls `/auth/login`, stores JWT |
| `src/app/(auth)/register/page.tsx` | Register page — form with role selector (Candidate/Recruiter), calls `/auth/register` |
| `src/app/(dashboard)/admin/dashboard/page.tsx` | Admin overview — total users, jobs, applications, charts (Recharts) |
| `src/app/(dashboard)/admin/users/page.tsx` | User management table — list, activate/deactivate, delete users |
| `src/app/(dashboard)/admin/settings/page.tsx` | System settings — matching threshold, auto-reject score, general config |
| `src/app/(dashboard)/candidate/profile/page.tsx` | Candidate profile editor — skills tags, experience, preferences, values, visibility toggle |
| `src/app/(dashboard)/recruiter/profile/page.tsx` | Recruiter profile — company info, values, industry |
| `src/context/AuthContext.tsx` | Global auth state: user object, login/logout functions, loading state |
| `src/hooks/useAuth.ts` | Hook: get current user, check role, check if authenticated |
| `src/lib/auth.ts` | JWT helpers: decode token, check expiry, get role from token |
| `src/middleware.ts` | Next.js middleware: protect `/dashboard/*` routes, redirect by role |
| `src/components/layout/Navbar.tsx` | Top navigation bar — logo, user menu, role-specific links |
| `src/components/layout/Sidebar.tsx` | Side navigation — different menu items per role |
| `src/components/layout/Footer.tsx` | Page footer |
| `src/components/ui/Button.tsx` | Reusable button component (variants: primary, secondary, danger, ghost) |
| `src/components/ui/Input.tsx` | Reusable form input with label and error message |
| `src/components/ui/Modal.tsx` | Reusable modal/dialog component |
| `src/components/ui/Card.tsx` | Reusable card container |
| `src/components/ui/Badge.tsx` | Status badges (role badges, status tags) |
| `src/components/ui/DataTable.tsx` | Reusable sortable/filterable data table |
| `src/components/ui/LoadingSpinner.tsx` | Loading animation component |
| `src/components/ui/Toast.tsx` | Toast notification wrapper (sonner) |
| `src/lib/api.ts` | Axios instance — base URL, JWT interceptor (auto-attach token), error interceptor |
| `src/types/index.ts` | ALL shared TypeScript interfaces (User, Job, Application, CV, etc.) |

> **⚠️ Shared files**: Dev A creates `api.ts`, `types/index.ts`, `AuthContext`, `middleware.ts`, and all `ui/` components.
> These are **shared** — other devs import them but Dev A maintains them.

#### API Endpoints Owned

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | ❌ Public | Register new user (candidate or recruiter) |
| `POST` | `/api/v1/auth/login` | ❌ Public | Login, returns JWT token + user data |
| `GET` | `/api/v1/auth/me` | 🔒 JWT | Get current authenticated user |
| `PUT` | `/api/v1/auth/change-password` | 🔒 JWT | Change password |
| `GET` | `/api/v1/users` | 🔒 Admin | List all users (paginated) |
| `GET` | `/api/v1/users/{id}` | 🔒 JWT | Get user by ID |
| `PUT` | `/api/v1/users/{id}` | 🔒 Own/Admin | Update user info |
| `DELETE` | `/api/v1/users/{id}` | 🔒 Admin | Deactivate user |
| `GET` | `/api/v1/users/{id}/candidate-profile` | 🔒 JWT | Get candidate profile |
| `PUT` | `/api/v1/users/{id}/candidate-profile` | 🔒 Candidate | Update candidate profile (skills, prefs) |
| `PUT` | `/api/v1/users/{id}/visibility` | 🔒 Candidate | Set profile visibility |
| `GET` | `/api/v1/admin/dashboard` | 🔒 Admin | Get system stats |
| `GET` | `/api/v1/admin/pending-recruiters` | 🔒 Admin | List unverified recruiters |
| `PUT` | `/api/v1/admin/verify/{id}` | 🔒 Admin | Approve/reject recruiter |
| `GET` | `/api/v1/admin/settings` | 🔒 Admin | Get system settings |
| `PUT` | `/api/v1/admin/settings` | 🔒 Admin | Update system settings |

#### Weekly Breakdown

| Week | Tasks | Deliverable |
|---|---|---|
| **Week 1** | User model, RegisterRequest/LoginRequest DTOs, AuthService (BCrypt + JWT), SecurityConfig, JwtTokenProvider, JwtAuthenticationFilter, AuthController | ✅ Working `/register` and `/login` API endpoints |
| **Week 2** | Login + Register pages (Next.js), AuthContext, middleware.ts, protected routes, Navbar/Sidebar, all `ui/` components, `api.ts`, `types/index.ts` | ✅ Full auth flow in browser + shared components for team |
| **Week 3** | Admin dashboard page (stats + charts), Users management table, Recruiter verification workflow, CandidateProfile + RecruiterProfile models | ✅ Working admin panel |
| **Week 4** | Candidate profile editor (skills, preferences, values), Visibility settings, RBAC hardening (test all roles on all endpoints) | ✅ Complete profile management |
| **Week 5** | System settings page, Matching threshold config, Polish + edge cases | ✅ Admin settings complete |
| **Week 6-7** | Bug fixes, integration testing with other devs, UI polish, help with deployment | ✅ Production-ready auth |

---

### 💼 Dev B — Jobs & Applications + CV Upload

**Owns**: Everything related to jobs, job applications, CV file uploads, and candidate search.

#### Files Owned — Backend (Spring Boot)

| File | Purpose |
|---|---|
| `model/Job.java` | `@Document("jobs")` — title, description, location, type, requiredSkills, experienceLevel, companyValues, status, deadline |
| `model/Cv.java` | `@Document("cvs")` — originalFileName, fileType, fileData (Binary), extractedText, detectedSkills, yearsExperience |
| `model/Application.java` | `@Document("applications")` — candidateId, jobId, cvId, status, matchingScore, scoreBreakdown, statusHistory |
| `model/enums/JobType.java` | Enum: `FULL_TIME`, `PART_TIME`, `INTERNSHIP` |
| `model/enums/JobStatus.java` | Enum: `OPEN`, `CLOSED`, `DRAFT` |
| `model/enums/ApplicationStatus.java` | Enum: `APPLIED`, `SHORTLISTED`, `INTERVIEW`, `REJECTED`, `HIRED` |
| `model/enums/ExperienceLevel.java` | Enum: `JUNIOR`, `MID`, `SENIOR` |
| `dto/JobRequest.java` | Create/update job request body |
| `dto/JobResponse.java` | Job response with recruiter info |
| `dto/ApplicationRequest.java` | Apply to job request (jobId, cvId) |
| `dto/ApplicationResponse.java` | Application response with score + status |
| `dto/CvResponse.java` | CV metadata + extracted info (no binary data) |
| `repository/JobRepository.java` | `findByRecruiterId()`, `findByStatus()`, search queries |
| `repository/CvRepository.java` | `findByUserId()` |
| `repository/ApplicationRepository.java` | `findByCandidateId()`, `findByJobId()`, `findByJobIdOrderByMatchingScoreDesc()` |
| `controller/JobController.java` | Full CRUD: `POST/GET/PUT/DELETE /jobs`, `GET /jobs/recommended`, search & filter |
| `controller/CvController.java` | `POST /cv/upload`, `GET /cv/{id}`, `GET /cv/{id}/download`, `DELETE /cv/{id}` |
| `controller/ApplicationController.java` | `POST /applications`, `GET /applications`, `GET /applications/{id}`, `GET /applications/job/{jobId}` |
| `service/JobService.java` | Job CRUD logic, search/filter by skills/experience/location, recommended jobs (calls AI) |
| `service/CvService.java` | File upload (validate PDF/DOCX, store in MongoDB), trigger parse via AI service, return metadata |
| `service/ApplicationService.java` | Create application, check duplicates, trigger matching score, list applications |

#### Files Owned — Frontend (Next.js)

| File | Purpose |
|---|---|
| `src/app/(dashboard)/recruiter/jobs/page.tsx` | Recruiter: list own job postings, create/edit/delete jobs |
| `src/app/(dashboard)/recruiter/jobs/new/page.tsx` | Recruiter: create new job form (title, description, skills tags, experience, values) |
| `src/app/(dashboard)/recruiter/jobs/[id]/edit/page.tsx` | Recruiter: edit existing job |
| `src/app/(dashboard)/recruiter/jobs/[id]/page.tsx` | Recruiter: view job details + applicant list (ranked by score) |
| `src/app/(dashboard)/recruiter/candidates/page.tsx` | Recruiter: search candidate database (by skills, experience, score) |
| `src/app/(dashboard)/candidate/jobs/page.tsx` | Candidate: browse all open jobs, search & filter, see compatibility score |
| `src/app/(dashboard)/candidate/jobs/[id]/page.tsx` | Candidate: view job detail + matched/missing skills + apply button |
| `src/app/(dashboard)/candidate/applications/page.tsx` | Candidate: application tracker — list all applications with status & timeline |
| `src/components/jobs/JobCard.tsx` | Job listing card (title, company, skills tags, match score badge) |
| `src/components/jobs/JobForm.tsx` | Create/edit job form component (react-hook-form + zod) |
| `src/components/jobs/SkillsInput.tsx` | Tag input component for adding/removing skills |
| `src/components/jobs/JobFilters.tsx` | Search bar + filter dropdowns (type, experience, location) |
| `src/components/cv/CvUpload.tsx` | Drag & drop file upload component (accept PDF/DOCX, max 10MB) |
| `src/components/cv/CvPreview.tsx` | Display extracted CV data (skills, experience, education) |
| `src/components/applications/ApplicationCard.tsx` | Application status card with score and timeline |
| `src/components/applications/ApplicationTimeline.tsx` | Visual timeline of status changes |
| `src/hooks/useJobs.ts` | Hook: fetch jobs, create job, update job, delete job |
| `src/hooks/useApplications.ts` | Hook: fetch applications, apply to job |
| `src/hooks/useCv.ts` | Hook: upload CV, fetch CV data |

#### API Endpoints Owned

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/jobs` | 🔒 Recruiter | Create a new job posting |
| `GET` | `/api/v1/jobs` | 🔒 JWT | List jobs (paginated, with filters: skills, type, experience, location) |
| `GET` | `/api/v1/jobs/{id}` | 🔒 JWT | Get full job details |
| `PUT` | `/api/v1/jobs/{id}` | 🔒 Recruiter (own) | Update a job |
| `DELETE` | `/api/v1/jobs/{id}` | 🔒 Recruiter (own) | Delete a job |
| `GET` | `/api/v1/jobs/my-jobs` | 🔒 Recruiter | Get recruiter's own jobs |
| `GET` | `/api/v1/jobs/recommended` | 🔒 Candidate | Get AI-recommended jobs for current user |
| `POST` | `/api/v1/cv/upload` | 🔒 JWT | Upload CV file (PDF/DOCX, max 10MB) |
| `GET` | `/api/v1/cv/{id}` | 🔒 JWT | Get CV metadata + extracted data |
| `GET` | `/api/v1/cv/{id}/download` | 🔒 JWT | Download original CV file |
| `DELETE` | `/api/v1/cv/{id}` | 🔒 JWT (own) | Delete a CV |
| `POST` | `/api/v1/applications` | 🔒 Candidate | Apply to a job |
| `GET` | `/api/v1/applications` | 🔒 JWT | List own applications (candidate) or job applications (recruiter) |
| `GET` | `/api/v1/applications/{id}` | 🔒 JWT | Get application details + score breakdown |
| `GET` | `/api/v1/applications/job/{jobId}` | 🔒 Recruiter | Get all applications for a job (ranked by score) |
| `GET` | `/api/v1/candidates/search` | 🔒 Recruiter | Search candidates by skills, experience (respects visibility) |

#### Weekly Breakdown

| Week | Tasks | Deliverable |
|---|---|---|
| **Week 1** | Job model, Job DTOs, JobRepository, JobController (CRUD), JobService, CV model, CvController (upload endpoint) | ✅ Working job CRUD API + CV upload API |
| **Week 2** | Job listing page, Job detail page, Job create/edit form, CV upload component (drag & drop), CvService (file validation + storage) | ✅ Recruiter can create jobs, candidate can browse jobs |
| **Week 3** | Application model, ApplicationController, ApplicationService, Apply-to-job flow, Application tracker page, Recruiter applicant list | ✅ Candidates can apply, recruiter sees applicants |
| **Week 4** | Integrate matching scores from Dev D's AI API, Ranked candidate list, Search & filter candidates, Min score filter | ✅ Scores visible on all application views |
| **Week 5** | Missing skills view (candidate side), Edge cases (duplicate apply, closed jobs, etc.), Validation & error handling | ✅ Polished job + application flow |
| **Week 6-7** | Bug fixes, integration testing, UI polish, responsive design, help with deployment | ✅ Production-ready jobs |

---

### 📋 Dev C — Pipeline & Automation (n8n)

**Owns**: Kanban recruitment pipeline, status management, n8n automation workflows, email/calendar integrations, and profile visibility.

#### Files Owned — Backend (Spring Boot)

| File | Purpose |
|---|---|
| `controller/PipelineController.java` | `GET /pipeline/job/{jobId}` (grouped by status), `PUT /applications/{id}/status` (status update + history) |
| `service/PipelineService.java` | Status transitions, validation (valid state transitions), history tracking |
| `service/WebhookService.java` | Send HTTP POST to n8n webhooks on events (new application, status change, interview scheduled) |
| `dto/StatusUpdateRequest.java` | Request body: new status + optional notes |
| `dto/PipelineResponse.java` | Response: applications grouped by status columns |
| `dto/StatusHistoryEntry.java` | Status + timestamp + changedBy for history array |
| `config/N8nConfig.java` | n8n webhook URLs configuration |

> **Note**: Dev C modifies `Application.java` (owned by Dev B) to add `statusHistory` logic. Coordinate with Dev B on model changes.

#### Files Owned — Frontend (Next.js)

| File | Purpose |
|---|---|
| `src/app/(dashboard)/recruiter/pipeline/page.tsx` | Kanban board page — select a job, see candidates in pipeline columns |
| `src/app/(dashboard)/recruiter/pipeline/[jobId]/page.tsx` | Pipeline board for specific job |
| `src/app/(dashboard)/recruiter/analytics/page.tsx` | Recruitment analytics — hiring funnel charts, time-to-hire, score distributions |
| `src/components/kanban/KanbanBoard.tsx` | Main kanban board container — 5 columns, drop zones |
| `src/components/kanban/KanbanColumn.tsx` | Single pipeline column (title, count badge, droppable area) |
| `src/components/kanban/KanbanCard.tsx` | Candidate card in pipeline (name, score, skills preview, drag handle) |
| `src/components/kanban/CandidateDetailModal.tsx` | Modal: full candidate info, CV preview, score breakdown, status history |
| `src/components/charts/HiringFunnel.tsx` | Funnel chart: Applied → Shortlisted → Interview → Hired |
| `src/components/charts/ScoreDistribution.tsx` | Bar chart: score ranges distribution |
| `src/components/charts/TimelineChart.tsx` | Time-to-hire analytics |
| `src/components/visibility/VisibilitySettings.tsx` | Toggle: Public / Verified Recruiters / Private |
| `src/hooks/usePipeline.ts` | Hook: fetch pipeline data, update status |

#### n8n Workflows Owned (Docker + n8n UI)

| # | Workflow | Trigger Webhook | n8n Actions |
|---|---|---|---|
| 1 | **Auto-Reject Low Score** | `POST /webhook/auto-reject` | Receive score → If < threshold → Call backend API to update status → Send rejection email via SMTP |
| 2 | **Interview Scheduler** | `POST /webhook/interview` | Receive candidate + job info → Create Google Calendar event (OAuth2) → Send interview invite email |
| 3 | **Status Change Notification** | `POST /webhook/status-change` | Receive new status → Format email body → Send email to candidate |
| 4 | **New Application Alert** | `POST /webhook/new-application` | Receive application info → Send email to recruiter |

#### Webhook Payload Formats (Spring Boot → n8n)

```json
// POST /webhook/status-change
{
  "applicationId": "string",
  "candidateName": "string",
  "candidateEmail": "string",
  "jobTitle": "string",
  "previousStatus": "APPLIED",
  "newStatus": "SHORTLISTED",
  "changedAt": "2026-04-15T10:30:00Z"
}

// POST /webhook/auto-reject
{
  "applicationId": "string",
  "candidateEmail": "string",
  "candidateName": "string",
  "jobTitle": "string",
  "score": 32,
  "threshold": 50
}

// POST /webhook/interview
{
  "applicationId": "string",
  "candidateName": "string",
  "candidateEmail": "string",
  "recruiterName": "string",
  "recruiterEmail": "string",
  "jobTitle": "string",
  "interviewDate": "2026-04-20T14:00:00Z",
  "interviewDuration": 60
}

// POST /webhook/new-application
{
  "applicationId": "string",
  "candidateName": "string",
  "jobTitle": "string",
  "recruiterEmail": "string",
  "matchingScore": 78,
  "appliedAt": "2026-04-15T09:00:00Z"
}
```

#### API Endpoints Owned

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/pipeline/job/{jobId}` | 🔒 Recruiter | Get pipeline board data (applications grouped by status) |
| `PUT` | `/api/v1/applications/{id}/status` | 🔒 Recruiter | Update application status (triggers webhook to n8n) |
| `GET` | `/api/v1/applications/{id}/history` | 🔒 JWT | Get status change history for an application |
| `GET` | `/api/v1/analytics/job/{jobId}` | 🔒 Recruiter | Get analytics for a job (funnel, timing, scores) |
| `GET` | `/api/v1/analytics/overview` | 🔒 Recruiter | Get recruiter-wide analytics |

#### Weekly Breakdown

| Week | Tasks | Deliverable |
|---|---|---|
| **Week 1** | Study n8n docs, install Docker Desktop, run n8n container, explore n8n interface, design pipeline model & webhook payloads | ✅ n8n running locally, webhook payload specs documented |
| **Week 2** | PipelineController, PipelineService, StatusUpdateRequest DTO, status validation (valid transitions), status history tracking | ✅ Working pipeline status API |
| **Week 3** | Kanban board UI: KanbanBoard, KanbanColumn, KanbanCard using `@dnd-kit`, CandidateDetailModal, connect to pipeline API | ✅ Drag & drop pipeline board in browser |
| **Week 4** | WebhookService (Spring Boot), n8n workflows (auto-reject + status change notification), Email node setup in n8n (SMTP config) | ✅ Automated emails on status change |
| **Week 5** | Google Calendar n8n integration, Interview scheduling workflow, Analytics page (Recharts), Visibility settings | ✅ Full automation working |
| **Week 6-7** | Bug fixes, test all automations end-to-end, UI polish, help with deployment | ✅ Production-ready pipeline + automation |

---

### 🤖 Dev D — AI Engine (Python Microservice)

**Owns**: The entire Python FastAPI microservice — CV parsing, NLP, matching algorithm, career intelligence. Also owns the Spring Boot integration layer that calls the Python service.

#### Files Owned — Python (FastAPI)

| File | Purpose |
|---|---|
| `main.py` | FastAPI app entry, CORS config, router includes, uvicorn setup |
| `app/routers/cv_parser.py` | `POST /api/ai/parse` — accepts PDF/DOCX file, returns extracted data |
| `app/routers/matcher.py` | `POST /api/ai/match` — accepts job + candidate data, returns score |
| `app/routers/career.py` | `POST /api/ai/career-advice` — returns CV feedback + skill gaps + career suggestions |
| `app/services/parser_service.py` | PDF extraction (pdfplumber), DOCX extraction (python-docx), text cleaning + normalization |
| `app/services/nlp_service.py` | Skill extraction (keyword match against dictionary + regex), Experience detection (regex: "X years"), Education parsing |
| `app/services/matching_service.py` | TF-IDF vectorization (scikit-learn), Cosine similarity calculation, Weighted score composition |
| `app/services/career_service.py` | CV quality feedback, Skill gap analysis (compare candidate vs market), Career path suggestion logic |
| `app/models/schemas.py` | Pydantic models: `ParseResponse`, `MatchRequest`, `MatchResponse`, `CareerAdviceResponse` |
| `app/data/skills_dictionary.json` | Master skills taxonomy (500+ skills, categorized: programming, frameworks, databases, soft skills, etc.) |
| `tests/test_parser.py` | Unit tests for PDF/DOCX parsing accuracy |
| `tests/test_matcher.py` | Unit tests for scoring accuracy with known CV-Job pairs |
| `tests/sample_cvs/` | 5-10 sample CVs (PDF + DOCX) for testing |
| `requirements.txt` | Python dependencies |
| `Procfile` | Render deployment: `web: uvicorn main:app --host 0.0.0.0 --port $PORT` |

#### Files Owned — Backend (Spring Boot) — Integration Layer

| File | Purpose |
|---|---|
| `service/MatchingService.java` | Calls Python AI service via `RestTemplate` — `/parse`, `/match`, `/career-advice` |
| `controller/MatchingController.java` | `GET /matching/score/{appId}`, `GET /matching/job/{jobId}/ranked`, `GET /matching/candidate/recommendations` |
| `dto/MatchingScoreResponse.java` | Response: score, breakdown, matchedSkills, missingSkills |
| `dto/CareerAdviceResponse.java` | Response: feedback, skillGaps, suggestions |
| `config/AiServiceConfig.java` | RestTemplate bean + AI service URL config |

#### Files Owned — Frontend (Next.js)

| File | Purpose |
|---|---|
| `src/app/(dashboard)/candidate/career/page.tsx` | Career intelligence page — CV feedback, skill gaps, career path suggestions |
| `src/components/matching/ScoreCard.tsx` | Circular score display (0-100) with color coding |
| `src/components/matching/ScoreBreakdown.tsx` | Breakdown bars: skills %, experience %, culture % |
| `src/components/matching/SkillsComparison.tsx` | Visual: matched skills (green) vs missing skills (red) |
| `src/components/career/CvFeedback.tsx` | AI-generated feedback cards |
| `src/components/career/SkillGapChart.tsx` | Radar chart showing current vs required skill levels |
| `src/components/career/CareerSuggestions.tsx` | Career path suggestion cards |
| `src/hooks/useMatching.ts` | Hook: fetch scores, recommendations |
| `src/hooks/useCareer.ts` | Hook: fetch career advice |

#### AI Service API Endpoints

| Method | Endpoint | Input | Output |
|---|---|---|---|
| `POST` | `/api/ai/parse` | `multipart/form-data` — file (PDF/DOCX) | `{ extractedText, detectedSkills[], yearsExperience, education, languages[] }` |
| `POST` | `/api/ai/match` | `{ jobSkills[], jobExperience, jobValues[], candidateSkills[], candidateExperience, candidateValues[] }` | `{ score (0-100), breakdown: { skills, experience, culture }, matchedSkills[], missingSkills[] }` |
| `POST` | `/api/ai/career-advice` | `{ skills[], yearsExperience, education, targetJobTitles[] }` | `{ cvFeedback: { strengths[], improvements[] }, skillGaps: [{ skill, currentLevel, requiredLevel }], careerPaths: [{ title, description, requiredSkills[] }] }` |

#### Matching Algorithm Details

```
Score = (Skills Score × 0.60) + (Experience Score × 0.25) + (Culture Score × 0.15)

Skills Score (0-100):
  1. Convert job required skills into a TF-IDF vector
  2. Convert candidate skills into a TF-IDF vector
  3. Calculate Cosine Similarity between vectors
  4. Multiply by 100

Experience Score (0-100):
  - If candidate years >= required years → 100
  - If candidate years >= required × 0.75 → 75
  - If candidate years >= required × 0.50 → 50
  - Otherwise → (candidate / required) × 100

Culture Score (0-100):
  - Count matching values between job and candidate
  - (matched / total required) × 100
```

#### Skills Dictionary Structure (`skills_dictionary.json`)

```json
{
  "categories": {
    "programming_languages": ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"],
    "frontend": ["React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "Tailwind", "Bootstrap", "SASS"],
    "backend": ["Spring Boot", "Node.js", "Express.js", "Django", "FastAPI", "Flask", "ASP.NET", "Laravel"],
    "databases": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Firebase", "DynamoDB"],
    "devops": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitHub Actions", "Terraform"],
    "data_science": ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn"],
    "mobile": ["React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Xamarin"],
    "soft_skills": ["Leadership", "Communication", "Teamwork", "Problem Solving", "Time Management", "Agile", "Scrum"],
    "tools": ["Git", "Jira", "Figma", "Postman", "VS Code", "IntelliJ", "Linux"]
  }
}
```

#### Weekly Breakdown

| Week | Tasks | Deliverable |
|---|---|---|
| **Week 1** | Setup Python project, FastAPI app, parser_service (pdfplumber + python-docx), `/parse` endpoint, test with 5 sample CVs | ✅ Working CV parser — input PDF/DOCX, output text + data |
| **Week 2** | Build `skills_dictionary.json` (500+ skills), nlp_service (keyword matching, regex experience detection, education parsing), return detected skills | ✅ NLP extracts skills, experience, education from any CV |
| **Week 3** | matching_service (TF-IDF with scikit-learn, Cosine similarity), weighted scoring formula, `/match` endpoint | ✅ Working matching algorithm — input job + candidate, output score |
| **Week 4** | MatchingService.java (Spring Boot → Python bridge), MatchingController, Score API endpoints, Ranked candidate list, Score breakdown view | ✅ Full pipeline: CV → Parse → Match → Score visible in app |
| **Week 5** | career_service (CV feedback, skill gap analysis, career suggestions), `/career-advice` endpoint, Career page (Next.js), ScoreCard + SkillsComparison components | ✅ Career intelligence working |
| **Week 6-7** | Tune matching accuracy, test with diverse CVs, edge cases, integration testing, help with deployment (Render for Python service) | ✅ Production-ready AI |

---

### Integration Dependencies

```
Week 1:  Dev A ──► ALL DEVS
         │  Delivers: User model, JWT token format, SecurityConfig
         │  Others need: AuthContext, api.ts, middleware.ts, types/index.ts
         │
Week 2:  Dev B ──► Dev C + Dev D
         │  Delivers: Job model, Application model, ApplicationStatus enum
         │  Dev C needs: Application model for pipeline
         │  Dev D needs: Job model for matching
         │
Week 3:  Dev D ──► Dev B
         │  Delivers: /api/ai/match endpoint (score API)
         │  Dev B needs: to display scores on application list
         │
Week 3:  Dev B ──► Dev C
         │  Delivers: ApplicationController endpoints
         │  Dev C needs: to build pipeline board on top of applications
         │
Week 4:  Dev C ──► n8n
         │  Delivers: WebhookService (Spring Boot sends events to n8n)
         │  n8n workflows trigger on these webhooks
```

> **⚠️ Critical Coordination Points:**
> - **End of Day 1**: Dev A shares the `User.java` model and `RegisterRequest` / `LoginRequest` DTOs with everyone
> - **End of Week 1**: Dev A provides working JWT auth that all devs can test their APIs with
> - **End of Week 2**: Dev B shares `Job.java`, `Application.java`, and enum classes with Dev C and Dev D
> - **Week 3**: Dev D provides the Python `/match` endpoint URL for Dev B to integrate
> - **Use a shared Postman collection** or Swagger docs so everyone can test each other's APIs

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
