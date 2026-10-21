// Shared types for quiz feature
export interface QuizQuestion {
  stem: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
  optionExplanations: [string, string, string, string]
  difficulty: 'easy' | 'medium' | 'hard'
  topicSlug: string
}
