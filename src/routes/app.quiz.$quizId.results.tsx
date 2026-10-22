// Quiz Results — comprehensive AZ-900 score breakdown and question review
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
  Target,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Award,
} from 'lucide-react'
import type { QuizQuestion } from '../lib/quiz-types.ts'
import { MarkdownContent } from '../components/MarkdownContent.tsx'

export const Route = createFileRoute('/app/quiz/$quizId/results')({
  component: QuizResultsPage,
})

type AnswerState = {
  selectedIndex: number
  isCorrect: boolean
  revealed: boolean
}

type FilterMode = 'all' | 'incorrect' | 'correct'

export function ScoreBadge({ score }: { score: number }) {
  const isPassing = score >= 70

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-inner text-3xl font-black ${
          isPassing
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
        }`}
      >
        {score}%
      </div>
      <div className="text-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isPassing
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
          }`}
        >
          {isPassing ? (
            <>
              <Award className="h-3.5 w-3.5" />
              Passing Score Achieved (Target: 70%)
            </>
          ) : (
            <>
              <Target className="h-3.5 w-3.5" />
              Below Target (Target: 70% to Pass)
            </>
          )}
        </span>
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          {isPassing
            ? 'Great job! Your answers demonstrate solid grasp of this AZ-900 domain.'
            : 'Keep reviewing these topics. Review your missed answers below to close knowledge gaps.'}
        </p>
      </div>
    </div>
  )
}

function QuizResultsPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [answers, setAnswers] = useState<(AnswerState | null)[]>([])
  const [topicLabel, setTopicLabel] = useState('AZ-900 Quiz')
  const [expandedIdxs, setExpandedIdxs] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<FilterMode>('all')

  useEffect(() => {
    const rawQ = sessionStorage.getItem('somopal_quiz')
    const rawA = sessionStorage.getItem('somopal_quiz_answers')
    const label = sessionStorage.getItem('somopal_quiz_topic')
    if (!rawQ || !rawA) {
      void navigate({ to: '/app/quiz' })
      return
    }
    try {
      const parsedQ = JSON.parse(rawQ) as QuizQuestion[]
      const parsedA = JSON.parse(rawA) as (AnswerState | null)[]
      setQuestions(parsedQ)
      setAnswers(parsedA)
      setTopicLabel(label ?? 'AZ-900 Quiz')
      // Auto-expand any incorrect answers by default so learner immediately sees review
      const incorrectSet = new Set<number>()
      parsedA.forEach((a, idx) => {
        if (!a?.isCorrect) incorrectSet.add(idx)
      })
      setExpandedIdxs(incorrectSet)
    } catch {
      void navigate({ to: '/app/quiz' })
    }
  }, [navigate])

  if (!questions) return null

  const correctCount = answers.filter((a) => a?.isCorrect).length
  const answeredCount = answers.filter((a) => a !== null).length
  const incorrectCount = answeredCount - correctCount
  const skippedCount = questions.length - answeredCount
  const score = answeredCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  const weakTopics = [
    ...new Set(
      questions
        .filter((_, i) => answers[i] && !answers[i]?.isCorrect)
        .map((q) => q.topicSlug)
    ),
  ]

  const handleRetry = () => {
    sessionStorage.removeItem('somopal_quiz_answers')
    void navigate({ to: '/app/quiz/$quizId', params: { quizId: 'active' } })
  }

  const toggleExpand = (idx: number) => {
    setExpandedIdxs((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleExpandAll = () => {
    if (expandedIdxs.size === questions.length) {
      setExpandedIdxs(new Set())
    } else {
      setExpandedIdxs(new Set(questions.map((_, i) => i)))
    }
  }

  const filteredQuestions = questions
    .map((q, originalIdx) => ({ q, originalIdx, a: answers[originalIdx] }))
    .filter(({ a }) => {
      if (filter === 'correct') return a?.isCorrect === true
      if (filter === 'incorrect') return !a?.isCorrect
      return true
    })

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* ── Top Summary Card ── */}
      <div className="card-glass overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="mb-4 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Quiz Summary
              </span>
              <h1 className="font-display text-xl font-bold text-[var(--text-main)] sm:text-2xl">
                {topicLabel}
              </h1>
            </div>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-200">
            Official AZ-900 Standard Grounded
          </span>
        </div>

        {/* Score Ring & Performance Tier */}
        <div className="my-6 flex justify-center py-2">
          <ScoreBadge score={score} />
        </div>

        {/* Stat Grid */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="py-3 text-center">
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</p>
            <p className="text-xs text-[var(--text-muted)]">Correct</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-xl font-black text-red-600 dark:text-red-400">{incorrectCount}</p>
            <p className="text-xs text-[var(--text-muted)]">Incorrect</p>
          </div>
          <div className="py-3 text-center">
            <p className="text-xl font-black text-[var(--text-muted)]">{skippedCount}</p>
            <p className="text-xs text-[var(--text-muted)]">Skipped</p>
          </div>
        </div>

        {/* Readiness Impact Alert */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-teal-50/70 p-3.5 text-xs text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <span>
              Your responses have updated your <strong>AZ-900 Exam Readiness</strong> profile.
            </span>
          </div>
          <Link
            to="/app/readiness"
            className="flex shrink-0 items-center gap-1 font-bold text-teal-700 hover:underline dark:text-teal-300"
          >
            Track Readiness <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Weak Topics to Review */}
        {weakTopics.length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              📚 Recommended Topics to Review:
            </p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((slug) => (
                <Link
                  key={slug}
                  to="/app/topics/$slug"
                  params={{ slug }}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-100"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="quiz-retry-btn"
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-bold text-[var(--text-main)] shadow-sm transition hover:bg-[var(--primary-light)]"
          >
            <RefreshCw className="h-4 w-4 text-teal-600" />
            Retry This Quiz
          </button>
          <Link
            to="/app/quiz"
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-amber-700"
          >
            <Star className="h-4 w-4" />
            Configure New Quiz
          </Link>
          <Link
            to="/app/buddy"
            className="flex items-center gap-2 rounded-xl border border-teal-500/50 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800 shadow-sm transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-200"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Discuss with Study Buddy
          </Link>
        </div>
      </div>

      {/* ── Question Review Section ── */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--text-main)]">
              Detailed Question Review
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Each question has verified Azure explanations and distractor analyses
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  filter === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  filter === 'incorrect'
                    ? 'bg-red-600 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Missed ({incorrectCount})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  filter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Correct ({correctCount})
              </button>
            </div>

            {/* Expand / Collapse All */}
            <button
              onClick={toggleExpandAll}
              className="rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              {expandedIdxs.size === questions.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3">
          {filteredQuestions.map(({ q, originalIdx, a }) => {
            const isCorrect = a?.isCorrect
            const isExpanded = expandedIdxs.has(originalIdx)

            return (
              <div
                key={originalIdx}
                className={`overflow-hidden rounded-2xl border transition ${
                  isCorrect === undefined
                    ? 'border-[var(--border-subtle)]'
                    : isCorrect
                      ? 'border-emerald-300 dark:border-emerald-800/60'
                      : 'border-red-300 dark:border-red-800/60'
                } bg-[var(--bg-surface)] shadow-sm`}
              >
                <button
                  onClick={() => toggleExpand(originalIdx)}
                  className="flex w-full items-start gap-3.5 p-4 text-left transition hover:bg-[var(--primary-light)]/40"
                >
                  <div className="mt-0.5 shrink-0">
                    {isCorrect === undefined ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)]">
                        {originalIdx + 1}
                      </span>
                    ) : isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">
                        Question {originalIdx + 1} of {questions.length}
                      </span>
                      <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
                        {q.topicSlug.replace(/-/g, ' ')}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold capitalize ${
                          q.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : q.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-[var(--text-main)]">
                      {q.stem}
                    </p>
                  </div>
                  <div className="mt-1 shrink-0 text-[var(--text-muted)]">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)]/40 p-4 space-y-3.5">
                    {/* All 4 options with explanations */}
                    <div className="space-y-2">
                      {q.options.map((opt: string, optIdx: number) => {
                        const wasSelected = a?.selectedIndex === optIdx
                        const isCorrectOpt = optIdx === q.correctIndex

                        return (
                          <div
                            key={optIdx}
                            className={`rounded-xl border p-3.5 text-xs transition ${
                              isCorrectOpt
                                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800/80 dark:bg-emerald-950/40'
                                : wasSelected
                                  ? 'border-red-300 bg-red-50 dark:border-red-800/80 dark:bg-red-950/40'
                                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] opacity-85'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isCorrectOpt
                                    ? 'bg-emerald-600 text-white'
                                    : wasSelected
                                      ? 'bg-red-600 text-white'
                                      : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`font-semibold ${
                                      isCorrectOpt
                                        ? 'text-emerald-950 dark:text-emerald-200'
                                        : wasSelected
                                          ? 'text-red-950 dark:text-red-200'
                                          : 'text-[var(--text-main)]'
                                    }`}
                                  >
                                    {opt}
                                  </p>
                                  {isCorrectOpt && (
                                    <span className="rounded bg-emerald-200/80 px-1.5 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                                      Correct Answer
                                    </span>
                                  )}
                                  {wasSelected && !isCorrectOpt && (
                                    <span className="rounded bg-red-200/80 px-1.5 py-0.2 text-[10px] font-bold text-red-900 dark:bg-red-900 dark:text-red-200">
                                      Your Choice
                                    </span>
                                  )}
                                </div>
                                {q.optionExplanations?.[optIdx] && (
                                  <p className="mt-1 leading-relaxed text-[var(--text-muted)]">
                                    {q.optionExplanations[optIdx]}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Official Concept Explanation Box */}
                    <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-3.5 dark:border-teal-900 dark:bg-teal-950/50">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                        <HelpCircle className="h-3.5 w-3.5" />
                        AZ-900 Concept Deep Dive
                      </div>
                      <MarkdownContent
                        content={q.explanation}
                        compact
                        className="text-teal-950 dark:text-teal-100 [&_p]:text-teal-950 dark:[&_p]:text-teal-100 leading-relaxed text-xs"
                      />
                    </div>

                    {/* Footer Actions per Question */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <Link
                        to="/app/topics/$slug"
                        params={{ slug: q.topicSlug }}
                        className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:underline dark:text-teal-400"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Review Study Notes for {q.topicSlug.replace(/-/g, ' ')}
                      </Link>

                      <Link
                        to="/app/buddy"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300/80 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-200"
                      >
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        Ask Buddy about this concept
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
