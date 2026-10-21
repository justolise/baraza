// Seed script to populate domains, topics, and study-note chunks with embeddings
import fs from 'node:fs'
import path from 'node:path'
import { CONFIG } from '../src/lib/config.ts'
import { getEmbedding } from '../src/lib/embeddings.ts'
import { getSupabaseAdminClient } from '../src/lib/supabase.ts'

interface ChunkData {
  title: string
  body: string
  source_note: string
  embedding?: number[]
}

interface TopicData {
  slug: string
  title: string
  summary: string
  key_terms: string[]
  analogy: string
  sort: number
  chunks: ChunkData[]
}

interface DomainData {
  slug: string
  title: string
  weight_pct: number
  sort: number
  topics: TopicData[]
}

interface SeedFile {
  domains: DomainData[]
}

async function runSeed() {
  console.log(`Starting SomoPal AZ-900 database seed...`)
  console.log(`EMBEDDING_DIM configured: ${CONFIG.embeddingDim}`)
  console.log(`EMBEDDING_MODEL configured: ${CONFIG.embeddingModel}`)

  const seedFilePath = path.resolve(process.cwd(), 'src/data/az900-seed.json')
  if (!fs.existsSync(seedFilePath)) {
    throw new Error(`Seed file not found at ${seedFilePath}. Run 'npm run generate-seed' first.`)
  }

  const raw = fs.readFileSync(seedFilePath, 'utf-8')
  const seed: SeedFile = JSON.parse(raw)

  const isSupabaseConfigured = Boolean(
    CONFIG.supabaseUrl &&
    !CONFIG.supabaseUrl.includes('placeholder') &&
    (CONFIG.supabaseServiceRoleKey || CONFIG.supabaseAnonKey)
  )

  const supabase = isSupabaseConfigured ? getSupabaseAdminClient() : null

  let domainCount = 0
  let topicCount = 0
  let chunkCount = 0

  // Precompute embeddings for all chunks and store in embedded cache file
  const embeddedDomains: DomainData[] = []

  for (const domain of seed.domains) {
    domainCount++
    console.log(`\nProcessing Domain [${domain.slug}]: ${domain.title}`)

    let domainId: string | undefined
    if (supabase) {
      const { data: dData, error: dError } = await supabase
        .from('domains')
        .upsert(
          {
            slug: domain.slug,
            title: domain.title,
            weight_pct: domain.weight_pct,
            sort: domain.sort,
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single()

      if (dError) {
        console.error(`Failed to upsert domain ${domain.slug}:`, dError.message)
      } else {
        domainId = dData.id
      }
    }

    const processedTopics: TopicData[] = []

    for (const topic of domain.topics) {
      topicCount++
      console.log(`  Topic [${topic.slug}]: ${topic.title} (${topic.chunks.length} chunks)`)

      let topicId: string | undefined
      if (supabase && domainId) {
        const { data: tData, error: tError } = await supabase
          .from('topics')
          .upsert(
            {
              domain_id: domainId,
              slug: topic.slug,
              title: topic.title,
              summary: topic.summary,
              key_terms: topic.key_terms,
              analogy: topic.analogy,
              sort: topic.sort,
            },
            { onConflict: 'slug' }
          )
          .select('id')
          .single()

        if (tError) {
          console.error(`  Failed to upsert topic ${topic.slug}:`, tError.message)
        } else {
          topicId = tData.id
        }
      }

      const processedChunks: ChunkData[] = []

      for (const chunk of topic.chunks) {
        chunkCount++
        const embedding = await getEmbedding(`${chunk.title}: ${chunk.body}`)

        processedChunks.push({
          ...chunk,
          embedding,
        })

        if (supabase && topicId) {
          const { error: cError } = await supabase.from('content_chunks').insert({
            topic_id: topicId,
            title: chunk.title,
            body: chunk.body,
            embedding,
            source_note: chunk.source_note || 'Draft, needs human review',
          })

          if (cError) {
            console.error(`    Failed to insert chunk "${chunk.title}":`, cError.message)
          }
        }
      }

      processedTopics.push({
        ...topic,
        chunks: processedChunks,
      })
    }

    embeddedDomains.push({
      ...domain,
      topics: processedTopics,
    })
  }

  // Save the pre-embedded dataset for offline/mock fallback and testing
  const embeddedPath = path.resolve(process.cwd(), 'src/data/az900-embedded.json')
  fs.writeFileSync(embeddedPath, JSON.stringify({ domains: embeddedDomains }, null, 2), 'utf-8')
  console.log(`\nSuccessfully cached embedded dataset to: ${embeddedPath}`)

  console.log(`\n========================================`)
  console.log(`Seed Complete:`)
  console.log(`Domains Processed: ${domainCount}`)
  console.log(`Topics Processed: ${topicCount}`)
  console.log(`Chunks with ${CONFIG.embeddingDim}-dim Embeddings: ${chunkCount}`)
  if (isSupabaseConfigured) {
    console.log(`Database Status: Remote Supabase database updated successfully.`)
  } else {
    console.log(`Database Status: Supabase credentials not set in .env; generated local embedded dataset.`)
  }
  console.log(`========================================\n`)
}

runSeed().catch((err) => {
  console.error('Fatal error during seed execution:', err)
  process.exit(1)
})
