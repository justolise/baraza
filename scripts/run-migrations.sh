#!/usr/bin/env bash
set -e

# SomoPal Supabase Migration Runner
# Usage:
#   ./scripts/run-migrations.sh "postgresql://postgres:[YOUR-PASSWORD]@db.ijrxiducurbdkkrbxczc.supabase.co:5432/postgres"
# Or set DATABASE_URL in .env and run:
#   ./scripts/run-migrations.sh

PROJECT_REF="ijrxiducurbdkkrbxczc"

# Load DATABASE_URL from .env if present
if [ -f .env ]; then
  DB_URL_FROM_ENV=$(grep -E '^DATABASE_URL=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi

CONN="${1:-$DB_URL_FROM_ENV}"

if [ -z "$CONN" ]; then
  echo "================================================================="
  echo "🚀 SomoPal Terminal Migration Runner"
  echo "================================================================="
  echo ""
  echo "Please provide your Supabase database connection string or password."
  echo ""
  echo "Usage:"
  echo "  ./scripts/run-migrations.sh \"postgresql://postgres:[YOUR-PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres\""
  echo ""
  echo "Or using connection pooler (port 6543):"
  echo "  ./scripts/run-migrations.sh \"postgresql://postgres.$PROJECT_REF:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres\""
  echo ""
  echo "You can also add DATABASE_URL=... to your .env file."
  echo "================================================================="
  exit 1
fi

echo "Connecting to Supabase and executing migrations..."

echo "-> [1/3] Running 001_schema.sql (tables & pgvector)..."
psql "$CONN" -f supabase/migrations/001_schema.sql

echo "-> [2/3] Running 002_rls.sql (row-level security policies)..."
psql "$CONN" -f supabase/migrations/002_rls.sql

echo "-> [3/3] Running 003_match_chunks.sql (vector similarity RPC)..."
psql "$CONN" -f supabase/migrations/003_match_chunks.sql

echo ""
echo "✅ All 3 migrations completed successfully!"
echo "Now run 'pnpm seed' to populate the database with AZ-900 content."
