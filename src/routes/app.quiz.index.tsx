// Quiz Hub — configure and launch a practice quiz session
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {
  CheckSquare,
  Sparkles,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { z } from 'zod'
import { generateText, Output } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { retrieveChunks, formatContext } from '../lib/rag.ts'
import { buildQuizGenerationPrompt } from '../lib/prompts.ts'
import { CONFIG } from '../lib/config.ts'
import { useAuth } from '../lib/auth-context.tsx'

// ── Types & Schema ───────────────────────────────────────────────────────────
import type { QuizQuestion } from '../lib/quiz-types.ts'

const quizItemSchema = z.object({
  stem: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  optionExplanations: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topicSlug: z.string(),
})

const quizSchema = z.array(quizItemSchema)

export const Route = createFileRoute('/app/quiz/')({
  validateSearch: z.object({ topic: z.string().optional() }),
  component: QuizHubPage,
})

// ── Rate Limiter for Quiz Generation ─────────────────────────────────────────
const quizCallHistory = new Map<string, number[]>()
function isQuizRateLimited(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now()
  const timestamps = (quizCallHistory.get(key) || []).filter((t) => now - t < windowMs)
  if (timestamps.length >= limit) return true
  timestamps.push(now)
  quizCallHistory.set(key, timestamps)
  return false
}

const generateQuizInputSchema = z.object({
  topic: z.string().trim().min(1).max(150),
  topicSlug: z.string().trim().min(1).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  count: z.number().int().min(1).max(15),
  language: z.enum(['en', 'sw']).default('en'),
})

// ── Server fn: generate quiz questions via AI + RAG ──────────────────────────
export const generateQuiz = createServerFn({ method: 'POST' })
  .validator((d: unknown) => generateQuizInputSchema.parse(d))
  .handler(async ({ data }) => {
    if (isQuizRateLimited(data.topicSlug, 8, 60_000)) {
      throw new Error('You are generating quizzes quickly. Please wait a moment before trying again.')
    }
    // 1. Retrieve context
    const chunks = await retrieveChunks(data.topic, {
      topicSlug: data.topicSlug === 'all' ? undefined : data.topicSlug,
      topK: 6,
      threshold: 0.3,
    })
    const context = formatContext(chunks)

    // 2. Build prompt
    const prompt = buildQuizGenerationPrompt({
      count: data.count,
      topic: data.topic,
      difficulty: data.difficulty,
      context,
      language: data.language,
    })

    // 3. Call AI with structured object schema & high token ceiling
    if (!CONFIG.geminiApiKey) {
      throw new Error('Quiz generator is currently unavailable. Please try again shortly.')
    }
    const google = createGoogleGenerativeAI({ apiKey: CONFIG.geminiApiKey })

    async function callModel(modelName: string) {
      const { output } = await generateText({
        model: google(modelName),
        output: Output.object({ schema: quizSchema }),
        prompt,
        maxOutputTokens: 8192,
      })
      return output
    }

    try {
      let questions: z.infer<typeof quizSchema>
      try {
        questions = await callModel(CONFIG.geminiModel)
      } catch (primaryErr) {
        console.warn('Primary model quiz generation failed, attempting fallback:', primaryErr)
        questions = await callModel(CONFIG.geminiFallbackModel)
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions returned. Please try again.')
      }

      return questions as unknown as QuizQuestion[]
    } catch (err) {
      console.error('Quiz generation error:', err)
      const msg = err instanceof Error ? err.message : ''
      if (msg.startsWith('No questions')) throw err
      throw new Error('Could not generate quiz questions. Please try a different topic or try again.')
    }
  })

// ── Topic options ────────────────────────────────────────────────────────────
const TOPIC_OPTIONS = [
  { slug: 'all', label: 'All Domains (Mixed)' },
  // Cloud Concepts
  { slug: 'shared-responsibility-model', label: 'Shared Responsibility Model' },
  { slug: 'cloud-models-public-private-hybrid', label: 'Cloud Deployment Models' },
  { slug: 'cloud-benefits-high-availability-fault-tolerance', label: 'High Availability & Fault Tolerance' },
  { slug: 'cloud-benefits-scalability-elasticity', label: 'Scalability & Elasticity' },
  { slug: 'cloud-service-types-iaas-paas-saas', label: 'IaaS / PaaS / SaaS' },
  { slug: 'cloud-economics-capex-vs-opex', label: 'CapEx vs OpEx' },
  { slug: 'cloud-benefits-predictability-and-manageability', label: 'Predictability & Manageability' },
  // Azure Architecture
  { slug: 'regions-and-availability-zones', label: 'Regions & Availability Zones' },
  { slug: 'sovereign-regions', label: 'Sovereign Regions' },
  { slug: 'resource-hierarchy-and-management', label: 'Resource Hierarchy & ARM' },
  { slug: 'azure-virtual-machines-and-scale-sets', label: 'Virtual Machines & Scale Sets' },
  { slug: 'azure-app-services-and-functions', label: 'App Services & Functions' },
  { slug: 'azure-containers-and-aks', label: 'Containers & AKS' },
  { slug: 'azure-networking-vnets-subnets', label: 'VNets & Subnets' },
  { slug: 'azure-vpn-gateway-and-expressroute', label: 'VPN Gateway & ExpressRoute' },
  { slug: 'azure-storage-types-and-access-tiers', label: 'Storage Types & Access Tiers' },
  { slug: 'azure-storage-redundancy', label: 'Storage Redundancy (LRS/ZRS/GRS)' },
  { slug: 'azure-database-services', label: 'Database Services' },
  { slug: 'azure-virtual-desktop', label: 'Azure Virtual Desktop' },
  { slug: 'azure-migration-tools-migrate-databox', label: 'Migration Tools & Data Box' },
  { slug: 'azure-storage-security-and-tooling', label: 'Storage Security & Tooling' },
  // Azure Management
  { slug: 'pricing-calculator-and-tco', label: 'Pricing & TCO Calculator' },
  { slug: 'cost-management-and-budgets', label: 'Cost Management & Budgets' },
  { slug: 'identity-and-entra-id', label: 'Identity & Entra ID' },
  { slug: 'multi-factor-authentication-and-conditional-access', label: 'MFA & Conditional Access' },
  { slug: 'azure-rbac', label: 'RBAC' },
  { slug: 'azure-policy-and-resource-locks', label: 'Azure Policy & Resource Locks' },
  { slug: 'azure-monitor-and-service-health', label: 'Azure Monitor & Service Health' },
  { slug: 'azure-management-tools-and-arm', label: 'Management Tools & ARM' },
  { slug: 'compliance-purview-and-trust', label: 'Compliance, Purview & Trust' },
  { slug: 'azure-advisor-recommendations', label: 'Azure Advisor' },
]

function QuizHubPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { topic: preselectedTopic } = Route.useSearch()

  const [selectedTopic, setSelectedTopic] = useState(preselectedTopic ?? 'all')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed')
  const [count, setCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const language = (profile?.language ?? 'en')

  const handleGenerate = async () => {
    setError(null)
    setIsGenerating(true)
    try {
      const topicLabel = TOPIC_OPTIONS.find((t) => t.slug === selectedTopic)?.label ?? selectedTopic
      const questions = await generateQuiz({
        data: {
          topic: topicLabel,
          topicSlug: selectedTopic,
          difficulty,
          count,
          language,
        },
      })
      // Store in session storage and navigate to player
      sessionStorage.setItem('somopal_quiz', JSON.stringify(questions))
      sessionStorage.setItem('somopal_quiz_topic', topicLabel)
      await navigate({ to: '/app/quiz/$quizId', params: { quizId: 'active' } })
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : ''
      const friendlyMsg = rawMsg.includes('GEMINI_API_KEY') || !rawMsg
        ? 'Unable to generate quiz questions right now. Please try again in a moment.'
        : rawMsg
      setError(friendlyMsg)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow">
          <CheckSquare className="h-5 w-5 text-amber-100" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">AZ-900 Quiz Center</h1>
          <p className="text-xs text-[var(--text-muted)]">
            AI-generated questions grounded in study notes
          </p>
        </div>
      </div>

      {/* Config Card */}
      <div className="card-glass space-y-6 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Configure Your Quiz</h2>

        {/* Topic */}
        <div className="space-y-2">
          <label htmlFor="quiz-topic" className="block text-sm font-semibold text-[var(--text-main)]">
            Topic
          </label>
          <select
            id="quiz-topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-main)] focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            {TOPIC_OPTIONS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--text-main)]">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {(['easy', 'medium', 'hard', 'mixed'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${
                  difficulty === d
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-amber-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label htmlFor="quiz-count" className="block text-sm font-semibold text-[var(--text-main)]">
            Number of Questions: <span className="text-amber-600 dark:text-amber-400">{count}</span>
          </label>
          <input
            id="quiz-count"
            type="range"
            min={3}
            max={15}
            step={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>3 (quick)</span>
            <span>15 (full)</span>
          </div>
        </div>


        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 dark:border-red-700 dark:bg-red-950/40">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="text-xs text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <button
          id="quiz-generate-btn"
          onClick={() => void handleGenerate()}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-600 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating {count} questions…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Quiz
            </>
          )}
        </button>
      </div>

      {/* Browse topics link */}
      <Link
        to="/app/topics"
        className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-3 text-xs font-semibold text-[var(--text-muted)] transition hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400"
      >
        Browse all 31 study topics
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
