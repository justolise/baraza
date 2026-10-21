// Readiness Tracker — domain mastery, coverage, and exam countdown
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth-context.tsx'
import {
  Award,
  BookOpen,
  CheckSquare,
  Sparkles,
  Calendar,
  TrendingUp,
  Target,
  RefreshCw,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { calculateReadinessReport } from '../lib/readiness.ts'
import type { ReadinessReport } from '../lib/readiness.ts'
import {
  loadAnswerHistory,
  saveAnswerHistory,
  generateSampleProgress,
  clearAnswerHistory,
} from '../lib/demo-data.ts'

export const Route = createFileRoute('/app/readiness')({
  component: ReadinessPage,
})

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

function studyRateMessage(days: number, readinessScore: number): string {
  const gap = 70 - readinessScore
  if (readinessScore >= 70) return 'On track! Your readiness is above the 70% passing threshold.'
  if (days <= 0) return 'Exam day! Do your best — you have prepared for this.'
  if (days <= 3) return `Only ${days} days left. Focus on your weakest domain today.`
  if (days <= 7) return `${days} days to go. You need to close a ${gap}% readiness gap — quiz daily.`
  return `${days} days to go. Study consistently — aim to close ~${Math.ceil((gap / days) * 7)}% per week.`
}

// ── Score Ring Component ─────────────────────────────────────────────────────
function ScoreRing({
  score,
  size = 120,
  stroke = 10,
  color,
}: {
  score: number
  size?: number
  stroke?: number
  color: string
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  const colors: Record<string, string> = {
    teal: '#0d9488',
    amber: '#d97706',
    indigo: '#4f46e5',
    green: '#16a34a',
    red: '#dc2626',
  }

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-[var(--border-subtle)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors[color] ?? colors.teal}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

function ReadinessPage() {
  const { profile } = useAuth()
  const [report, setReport] = useState<ReadinessReport | null>(null)
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)

  const refreshReport = () => {
    const history = loadAnswerHistory()
    // Also include any temporary session quiz answers if present
    if (history.length === 0 && typeof window !== 'undefined') {
      try {
        const rawAnswers = sessionStorage.getItem('somopal_quiz_answers')
        const rawQs = sessionStorage.getItem('somopal_quiz')
        if (rawAnswers && rawQs) {
          const answers = JSON.parse(rawAnswers) as { isCorrect: boolean }[]
          const qs = JSON.parse(rawQs) as { topicSlug?: string }[]
          const sessionRecords = answers.map((a, i) => ({
            topicSlug: qs[i]?.topicSlug ?? 'shared-responsibility-model',
            isCorrect: a.isCorrect,
            answeredAt: new Date().toISOString(),
          }))
          setReport(calculateReadinessReport(sessionRecords))
          return
        }
      } catch {}
    }
    setReport(calculateReadinessReport(history))
  }

  useEffect(() => {
    refreshReport()
  }, [])

  const handleLoadDemo = () => {
    const sample = generateSampleProgress()
    saveAnswerHistory(sample)
    setReport(calculateReadinessReport(sample))
  }

  const handleReset = () => {
    clearAnswerHistory()
    setReport(calculateReadinessReport([]))
  }

  const daysLeft = profile?.exam_date ? daysUntil(profile.exam_date) : null
  const hasData = report ? report.totalQuestionsAnswered > 0 : false

  const colorMap: Record<string, { badge: string; text: string; bg: string; border: string }> = {
    teal: {
      badge: 'bg-teal-700 text-white',
      text: 'text-teal-700 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-200 dark:border-teal-800',
    },
    amber: {
      badge: 'bg-amber-600 text-white',
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
    },
    indigo: {
      badge: 'bg-indigo-700 text-white',
      text: 'text-indigo-700 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
  }

  const labelBadgeClasses: Record<string, string> = {
    'Not yet': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300',
    'Getting there': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300',
    'Almost ready': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300',
    'Ready': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300',
  }

  if (!report) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white shadow">
            <Award className="h-5 w-5 text-teal-200" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
              Readiness Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Weighted exam readiness based on recency-decay practice across all AZ-900 domains
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {daysLeft !== null && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>{daysLeft === 0 ? 'Exam day!' : `${daysLeft} days to exam`}</span>
            </div>
          )}

          {/* Demo Controls */}
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 rounded-xl border border-teal-600 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 transition hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-200"
            title="Populate realistic practice data across all domains"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Load Demo Progress</span>
          </button>
          {hasData && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-red-600"
              title="Clear all local quiz records"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="card-glass flex flex-col items-center py-12 text-center">
          <Target className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <h2 className="text-lg font-bold text-[var(--text-main)]">No practice quiz data yet</h2>
          <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
            Take a practice quiz to see your readiness score, domain coverage, and personalized study recommendations. Or click &ldquo;Load Demo Progress&rdquo; above to see a sample tracker!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/quiz"
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 shadow-sm"
            >
              <CheckSquare className="h-4 w-4" />
              Take a Quiz
            </Link>
            <button
              onClick={handleLoadDemo}
              className="flex items-center gap-2 rounded-xl border border-teal-600 bg-teal-50 px-5 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-200"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              Load Sample Progress
            </button>
          </div>
        </div>
      )}

      {hasData && (
        <>
          {/* Overall Readiness Card */}
          <div className="card-glass p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative flex shrink-0 flex-col items-center">
                <ScoreRing
                  score={report.overallScore}
                  size={140}
                  stroke={12}
                  color={report.overallScore >= 70 ? 'teal' : report.overallScore >= 50 ? 'amber' : 'red'}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[var(--text-main)]">
                    {report.overallScore}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Readiness
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[var(--text-main)]">
                      Overall Exam Readiness
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      AZ-900 weighted composite score with recency weighting & coverage factors
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      labelBadgeClasses[report.label] ?? ''
                    }`}
                  >
                    {report.label}
                  </span>
                </div>

                {/* Passing threshold bar */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
                    <span>Passing threshold (70% · 700/1000)</span>
                    <span
                      className={
                        report.isPassing
                          ? 'text-green-600 dark:text-green-400 font-bold'
                          : 'text-amber-600 dark:text-amber-400 font-bold'
                      }
                    >
                      {report.isPassing
                        ? '✓ On track to pass'
                        : `${70 - report.overallScore}% gap to passing mark`}
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        report.isPassing
                          ? 'bg-green-500'
                          : report.overallScore >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${report.overallScore}%` }}
                    />
                    <div
                      className="absolute top-0 h-full border-l-2 border-dashed border-green-600 dark:border-green-400"
                      style={{ left: '70%' }}
                    />
                  </div>
                </div>

                {/* Session stats */}
                <div className="flex flex-wrap gap-6 pt-1">
                  <div>
                    <p className="text-xl font-black text-green-600 dark:text-green-400">
                      {report.totalCorrect} / {report.totalQuestionsAnswered}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Questions Correct</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-[var(--text-main)]">
                      {report.overallAccuracy}%
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Overall Accuracy</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                      {report.scaledScore} / 1000
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Estimated Exam Score</p>
                  </div>
                </div>

                {/* Study rate message */}
                {daysLeft !== null && (
                  <div className="flex items-start gap-2 rounded-xl bg-[var(--bg-surface)] p-3 border border-[var(--border-subtle)]">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                      {studyRateMessage(daysLeft, report.overallScore)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top 3 Next-Up Recommendations */}
          {report.nextRecommendations.length > 0 && (
            <div className="card-glass p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h2 className="font-display text-base font-bold text-[var(--text-main)]">
                  Top 3 Next-Up Recommendations
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {report.nextRecommendations.map((rec) => (
                  <div
                    key={rec.topicSlug}
                    className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--text-main)] leading-snug">
                        {rec.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">{rec.reason}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                      <Link
                        to="/app/quiz"
                        search={{ topic: rec.topicSlug }}
                        className="text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
                      >
                        Practice Quiz &rarr;
                      </Link>
                      <Link
                        to="/app/topics/$slug"
                        params={{ slug: rec.topicSlug }}
                        className="text-xs font-semibold text-[var(--text-muted)] hover:underline"
                      >
                        Notes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Domain Breakdown */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[var(--text-main)]">
              Domain Breakdown
            </h2>
            {report.domains.map((domain) => {
              const c = colorMap[domain.color] ?? colorMap.teal
              const isExpanded = expandedDomain === domain.slug

              return (
                <div
                  key={domain.slug}
                  className={`rounded-2xl border p-5 ${c.border} ${c.bg} transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${c.badge}`}>
                          {domain.weight}% of exam
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {domain.topicCount} topics
                        </span>
                      </div>
                      <h3 className={`font-display text-base font-bold ${c.text}`}>{domain.title}</h3>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-[var(--text-muted)]">Mastery</span>
                          <span className={`font-bold ${c.text}`}>{domain.mastery}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60 dark:bg-black/20">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              domain.mastery >= 70
                                ? 'bg-green-500'
                                : domain.mastery >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${domain.mastery}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <ScoreRing
                      score={domain.mastery}
                      size={70}
                      stroke={7}
                      color={domain.mastery >= 70 ? 'teal' : domain.mastery >= 50 ? 'amber' : 'red'}
                    />
                  </div>

                  {/* Actions & Expand Toggle */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/5 dark:border-white/5 pt-3">
                    <div className="flex gap-2">
                      <Link
                        to="/app/quiz"
                        className="flex items-center gap-1.5 rounded-lg border border-current px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
                        style={{ color: 'inherit' }}
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                        Practice Domain
                      </Link>
                      <Link
                        to="/app/topics"
                        className="flex items-center gap-1.5 rounded-lg border border-current px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
                        style={{ color: 'inherit' }}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Study Notes
                      </Link>
                    </div>

                    <button
                      onClick={() => setExpandedDomain(isExpanded ? null : domain.slug)}
                      className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      <span>{isExpanded ? 'Hide' : 'Show'} Topics ({domain.topics.length})</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Topic Mastery List */}
                  {isExpanded && (
                    <div className="mt-4 space-y-2 border-t border-black/5 dark:border-white/5 pt-4">
                      {domain.topics.map((t) => (
                        <div
                          key={t.slug}
                          className="flex items-center justify-between rounded-xl bg-white/70 dark:bg-black/20 p-2.5 text-xs"
                        >
                          <div className="min-w-0 pr-3">
                            <p className="font-semibold text-[var(--text-main)] truncate">{t.title}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {t.attempts > 0
                                ? `${t.correctCount}/${t.attempts} correct (${Math.round(t.weightedAccuracy * 100)}% acc, ${Math.round(t.coverage * 100)}% cov)`
                                : 'Not yet attempted'}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                t.mastery >= 70
                                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                                  : t.mastery >= 40
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              }`}
                            >
                              {t.mastery}%
                            </span>
                            <Link
                              to="/app/quiz"
                              search={{ topic: t.slug }}
                              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 font-bold"
                              title="Quiz this topic"
                            >
                              Quiz
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </section>

          {/* Quick shortcuts */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              to="/app/quiz"
              className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition hover:border-amber-400"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-semibold text-[var(--text-main)]">Take a Quiz</span>
              </div>
            </Link>
            <Link
              to="/app/buddy"
              className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition hover:border-teal-400"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-[var(--text-main)]">Ask Buddy Baraza</span>
              </div>
            </Link>
            <Link
              to="/app/settings"
              className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition hover:border-indigo-400"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold text-[var(--text-main)]">Set Exam Date</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
