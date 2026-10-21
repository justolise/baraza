-- 003_match_chunks.sql: Vector similarity search function for RAG
CREATE OR REPLACE FUNCTION public.match_chunks(
  query_embedding VECTOR(768),
  p_topic_id UUID DEFAULT NULL,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  topic_id UUID,
  title TEXT,
  body TEXT,
  source_note TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.id,
    cc.topic_id,
    cc.title,
    cc.body,
    cc.source_note,
    (1 - (cc.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.content_chunks cc
  WHERE
    (p_topic_id IS NULL OR cc.topic_id = p_topic_id)
    AND (1 - (cc.embedding <=> query_embedding)) >= match_threshold
  ORDER BY cc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
