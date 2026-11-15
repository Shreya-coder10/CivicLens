# CivicLens – AI-Powered Civic Issue Reporting & Community Intelligence Platform

> *"See the problem. Report the issue. Improve your community."*

CivicLens is a full-stack, database-driven municipal civic issue reporting and community intelligence web application. Designed with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **NeonDB (Serverless PostgreSQL)**, **Prisma ORM**, **Auth.js**, and **Open-Source Generative AI via OpenRouter (Meta Llama 3.3 70B & Mistral)**.

---

## 🌟 Key Capabilities

### 1. 🤖 Open-Source GenAI Complaint Assistant (OpenRouter)
- **Automatic Complaint Structuring**: Translates informal citizen notes (e.g., *"water collecting near road, bikes slipping"*) into professional, structured municipal reports with recommended categories and severity.
- **Strict Fact Grounding**: Zero hallucination policy; faithfully preserves user-stated hazards, timeframes, and locations.
- **Citizen Autonomy**: Generative suggestions require citizen review and confirmation before submission.
- **Community Intelligence Synthesis**: Aggregates verified database counts and hotspots into insightful executive summaries for city planners.

### 2. 🗺️ Interactive Community Civic Map
- Powered by **Leaflet & OpenStreetMap**.
- Color-coded pins for each civic category (Roads, Waste, Water, Streetlights, Sanitation, Infrastructure).
- Interactive popup cards with reference numbers, statuses, and one-click navigation to details.
- Category and status filters.
- Interactive click-to-pin location selector during complaint filing.

### 3. 📊 Public & Admin Real-Time Analytics
- Built with **Recharts**.
- Category distribution (Pie chart).
- Workflow status progression (Bar chart).
- Daily submission trajectory trends (Area chart).
- Hazard severity breakdown (Bar chart).

### 4. 🔒 Role-Based Access Control & Security
- **3 Defined Roles**: Guest, Citizen, Administrator.
- Server-side route guards and Next.js middleware.
- Passwords hashed using industry-standard **bcrypt** (10 rounds).
- Zod schema validation across both client and server actions.
- Audit trail logging every status change with timestamp and actor name.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript (Strict type safety, zero TS errors) |
| **Styling & UI** | Tailwind CSS + shadcn/ui primitives + Lucide React |
| **Database** | NeonDB (Serverless PostgreSQL) |
| **ORM** | Prisma ORM with automated schema sync |
| **Authentication** | Auth.js (NextAuth v4/v5 JWT session strategy) + bcryptjs |
| **AI Integration** | OpenRouter API (Meta Llama 3.3 70B, Mistral, Qwen) |
| **Mapping** | Leaflet + React-Leaflet + OpenStreetMap |
| **Charts** | Recharts (Responsive data visualizations) |
| **Form Handling** | React Hook Form + Zod resolvers |
| **Hosting** | AWS Amplify Hosting (SSR mode) |

---

## ⚡ Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/civiclens.git
cd civiclens
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the required environment keys in `.env`:

```env
# 1. NeonDB Serverless PostgreSQL Connection String
# Create a free project at https://console.neon.tech
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR-PROJECT.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. NextAuth Secret
NEXTAUTH_SECRET="civiclens-super-secure-production-secret-123456"
NEXTAUTH_URL="http://localhost:3000"

# 3. OpenRouter API Key (Open-Source AI)
# Create a free/low-cost API key at https://openrouter.ai/keys
OPENROUTER_API_KEY="sk-or-v1-YOUR-OPENROUTER-KEY"
OPENROUTER_MODEL="meta-llama/llama-3.3-70b-instruct"
```

> **Note**: Free open-source models can also be specified, such as `meta-llama/llama-3.1-8b-instruct:free` or `mistralai/mistral-7b-instruct:free`.

### 3. Synchronize Database & Seed Demonstration Data

Run Prisma to push the relational schema to NeonDB and seed realistic municipal complaints:

```bash
# Push schema tables and enums to NeonDB
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Populate database with realistic demonstration accounts and complaints
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Demonstration Accounts

For quick college project evaluation and testing, the seed script provisions:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@civiclens.gov` | `Admin@CivicLens2026!` | Access `/admin`, triage complaints, update statuses, view audit logs |
| **Citizen 1** | `aarav.sharma@example.com` | `Citizen@123!` | File complaints, track status, view citizen dashboard |
| **Citizen 2** | `priya.patel@example.com` | `Citizen@123!` | File complaints, upload images, track status |
| **Citizen 3** | `rohan.mukherjee@example.com` | `Citizen@123!` | File complaints, track status |

> The `/login` page includes **One-Click Demo Fill** buttons to instantly log in as either Citizen or Administrator!

---

## 📁 Project Structure

```text
src/
├── actions/                  # Next.js Server Actions
│   ├── auth.actions.ts       # Registration & password hashing
│   └── complaint.actions.ts  # Submission, status transition & admin remarks
├── app/
│   ├── (auth)/               # Login & Register pages
│   ├── (citizen)/            # Citizen Dashboard, Report Wizard, My Reports, Profile
│   ├── admin/                # Admin Console, All Complaints, Analytics, User Management
│   ├── api/                  # Auth, AI Enhance, AI Insights, Presigned Upload endpoints
│   ├── insights/             # Public Civic Analytics & AI Intelligence
│   ├── issues/               # Public Complaints Catalog & Dedicated Tracking Details
│   ├── map/                  # Full-screen Interactive Leaflet Community Map
│   ├── layout.tsx            # Global Root Layout
│   └── page.tsx              # Civic SaaS Landing Page
├── components/
│   ├── ai/                   # AI Complaint Assistant & Bedrock/OpenRouter Cards
│   ├── charts/               # Recharts Pie, Bar, Area, and Severity components
│   ├── complaints/           # ComplaintCard, ComplaintForm, ImageUploader, Timeline
│   ├── layout/               # Navbar, Footer, App Providers
│   ├── maps/                 # Dynamic Leaflet map & Location picker
│   └── ui/                   # Reusable UI primitives (Button, Card, Input, Badge, etc.)
├── lib/
│   ├── ai/openrouter.ts      # OpenRouter API client for open-source LLMs
│   ├── auth.ts               # Auth.js / NextAuth configuration & session guards
│   ├── prisma.ts             # Prisma Client singleton
│   ├── services/             # Complaint, Analytics, and AI domain services
│   └── validations/          # Zod input schemas
└── types/                    # TypeScript interfaces
```

---

## 🚀 AWS Amplify Hosting Deployment

CivicLens is designed for direct deployment to **AWS Amplify Hosting (SSR mode)**:

1. Push your repository to GitHub.
2. In the AWS Amplify Console, select **Host web app** → **GitHub**.
3. Choose your repository and `main` branch.
4. Amplify will automatically detect Next.js SSR using the included `amplify.yml`:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npx prisma generate
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
5. In **Environment Variables**, add:
   - `DATABASE_URL` (Your NeonDB connection string)
   - `NEXTAUTH_SECRET` (Secure random string)
   - `NEXTAUTH_URL` (Your Amplify custom domain or default `amplifyapp.com` domain)
   - `OPENROUTER_API_KEY` (Your OpenRouter API Key)
   - `OPENROUTER_MODEL` (e.g. `meta-llama/llama-3.3-70b-instruct`)
6. Click **Save and Deploy**. Your full-stack platform will be live in minutes!

---

## 📜 License & Academic Usage

Built for final-year engineering capstones, technical portfolio demonstrations, and production-grade municipal software prototypes.
