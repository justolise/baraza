// History persistence helpers — save/load chat and quiz history to Supabase
// Only runs for authenticated (non-guest) users; guests use local state only.
import { getSupabaseClient } from './supabase.ts'

// ─── Chat ────────────────────────────────────────────────────────────────────

/** Creates a new chat_session row and returns its id */
export async function createChatSession(userId: string, title: string): Promise<string | null> {
  const { data, error } = await getSupabaseClient()
    .from('chat_sessions')
    .insert({ user_id: userId, title: title.slice(0, 120) })
    .select('id')
    .single()
  if (error) { console.error('createChatSession:', error.message); return null }
  return data.id as string
}

/** Appends a message row to an existing session */
export async function saveChatMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
) {
  const { error } = await getSupabaseClient()
    .from('chat_messages')
    .insert({ session_id: sessionId, user_id: userId, role, content })
  if (error) console.error('saveChatMessage:', error.message)
}

/** Loads all sessions for a user, newest first */
export async function loadChatSessions(userId: string) {
  const { data, error } = await getSupabaseClient()
    .from('chat_sessions')
    .select('id, title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) { console.error('loadChatSessions:', error.message); return [] }
  return data as { id: string; title: string; created_at: string }[]
}

/** Loads all messages for a single session */
export async function loadChatMessages(sessionId: string) {
  const { data, error } = await getSupabaseClient()
    .from('chat_messages')
    .select('id, role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) { console.error('loadChatMessages:', error.message); return [] }
  return data as { id: string; role: 'user' | 'assistant'; content: string; created_at: string }[]
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizSavePayload {
  userId: string
  topicLabel: string
  questions: {
    stem: string
    options: string[]
    correctIndex: number
    explanation: string
    optionExplanations: string[]
    difficulty: string
    topicSlug: string
  }[]
  answers: ({ selectedIndex: number; isCorrect: boolean; revealed: boolean } | null)[]
}

/** Persists a completed quiz run and returns the quiz row id */
export async function saveQuizRun(payload: QuizSavePayload): Promise<string | null> {
  const supabase = getSupabaseClient()

  // 1. Insert quiz header
  const { data: quiz, error: qErr } = await supabase
    .from('quizzes')
    .insert({
      user_id: payload.userId,
      mode: 'practice',
      length: payload.questions.length,
    })
    .select('id')
    .single()
  if (qErr) { console.error('saveQuizRun quiz:', qErr.message); return null }
  const quizId = quiz.id as string

  // 2. Insert questions
  const questionRows = payload.questions.map((q) => ({
    quiz_id: quizId,
    stem: q.stem,
    options: q.options,
    correct_index: q.correctIndex,
    explanation: q.explanation,
    option_explanations: q.optionExplanations,
    difficulty: q.difficulty || 'medium',
    language: 'en',
  }))
  const { data: insertedQs, error: qqErr } = await supabase
    .from('quiz_questions')
    .insert(questionRows)
    .select('id')
  if (qqErr) { console.error('saveQuizRun questions:', qqErr.message); return quizId }

  // 3. Insert answers for revealed questions
  const answerRows = payload.answers
    .map((a, i) => ({ answer: a, questionId: insertedQs[i]?.id }))
    .filter(({ answer, questionId }) => answer?.revealed && questionId)
    .map(({ answer, questionId }) => ({
      question_id: questionId as string,
      user_id: payload.userId,
      selected_index: answer!.selectedIndex,
      is_correct: answer!.isCorrect,
    }))

  if (answerRows.length > 0) {
    const { error: aErr } = await supabase.from('quiz_answers').insert(answerRows)
    if (aErr) console.error('saveQuizRun answers:', aErr.message)
  }

  return quizId
}

export interface QuizRunSummary {
  id: string
  created_at: string
  length: number
  correct: number
  total: number
  questions: {
    id: string
    stem: string
    difficulty: string
    explanation: string
    correct_index: number
    options: string[]
    option_explanations: string[]
    topic_slug: string
    answers: { selected_index: number; is_correct: boolean }[]
  }[]
}

/** Loads all quiz runs for a user with scores, newest first */
export async function loadQuizHistory(userId: string): Promise<QuizRunSummary[]> {
  const supabase = getSupabaseClient()

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select(`
      id, created_at, length,
      quiz_questions (
        id, stem, difficulty, explanation, correct_index, options, option_explanations, topic_slug,
        quiz_answers ( selected_index, is_correct )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) { console.error('loadQuizHistory:', error.message); return [] }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (quizzes ?? []).map((q: any) => {
    const questions = (q.quiz_questions ?? []) as QuizRunSummary['questions']
    const answeredQs = questions.filter((qq) => qq.answers.length > 0)
    const correct = answeredQs.filter((qq) => qq.answers[0]?.is_correct).length
    return {
      id: q.id as string,
      created_at: q.created_at as string,
      length: q.length as number,
      correct,
      total: answeredQs.length,
      questions,
    }
  })
}
