// SomoPal Readiness Scoring Engine
// Pure scoring functions calculating recency-weighted topic mastery, domain readiness, and recommendations

export interface AnswerRecord {
  topicSlug: string
  isCorrect: boolean
  answeredAt?: string | Date | number
}

export interface TopicReadiness {
  slug: string
  title: string
  domainSlug: string
  attempts: number
  correctCount: number
  weightedAccuracy: number // 0 to 1
  coverage: number // 0 to 1 (min(1, count / 6))
  mastery: number // 0 to 100 percentage (weightedAccuracy * coverage * 100)
}

export interface DomainReadiness {
  slug: string
  title: string
  weight: number // percentage e.g. 28, 35, 30
  color: string
  topicCount: number
  mastery: number // 0 to 100 percentage
  topics: TopicReadiness[]
}

export type ReadinessLabel = 'Not yet' | 'Getting there' | 'Almost ready' | 'Ready'

export interface ReadinessReport {
  overallScore: number // 0 to 100
  scaledScore: number // 0 to 1000 (AZ-900 style, 700 to pass)
  isPassing: boolean // >= 70% or >= 700
  label: ReadinessLabel
  domains: DomainReadiness[]
  weakestTopics: TopicReadiness[]
  nextRecommendations: {
    topicSlug: string
    title: string
    domainSlug: string
    reason: string
  }[]
  totalQuestionsAnswered: number
  totalCorrect: number
  overallAccuracy: number // 0 to 100
  disclaimer: string
}

export const OFFICIAL_DOMAINS: {
  slug: string
  title: string
  weight: number
  color: string
  topics: { slug: string; title: string }[]
}[] = [
  {
    slug: 'cloud-concepts',
    title: 'Cloud Concepts',
    weight: 28,
    color: 'teal',
    topics: [
      { slug: 'shared-responsibility-model', title: 'Shared Responsibility Model' },
      { slug: 'cloud-models-public-private-hybrid', title: 'Cloud Deployment Models' },
      { slug: 'cloud-benefits-high-availability-fault-tolerance', title: 'High Availability & Fault Tolerance' },
      { slug: 'cloud-benefits-scalability-elasticity', title: 'Scalability & Elasticity' },
      { slug: 'cloud-service-types-iaas-paas-saas', title: 'Cloud Service Models (IaaS / PaaS / SaaS)' },
      { slug: 'cloud-economics-capex-vs-opex', title: 'CapEx vs OpEx & Cloud Economics' },
      { slug: 'cloud-benefits-predictability-and-manageability', title: 'Predictability & Manageability' },
    ],
  },
  {
    slug: 'azure-architecture',
    title: 'Azure Architecture & Services',
    weight: 35,
    color: 'amber',
    topics: [
      { slug: 'regions-and-availability-zones', title: 'Regions & Availability Zones' },
      { slug: 'sovereign-regions', title: 'Sovereign Regions' },
      { slug: 'resource-hierarchy-and-management', title: 'Resource Hierarchy & Management' },
      { slug: 'azure-virtual-machines-and-scale-sets', title: 'Virtual Machines & Scale Sets' },
      { slug: 'azure-app-services-and-functions', title: 'App Services & Azure Functions' },
      { slug: 'azure-containers-and-aks', title: 'Containers & AKS' },
      { slug: 'azure-networking-vnets-subnets', title: 'VNets, Subnets & Peering' },
      { slug: 'azure-vpn-gateway-and-expressroute', title: 'VPN Gateway & ExpressRoute' },
      { slug: 'azure-storage-types-and-access-tiers', title: 'Azure Storage & Access Tiers' },
      { slug: 'azure-storage-redundancy', title: 'Storage Redundancy (LRS, ZRS, GRS)' },
      { slug: 'azure-database-services', title: 'Azure Database Services' },
      { slug: 'azure-virtual-desktop', title: 'Azure Virtual Desktop (AVD)' },
      { slug: 'azure-migration-tools-migrate-databox', title: 'Azure Migrate & Data Box' },
      { slug: 'azure-storage-security-and-tooling', title: 'Storage Security & AzCopy/Storage Explorer' },
    ],
  },
  {
    slug: 'azure-management',
    title: 'Azure Management & Governance',
    weight: 30,
    color: 'indigo',
    topics: [
      { slug: 'pricing-calculator-and-tco', title: 'Pricing & TCO Calculator' },
      { slug: 'cost-management-and-budgets', title: 'Cost Management & Budgets' },
      { slug: 'identity-and-entra-id', title: 'Identity & Microsoft Entra ID' },
      { slug: 'multi-factor-authentication-and-conditional-access', title: 'MFA & Conditional Access' },
      { slug: 'azure-rbac', title: 'Role-Based Access Control (RBAC)' },
      { slug: 'azure-policy-and-resource-locks', title: 'Azure Policy & Resource Locks' },
      { slug: 'azure-monitor-and-service-health', title: 'Azure Monitor & Service Health' },
      { slug: 'azure-management-tools-and-arm', title: 'Management Tools & ARM' },
      { slug: 'compliance-purview-and-trust', title: 'Compliance, Purview & Trust' },
      { slug: 'azure-advisor-recommendations', title: 'Azure Advisor' },
    ],
  },
]

export const READINESS_DISCLAIMER =
  'This is an estimate based on your practice, not an official prediction.'

/**
 * Calculates recency-weighted accuracy for a list of answers.
 * Answers must be chronological (newest answer has index 0 or answers[answers.length - 1] is newest).
 * We assume newest answers are provided first, or we sort if timestamp is available.
 * Recency factor: 0.9^distance from newest.
 */
export function calculateTopicAccuracy(answers: { isCorrect: boolean }[]): {
  weightedAccuracy: number
  coverage: number
  mastery: number
} {
  const n = answers.length
  if (n === 0) {
    return { weightedAccuracy: 0, coverage: 0, mastery: 0 }
  }

  // Weight decreases by 0.9 for each step into the past (0 = newest, n-1 = oldest)
  let totalWeight = 0
  let weightedCorrect = 0

  for (let i = 0; i < n; i++) {
    // Distance from newest: if answers array is [newest, ..., oldest], distance = i
    // If answers array is [oldest, ..., newest], distance = (n - 1) - i
    const weight = Math.pow(0.9, i)
    totalWeight += weight
    if (answers[i]?.isCorrect) {
      weightedCorrect += weight
    }
  }

  const weightedAccuracy = totalWeight > 0 ? weightedCorrect / totalWeight : 0
  const coverage = Math.min(1.0, n / 6)
  const mastery = Math.round(weightedAccuracy * coverage * 100)

  return { weightedAccuracy, coverage, mastery }
}

export function getReadinessLabel(score: number): ReadinessLabel {
  if (score < 50) return 'Not yet'
  if (score < 70) return 'Getting there'
  if (score < 85) return 'Almost ready'
  return 'Ready'
}

/**
 * Main pure scoring function: builds a full readiness report from a list of answers.
 */
export function calculateReadinessReport(answers: AnswerRecord[]): ReadinessReport {
  // Group answers by topic
  const topicAnswerMap = new Map<string, { isCorrect: boolean }[]>()

  // For topics where we have timestamps, sort newest first
  const sortedAnswers = [...answers].sort((a, b) => {
    if (!a.answeredAt || !b.answeredAt) return 0
    const timeA = new Date(a.answeredAt).getTime()
    const timeB = new Date(b.answeredAt).getTime()
    return timeB - timeA // newest first
  })

  let totalQuestionsAnswered = 0
  let totalCorrect = 0

  for (const ans of sortedAnswers) {
    totalQuestionsAnswered++
    if (ans.isCorrect) totalCorrect++

    const list = topicAnswerMap.get(ans.topicSlug) ?? []
    list.push({ isCorrect: ans.isCorrect })
    topicAnswerMap.set(ans.topicSlug, list)
  }

  let weightedDomainScoreSum = 0
  let totalDomainWeight = 0

  const allTopics: TopicReadiness[] = []

  const domains: DomainReadiness[] = OFFICIAL_DOMAINS.map((domain) => {
    const topicReadinessList: TopicReadiness[] = domain.topics.map((t) => {
      const topicAnswers = topicAnswerMap.get(t.slug) ?? []
      const { weightedAccuracy, coverage, mastery } = calculateTopicAccuracy(topicAnswers)
      const correctCount = topicAnswers.filter((a) => a.isCorrect).length

      const topicReadiness: TopicReadiness = {
        slug: t.slug,
        title: t.title,
        domainSlug: domain.slug,
        attempts: topicAnswers.length,
        correctCount,
        weightedAccuracy,
        coverage,
        mastery,
      }
      allTopics.push(topicReadiness)
      return topicReadiness
    })

    // Domain mastery is the average topic mastery in this domain
    const totalTopicMastery = topicReadinessList.reduce((sum, tr) => sum + tr.mastery, 0)
    const domainMastery =
      topicReadinessList.length > 0 ? Math.round(totalTopicMastery / topicReadinessList.length) : 0

    weightedDomainScoreSum += domainMastery * domain.weight
    totalDomainWeight += domain.weight

    return {
      slug: domain.slug,
      title: domain.title,
      weight: domain.weight,
      color: domain.color,
      topicCount: domain.topics.length,
      mastery: domainMastery,
      topics: topicReadinessList,
    }
  })

  const overallScore =
    totalDomainWeight > 0 ? Math.round(weightedDomainScoreSum / totalDomainWeight) : 0
  const scaledScore = Math.round((overallScore / 100) * 1000)
  const isPassing = overallScore >= 70

  // Weakest topics: topics with attempts but lowest mastery, or zero attempts
  const weakestTopics = [...allTopics]
    .sort((a, b) => {
      // Prioritize practiced topics with low mastery first, then unpracticed
      if (a.attempts > 0 && b.attempts > 0) return a.mastery - b.mastery
      if (a.attempts > 0) return -1
      if (b.attempts > 0) return 1
      return 0
    })
    .slice(0, 5)

  // Top 3 next-up recommendations
  const nextRecommendations = allTopics
    .filter((t) => t.mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3)
    .map((t) => ({
      topicSlug: t.slug,
      title: t.title,
      domainSlug: t.domainSlug,
      reason:
        t.attempts === 0
          ? 'Not yet practiced — build foundational coverage'
          : `Mastery is ${t.mastery}% — practice to push past 70% threshold`,
    }))

  const overallAccuracy =
    totalQuestionsAnswered > 0
      ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
      : 0

  return {
    overallScore,
    scaledScore,
    isPassing,
    label: getReadinessLabel(overallScore),
    domains,
    weakestTopics,
    nextRecommendations,
    totalQuestionsAnswered,
    totalCorrect,
    overallAccuracy,
    disclaimer: READINESS_DISCLAIMER,
  }
}
