// Connection and API Key Diagnostic Script (Zero extra dependencies)
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

// Simple env parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }
}

loadEnv()

async function checkConnections() {
  console.log('========================================================')
  console.log('🔍 SOMOPAL CONNECTION & API KEY DIAGNOSTIC')
  console.log('========================================================\n')

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const geminiApiKey = process.env.GEMINI_API_KEY || ''

  console.log('📋 Environment Configuration Check:')
  console.log(`- SUPABASE_URL: ${supabaseUrl ? `✓ Set (${supabaseUrl})` : '❌ Missing'}`)
  console.log(`- SUPABASE_ANON_KEY: ${supabaseAnonKey ? `✓ Set (length: ${supabaseAnonKey.length})` : '❌ Missing'}`)
  console.log(`- SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? `✓ Set (length: ${supabaseServiceRoleKey.length})` : '⚠️ Not set'}`)
  console.log(`- GEMINI_API_KEY: ${geminiApiKey ? `✓ Set (length: ${geminiApiKey.length})` : '❌ Missing'}\n`)

  // 1. Check Supabase
  console.log('--- [1/2] Testing Supabase Connection ---')
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Skipping Supabase check: SUPABASE_URL or SUPABASE_ANON_KEY missing.\n')
  } else {
    try {
      console.log('Connecting to Supabase via Anon Client...')
      const anonClient = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: domainsData, error: domainsError } = await anonClient
        .from('domains')
        .select('id, slug, title')
        .limit(5)

      if (domainsError) {
        console.log(`⚠️ Anon Client table query: ${domainsError.message} (code: ${domainsError.code})`)
      } else {
        console.log(`✅ Supabase Anon Client connected successfully!`)
        console.log(`   Found ${domainsData.length} domains in 'domains' table.`)
      }

      // Test Service Role if available
      if (supabaseServiceRoleKey) {
        console.log('Connecting to Supabase via Service Role Admin Client...')
        const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)
        const { error: adminError } = await adminClient
          .from('domains')
          .select('id, slug')
          .limit(1)

        if (adminError) {
          console.log(`⚠️ Admin Client query error: ${adminError.message}`)
        } else {
          console.log(`✅ Supabase Service Role Client connected successfully!`)
        }

        // Check tables status
        const tables = ['profiles', 'domains', 'topics', 'content_chunks', 'chat_sessions', 'chat_messages', 'quizzes', 'quiz_questions', 'quiz_answers', 'usage_limits']
        console.log('\n📊 Database Tables Status:')
        for (const t of tables) {
          const { count, error } = await adminClient.from(t).select('*', { count: 'exact', head: true })
          if (error) {
            console.log(`   - ${t}: ❌ Table not found (${error.message})`)
          } else {
            console.log(`   - ${t}: ✅ Exists (${count ?? 0} rows)`)
          }
        }
      }
      console.log('✅ Supabase connectivity check completed.\n')
    } catch (err: unknown) {
      console.log(`❌ Supabase connection failed: ${err instanceof Error ? err.message : String(err)}\n`)
    }
  }

  // 2. Check Gemini API Key
  console.log('--- [2/2] Testing Gemini API Key ---')
  if (!geminiApiKey) {
    console.log('❌ Skipping Gemini check: GEMINI_API_KEY missing.\n')
  } else {
    try {
      const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
      console.log(`Testing Gemini API Key with models endpoint...`)

      // Test with fetch to Google Generative Language REST API directly to diagnose raw response
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
      const res = await fetch(url)
      const data = await res.json() as { error?: { message: string; status: string }; models?: unknown[] }

      if (!res.ok || data.error) {
        console.log(`❌ Gemini API Key validation failed:`)
        console.log(`   HTTP Status: ${res.status} ${res.statusText}`)
        console.log(`   API Message: ${data.error?.message ?? JSON.stringify(data)}`)
      } else {
        console.log(`✅ Gemini API Key is VALID and ACTIVE!`)
        console.log(`   Available models retrieved: ${data.models?.length ?? 0}`)

        // Test lightweight generateContent
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`
        const genRes = await fetch(genUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with exactly: "SomoPal Ready"' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        })

        const genData = await genRes.json() as {
          candidates?: { content?: { parts?: { text?: string }[] } }[]
          error?: { message: string }
        }

        if (genRes.ok && genData.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.log(`✅ Live text generation verified with ${geminiModel}: "${genData.candidates[0].content.parts[0].text.trim()}"`)
        } else if (genData.error) {
          console.log(`⚠️ Model ${geminiModel} test: ${genData.error.message}`)
        }
      }
      console.log('✅ Gemini API check completed.\n')
    } catch (err: unknown) {
      console.log(`❌ Gemini API call failed: ${err instanceof Error ? err.message : String(err)}\n`)
    }
  }

  console.log('========================================================')
  console.log('🏁 DIAGNOSTIC COMPLETE')
  console.log('========================================================')
}

checkConnections().catch(console.error)
