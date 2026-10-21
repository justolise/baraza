function getEnv(key: string, defaultValue = ''): string {
  const processVal = typeof process !== 'undefined' ? process.env[key] : undefined
  if (processVal) {
    return processVal
  }
  const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined
  if (metaEnv && typeof metaEnv === 'object') {
    const val = (metaEnv as Record<string, string | undefined>)[key]
    if (val) {
      return val
    }
  }
  return defaultValue
}

const embeddingDim = parseInt(getEnv('EMBEDDING_DIM', '768'), 10)

if (isNaN(embeddingDim) || embeddingDim <= 0) {
  throw new Error(`FATAL: Invalid EMBEDDING_DIM configured (${getEnv('EMBEDDING_DIM')}). Must be a positive integer.`)
}

export const CONFIG = {
  // AI Models
  geminiApiKey: getEnv('GEMINI_API_KEY', ''),
  geminiModel: getEnv('GEMINI_MODEL', 'gemini-2.5-flash'),
  geminiFallbackModel: getEnv('GEMINI_FALLBACK_MODEL', 'gemini-1.5-flash'),
  embeddingModel: getEnv('EMBEDDING_MODEL', 'text-embedding-004'),
  embeddingDim,

  // Retrieval & Rate Limiting
  retrievalThreshold: parseFloat(getEnv('RETRIEVAL_SIMILARITY_THRESHOLD', '0.55')),
  retrievalMatchCount: parseInt(getEnv('RETRIEVAL_MATCH_COUNT', '4'), 10),
  rateLimitDailyMessages: parseInt(getEnv('RATE_LIMIT_DAILY_MESSAGES', '50'), 10),

  // Supabase
  supabaseUrl: getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL', ''),
  supabaseAnonKey: getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY', ''),
  supabaseServiceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY', ''),

  // App Metadata
  appName: 'SomoPal',
  disclaimer: 'Unofficial: not affiliated with or endorsed by Microsoft',
} as const

/**
 * Startup and runtime assertion ensuring that embedding dimensions match EMBEDDING_DIM strictly.
 */
export function assertEmbeddingDimension(vector: number[] | Float32Array): void {
  if (vector.length !== CONFIG.embeddingDim) {
    throw new Error(
      `FATAL: Embedding dimension mismatch! Configured EMBEDDING_DIM is ${CONFIG.embeddingDim}, but received vector of length ${vector.length}.`
    )
  }
}
