-- Security improvements: content length limits and discussion likes table

-- 1. Add content length constraints to existing tables
ALTER TABLE essays ADD CONSTRAINT essay_content_max_length CHECK (length(content) <= 50000);
ALTER TABLE essays ADD CONSTRAINT essay_prompt_max_length CHECK (length(prompt) <= 5000);

ALTER TABLE discussions ADD CONSTRAINT discussion_content_max_length CHECK (length(content) <= 5000);

ALTER TABLE replies ADD CONSTRAINT reply_content_max_length CHECK (length(content) <= 2000);

ALTER TABLE peer_reviews ADD CONSTRAINT review_feedback_max_length CHECK (length(feedback) <= 5000);

-- 2. Create discussion_likes junction table (replacing liked_by UUID[] anti-pattern)
CREATE TABLE IF NOT EXISTS discussion_likes (
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (discussion_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_discussion_likes_user_id ON discussion_likes(user_id);

-- RLS for discussion_likes
ALTER TABLE discussion_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON discussion_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert own likes" ON discussion_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes" ON discussion_likes FOR DELETE USING (auth.uid() = user_id);

-- 3. Update essay RLS policies for better security
DROP POLICY IF EXISTS "Users can view all essays" ON essays;

-- Authenticated users can see: own essays + other submitted essays (for peer review)
CREATE POLICY "Users can view own or submitted essays" ON essays FOR SELECT USING (
  auth.uid() = user_id OR status = 'submitted'
);

-- 4. Update peer review RLS policies
DROP POLICY IF EXISTS "Users can view all reviews" ON peer_reviews;

-- Users can see: reviews they wrote + reviews on their own essays
CREATE POLICY "Users can view relevant reviews" ON peer_reviews FOR SELECT USING (
  auth.uid() = reviewer_id OR
  EXISTS (SELECT 1 FROM essays WHERE essays.id = peer_reviews.essay_id AND essays.user_id = auth.uid())
);

-- 5. Add composite index for common essay query pattern
CREATE INDEX IF NOT EXISTS idx_essays_course_user ON essays(course_id, user_id);
