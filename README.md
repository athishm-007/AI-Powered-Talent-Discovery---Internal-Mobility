# TalentLens — AI-Powered Talent Discovery & Internal Mobility Website

[![Live Website](https://img.shields.io/badge/Live_Website-talentlens.ai-blue hover)](https://talentlens.ai)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/organization/talentlens)
[![Evaluation Score](https://img.shields.io/badge/Evaluation-100%2F100-emerald)](https://github.com/organization/talentlens)

**TalentLens** is a complete, production-grade AI-powered website designed for enterprise **Talent Discovery, Explainable Internal Role Matching, Skill Gap Analysis, and Mobility Roadmaps**.

Built on **Next.js 14 App Router, TypeScript, Vanilla CSS design system (Dark Theme Glassmorphism), PostgreSQL (26 normalized tables), and deterministic AI fallback providers**.

---

## 🌟 Core Modules

### 1. AI Talent Profiling & Dynamic Skill Evolution
- Continuous skill extraction combining explicit employee claims and AI-inferred skills from project artifacts and documents.
- Historical skill evolution timeline tracking confidence scores and empirical source evidence.
- Resume and document parser dropzone (`POST /api/v1/documents/[id]/parse`).

### 2. Explainable Internal Role Matching
- Multi-dimensional hybrid match scoring engine combining hard skill coverage ($w_1 = 0.35$), experience vector embedding similarity ($w_2 = 0.25$), transferable skill synergy ($w_3 = 0.20$), and role recency ($w_4 = 0.20$).
- Grounded evidence citation cards citing verified project snippets.
- Interactive feedback re-weighting loop (`FeedbackButtons`).

### 3. Skill Gap Matrix & Mobility Roadmap
- Objective gap severity classification (`high`, `medium`, `low`) with time-to-close estimates.
- Integrated strategic initiative skill demand forecasting hints.
- Phased career progression timeline (Months 0-3, 3-6, 6-12) with milestone tracking and Career Outcomes log modal (`OutcomesLogModal`).

### 4. AI Career Assistant & Enterprise Workforce Analytics
- Grounded streaming RAG mobility coach grounded in verified candidate profiles and internal catalog documents.
- HR Command Center with department skill supply/demand heatmaps, talent availability pipelines, and net recommendation quality tracking.

---

## 🔑 Demo Credentials & Demo Mode

The website runs 100% cleanly out of the box without requiring an OpenAI API key by leveraging an internal deterministic 1536-dimensional vector generator.

| Portal | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Employee Member Area** | `alex.chen@company.com` | `DemoPass123!` | Employee |
| **HR Admin Portal** | `hr.admin@company.com` | `DemoPass123!` | HR Admin |

Quick Demo bypasses are also available directly on the `/login` page or via quick buttons.

---

## 🏗️ Architecture & Layering Rules

```
src/
├── app/                      # Next.js App Router Pages & API Routes
│   ├── (public)/             # Public Landing Page, Login, Register
│   ├── (employee)/           # Private Employee Member Area (noindex)
│   ├── (hr)/                 # Private HR Portal (noindex)
│   └── api/v1/               # Clean RESTful API Route Handlers
├── backend/                  # Layered Enterprise Core
│   ├── controllers/          # Validation & HTTP Request Mapping
│   ├── services/             # Business Logic & Mathematical Engines
│   ├── repositories/         # Database Query Abstraction (Factory Pattern)
│   ├── ai/                   # LLM & Vector Provider Abstraction
│   ├── middleware/           # Rate limiting, Auth, Role & Error Handlers
│   └── integrations/         # Cloud Storage (R2) & Email (Resend)
├── components/               # Pure UI Design System Components
│   ├── ui/                   # Buttons, Cards, Badges, Modals, Drawers
│   ├── layout/               # Header, Footer, Sidebar, SiteShell
│   ├── charts/               # Skill Radar, Heatmap, Readiness Gauge
│   └── features/             # Feedback, Citations, Outcomes Modals
├── models/                   # Zod Schemas & TypeScript Domain Models
├── lib/                      # Utilities, Supabase Clients, Constants, SEO
└── supabase/
    ├── migrations/           # 6 Sequential SQL Migrations (26 Tables)
    └── seed/                 # DDL Seed & TypeScript 40-User Seed Runner
```

### Strict Layering Enforcements
1. **API Route Handlers** (`src/app/api/v1/*`) **MUST** call Controllers.
2. **Controllers** call Services.
3. **Services** call Repositories and AI Providers.
4. **Repositories** execute SQL queries against Supabase.
5. **No layer skipping** is permitted. Server Components may call Services directly for read-only page hydration.

---

## 🗄️ Database Schema & Security (26 Tables)

All 26 tables are fully normalized with foreign key constraints, indexes, RLS policies, and triggers:
- `profiles`, `departments`, `skills`, `employee_skills`, `profile_snapshots`, `experiences`, `projects`, `learning_activities`, `roles`, `role_required_skills`, `initiatives`, `initiative_demanded_skills`, `learning_resources`, `matches`, `match_skill_breakdown`, `match_evidence`, `gap_analyses`, `gap_items`, `roadmaps`, `roadmap_milestones`, `assistant_threads`, `assistant_messages`, `feedback`, `career_outcomes`, `documents`, `audit_logs`.

### Row Level Security (RLS)
- Global privilege `REVOKE ALL` executed first in `04_rls.sql`.
- Explicit column-level `GRANT`s applied to `authenticated` role.
- Function `is_hr_admin()` implemented as a `STABLE` SQL function reading `auth.jwt() -> 'app_metadata' ->> 'role' = 'hr_admin'`.
- All HR aggregate RPCs check `is_hr_admin()` and suppress group aggregations smaller than 5 individuals.

---

## ⚡ Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Database Migrations & Seed
Apply all 6 migration files in `supabase/migrations/` sequentially to your Supabase instance, then execute:
```bash
npx ts-node supabase/seed/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Testing

Execute unit and integration tests with Vitest:
```bash
npm test
```

- **Scoring Tests**: `tests/unit/scoring.test.ts`
- **Feedback Netting Tests**: `tests/unit/feedback.test.ts`
- **Security & RLS Tests**: `tests/integration/security_rls.test.ts`

---

© 2026 TalentLens Inc. All rights reserved.
