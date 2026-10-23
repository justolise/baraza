// Quiz Player — interactive question-by-question quiz
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Loader2,
} from 'lucide-react'
import type { QuizQuestion } from '../lib/quiz-types.ts'
import { loadAnswerHistory, saveAnswerHistory } from '../lib/demo-data.ts'
import { MarkdownContent } from '../components/MarkdownContent.tsx'
import { useAuth } from '../lib/auth-context.tsx'
import { saveQuizRun } from '../lib/history.ts'
import { useToast } from '../lib/toast-context.tsx'
import { useTranslation } from '../lib/i18n.ts'

export const Route = createFileRoute('/app/quiz/$quizId/')({
  component: QuizPlayerPage,
})

type AnswerState = {
  selectedIndex: number
  isCorrect: boolean
  revealed: boolean
}

function QuizPlayerPage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()
  const { toast } = useToast()
  const { t, language } = useTranslation()
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(AnswerState | null)[]>([])
  const [topicLabel, setTopicLabel] = useState('AZ-900 Quiz')

  useEffect(() => {
    const raw = sessionStorage.getItem('somopal_quiz')
    const label = sessionStorage.getItem('somopal_quiz_topic')
    if (!raw) {
      void navigate({ to: '/app/quiz' })
      return
    }
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid quiz data')
      }
      const qs = (parsed as unknown[]).filter((q): q is QuizQuestion => {
        return (
          typeof q === 'object' &&
          q !== null &&
          typeof (q as QuizQuestion).stem === 'string' &&
          Array.isArray((q as QuizQuestion).options) &&
          (q as QuizQuestion).options.length === 4 &&
          typeof (q as QuizQuestion).correctIndex === 'number' &&
          (q as QuizQuestion).correctIndex >= 0 &&
          (q as QuizQuestion).correctIndex <= 3
        )
      })
      if (qs.length === 0) {
        throw new Error('No valid questions found')
      }
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null) as null[])
      setTopicLabel(label ?? 'AZ-900 Quiz')
    } catch {
      void navigate({ to: '/app/quiz' })
    }
  }, [navigate])

  const current = questions ? questions[currentIndex] : null
  const currentAnswer = answers[currentIndex]
  const totalAnswered = answers.filter((a) => a !== null).length

  const handleSelect = (idx: number) => {
    if (!current || currentAnswer?.revealed) return
    const isCorrect = idx === current.correctIndex
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { selectedIndex: idx, isCorrect, revealed: false } : a
      )
    )
  }

  const handleReveal = () => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex && a ? { ...a, revealed: true } : a))
    )
  }

  const handleNext = () => {
    if (!questions) return
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      // Save results to sessionStorage for the results page
      sessionStorage.setItem('somopal_quiz_answers', JSON.stringify(answers))
      // Save to local readiness history
      try {
        const existing = loadAnswerHistory()
        const newRecords = answers.map((a, i) => ({
          topicSlug: questions[i]?.topicSlug ?? 'shared-responsibility-model',
          isCorrect: a?.isCorrect ?? false,
          answeredAt: new Date().toISOString(),
        }))
        saveAnswerHistory([...existing, ...newRecords])
      } catch {
        // storage fallback
      }
      // Persist to Supabase for signed-in users (fire-and-forget)
      if (user && !isGuest) {
        void saveQuizRun({
          userId: user.id,
          topicLabel,
          language,
          questions: questions.map((q) => ({
            stem: q.stem,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            optionExplanations: q.optionExplanations,
            difficulty: q.difficulty,
            topicSlug: q.topicSlug,
          })),
          answers,
        })
      }
      toast.success('Quiz completed! Reviewing answers and readiness score...', 'Session Finished')
      void navigate({ to: '/app/quiz/$quizId/results', params: { quizId: 'active' } })
    }
  }

  // Keyboard navigation for distraction-free zen learning
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when focused in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()
      if (['1', 'a'].includes(key)) handleSelect(0)
      else if (['2', 'b'].includes(key)) handleSelect(1)
      else if (['3', 'c'].includes(key)) handleSelect(2)
      else if (['4', 'd'].includes(key)) handleSelect(3)
      else if (e.key === 'Enter') {
        if (!currentAnswer?.revealed && currentAnswer?.selectedIndex !== undefined) {
          handleReveal()
        } else if (currentAnswer?.revealed) {
          handleNext()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentIndex, currentAnswer, questions])

  if (!questions || !current) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  const difficultyColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="font-semibold">{topicLabel}</span>
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="mt-1.5 flex gap-1">
          {questions.map((_, i) => {
            const a = answers[i]
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 flex-1 rounded-full transition ${
                  i === currentIndex
                    ? 'bg-amber-500'
                    : a?.revealed
                      ? a.isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : a
                        ? 'bg-amber-300 dark:bg-amber-700'
                        : 'bg-[var(--border-subtle)]'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="card-glass space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-base font-bold leading-snug text-[var(--text-main)] sm:text-lg">
            {current.stem}
          </h2>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyColor[current.difficulty] ?? ''}`}
          >
            {current.difficulty}
          </span>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {current.options.map((option, idx) => {
            const isSelected = currentAnswer?.selectedIndex === idx
            const revealed = currentAnswer?.revealed
            const isCorrect = idx === current.correctIndex

            let optClass =
              'flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition'

            if (!revealed || !isSelected) {
              if (isSelected) {
                optClass += ' border-amber-500 bg-amber-50 dark:bg-amber-950/50'
              } else if (revealed && isCorrect) {
                optClass += ' border-green-500 bg-green-50 dark:bg-green-950/40'
              } else {
                optClass += ' border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-amber-400'
              }
            } else {
              // After reveal and isSelected
              if (isCorrect) {
                optClass += ' border-green-500 bg-green-50 dark:bg-green-950/40'
              } else {
                optClass += ' border-red-500 bg-red-50 dark:bg-red-950/40'
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                onClick={() => handleSelect(idx)}
                disabled={!!currentAnswer?.revealed}
                className={optClass}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    revealed
                      ? isCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : isSelected
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                      : isSelected
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed text-[var(--text-main)]">{option}</span>
                {revealed && isCorrect && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                )}
                {revealed && isSelected && !isCorrect && (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                )}
              </button>
            )
          })}
        </div>

        {/* Per-option explanations after reveal */}
        {currentAnswer?.revealed && (
          <div className="space-y-3 border-t border-[var(--border-subtle)] pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('player.why_each')}
            </h3>
            {current.optionExplanations.map((exp, idx) => (
              <div key={idx} className="flex gap-2.5">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    idx === current.correctIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <MarkdownContent
                  content={exp}
                  compact
                  className="flex-1 text-[var(--text-muted)]"
                />
              </div>
            ))}
            <div className="mt-3 rounded-xl bg-teal-50 p-3.5 dark:bg-teal-950/50">
              <p className="mb-1.5 text-xs font-bold text-teal-700 dark:text-teal-400">{t('player.explanation')}</p>
              <MarkdownContent
                content={current.explanation}
                compact
                className="text-teal-900 dark:text-teal-100 [&_p]:text-teal-900 dark:[&_p]:text-teal-100"
              />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
          {!currentAnswer?.revealed && currentAnswer?.selectedIndex !== undefined ? (
            <button
              id="quiz-check-btn"
              onClick={handleReveal}
              className="flex-1 rounded-xl bg-teal-700 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
            >
              {t('player.check')}
            </button>
          ) : currentAnswer?.revealed ? (
            <button
              id="quiz-next-btn"
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  {t('player.next')} <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t('player.finish')} <Trophy className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <p className="flex-1 py-2.5 text-center text-xs text-[var(--text-muted)]">
              {t('player.select_hint')}
            </p>
          )}
          {totalAnswered > 0 && !currentAnswer?.revealed && (
            <button
              onClick={handleNext}
              className="rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--border-strong)]"
            >
              {t('player.skip')}
            </button>
          )}
        </div>
      </div>

      {/* Answered count */}
      <p className="text-center text-xs text-[var(--text-muted)]">
        {totalAnswered} / {questions.length} {t('player.answered_so_far')} ·{' '}
        {answers.filter((a) => a?.isCorrect).length} {language === 'sw' ? 'sahihi' : 'correct'}
      </p>
    </div>
  )
}
