// Vector embedding utilities for SomoPal RAG
import { CONFIG, assertEmbeddingDimension } from './config.ts'

/**
 * Generates a deterministic normalized unit vector of length `dim` for a given text string.
 * Used for offline testing, local seeds without API keys, and test suites.
 */
export function generateDeterministicEmbedding(text: string, dim: number = CONFIG.embeddingDim): number[] {
  const vector = new Float32Array(dim)
  let seed = 0
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0
  }

  let sumSq = 0
  for (let i = 0; i < dim; i++) {
    // Linear congruential generator with pseudo-random normal distribution
    seed = (1664525 * seed + 1013904223) >>> 0
    const val = Math.sin((seed / 0xffffffff) * Math.PI * 2) * Math.cos(i * 0.1)
    vector[i] = val
    sumSq += val * val
  }

  // Normalize to unit vector for cosine distance
  const norm = Math.sqrt(sumSq) || 1
  const result: number[] = new Array(dim)
  for (let i = 0; i < dim; i++) {
    result[i] = vector[i] / norm
  }

  assertEmbeddingDimension(result)
  return result
}

/**
 * Computes embedding for text using Google Gemini's embedding model (e.g., text-embedding-004)
 * with explicit outputDimensionality set to CONFIG.embeddingDim.
 * Falls back to deterministic embedding when API key is unavailable or in offline environments.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (CONFIG.geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.embeddingModel}:embedContent?key=${CONFIG.geminiApiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${CONFIG.embeddingModel}`,
          content: {
            parts: [{ text }],
          },
          outputDimensionality: CONFIG.embeddingDim,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const values: number[] = data.embedding?.values
        if (Array.isArray(values) && values.length === CONFIG.embeddingDim) {
          assertEmbeddingDimension(values)
          return values
        }
      } else {
        console.warn(`[getEmbedding] Gemini API returned ${response.status}: ${await response.text()}`)
      }
    } catch (err) {
      console.warn('[getEmbedding] Error connecting to Gemini API, falling back to deterministic embedding:', err)
    }
  }

  return generateDeterministicEmbedding(text, CONFIG.embeddingDim)
}
