# SomoPal (Baraza) 🌍☁️

> **UNOFFICIAL: NOT AFFILIATED WITH OR ENDORSED BY MICROSOFT**  
> *SomoPal is an independent community study companion. All quiz questions, analogies, and study notes are 100% original educational content created specifically for African learners preparing for cloud fundamentals.*

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![TanStack Start](https://img.shields.io/badge/Framework-TanStack%20Start-red.svg)](https://tanstack.com/start)

---

## 📖 Overview

**SomoPal** (from Swahili *Somo* = Lesson / Study + *Pal* = Companion) is an AI study buddy and exam readiness tracker for the **Microsoft Azure Fundamentals (AZ-900)** exam, designed to make cloud computing intuitive, memorable, and culturally resonant for learners across Africa.

Most cloud certification materials assume familiarity with Western enterprise IT infrastructure (e.g., traditional on-premises data centers, corporate fiber, US billing models). SomoPal bridges this gap through **grounded African analogies**:
- **Shared Responsibility Model** explained through *renting an apartment in Nairobi* (landlord maintains the roof and perimeter gates, but you lock your own front door).
- **CapEx vs OpEx** explained via *buying a diesel generator vs purchasing KPLC prepaid electricity tokens*.
- **Cloud Elasticity** explained through *M-Pesa transaction surges on Friday evening payday*.
- **High Availability & Fault Tolerance** explained through *twin-engine matatus and multi-chama savings cooperatives*.
- **Microservices & Containers** explained via *shipping containers at the Port of Mombasa*.

---

## 🚀 Key Features

### 1. 🤖 Buddy Baraza (AI Study Companion)
- Grounded in curated AZ-900 study notes via **vector embeddings & retrieval-augmented generation (RAG)**.
- **Fixed 4-Card Structured Answer**:
  1. **💡 In Simple Terms**: Plain language, jargon-free explanation.
  2. **🌍 African Analogy**: Concrete, memorable real-world comparison.
  3. **📋 Official Exam Definition**: Exact terminology Microsoft uses on the exam.
  4. **⚠️ Watch Out / Exam Trap**: Common candidate pitfalls and distractor concepts.
- **Dual Language**: Seamless toggle between **English** and **Kiswahili**.
- **Rate-Limited & Guardrailed**: Enforces daily safety quotas and prevents exam-dump queries.

### 2. 📚 Topic Catalog & Deep-Dive Notes (`/app/topics`)
- Complete coverage of all 3 official AZ-900 exam domains:
  - **Describe Cloud Concepts** (28% of exam)
  - **Describe Azure Architecture & Services** (35% of exam)
  - **Describe Azure Management & Governance** (30% of exam)
- 31 curated core topics with analogies, key terms, and comprehensive study notes.

### 3. 📝 Zod-Validated Quiz Engine (`/app/quiz`)
- Generate practice quizzes by topic or mixed-domain mock exams.
- Immediate option-by-option explanations.
- Exam-style review page with scoring breakdown and **"Explain it differently"** AI re-explanation feature.

### 4. 📊 Readiness Scoring Engine (`/app/readiness`)
- **Recency-Weighted Accuracy**: Newer answers are weighted more heavily ($0.9^i$ decay factor) so recent improvements boost readiness.
- **Coverage Factor**: $\min(1.0, \text{attempts} / 6)$ guarantees you cannot score 100% readiness from just one lucky question.
- **Official Domain Weighting**: 28% Cloud Concepts, 35% Architecture, 30% Management.
- **Passing Threshold**: 70% threshold correlating to AZ-900's 700/1000 passing mark.
- **Readiness Bands**: `'Not yet'` (<50%), `'Getting there'` (50–69%), `'Almost ready'` (70–84%), `'Ready'` (≥85%).
- **Top 3 Next-Up Recommendations**: Pinpoints exactly what to practice next to maximize score velocity.
- **Demo Mode**: One-click "Load Sample Progress" button to test and evaluate realistic analytics instantly.

### 5. ⚙️ Preferences & Kiswahili Support (`/app/settings`)
- Target exam date countdown with daily pace recommendations.
- Language selector (**English** vs **Kiswahili**).
- Guest anonymous sign-in or persistent Supabase Auth.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19, Nitro server engine) |
| **Routing** | [TanStack Router](https://tanstack.com/router) with flat dot-notation route files |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom ochre/teal design system |
| **Icons** | [Lucide React](https://lucide.dev/) (generic cloud icons only) |
| **Database & Auth** | [Supabase](https://supabase.com/) Postgres + pgvector + strict RLS |
| **AI SDK** | [Vercel AI SDK v7](https://sdk.vercel.ai/) with Google Gemini (`@ai-sdk/google`) |
| **Testing** | [Vitest](https://vitest.dev/) for unit and scoring algorithm test suites |
| **Validation** | [Zod v4](https://zod.dev/) for schema-enforced AI quiz generation |

---

## 📐 Readiness Scoring Algorithm Specification

The readiness score is calculated using pure functions in `src/lib/readiness.ts`:

1. **Topic Recency-Weighted Accuracy**:
   For $n$ chronological answer attempts on topic $t$, with index $i = 0$ being the most recent:
   $$w_i = 0.9^i$$
   $$\text{weightedAccuracy} = \frac{\sum_{i=0}^{n-1} w_i \cdot \mathbb{I}(\text{isCorrect}_i)}{\sum_{i=0}^{n-1} w_i}$$

2. **Topic Coverage Factor**:
   $$\text{coverage} = \min\left(1.0, \frac{n}{6}\right)$$

3. **Topic Effective Mastery**:
   $$\text{mastery}_t = \text{round}(\text{weightedAccuracy} \times \text{coverage} \times 100)$$

4. **Domain Score**:
   $$\text{domainMastery}_d = \frac{1}{|T_d|} \sum_{t \in T_d} \text{mastery}_t$$

5. **Overall Readiness Score**:
   $$\text{overallScore} = \text{round}\left( \frac{\sum_d \text{domainMastery}_d \cdot \text{weight}_d}{\sum_d \text{weight}_d} \right)$$
   where $\text{weight}_{\text{concepts}} = 28$, $\text{weight}_{\text{architecture}} = 35$, $\text{weight}_{\text{management}} = 30$.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 20+
- `pnpm` 9+

### 2. Installation
```bash
git clone https://github.com/your-org/somopal.git
cd somopal
pnpm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in the credentials:
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI (Vercel AI SDK)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
EMBEDDING_MODEL=text-embedding-004
EMBEDDING_DIM=768

# RAG & Rate Limits
RATE_LIMIT_DAILY_MESSAGES=25
RETRIEVAL_SIMILARITY_THRESHOLD=0.65
RETRIEVAL_MATCH_COUNT=4
```

### 4. Supabase Migrations & Vector Setup
Run the SQL migrations in `supabase/migrations/`:
- `001_schema.sql`: Core tables, constraints, foreign keys
- `002_rls.sql`: Strict Row-Level Security policies (`user_id = auth.uid()`)
- `003_match_chunks.sql`: pgvector cosine similarity RPC

### 5. Running the App
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

Run the complete test suite, linter, and type checker:

```bash
# Pure scoring unit tests
pnpm test

# TypeScript strict mode verification
pnpm typecheck

# ESLint inspection
pnpm lint

# Production build bundle
pnpm build
```

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects the TanStack Start framework (supported by the included `vercel.json`).
4. Set the environment variables in **Settings > Environment Variables**:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Nitro builds the production bundle and deploys server routes as Vercel Edge/Serverless Functions.

---

## ⚖️ Legal & Trademark Notice

*Microsoft, Azure, and other Microsoft trademarks are trademarks of the Microsoft group of companies. SomoPal is an independent open educational resource and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All practice questions and pedagogical analogies are original works.*
