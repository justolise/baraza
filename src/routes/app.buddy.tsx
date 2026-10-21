// AI Buddy Chat — full RAG-grounded streaming chat page
import { useState, useRef, useEffect, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import {
  Sparkles,
  Send,
  Square,
  Loader2,
  RefreshCw,
  ChevronDown,
  BookOpen,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../lib/auth-context.tsx'
import { retrieveChunks, formatContext } from '../lib/rag.ts'
import { buildBuddySystemPrompt } from '../lib/prompts.ts'
import { CONFIG } from '../lib/config.ts'

export const Route = createFileRoute('/app/buddy')({
  component: BuddyPage,
})

// ─── Server function: AI Buddy response with RAG (secure server-side execution) ─
const askBuddy = createServerFn({ method: 'POST' })
  .validator(
    (data: unknown) =>
      data as {
        text: string
        topicSlug?: string
        language: 'en' | 'sw'
        history: { role: 'user' | 'assistant'; content: string }[]
        daysToExam?: string
      }
  )
  .handler(async ({ data }) => {
    if (!CONFIG.geminiApiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured on the server. Please check your .env file.'
      )
    }

    // 1. RAG retrieval (server-side)
    const chunks = await retrieveChunks(data.text, {
      topicSlug: data.topicSlug,
      topK: CONFIG.retrievalMatchCount,
      threshold: CONFIG.retrievalThreshold,
    })
    const context = formatContext(chunks)
    const topicHints = [...new Set(chunks.map((c) => c.topicTitle))].slice(0, 3)

    // 2. Build system prompt
    const systemPrompt = buildBuddySystemPrompt({
      language: data.language,
      weakTopics: 'None identified yet',
      daysToExam: data.daysToExam,
      context,
    })

    // 3. AI SDK generation on server
    const google = createGoogleGenerativeAI({ apiKey: CONFIG.geminiApiKey })
    const { text } = await generateText({
      model: google(CONFIG.geminiModel),
      system: systemPrompt,
      messages: [...data.history, { role: 'user', content: data.text }],
      maxOutputTokens: 1200,
    })

    return {
      content: text,
      topicHints,
    }
  })

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  topicHints?: string[]
  isStreaming?: boolean
}

// ─── Helper: parse structured sections from Buddy response ──────────────────
function parseSection(content: string, label: string): string {
  const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\d\\)\\s+\\w|$)`, 'i')
  const match = re.exec(content)
  return match ? match[1].trim() : ''
}

function BuddyResponseCard({ content }: { content: string }) {
  const simple = parseSection(content, '1\\) Simple')
  const analogy = parseSection(content, '2\\) Analogy')
  const examDef = parseSection(content, '3\\) Exam definition')
  const watchOut = parseSection(content, '4\\) Watch out')

  const hasStructure = simple || analogy || examDef || watchOut

  if (!hasStructure) {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap text-[var(--text-main)]">
        {content}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {simple && (
        <div className="rounded-xl bg-teal-50 p-3.5 dark:bg-teal-950/60">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            💡 Simple
          </p>
          <p className="text-sm leading-relaxed text-teal-900 dark:text-teal-100">{simple}</p>
        </div>
      )}
      {analogy && (
        <div className="rounded-xl bg-amber-50 p-3.5 dark:bg-amber-950/60">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            🌍 African Analogy
          </p>
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">{analogy}</p>
        </div>
      )}
      {examDef && (
        <div className="rounded-xl bg-indigo-50 p-3.5 dark:bg-indigo-950/60">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            📋 Exam Definition
          </p>
          <p className="text-sm leading-relaxed text-indigo-900 dark:text-indigo-100">{examDef}</p>
        </div>
      )}
      {watchOut && (
        <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-900 dark:bg-red-950/40">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              ⚠️ Watch Out
            </p>
            <p className="text-sm leading-relaxed text-red-900 dark:text-red-100">{watchOut}</p>
          </div>
        </div>
      )}
      {/* Remainder (quiz offer etc.) */}
      {(() => {
        const remainder = content
          .replace(/1\)\s+Simple[\s\S]*?(?=2\)|$)/i, '')
          .replace(/2\)\s+Analogy[\s\S]*?(?=3\)|$)/i, '')
          .replace(/3\)\s+Exam definition[\s\S]*?(?=4\)|$)/i, '')
          .replace(/4\)\s+Watch out[\s\S]*$/i, '')
          .trim()
        return remainder ? (
          <p className="mt-1 text-xs italic text-[var(--text-muted)]">{remainder}</p>
        ) : null
      })()}
    </div>
  )
}

const STARTER_PROMPTS = [
  'What is the difference between IaaS, PaaS, and SaaS? Give me an African analogy.',
  'Explain Azure Regions and Availability Zones like I am studying for AZ-900.',
  'What is the Shared Responsibility Model and why does it matter?',
  'How does the CapEx vs OpEx comparison appear on the AZ-900 exam?',
  'What Azure services are in the Compute category?',
]

function BuddyPage() {
  const { profile } = useAuth()
  const language = (profile?.language ?? 'en')

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return
      setError(null)

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsLoading(true)

      const assistantId = crypto.randomUUID()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '', isStreaming: true },
      ])

      try {
        const historyForAI = messages
          .slice(-12)
          .filter((m) => m.content)
          .map((m) => ({ role: m.role, content: m.content }))

        const daysToExam = profile?.exam_date
          ? String(
              Math.max(
                0,
                Math.ceil(
                  (new Date(profile.exam_date).getTime() - Date.now()) / 86400000
                )
              )
            )
          : undefined

        // Call server function where GEMINI_API_KEY is available
        const res = await askBuddy({
          data: {
            text: text.trim(),
            language,
            history: historyForAI,
            daysToExam,
          },
        })

        // Smooth typewriter streaming animation for rich dynamic feel
        const fullContent = res.content
        const chunkSize = Math.max(4, Math.floor(fullContent.length / 30))
        let accumulated = ''

        for (let i = 0; i < fullContent.length; i += chunkSize) {
          accumulated = fullContent.slice(0, i + chunkSize)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: accumulated, topicHints: res.topicHints, isStreaming: true }
                : m
            )
          )
          await new Promise((resolve) => setTimeout(resolve, 15))
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: fullContent, topicHints: res.topicHints, isStreaming: false }
              : m
          )
        )
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        if (errMsg.includes('aborted') || errMsg.includes('AbortError')) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, isStreaming: false } : m
            )
          )
        } else {
          setError(errMsg)
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        }
      } finally {
        setIsLoading(false)
        abortRef.current = null
        scrollToBottom()
        inputRef.current?.focus()
      }
    },
    [isLoading, language, messages, profile?.exam_date, scrollToBottom]
  )

  const stopStreaming = () => {
    abortRef.current?.abort()
  }

  const clearChat = () => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }

  const hasApiKey = Boolean(CONFIG.geminiApiKey)

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col md:h-[calc(100vh-7rem)]">
      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[var(--text-main)]">
              Baraza Study Buddy
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Grounded answers · African analogies · AZ-900 focused
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-main)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New chat
          </button>
        )}
      </div>

      {/* ── API key warning ── */}
      {!hasApiKey && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm dark:border-amber-700 dark:bg-amber-950/50">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-amber-800 dark:text-amber-200">
            <strong>GEMINI_API_KEY not set.</strong> Add it to your <code>.env</code> to enable the AI
            buddy. Retrieval still works for topic browsing.
          </p>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-4 pr-1">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700/10 text-teal-700 dark:bg-teal-700/20">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="font-display text-lg font-bold text-[var(--text-main)]">
                Habari! I am Baraza, your AZ-900 study buddy.
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-[var(--text-muted)]">
                Ask me anything about Azure Fundamentals. I'll explain with African everyday analogies
                and ground every answer in study notes.
              </p>
            </div>
            <div className="grid w-full max-w-lg gap-2.5">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => void sendMessage(p)}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 text-left text-sm text-[var(--text-main)] transition hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-teal-950/30"
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  {p}
                </button>
              ))}
            </div>
            <ChevronDown className="animate-bounce text-[var(--text-muted)]" />
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="mr-2.5 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-700 shadow">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-teal-700 text-white'
                      : 'rounded-tl-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <>
                      {msg.content ? (
                        <BuddyResponseCard content={msg.content} />
                      ) : (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                          <span className="text-xs text-[var(--text-muted)]">Thinking…</span>
                        </div>
                      )}
                      {msg.isStreaming && msg.content && (
                        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-teal-600" />
                      )}
                      {msg.topicHints && msg.topicHints.length > 0 && !msg.isStreaming && (
                        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-2.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                            Topics:
                          </span>
                          {msg.topicHints.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-2 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-[var(--border-subtle)] pt-3">
        <div className="flex items-end gap-2.5">
          <textarea
            ref={inputRef}
            id="buddy-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'sw'
                ? 'Uliza swali lolote kuhusu AZ-900…'
                : 'Ask anything about Azure Fundamentals…'
            }
            disabled={isLoading && !abortRef.current}
            className="flex-1 resize-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60"
            style={{ maxHeight: 120 }}
          />
          {isLoading ? (
            <button
              onClick={stopStreaming}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow hover:bg-red-700"
              aria-label="Stop"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          ) : (
            <button
              id="buddy-send"
              onClick={() => void sendMessage(input)}
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[var(--text-muted)]">
          Unofficial: not affiliated with or endorsed by Microsoft · Answers grounded in study notes
        </p>
      </div>
    </div>
  )
}
