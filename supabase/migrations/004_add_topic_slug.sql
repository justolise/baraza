-- 004_add_topic_slug.sql
-- Add topic_slug to quiz_questions so the history page can link back to the correct study topic.
-- Back-fill existing rows with the slug of the linked topic (if any) or a safe default.

ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS topic_slug TEXT NOT NULL DEFAULT 'shared-responsibility-model';

-- Back-fill from the FK relationship where it exists
UPDATE public.quiz_questions qq
SET    topic_slug = t.slug
FROM   public.topics t
WHERE  qq.topic_id = t.id
  AND  qq.topic_slug = 'shared-responsibility-model'; -- only update the default placeholder rows
