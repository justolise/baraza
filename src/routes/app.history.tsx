// History Page — logged-in users can browse past chat sessions and quiz runs
import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  MessageSquare,
  Trophy,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'
import {
  loadChatSessions,
  loadChatMessages,
  loadQuizHistory,
} from '../lib/history.ts'
import type { QuizRunSummary } from '../lib/history.ts'
import { MarkdownContent } from '../components/MarkdownContent.tsx'
import { useTranslation } from '../lib/i18n.ts'

export const Route = createFileRoute('/app/history')({
  component: HistoryPage,
})

type Tab = 'chats' | 'quizzes'

interface ChatSession {
  id: string
  title: string
  created_at: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function ScoreBadge({ correct, total }: { correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const color =
    pct >= 80
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      : pct >= 60
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {correct}/{total} · {pct}%
    </span>
  )
}

// ─── Chat Session Row ─────────────────────────────────────────────────────────
function ChatSessionRow({ session }: { session: ChatSession }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[] | null>(null)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setOpen((o) => !o)
    if (!messages && !loading) {
      setLoading(true)
      const msgs = await loadChatMessages(session.id)
      setMessages(msgs)
      setLoading(false)
    }
  }

  return (
    <div className="card-glass overflow-hidden">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-[var(--bg-surface-elevated)]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/50">
            <MessageSquare className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-main)]">
              {session.title}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Clock className="h-3 w-3" />
              {timeAgo(session.created_at)}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        )}
      </button>

      {open && (
        <div className="border-t border-[var(--border-subtle)] px-4 pb-4 pt-3 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <span className="text-xs text-[var(--text-muted)]">Loading messages…</span>
            </div>
          )}
          {messages?.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                  m.role === 'user'
                    ? 'bg-teal-700 text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                }`}
              >
                {m.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{m.content}</p>
                ) : (
                  <MarkdownContent content={m.content} />
                )}
              </div>
            </div>
          ))}
          {messages?.length === 0 && (
            <p className="text-xs text-[var(--text-muted)]">No messages found.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Quiz Run Row ─────────────────────────────────────────────────────────────
function QuizRunRow({ run }: { run: QuizRunSummary }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="card-glass overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-[var(--bg-surface-elevated)]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <Trophy className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-main)]">
              {run.length}-question quiz
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Clock className="h-3 w-3" />
              {timeAgo(run.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ScoreBadge correct={run.correct} total={run.total} />
          {open ? (
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--border-subtle)] px-4 pb-4 pt-3 space-y-3">
          {run.questions.map((q, i) => {
            const userAnswer = q.answers[0]
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const answered = userAnswer !== undefined
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-3.5 ${
                  !answered
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                    : userAnswer.is_correct
                      ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40'
                      : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--text-muted)]">Q{i + 1}</p>
                  {answered ? (
                    userAnswer.is_correct ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-600" />
                    )
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)]">Skipped</span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium leading-snug text-[var(--text-main)]">
                  {q.stem}
                </p>
                {answered && !userAnswer.is_correct && (
                  <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                    Correct:{' '}
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {q.options[q.correct_index]}
                    </span>
                  </p>
                )}
                {q.explanation && (
                  <div className="mt-2 rounded-lg bg-white/60 px-3 py-2 dark:bg-black/20">
                    <MarkdownContent content={q.explanation} compact />
                  </div>
                )}
                <Link
                  to="/app/topics/$slug"
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  params={{ slug: q.topic_slug ?? 'shared-responsibility-model' }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:underline dark:text-teal-400"
                >
                  <BookOpen className="h-3 w-3" /> {t('history.study_topic')}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function HistoryPage() {
  const { user, isGuest } = useAuth()
  const { t, language } = useTranslation()
  const [tab, setTab] = useState<Tab>('chats')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [quizHistory, setQuizHistory] = useState<QuizRunSummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || isGuest) return
    setLoading(true)
    Promise.all([
      loadChatSessions(user.id),
      loadQuizHistory(user.id),
    ]).then(([sessions, quizzes]) => {
      setChatSessions(sessions)
      setQuizHistory(quizzes)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, isGuest])

  if (!user || isGuest) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/40">
          <Lock className="h-7 w-7 text-teal-700 dark:text-teal-300" />
        </div>
        <h1 className="font-display text-xl font-bold text-[var(--text-main)]">
          {language === 'sw' ? 'Ingia ili kuona historia yako' : 'Sign in to view your history'}
        </h1>
        <p className="max-w-sm text-sm text-[var(--text-muted)]">
          {language === 'sw'
            ? 'Mazungumzo yako na matokeo ya majaribio yanahifadhiwa kiotomatiki mara tu unapoingia. Wageni huona kikao cha sasa pekee.'
            : 'Your chat sessions and quiz results are saved automatically once you create a free account. Guests only see the current session.'}
        </p>
        <Link
          to="/app"
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
        >
          {t('home.continue_dash')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">{t('history.title')}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {t('history.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
        <button
          onClick={() => setTab('chats')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'chats'
              ? 'bg-teal-700 text-white shadow'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          {t('history.tab_chats')}
          {chatSessions.length > 0 && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === 'chats' ? 'bg-white/20 text-white' : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              {chatSessions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('quizzes')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
            tab === 'quizzes'
              ? 'bg-amber-600 text-white shadow'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Trophy className="h-4 w-4" />
          {t('history.tab_quizzes')}
          {quizHistory.length > 0 && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === 'quizzes' ? 'bg-white/20 text-white' : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              {quizHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
          <span className="text-sm text-[var(--text-muted)]">Loading…</span>
        </div>
      )}

      {/* Chat Sessions */}
      {!loading && tab === 'chats' && (
        <div className="space-y-3">
          {chatSessions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-14 text-center">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
              <p className="text-sm font-semibold text-[var(--text-muted)]">{t('history.no_chats')}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {t('history.no_chats_hint')}
              </p>
              <Link
                to="/app/buddy"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
              >
                {t('history.open_buddy')}
              </Link>
            </div>
          ) : (
            chatSessions.map((s) => <ChatSessionRow key={s.id} session={s} />)
          )}
        </div>
      )}

      {/* Quiz History */}
      {!loading && tab === 'quizzes' && (
        <div className="space-y-3">
          {quizHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-14 text-center">
              <Trophy className="mx-auto mb-3 h-8 w-8 text-[var(--text-muted)]" />
              <p className="text-sm font-semibold text-[var(--text-muted)]">{t('history.no_quizzes')}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {t('history.no_quizzes_hint')}
              </p>
              <Link
                to="/app/quiz"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                {t('history.take_quiz')}
              </Link>
            </div>
          ) : (
            quizHistory.map((r) => <QuizRunRow key={r.id} run={r} />)
          )}
        </div>
      )}
    </div>
  )
}
