-- 002_rls.sql: Row Level Security Policies for SomoPal

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- 1. Public reference data (domains, topics, content_chunks)
-- Readable by authenticated and anonymous clients; writable by NO client (service_role only).
CREATE POLICY "Public domains are readable by all"
  ON public.domains FOR SELECT
  USING (true);

CREATE POLICY "Public topics are readable by all"
  ON public.topics FOR SELECT
  USING (true);

CREATE POLICY "Public content chunks are readable by all"
  ON public.content_chunks FOR SELECT
  USING (true);

-- 2. Profiles: users can select and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Chat Sessions
CREATE POLICY "Users can manage own chat sessions"
  ON public.chat_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Chat Messages
CREATE POLICY "Users can manage own chat messages"
  ON public.chat_messages FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Quizzes
CREATE POLICY "Users can manage own quizzes"
  ON public.quizzes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Quiz Questions (join through quizzes.user_id = auth.uid())
CREATE POLICY "Users can view questions for own quizzes"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE public.quizzes.id = quiz_questions.quiz_id
      AND public.quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for own quizzes"
  ON public.quiz_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE public.quizzes.id = quiz_questions.quiz_id
      AND public.quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for own quizzes"
  ON public.quiz_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE public.quizzes.id = quiz_questions.quiz_id
      AND public.quizzes.user_id = auth.uid()
    )
  );

-- 7. Quiz Answers
CREATE POLICY "Users can manage own quiz answers"
  ON public.quiz_answers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. Usage Limits
CREATE POLICY "Users can view own usage limits"
  ON public.usage_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage limits"
  ON public.usage_limits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
