# SomoPal (Baraza) 🌍☁️

> **UNOFFICIAL STUDY COMPANION: NOT AFFILIATED WITH OR ENDORSED BY MICROSOFT**  
> *SomoPal is an independent community study companion. Microsoft, Azure, and related marks are trademarks of the Microsoft group of companies. All practice questions, analogies, and study notes are original educational content designed to help learners master cloud fundamentals.*

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tested with Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![TanStack Start](https://img.shields.io/badge/Framework-TanStack%20Start-red.svg)](https://tanstack.com/start)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-somopal.vercel.app-emerald.svg)](https://somopal.vercel.app)

---

## 📌 1. The Problem

Traditional cloud certification materials suffer from critical barriers for African technologists and career switchers:
- **Cultural Distance**: Technical guides assume prior exposure to Western enterprise IT environments (e.g., corporate raised-floor data centers, US utility billing, dedicated fiber leased lines).
- **Abstract Jargon**: Dense technical definitions create high cognitive overhead and exam anxiety without building intuitive mental models.
- **Language Gap**: Learners often think in Swahili or local idioms while having to sit exams in English, leading to translation friction and misunderstandings of subtle distractor questions.
- **Exam Dump Culture**: Rote memorization of leaked questions produces "paper certified" candidates who lack practical architectural understanding.

---

## 💡 2. The Solution

**SomoPal** (*Somo* = Lesson / Study in Swahili + *Pal* = Companion) transforms AZ-900 preparation into an engaging, culturally grounded learning journey:
- **African Analogies**: Every Azure service is mapped to familiar real-world African systems (M-Pesa transaction spikes for Elasticity, KPLC prepaid electricity tokens for OpEx vs. CapEx, Nairobi gated communities for VNets & NSGs).
- **Dual-Language Grounding (English & Kiswahili)**: Explains concepts in natural Swahili while retaining precise English exam keywords (`Availability Zone`, `Resource Group`, `Blob Storage`) so candidates excel on the official test.
- **Structured 4-Part Explanations**: Every AI response delivers a simple definition, an African everyday analogy, the official Microsoft exam definition, and an "exam trap" warning.
- **Deterministic & Grounded RAG**: Local retrieval augmented generation grounded across 31 curated topics and 62 high-yield study notes with zero hallucination guardrails.
- **Recency-Weighted Readiness Analytics**: Objective scoring engine that quantifies true exam readiness across all 3 official AZ-900 exam domains.

---

## 📸 3. Screenshots

| Topic Catalog & Deep-Dive Notes | AI Study Buddy (Baraza Chat) |
|:---:|:---:|
| ![Topic Catalog](/docs/screenshots/topics.png)<br>*31 Curated Topics across 3 AZ-900 Domains* | ![AI Buddy](/docs/screenshots/buddy.png)<br>*Structured 4-Card Grounded Responses* |

| Interactive Practice Quizzes | Exam Readiness Scoring Engine |
|:---:|:---:|
| ![Practice Quiz](/docs/screenshots/quiz.png)<br>*Instant Option Explanations & "Explain Differently"* | ![Readiness Tracker](/docs/screenshots/readiness.png)<br>*Recency-Weighted Domain & Topic Mastery* |

---

## 🏛️ 4. Architecture

SomoPal uses a modern, lightweight SSR stack optimized for edge deployment, sub-second responses, and offline fallback capability.

```
                           ┌───────────────────────────────┐
                           │   Client (Browser / PWA)      │
                           │  React 19 + TanStack Router   │
                           └───────────────┬───────────────┘
                                           │
                       HTTPS / SSR Queries │ Server Functions (RPC)
                                           ▼
                           ┌───────────────────────────────┐
                           │    TanStack Start (Nitro)     │
                           │  - Input Validation (Zod)     │
                           │  - IP Rate Limiting           │
                           │  - Prompt Sanitization        │
                           └───────┬───────────────┬───────┘
                                   │               │
            ┌──────────────────────┴──────┐ ┌──────┴──────────────────────┐
            ▼                             ▼ ▼                             ▼
┌────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│ Embedded Dataset (RAG) │  │  Google Gemini 2.5/2.0  │  │   Supabase Postgres     │
│ 62 AZ-900 Notes Chunks │  │  - Streaming Chat       │  │  - User Profiles        │
│ 768-dim Vector Embeds  │  │  - JSON Quiz Generation │  │  - Quiz & Chat History  │
│ In-Memory Cosine Sim   │  │  - "Explain Differently"│  │  - Strict RLS Security  │
└────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

- **Frontend & Routing**: [TanStack Start](https://tanstack.com/start) with React 19, [TanStack Router](https://tanstack.com/router), and [Tailwind CSS v4](https://tailwindcss.com/).
- **AI & RAG Layer**: [Vercel AI SDK v7](https://sdk.vercel.ai/) with `@ai-sdk/google` (Gemini 2.5 Flash with fallback to Gemini 2.0 Flash). Cosine vector similarity runs in-process over pre-computed 768-dimensional embeddings (`src/data/az900-embedded.json`).
- **Database & Identity**: [Supabase](https://supabase.com/) PostgreSQL with Row-Level Security (RLS) guaranteeing user data isolation (`auth.uid() = user_id`).
- **Validation**: Strict [Zod](https://zod.dev/) schemas validate server function inputs, JSON quiz outputs, and storage serialization.

---

## ⚙️ 5. Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v9.0.0` or higher

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/justolise/baraza.git
   cd baraza
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see section 6 below)
   ```

4. **Build seed data and vector embeddings**:
   ```bash
   # Generates src/data/az900-seed.json
   pnpm tsx scripts/build-seed-data.ts

   # Computes 768-dim embeddings and caches src/data/az900-embedded.json
   pnpm seed
   ```

5. **Start the local development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Run verification suites**:
   ```bash
   pnpm typecheck   # TypeScript strict validation
   pnpm test        # Vitest scoring engine test suite
   pnpm build       # Production bundle build
   ```

---

## 🔐 6. Environment Variables

Create a `.env` file in the project root:

| Variable | Scope | Required | Purpose & Security Guideline |
|---|:---:|:---:|---|
| `GEMINI_API_KEY` | Server | **Yes** | Google Gemini API key. **CRITICAL SECURITY NOTE**: Never prefix with `VITE_`; client bundles must never expose this secret. |
| `GEMINI_MODEL` | Server | No | Primary model (default: `gemini-2.5-flash`). |
| `GEMINI_FALLBACK_MODEL` | Server | No | Failover model (default: `gemini-2.0-flash`). |
| `EMBEDDING_MODEL` | Server | No | Embedding model (default: `gemini-embedding-001`). |
| `EMBEDDING_DIM` | Shared | No | Vector dimension (default: `768`). Validated on startup. |
| `VITE_SUPABASE_URL` | Client/Server | Optional | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Client/Server | Optional | Supabase public anonymous API key. Protected by database RLS. |
| `SUPABASE_SERVICE_ROLE_KEY`| Server | Optional | Administrative key used exclusively for running database migrations or server seed scripts. |
| `RATE_LIMIT_DAILY_MESSAGES`| Server | No | In-memory IP window limit (default: `25`). |
| `RETRIEVAL_SIMILARITY_THRESHOLD` | Server | No | Minimum cosine similarity for RAG chunk retrieval (default: `0.55`). |
| `RETRIEVAL_MATCH_COUNT` | Server | No | Maximum chunks injected into prompt context (default: `4`). |

---

## 🧠 7. Prompt Engineering Approach

All prompts reside in [`src/lib/prompts.ts`](file:///home/elly/projects/baraza/src/lib/prompts.ts). They follow rigorous prompt-engineering and safety principles:

### Input Sanitization (`sanitizePromptParam`, `sanitizeContext`)
- **Delimited Tags**: Replaces characters that have structural meaning in XML/prompts (`<`, `>`, `&`, `` ` ``) with safe spaces.
- **Length Caps**: Hard-caps parameters (e.g. topic strings $\le 100$ chars, context $\le 12,000$ chars) to prevent prompt injection and token exhaustion attacks.

### Prompt Breakdown

| Prompt Template | Why It Is Designed That Way |
|---|---|
| **`BUDDY_SYSTEM_PROMPT_TEMPLATE`**<br>*(AI Study Buddy)* | • **XML Data Boundary**: Encloses RAG context, user profile, and glossary in explicit `<study_notes>`, `<learner_profile>`, and `<glossary>` tags with a security rule treating all tag contents strictly as untrusted data.<br>• **Zero Hallucination Clause**: Explicitly forbids inventing Azure features, fictitious SLAs, or mixing AWS/GCP terms (e.g., S3, EC2).<br>• **4-Card Structured Output**: Forces every reply into four distinct labeled cards: *(1) Simple Term*, *(2) African Everyday Analogy*, *(3) Official Exam Definition*, and *(4) Watch Out / Common Pitfall*.<br>• **Dual Language Bridging**: In Swahili mode (`sw`), explains the intuition in Swahili while mandating that core Azure keywords stay in English (with glosses like *eneo la upatikanaji*) so learners recognize exam questions.<br>• **Exam Integrity**: Forbids repeating real brain-dump questions. |
| **`QUIZ_GENERATION_PROMPT_TEMPLATE`**<br>*(Practice Quiz Generator)* | • **Zod-Guaranteed Schema**: Instructs Gemini to return **only** a raw JSON array matching our exact question schema (`stem`, `options[4]`, `correctIndex`, `explanation`, `optionExplanations[4]`, `difficulty`, `topicSlug`).<br>• **Plausible Distractors**: Requires all 3 wrong answers to represent realistic candidate misconceptions rather than obvious absurdities.<br>• **Strict Grounding**: Requires questions to be drawn directly from the injected `<study_notes>` context.<br>• **Formatting Discipline**: Strictly forbids markdown wrappers, preamble text, or code block fences to prevent parsing failures. |
| **`EXPLAIN_IT_DIFFERENTLY_PROMPT_TEMPLATE`**<br>*(Adaptive Remediation)* | • **Misconception-Targeted**: Injects the student's chosen incorrect distractor alongside the correct answer.<br>• **Novel Analogy Generation**: Instructs the model to generate a completely fresh, alternative everyday analogy distinct from the main catalog to re-frame the concept from another angle.<br>• **Recall Anchor**: Ends with a single punchy memory tip to prevent repeating the mistake on exam day. |

---

## 📊 8. Readiness Scoring Engine

The scoring model in [`src/lib/readiness.ts`](file:///home/elly/projects/baraza/src/lib/readiness.ts) calculates an objective evaluation of student preparation:

1. **Recency-Weighted Accuracy**:
   Past attempts decay exponentially ($w_i = 0.9^i$, where $i = 0$ is the newest attempt). Recent practice counts significantly more than older mistakes:
   $$\text{weightedAccuracy} = \frac{\sum_{i=0}^{n-1} 0.9^i \cdot \mathbb{I}(\text{isCorrect}_i)}{\sum_{i=0}^{n-1} 0.9^i}$$

2. **Topic Coverage Factor**:
   Guarantees that a student cannot achieve 100% mastery from answering just one lucky question. Requires at least 6 questions per topic for full coverage:
   $$\text{coverage} = \min\left(1.0, \frac{\text{attempts}}{6}\right)$$

3. **Topic Effective Mastery**:
   $$\text{mastery}_t = \text{round}(\text{weightedAccuracy} \times \text{coverage} \times 100)$$

4. **Domain Score & Official Weighting**:
   Domain scores average the topic masteries and weight them according to the official Microsoft AZ-900 exam specification:
   - **Describe Cloud Concepts**: **28%**
   - **Describe Azure Architecture & Services**: **35%**
   - **Describe Azure Management & Governance**: **30%** *(Remaining 7% normalized)*

5. **Readiness Bands & Passing Threshold**:
   - AZ-900 Passing Benchmark: **$\ge 70\%$** (equivalent to $\ge 700 / 1000$ scaled score).
   - **Bands**:
     - `Not yet`: $< 50\%$
     - `Getting there`: $50\% - 69\%$
     - `Almost ready`: $70\% - 84\%$
     - `Ready`: $\ge 85\%$

---

## ⚠️ 9. Limitations

- **In-Memory Rate Limiting**: The built-in rate limiter is designed for serverless sliding windows. Instances reset on serverless cold starts (a shared Redis/Upstash instance is recommended for enterprise scale).
- **Client RAG Vector Inlining**: Pre-computed 768-dimensional embeddings are bundled in `src/data/az900-embedded.json`. Updates to study notes require re-running `pnpm tsx scripts/build-seed-data.ts && pnpm seed`.
- **Practice, Not Dumps**: SomoPal intentionally does not reproduce real exam questions or NDA-protected brain dumps. It tests conceptual mastery through original, scenario-grounded questions.
- **English Exam Alignment**: While explanations are offered in Kiswahili, official Azure technical terms remain in English because Microsoft does not offer the AZ-900 examination in Kiswahili.

---

## ⚖️ 10. Unofficial Disclaimer

> **IMPORTANT DISCLAIMER**: SomoPal is an independent educational web application developed by community educators. It is **not** endorsed by, affiliated with, sponsored by, or certified by **Microsoft Corporation**.  
> Microsoft, Azure, Active Directory, Entra ID, and other Microsoft product names referenced herein are registered trademarks of Microsoft Corporation.

---

## 🗺️ 11. Roadmap to Other Certifications

SomoPal's core pedagogical engine (African analogies + dual-language RAG + recency readiness scoring) is architected to scale to additional foundational cloud and AI credentials:

- [ ] **AI-900**: Microsoft Azure AI Fundamentals *(Machine Learning, Computer Vision, Natural Language Processing, Responsible AI)*
- [ ] **DP-900**: Microsoft Azure Data Fundamentals *(Relational, Non-Relational, Modern Data Warehouses & Analytics)*
- [ ] **SC-900**: Microsoft Security, Compliance, and Identity Fundamentals *(Zero Trust, Microsoft Defender, Purview)*
- [ ] **AZ-104**: Microsoft Azure Administrator Associate *(Intermediate level hands-on compute, networking, and governance labs)*
- [ ] **AWS Certified Cloud Practitioner (CLF-C02)**: Multi-cloud localized edition for African developers.

---

*Built with ❤️ for the next generation of cloud architects across Africa.*
