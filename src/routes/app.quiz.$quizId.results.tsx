// Quiz Results — score summary and per-question review
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
} from 'lucide-react'
import type { QuizQuestion } from '../lib/quiz-types.ts'

export const Route = createFileRoute('/app/quiz/$quizId/results')({
  component: QuizResultsPage,
})

type AnswerState = {
  selectedIndex: number
  isCorrect: boolean
  revealed: boolean
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-500 bg-green-50 text-3xl font-black text-green-700 dark:bg-green-950/50 dark:text-green-300">
          {score}%
        </div>
        <p className="text-sm font-bold text-green-700 dark:text-green-400">Excellent! Ready to pass. 🎉</p>
      </div>
    )
  if (score >= 60)
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-500 bg-amber-50 text-3xl font-black text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          {score}%
        </div>
        <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Good progress! Keep studying. 📚</p>
      </div>
    )
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-400 bg-red-50 text-3xl font-black text-red-700 dark:bg-red-950/50 dark:text-red-300">
        {score}%
      </div>
      <p className="text-sm font-bold text-red-700 dark:text-red-400">Keep practicing — you'll get there! 💪</p>
    </div>
  )
}

function QuizResultsPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [answers, setAnswers] = useState<(AnswerState | null)[]>([])
  const [topicLabel, setTopicLabel] = useState('AZ-900 Quiz')
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  useEffect(() => {
    const rawQ = sessionStorage.getItem('somopal_quiz')
    const rawA = sessionStorage.getItem('somopal_quiz_answers')
    const label = sessionStorage.getItem('somopal_quiz_topic')
    if (!rawQ || !rawA) {
      void navigate({ to: '/app/quiz' })
      return
    }
    try {
      setQuestions(JSON.parse(rawQ) as QuizQuestion[])
      setAnswers(JSON.parse(rawA) as (AnswerState | null)[])
      setTopicLabel(label ?? 'AZ-900 Quiz')
    } catch {
      void navigate({ to: '/app/quiz' })
    }
  }, [navigate])

  if (!questions) return null

  const correctCount = answers.filter((a) => a?.isCorrect).length
  const answeredCount = answers.filter((a) => a !== null).length
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Results Header */}
      <div className="card-glass p-8 text-center">
        <div className="mb-4 flex justify-center">
          <Trophy className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">Quiz Complete!</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{topicLabel}</p>

        <div className="mt-6 flex justify-center">
          <ScoreBadge score={score} />
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-[var(--border-subtle)] rounded-xl border border-[var(--border-subtle)]">
          <div className="py-4">
            <p className="text-lg font-black text-green-600 dark:text-green-400">{correctCount}</p>
            <p className="text-xs text-[var(--text-muted)]">Correct</p>
          </div>
          <div className="py-4">
            <p className="text-lg font-black text-red-600 dark:text-red-400">
              {answeredCount - correctCount}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Incorrect</p>
          </div>
          <div className="py-4">
            <p className="text-lg font-black text-[var(--text-muted)]">
              {questions.length - answeredCount}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Skipped</p>
          </div>
        </div>

        {weakTopics.length > 0 && (
          <div className="mt-5 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
            <p className="mb-2 text-xs font-bold text-amber-700 dark:text-amber-400">
              📚 Topics to review:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {weakTopics.map((slug) => (
                <Link
                  key={slug}
                  to="/app/topics/$slug"
                  params={{ slug }}
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-200"
                >
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            id="quiz-retry-btn"
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-xl border border-amber-500 px-5 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Quiz
          </button>
          <Link
            to="/app/quiz"
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
          >
            <Star className="h-4 w-4" />
            New Quiz
          </Link>
          <Link
            to="/app/buddy"
            className="flex items-center gap-2 rounded-xl border border-teal-500 px-5 py-2.5 text-sm font-bold text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40"
          >
            <Sparkles className="h-4 w-4" />
            Ask Buddy
          </Link>
        </div>
      </div>

      {/* Per-question review */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-[var(--text-main)]">Question Review</h2>
        {questions.map((q, i) => {
          const a = answers[i]
          const isCorrect = a?.isCorrect
          const isExpanded = expandedIdx === i

          return (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition ${
                isCorrect === undefined
                  ? 'border-[var(--border-subtle)]'
                  : isCorrect
                    ? 'border-green-300 dark:border-green-800'
                    : 'border-red-300 dark:border-red-800'
              } bg-[var(--bg-surface)]`}
            >
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <div className="mt-0.5 shrink-0">
                  {isCorrect === undefined ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)]">
                      {i + 1}
                    </span>
                  ) : isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <p className="flex-1 text-sm font-semibold leading-snug text-[var(--text-main)]">
                  {q.stem}
                </p>
                {isExpanded ? (
                  <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border-subtle)] px-4 pb-4 pt-3 space-y-3">
                  {q.options.map((opt: string, idx: number) => {
                    const wasSelected = a?.selectedIndex === idx
                    const isCorrectOpt = idx === q.correctIndex
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                          isCorrectOpt
                            ? 'bg-green-50 dark:bg-green-950/40'
                            : wasSelected
                              ? 'bg-red-50 dark:bg-red-950/40'
                              : 'bg-[var(--bg-page)]'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isCorrectOpt
                              ? 'bg-green-500 text-white'
                              : wasSelected
                                ? 'bg-red-500 text-white'
                                : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div>
                          <p className="font-semibold text-[var(--text-main)]">{opt}</p>
                          <p className="mt-0.5 leading-relaxed text-[var(--text-muted)]">
                            {q.optionExplanations[idx]}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div className="rounded-xl bg-teal-50 p-3 dark:bg-teal-950/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Explanation
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-teal-900 dark:text-teal-100">
                      {q.explanation}
                    </p>
                  </div>
                  <Link
                    to="/app/topics/$slug"
                    params={{ slug: q.topicSlug }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Study {q.topicSlug.replace(/-/g, ' ')}
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
