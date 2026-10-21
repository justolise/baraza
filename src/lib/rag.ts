// Local RAG retrieval using pre-embedded az900-embedded.json
// Cosine similarity computed in-process — no Supabase needed for retrieval.

import { getEmbedding } from './embeddings.ts'
import { CONFIG } from './config.ts'

export interface Chunk {
  id: string
  topicSlug: string
  topicTitle: string
  domainSlug: string
  title: string
  body: string
  embedding: number[]
}

let _chunks: Chunk[] | null = null

function cosineSim(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

/**
 * Lazily loads the embedded JSON. Works in SSR (Node) and client (browser).
 * In SSR we use a dynamic import; in the browser the bundler inlines it.
 */
async function getChunks(): Promise<Chunk[]> {
  if (_chunks) return _chunks
  // Dynamic import – vite bundles this for client, SSR resolves it via nitro
   
  const raw = await import('../data/az900-embedded.json')
  const data = raw.default as unknown as {
    domains: {
      slug: string
      topics: {
        slug: string
        title: string
        chunks: {
          id: string
          title: string
          body: string
          embedding: number[]
        }[]
      }[]
    }[]
  }

  const chunks: Chunk[] = []
  for (const domain of data.domains) {
    for (const topic of domain.topics) {
      for (const chunk of topic.chunks) {
        chunks.push({
          id: chunk.id,
          topicSlug: topic.slug,
          topicTitle: topic.title,
          domainSlug: domain.slug,
          title: chunk.title,
          body: chunk.body,
          embedding: chunk.embedding,
        })
      }
    }
  }
  _chunks = chunks
  return chunks
}

export interface RetrievedChunk {
  id: string
  topicSlug: string
  topicTitle: string
  domainSlug: string
  title: string
  body: string
  score: number
}

/**
 * Retrieve the top-k most similar content chunks for a query.
 */
export async function retrieveChunks(
  query: string,
  opts: {
    topK?: number
    threshold?: number
    topicSlug?: string
  } = {}
): Promise<RetrievedChunk[]> {
  const {
    topK = CONFIG.retrievalMatchCount,
    threshold = CONFIG.retrievalThreshold,
    topicSlug,
  } = opts

  const queryEmbedding = await getEmbedding(query)
  const chunks = await getChunks()

  const filtered = topicSlug ? chunks.filter((c) => c.topicSlug === topicSlug) : chunks

  const scored = filtered
    .map((c) => ({ ...c, score: cosineSim(queryEmbedding, c.embedding) }))
    .filter((c) => c.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  return scored
}

/**
 * Format retrieved chunks into a context string for the system prompt.
 */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return 'No specific notes retrieved for this query.'
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] Topic: ${c.topicTitle}\n${c.title}\n${c.body}`
    )
    .join('\n\n---\n\n')
}
