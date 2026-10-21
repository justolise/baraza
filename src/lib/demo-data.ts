import type { AnswerRecord } from './readiness.ts'

export const STORAGE_HISTORY_KEY = 'somopal_answer_history'

/**
 * Generates a realistic set of practice quiz answers across all 3 domains.
 * Creates an authentic ~68-74% readiness profile with strong areas and actionable weak areas.
 */
export function generateSampleProgress(): AnswerRecord[] {
  const records: AnswerRecord[] = []
  const now = Date.now()

  // Helper to push answers with realistic timestamps over the last 14 days
  const addAttempts = (
    topicSlug: string,
    total: number,
    correctCount: number,
    daysAgo: number
  ) => {
    for (let i = 0; i < total; i++) {
      const isCorrect = i < correctCount
      const timeOffset = (daysAgo * 86400000) + (i * 120000)
      records.push({
        topicSlug,
        isCorrect,
        answeredAt: new Date(now - timeOffset).toISOString(),
      })
    }
  }

  // 1. Cloud Concepts (Solid foundation ~80% mastery in most)
  addAttempts('shared-responsibility-model', 6, 6, 5) // 100%
  addAttempts('cloud-models-public-private-hybrid', 6, 5, 4) // ~83%
  addAttempts('cloud-service-types-iaas-paas-saas', 6, 6, 3) // 100%
  addAttempts('cloud-economics-capex-vs-opex', 5, 4, 3) // ~80%
  addAttempts('cloud-benefits-high-availability-fault-tolerance', 4, 3, 2)
  addAttempts('cloud-benefits-scalability-elasticity', 4, 2, 2) // ~50%
  addAttempts('cloud-benefits-predictability-and-manageability', 3, 1, 1) // ~33% (weak area)

  // 2. Azure Architecture (Moderate foundation ~65%)
  addAttempts('regions-and-availability-zones', 6, 5, 6)
  addAttempts('sovereign-regions', 5, 4, 5)
  addAttempts('resource-hierarchy-and-management', 6, 4, 4)
  addAttempts('azure-virtual-machines-and-scale-sets', 6, 5, 3)
  addAttempts('azure-app-services-and-functions', 5, 4, 3)
  addAttempts('azure-containers-and-aks', 4, 2, 2) // ~50%
  addAttempts('azure-networking-vnets-subnets', 5, 2, 2) // ~40% (weak area)
  addAttempts('azure-storage-types-and-access-tiers', 6, 5, 2)
  addAttempts('azure-storage-redundancy', 4, 2, 1) // ~50%
  addAttempts('azure-database-services', 3, 1, 1) // weak area

  // 3. Azure Management & Governance (Developing ~55%)
  addAttempts('pricing-calculator-and-tco', 5, 4, 4)
  addAttempts('cost-management-and-budgets', 4, 3, 3)
  addAttempts('identity-and-entra-id', 6, 5, 3)
  addAttempts('azure-rbac', 5, 4, 2)
  addAttempts('azure-policy-and-resource-locks', 4, 2, 2)
  addAttempts('compliance-purview-and-trust', 3, 1, 1) // weak area

  return records
}

/**
 * Loads current answer history from localStorage.
 */
export function loadAnswerHistory(): AnswerRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AnswerRecord[]
  } catch {
    return []
  }
}

/**
 * Saves answer history to localStorage.
 */
export function saveAnswerHistory(records: AnswerRecord[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(records))
  } catch {
    // quota exceeded or storage disabled
  }
}

/**
 * Clears demo/local progress.
 */
export function clearAnswerHistory(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_HISTORY_KEY)
    sessionStorage.removeItem('somopal_quiz_answers')
    sessionStorage.removeItem('somopal_quiz')
  } catch {}
}
