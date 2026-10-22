// Internationalization (i18n) helper for SomoPal: English & Kiswahili
import { useAuth } from './auth-context.tsx'

export type Language = 'en' | 'sw'

export const TRANSLATIONS = {
  // Navigation
  'nav.home': { en: 'Home', sw: 'Nyumbani' },
  'nav.about': { en: 'About SomoPal', sw: 'Kuhusu SomoPal' },
  'nav.dashboard': { en: 'Dashboard', sw: 'Dashibodi' },
  'nav.buddy': { en: 'Study Buddy', sw: 'Msaidizi Baraza' },
  'nav.topics': { en: 'Topics', sw: 'Mada za Masomo' },
  'nav.quiz': { en: 'Practice Quizzes', sw: 'Mazoezi ya Maswali' },
  'nav.readiness': { en: 'Readiness', sw: 'Kipimo cha Utayari' },
  'nav.history': { en: 'History', sw: 'Historia Yangu' },
  'nav.settings': { en: 'Settings', sw: 'Mipangilio' },
  'nav.signin': { en: 'Sign in', sw: 'Ingia' },
  'nav.signout': { en: 'Sign out', sw: 'Toka' },
  'nav.signed_in': { en: 'Signed in account', sw: 'Akaunti uliyoingia' },
  'nav.signin_create': { en: 'Sign in / Create Account', sw: 'Ingia / Fungua Akaunti' },

  // Home Landing Page
  'home.hero_badge': {
    en: 'AI Study Buddy & Readiness Tracker for African Learners',
    sw: 'Msaidizi wa AI na Kipimo cha Utayari kwa Wanafunzi wa Afrika',
  },
  'home.hero_title_prefix': { en: 'Pass the', sw: 'Faulu Mtihani wa' },
  'home.hero_title_highlight': { en: 'AZ-900 Azure', sw: 'AZ-900 Azure' },
  'home.hero_title_suffix': {
    en: 'Exam with Relatable Everyday Analogies.',
    sw: 'kwa Mifano Halisi ya Kila Siku.',
  },
  'home.hero_desc': {
    en: 'Say goodbye to dry technical jargon. Master cloud concepts through Nairobi matatus, M-Pesa float, SACCO governance, and prepaid KPLC tokens. Grounded notes, original practice quizzes, and an actionable readiness score.',
    sw: 'Sahau maelezo magumu ya kiufundi. Elewa dhana za wingu kupitia mifano ya matatu za Nairobi, mtaji wa M-Pesa, uongozi wa SACCO, na tokeni za KPLC. Muhtasari uliothibitishwa, maswali halisi, na alama sahihi za utayari.',
  },
  'home.welcome_back': { en: 'Welcome back,', sw: 'Karibu tena,' },
  'home.continue_dash': { en: 'Open Study Dashboard', sw: 'Fungua Dashibodi ya Masomo' },
  'home.ask_buddy': { en: 'Ask Study Buddy', sw: 'Uliza Msaidizi Baraza' },
  'home.take_quiz': { en: 'Practice Quiz', sw: 'Fanya Mazoezi ya Maswali' },
  'home.try_guest': { en: 'Try as Guest (Instant Access)', sw: 'Anza kama Mgeni (Bila Kujisajili)' },
  'home.sign_in': { en: 'Sign In / Register', sw: 'Ingia / Jisajili' },
  'home.no_cc': { en: '100% Free · No credit card', sw: '100% Bure · Hakuna kadi' },
  'home.original_q': { en: '100% Original questions', sw: 'Maswali 100% Halisi' },
  'home.bilingual': { en: 'English & Kiswahili', sw: 'Kiingereza na Kiswahili' },
  'home.active_session': { en: 'Active Study Session', sw: 'Kipindi cha Masomo Kimewashwa' },

  // Dashboard
  'dash.guest': { en: 'Guest Mode', sw: 'Hali ya Mgeni' },
  'dash.days_to_exam': { en: 'days to exam', sw: 'siku zimesalia mtihani' },
  'dash.set_exam_date': { en: 'Set exam target date', sw: 'Weka tarehe ya mtihani' },
  'dash.welcome_morning': { en: 'Good Morning', sw: 'Habari za Asubuhi' },
  'dash.welcome_afternoon': { en: 'Good Afternoon', sw: 'Habari za Mchana' },
  'dash.welcome_evening': { en: 'Good Evening', sw: 'Habari za Jioni' },
  'dash.welcome_night': { en: 'Late Night Study', sw: 'Habari za Usiku' },

  'dash.card1.step': { en: '1. EXPLAIN', sw: '1. MAELEZO' },
  'dash.card1.title': { en: 'Ask Buddy Baraza', sw: 'Uliza Msaidizi Baraza' },
  'dash.card1.desc': {
    en: 'Grounded AI answers structured with African everyday analogies and exam definitions.',
    sw: 'Majibu ya AI yaliyothibitishwa kwa mifano halisi ya Kiafrika na maana sahihi za mtihani.',
  },
  'dash.card1.cta': { en: 'Start studying', sw: 'Anza kujifunza' },

  'dash.card2.step': { en: '2. PRACTICE', sw: '2. MAZOEZI' },
  'dash.card2.title': { en: 'Practice Quizzes', sw: 'Mazoezi ya Maswali' },
  'dash.card2.desc': {
    en: 'Test yourself with realistic AZ-900 questions grounded strictly in official Azure topics.',
    sw: 'Pima uelewa wako kwa maswali halisi ya AZ-900 yaliyotungwa moja kwa moja kutoka mada za Azure.',
  },
  'dash.card2.cta': { en: 'Take a quiz', sw: 'Fanya jaribio' },

  'dash.card3.step': { en: '3. TRACK', sw: '3. UTAYARI' },
  'dash.card3.title': { en: 'Readiness Tracker', sw: 'Kipimo cha Utayari' },
  'dash.card3.desc': {
    en: 'Dynamic weighted scoring across all 3 exam domains to know when you are ready to pass.',
    sw: 'Alama za upimaji katika nyanja zote 3 za mtihani ili ujue lini uko tayari kufaulu.',
  },
  'dash.card3.cta': { en: 'Check readiness', sw: 'Angalia utayari wako' },

  'dash.card_topics.title': { en: 'Topic Catalog', sw: 'Orodha ya Mada za AZ-900' },
  'dash.card_topics.desc': {
    en: 'Browse all 31 AZ-900 exam topics and grounded study notes',
    sw: 'Tazama mada zote 31 za mtihani wa AZ-900 na muhtasari wake',
  },
  'dash.card_settings.title': { en: 'Preferences & Demo Mode', sw: 'Mipangilio na Hali ya Mfano' },
  'dash.card_settings.desc': {
    en: 'Toggle Swahili, set your exam date, or load sample progress',
    sw: 'Badilisha Kiswahili, weka tarehe ya mtihani, au weka data ya mfano',
  },

  // Buddy
  'buddy.title': { en: 'Baraza Study Buddy', sw: 'Msaidizi wa Masomo Baraza' },
  'buddy.subtitle': {
    en: 'Grounded answers · African analogies · AZ-900 focused',
    sw: 'Majibu sahihi · Mifano ya Kiafrika · Lengo la AZ-900',
  },
  'buddy.new_chat': { en: 'New chat', sw: 'Mazungumzo mapya' },
  'buddy.welcome.title': {
    en: 'Habari! I am Baraza, your AZ-900 study buddy.',
    sw: 'Habari! Mimi ni Baraza, msaidizi wako wa masomo ya AZ-900.',
  },
  'buddy.welcome.desc': {
    en: "Ask me anything about Azure Fundamentals. I'll explain with African everyday analogies and ground every answer in study notes.",
    sw: 'Niulize chochote kuhusu Azure Fundamentals. Nitakueleza kwa mifano ya kila siku ya Kiafrika na maelezo yaliyothibitishwa.',
  },
  'buddy.placeholder': {
    en: 'Ask anything about Azure Fundamentals…',
    sw: 'Uliza swali lolote kuhusu AZ-900…',
  },
  'buddy.thinking': { en: 'Thinking…', sw: 'Inafikiri…' },
  'buddy.copy': { en: 'Copy', sw: 'Nakili' },
  'buddy.copied': { en: 'Copied', sw: 'Imenakiliwa' },
  'buddy.topics': { en: 'Topics:', sw: 'Mada husika:' },
  'buddy.starters_title': {
    en: 'Try asking one of these to get started:',
    sw: 'Jaribu kuuliza mojawapo ya maswali haya:',
  },
  'buddy.section.simple': { en: 'Simple Definition', sw: 'Dhana Rahisi' },
  'buddy.section.analogy': { en: 'African Everyday Analogy', sw: 'Mfano Halisi wa Kiafrika' },
  'buddy.section.exam': { en: 'AZ-900 Exam Definition', sw: 'Ufafanuzi Rasmi wa Mtihani' },
  'buddy.section.watchout': { en: 'Watch Out (Exam Trap)', sw: 'Tahadhari Muhimu ya Mtihani' },

  // Quiz Hub
  'quiz.title': { en: 'AZ-900 Quiz Center', sw: 'Kituo cha Maswali ya AZ-900' },
  'quiz.subtitle': {
    en: 'AI-generated questions grounded in study notes',
    sw: 'Maswali ya AI yaliyothibitishwa kutoka muhtasari wa masomo',
  },
  'quiz.configure': { en: 'Configure Your Quiz', sw: 'Sanidi Jaribio Lako' },
  'quiz.topic': { en: 'Topic', sw: 'Chagua Mada' },
  'quiz.difficulty': { en: 'Difficulty', sw: 'Kiwango cha Ugumu' },
  'quiz.diff.easy': { en: 'Easy', sw: 'Rahisi' },
  'quiz.diff.medium': { en: 'Medium', sw: 'Wastani' },
  'quiz.diff.hard': { en: 'Hard', sw: 'Ngumu' },
  'quiz.diff.mixed': { en: 'Mixed', sw: 'Mchanganyiko' },
  'quiz.count': { en: 'Number of Questions:', sw: 'Idadi ya Maswali:' },
  'quiz.generate': { en: 'Generate Quiz', sw: 'Tengeneza Maswali' },
  'quiz.generating': { en: 'Generating questions…', sw: 'Inatengeneza maswali…' },
  'quiz.browse_topics': {
    en: 'Browse all 31 study topics',
    sw: 'Tazama mada zote 31 za masomo',
  },

  // Quiz Player
  'player.check': { en: 'Check Answer', sw: 'Kagua Jibu' },
  'player.next': { en: 'Next Question', sw: 'Swali Linalofuata' },
  'player.finish': { en: 'See Results', sw: 'Tazama Matokeo' },
  'player.skip': { en: 'Skip', sw: 'Ruka' },
  'player.select_hint': {
    en: 'Select an answer to continue',
    sw: 'Chagua jibu ili kuendelea',
  },
  'player.why_each': { en: 'Why each option?', sw: 'Kwanini kila chaguo?' },
  'player.explanation': { en: '💡 Overall explanation', sw: '💡 Maelezo ya kina ya dhana hii' },
  'player.answered_so_far': {
    en: 'answered so far',
    sw: 'yamejibiwa kufikia sasa',
  },

  // Quiz Results
  'results.title': { en: 'Quiz Summary', sw: 'Muhtasari wa Matokeo' },
  'results.passed': {
    en: 'Passing Score Achieved (Target: 70%)',
    sw: 'Umefaulu Kiwango cha AZ-900 (Lengo: 70%)',
  },
  'results.below_target': {
    en: 'Below Target (Target: 70% to Pass)',
    sw: 'Bado Chini ya Lengo (Lengo: 70% Kufaulu)',
  },
  'results.correct': { en: 'Correct', sw: 'Sahihi' },
  'results.incorrect': { en: 'Incorrect', sw: 'Umekosa' },
  'results.skipped': { en: 'Skipped', sw: 'Umeruka' },
  'results.retry': { en: 'Retry This Quiz', sw: 'Rudia Jaribio Hili' },
  'results.copy_summary': { en: 'Copy Summary', sw: 'Nakili Muhtasari' },
  'results.new_quiz': { en: 'Configure New Quiz', sw: 'Sanidi Jaribio Jipya' },
  'results.discuss_buddy': { en: 'Discuss with Study Buddy', sw: 'Jadili na Baraza' },
  'results.review_title': { en: 'Detailed Question Review', sw: 'Mapitio ya Kina ya Maswali' },
  'results.filter_all': { en: 'All', sw: 'Yote' },
  'results.filter_missed': { en: 'Missed', sw: 'Uliyokosa' },
  'results.filter_correct': { en: 'Correct', sw: 'Sahihi' },
  'results.study_notes': { en: 'Review Study Notes', sw: 'Soma Muhtasari wa Mada' },

  // Readiness
  'ready.title': { en: 'AZ-900 Readiness Tracker', sw: 'Kipimo cha Utayari wa AZ-900' },
  'ready.subtitle': {
    en: 'Calculated across all 3 domains with recency weighting and topic coverage',
    sw: 'Hukadiriwa katika nyanja zote 3 kwa kuzingatia uzito wa majibu ya hivi karibuni na mada zote',
  },
  'ready.overall': { en: 'Overall Readiness', sw: 'Utayari wa Jumla' },
  'ready.target': { en: '70% Passing Target', sw: 'Lengo la Kufaulu: 70%' },
  'ready.weak_topics': { en: 'Priority Topics to Review', sw: 'Mada za Kutilia Mkazo' },
  'ready.load_demo': { en: 'Load Sample Progress', sw: 'Weka Data ya Mfano' },
  'ready.reset': { en: 'Reset Progress', sw: 'Futa Data ya Utayari' },

  // Topics
  'topics.title': { en: 'AZ-900 Topic Catalog', sw: 'Orodha ya Mada za AZ-900' },
  'topics.search': { en: 'Search topics…', sw: 'Tafuta mada…' },
  'topics.topics_count': { en: 'topics across 3 exam domains', sw: 'mada katika nyanja 3 za mtihani' },

  // Settings
  'settings.title': { en: 'Preferences & Settings', sw: 'Mipangilio na Mapendeleo' },
  'settings.subtitle': {
    en: 'Customize your language, exam target date, and study profile',
    sw: 'Binafsisha lugha yako, tarehe ya mtihani, na wasifu wako',
  },
  'settings.name': { en: 'Learner Name', sw: 'Jina la Mwanafunzi' },
  'settings.lang_pref': { en: 'Study Language Preference', sw: 'Mapendeleo ya Lugha ya Masomo' },
  'settings.lang_en': { en: 'English (Default)', sw: 'Kiingereza (English - Chaguo-msingi)' },
  'settings.lang_en_sub': { en: 'Official exam terminology', sw: 'Istilahi rasmi za mtihani' },
  'settings.lang_sw': { en: 'Kiswahili', sw: 'Kiswahili' },
  'settings.lang_sw_sub': { en: 'Swahili explanations with African analogies', sw: 'Maelezo ya Kiswahili na mifano ya Kiafrika' },
  'settings.exam_date': { en: 'Exam Target Date', sw: 'Tarehe ya Mtihani' },
  'settings.exam_date_sub': {
    en: 'Sets your countdown timer and calculates how many topics to cover each day.',
    sw: 'Huweka kipima muda na kukadiria mada ngapi za kusoma kila siku.',
  },
  'settings.save': { en: 'Save Preferences', sw: 'Hifadhi Mipangilio' },
  'settings.saved': { en: 'Preferences saved!', sw: 'Mipangilio imehifadhiwa!' },
  'settings.demo_title': { en: 'Demo Mode & Progress Data', sw: 'Hali ya Mfano na Data ya Maendeleo' },
  'settings.demo_desc': {
    en: 'Populate realistic sample quiz attempts across all 3 domains to explore the readiness charts, mastery rings, and study recommendations.',
    sw: 'Jaza majaribio ya mfano katika nyanja zote 3 ili kuona grafu za utayari, pete za ufaulu, na mapendekezo ya masomo.',
  },
  'settings.demo_load': { en: 'Load Sample Progress', sw: 'Weka Data ya Mfano' },
  'settings.demo_reset': { en: 'Reset Progress', sw: 'Futa Data ya Utayari' },
  'settings.account': { en: 'Account Status', sw: 'Hali ya Akaunti' },

  // History
  'history.title': { en: 'My Study History', sw: 'Historia Yangu ya Masomo' },
  'history.subtitle': {
    en: 'Review your past study buddy conversations and completed practice quizzes',
    sw: 'Tazama mazungumzo yako ya awali na msaidizi Baraza na matokeo ya majaribio uliyofanya',
  },
  'history.tab_chats': { en: 'Chat Conversations', sw: 'Mazungumzo na Baraza' },
  'history.tab_quizzes': { en: 'Quiz Results', sw: 'Matokeo ya Majaribio' },
  'history.empty_chats': { en: 'No chat sessions found yet.', sw: 'Bado hakuna mazungumzo yaliyorekodiwa.' },
  'history.empty_quizzes': { en: 'No quiz attempts recorded yet.', sw: 'Bado hakuna majaribio yaliyorekodiwa.' },
  'history.no_chats': { en: 'No chat sessions yet', sw: 'Bado hakuna mazungumzo' },
  'history.no_chats_hint': {
    en: 'Start a conversation with your Study Buddy and it will appear here.',
    sw: 'Anza mazungumzo na Baraza na yataonekana hapa.',
  },
  'history.open_buddy': { en: 'Open Study Buddy', sw: 'Fungua Msaidizi Baraza' },
  'history.no_quizzes': { en: 'No quizzes completed yet', sw: 'Bado hujafanya jaribio lolote' },
  'history.no_quizzes_hint': {
    en: 'Complete a practice quiz and your score will be saved here automatically.',
    sw: 'Fanya jaribio la mazoezi na alama yako itahifadhiwa hapa kiotomatiki.',
  },
  'history.take_quiz': { en: 'Take a Quiz', sw: 'Fanya Jaribio' },
  'history.study_topic': { en: 'Study this topic', sw: 'Soma mada hii' },
} as const

export type TranslationKey = keyof typeof TRANSLATIONS

export function useTranslation() {
  const { profile } = useAuth()
  const language: Language = profile?.language === 'sw' ? 'sw' : 'en'

  const t = (key: TranslationKey): string => {
    const entry = TRANSLATIONS[key]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!entry) return key
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return entry[language] ?? entry['en']
  }

  return { t, language }
}
