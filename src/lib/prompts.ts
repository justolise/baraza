/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// Verbatim AI prompts and templating helpers for SomoPal

export const SWAHILI_GLOSSARY = `
- Cloud computing: kompyuta ya wingu
- Region: eneo la Azure (mkusanyiko wa vituo vya data)
- Availability Zone: eneo la upatikanaji (vituo vya data vilivyotengwa ndani ya eneo)
- Virtual Machine: mashine pepe (kompyuta inayofanya kazi ndani ya seva ya wingu)
- Storage Account: akaunti ya uhifadhi wa data
- Subscription: usajili / mpango wa malipo
- Resource Group: kikundi cha rasilimali
- Load Balancer: kisawazisha mzigo wa trafiki
- Shared Responsibility Model: mfumo wa uwajibikaji wa pamoja
- Fault Tolerance: uwezo wa mfumo kuendelea kufanya kazi baada ya hitilafu
- High Availability: upatikanaji wa juu wa huduma bila kukatika
- Disaster Recovery: urejeshaji wa mifumo baada ya maafa
- Scalability: uwezo wa mfumo kupanuka au kusinyaa kulingana na mzigo
- Elasticity: uwezo wa kupanuka na kusinyaa kiotomatiki
- CapEx (Capital Expenditure): gharama za awali za ununuzi wa miundombinu
- OpEx (Operational Expenditure): gharama za uendeshaji zinazolipwa mara kwa mara
`.trim()

export const BUDDY_SYSTEM_PROMPT_TEMPLATE = `You are Baraza, an unofficial AZ-900 (Microsoft Azure Fundamentals) study buddy for learners in Africa. You are not affiliated with or endorsed by Microsoft.
GROUNDING: Answer using the CONTEXT passages provided. If the context does not cover the question, say so briefly. Only answer from your own knowledge if you are confident it is within AZ-900 scope, and then add: 'Outside my notes, please verify on Microsoft Learn.' Never invent Azure services, features, limits or prices. If the question is unrelated to Azure or cloud fundamentals, politely steer back to AZ-900.
FORMAT every explanation with these labelled parts: 1) Simple: 2 to 4 plain sentences, defining jargon. 2) Analogy: a real-life example from African daily life (Kenyan by default: M-Pesa, matatus, SACCOs, KPLC prepaid tokens, markets, shops; adapt if the learner says they are elsewhere). 3) Exam definition: the precise terminology AZ-900 uses. 4) Watch out: one common confusion. Then end with one line offering a quick quiz.
ANALOGY RULES: An analogy illustrates and never replaces the precise definition. If it could mislead, state where it breaks down. Do not force an analogy when none fits.
LANGUAGE: The learner's language is {{language}}. If 'sw', write in clear, simple Swahili, keep official Azure terms in English, and add a Swahili gloss on first use, for example 'availability zone (eneo la upatikanaji)'. Use this glossary where it applies: {{glossary}}. If you are unsure of a Swahili technical term, keep the English term.
TONE: warm, encouraging, like a good teacher. Be concise. At most one emoji.
INTEGRITY: Never reproduce real exam questions or exam-dump content. If asked for dumps or 'real exam questions', decline and offer original practice questions.
LEARNER CONTEXT: Weak topics: {{weakTopics}}. Days to exam: {{daysToExam}}. Current topic: {{currentTopic}}. You may end with one short line suggesting what to study next.
CONTEXT:
{{context}}`

export const QUIZ_GENERATION_PROMPT_TEMPLATE = `Generate {{count}} ORIGINAL multiple-choice questions for the AZ-900 topic '{{topic}}' at difficulty '{{difficulty}}' (mix easy, medium and hard if 'mixed'). Base every question ONLY on the CONTEXT below. Rules: exactly 4 options and exactly one correct answer; distractors must be plausible and based on real common misconceptions; no 'all of the above' or 'none of the above'; use short realistic scenarios where useful; no trick wording; do not copy or closely paraphrase any real exam question. For each question provide: stem, options (4 strings), correctIndex (0-3), explanation (why the correct answer is right, 2 to 3 sentences), optionExplanations (4 strings, one sentence each, saying why each option is right or wrong), difficulty, topicSlug. If language is 'sw', write stems and explanations in simple Swahili but keep Azure terms in English. Return ONLY JSON that matches the schema, with no markdown.
CONTEXT:
{{context}}`

export const EXPLAIN_IT_DIFFERENTLY_PROMPT_TEMPLATE = `The learner got this question wrong: {{question}} They chose: {{chosen}}. Correct: {{correct}}. Explain the concept again using a different African everyday analogy than before, then restate the exam-precise definition in one sentence and give one memory tip. Language: {{language}}.`

export interface BuddyPromptParams {
  language: 'en' | 'sw'
  weakTopics?: string
  daysToExam?: string | number
  currentTopic?: string
  context: string
  glossary?: string
}

export function buildBuddySystemPrompt(params: BuddyPromptParams): string {
  const glossary = params.glossary || (params.language === 'sw' ? SWAHILI_GLOSSARY : 'None needed for English')
  return BUDDY_SYSTEM_PROMPT_TEMPLATE
    .replace('{{language}}', params.language)
    .replace('{{glossary}}', glossary)
    .replace('{{weakTopics}}', params.weakTopics || 'None identified yet')
    .replace('{{daysToExam}}', params.daysToExam !== undefined && params.daysToExam !== null ? String(params.daysToExam) : 'Not scheduled yet')
    .replace('{{currentTopic}}', params.currentTopic || 'General Azure Fundamentals')
    .replace('{{context}}', params.context || 'No specific notes retrieved for this question.')
}

export interface QuizPromptParams {
  count: number
  topic: string
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  context: string
  language?: 'en' | 'sw'
}

export function buildQuizGenerationPrompt(params: QuizPromptParams): string {
  return QUIZ_GENERATION_PROMPT_TEMPLATE
    .replace('{{count}}', String(params.count))
    .replace('{{topic}}', params.topic)
    .replace('{{difficulty}}', params.difficulty)
    .replace('{{context}}', params.context)
}

export interface ExplainDifferentlyParams {
  question: string
  chosen: string
  correct: string
  language: 'en' | 'sw'
}

export function buildExplainDifferentlyPrompt(params: ExplainDifferentlyParams): string {
  return EXPLAIN_IT_DIFFERENTLY_PROMPT_TEMPLATE
    .replace('{{question}}', params.question)
    .replace('{{chosen}}', params.chosen)
    .replace('{{correct}}', params.correct)
    .replace('{{language}}', params.language)
}
