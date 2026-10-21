import { describe, it, expect } from 'vitest'
import {
  calculateTopicAccuracy,
  calculateReadinessReport,
  getReadinessLabel,
  READINESS_DISCLAIMER,
} from './readiness.ts'

describe('Readiness Scoring Engine', () => {
  describe('calculateTopicAccuracy', () => {
    it('handles empty history', () => {
      const res = calculateTopicAccuracy([])
      expect(res.weightedAccuracy).toBe(0)
      expect(res.coverage).toBe(0)
      expect(res.mastery).toBe(0)
    })

    it('calculates 100% accuracy and coverage correctly for 6 correct answers', () => {
      const answers = Array(6).fill({ isCorrect: true })
      const res = calculateTopicAccuracy(answers)
      expect(res.weightedAccuracy).toBe(1)
      expect(res.coverage).toBe(1)
      expect(res.mastery).toBe(100)
    })

    it('calculates 0% accuracy for all-wrong answers', () => {
      const answers = Array(6).fill({ isCorrect: false })
      const res = calculateTopicAccuracy(answers)
      expect(res.weightedAccuracy).toBe(0)
      expect(res.coverage).toBe(1)
      expect(res.mastery).toBe(0)
    })

    it('applies coverage factor proportional to attempts under 6', () => {
      const res1 = calculateTopicAccuracy([{ isCorrect: true }])
      expect(res1.coverage).toBeCloseTo(1 / 6, 4)
      expect(res1.mastery).toBe(Math.round((1 * (1 / 6)) * 100))

      const res3 = calculateTopicAccuracy([
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true },
      ])
      expect(res3.coverage).toBe(0.5)
      expect(res3.mastery).toBe(50)
    })

    it('caps coverage at 1.0 even with more than 6 attempts', () => {
      const answers = Array(12).fill({ isCorrect: true })
      const res = calculateTopicAccuracy(answers)
      expect(res.coverage).toBe(1)
      expect(res.mastery).toBe(100)
    })

    it('correctly weights recent answers more heavily (recency decay 0.9^i)', () => {
      // Case A: Recent is correct (index 0), older is wrong (index 1)
      // weight 0 = 1.0 (correct), weight 1 = 0.9 (wrong)
      // weightedAccuracy = 1.0 / (1.0 + 0.9) = 1.0 / 1.9 ≈ 0.526
      const recentCorrect = calculateTopicAccuracy([
        { isCorrect: true },
        { isCorrect: false },
      ])

      // Case B: Recent is wrong (index 0), older is correct (index 1)
      // weight 0 = 1.0 (wrong), weight 1 = 0.9 (correct)
      // weightedAccuracy = 0.9 / (1.0 + 0.9) = 0.9 / 1.9 ≈ 0.474
      const recentWrong = calculateTopicAccuracy([
        { isCorrect: false },
        { isCorrect: true },
      ])

      expect(recentCorrect.weightedAccuracy).toBeGreaterThan(recentWrong.weightedAccuracy)
      expect(recentCorrect.weightedAccuracy).toBeCloseTo(1.0 / 1.9, 4)
      expect(recentWrong.weightedAccuracy).toBeCloseTo(0.9 / 1.9, 4)
    })
  })

  describe('getReadinessLabel', () => {
    it('returns correct label bands', () => {
      expect(getReadinessLabel(0)).toBe('Not yet')
      expect(getReadinessLabel(49)).toBe('Not yet')
      expect(getReadinessLabel(50)).toBe('Getting there')
      expect(getReadinessLabel(69)).toBe('Getting there')
      expect(getReadinessLabel(70)).toBe('Almost ready')
      expect(getReadinessLabel(84)).toBe('Almost ready')
      expect(getReadinessLabel(85)).toBe('Ready')
      expect(getReadinessLabel(100)).toBe('Ready')
    })
  })

  describe('calculateReadinessReport', () => {
    it('returns empty baseline report when user has no answers', () => {
      const report = calculateReadinessReport([])
      expect(report.overallScore).toBe(0)
      expect(report.scaledScore).toBe(0)
      expect(report.isPassing).toBe(false)
      expect(report.label).toBe('Not yet')
      expect(report.totalQuestionsAnswered).toBe(0)
      expect(report.domains.length).toBe(3)
      expect(report.nextRecommendations.length).toBe(3)
      expect(report.disclaimer).toBe(READINESS_DISCLAIMER)
    })

    it('calculates domain score and overall weighted score for single topic practice', () => {
      const report = calculateReadinessReport([
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
        { topicSlug: 'shared-responsibility-model', isCorrect: true },
      ])

      expect(report.totalQuestionsAnswered).toBe(6)
      expect(report.totalCorrect).toBe(6)
      expect(report.overallAccuracy).toBe(100)

      // Cloud Concepts has 7 topics. 1 topic has 100% mastery, 6 have 0%.
      // Domain mastery = round(100 / 7) = 14%
      const cloudDomain = report.domains.find((d) => d.slug === 'cloud-concepts')
      expect(cloudDomain).toBeDefined()
      expect(cloudDomain?.mastery).toBe(14)
    })

    it('marks isPassing true when overall score is >= 70', () => {
      // Simulate 6 correct answers across all topics in all domains
      const answers: { topicSlug: string; isCorrect: boolean }[] = []
      const reportEmpty = calculateReadinessReport([])
      for (const domain of reportEmpty.domains) {
        for (const topic of domain.topics) {
          for (let i = 0; i < 6; i++) {
            answers.push({ topicSlug: topic.slug, isCorrect: true })
          }
        }
      }

      const fullReport = calculateReadinessReport(answers)
      expect(fullReport.overallScore).toBe(100)
      expect(fullReport.scaledScore).toBe(1000)
      expect(fullReport.isPassing).toBe(true)
      expect(fullReport.label).toBe('Ready')
    })
  })
})
