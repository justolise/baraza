// About Page for SomoPal
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  Award,
  Sparkles,
  AlertTriangle,
  Globe,
} from 'lucide-react'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Main Title & Mission */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
          <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl">
          Empowering the Next Generation of African Cloud Builders
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          Cloud computing is the backbone of Africa's burgeoning digital economy—from mobile financial services like M-Pesa to agri-tech startups and health diagnostics. However, preparing for foundational cloud certifications like the Microsoft Azure Fundamentals (AZ-900) has traditionally relied on generic Western case studies or illegal, harmful exam-dump websites.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          <strong>SomoPal</strong> was born to change this. "Somo" is the Swahili word for lesson, study, or subject. SomoPal bridges world-class cloud engineering with everyday African life, replacing abstract descriptions with analogies you live every day.
        </p>
      </div>

      {/* Pedagogy Principles */}
      <section className="mt-14 space-y-6">
        <h2 className="font-display text-2xl font-bold text-[var(--text-main)]">
          The Three Pillars of SomoPal Pedagogy
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="card-glass p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">1. Explain</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Every concept is formatted into four disciplined layers: Simple explanation, African everyday analogy, Exam-precise definition, and Common pitfalls (Watch Out).
            </p>
          </div>

          <div className="card-glass p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white">
              <BookOpen className="h-5 w-5 text-amber-100" />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">2. Test</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Active recall through 100% original, AI-generated multiple-choice questions. Plausible distractors based on genuine misconceptions with per-option rationale.
            </p>
          </div>

          <div className="card-glass p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white">
              <Award className="h-5 w-5 text-teal-200" />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">3. Measure</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
              Mathematical readiness scoring with recency weighting and topic coverage. Guides you to the exact weak areas requiring revision prior to test day.
            </p>
          </div>
        </div>
      </section>

      {/* Integrity & Zero-Dumps Pledge */}
      <section className="mt-14 rounded-3xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20 sm:p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-red-600 dark:text-red-400" />
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-950 dark:text-red-200">
              Our Zero Exam-Dumps Integrity Pledge
            </h3>
            <p className="text-xs leading-relaxed text-red-900/90 dark:text-red-300/80">
              Exam dumps violate Microsoft's non-disclosure agreements, undermine professional credibility, and lead to revoked certifications. <strong>SomoPal contains zero real exam questions or dump materials.</strong> All questions and scenarios are generated dynamically from our verified study notes to build deep conceptual competence that endures long after test day.
            </p>
          </div>
        </div>
      </section>

      {/* Language Inclusion: English & Swahili */}
      <section className="mt-14 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
          <Globe className="h-3.5 w-3.5" />
          <span>Linguistic Inclusion</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-main)]">
          Bilingual Mastery: English & Kiswahili
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          Over 200 million people across East and Central Africa speak Kiswahili. SomoPal includes a native Swahili toggle for study explanations and quiz reviews. While official Microsoft certification exams are administered in English, learning the underlying architecture in your native or familiar language enhances retention and cognitive grasp.
        </p>
        <div className="mt-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs">
          <span className="font-bold text-teal-700 dark:text-teal-400">Sample Swahili Terminology Gloss:</span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[var(--text-muted)]">
            <div>• Availability Zone: <em>eneo la upatikanaji</em></div>
            <div>• Shared Responsibility: <em>uwajibikaji wa pamoja</em></div>
            <div>• Virtual Machine: <em>mashine pepe</em></div>
            <div>• Resource Group: <em>kikundi cha rasilimali</em></div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mt-14 space-y-4 border-t border-[var(--border-subtle)] pt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--text-main)]">
          Built with Modern Web Architecture
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-center">
            <span className="font-bold text-[var(--text-main)]">TanStack Start</span>
            <p className="mt-1 text-[var(--text-muted)]">Full-stack React & Router</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-center">
            <span className="font-bold text-[var(--text-main)]">Supabase pgvector</span>
            <p className="mt-1 text-[var(--text-muted)]">Postgres & Vector RAG</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-center">
            <span className="font-bold text-[var(--text-main)]">Google Gemini</span>
            <p className="mt-1 text-[var(--text-muted)]">Vercel AI SDK</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-center">
            <span className="font-bold text-[var(--text-main)]">Tailwind CSS</span>
            <p className="mt-1 text-[var(--text-muted)]">Mobile-first design</p>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <div className="mt-14 flex items-center justify-center gap-4">
        <Link
          to="/app"
          className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800"
        >
          Open Study Dashboard
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)]"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
