-- Essays table
CREATE TABLE IF NOT EXISTS essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'reviewed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Peer reviews table
CREATE TABLE IF NOT EXISTS peer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID REFERENCES essays(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clarity_score INTEGER NOT NULL CHECK (clarity_score BETWEEN 1 AND 5),
  accuracy_score INTEGER NOT NULL CHECK (accuracy_score BETWEEN 1 AND 5),
  depth_score INTEGER NOT NULL CHECK (depth_score BETWEEN 1 AND 5),
  feedback TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(essay_id, reviewer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_course_id ON essays(course_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_essay_id ON peer_reviews(essay_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_reviewer_id ON peer_reviews(reviewer_id);

-- RLS
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_reviews ENABLE ROW LEVEL SECURITY;

-- Essay policies
CREATE POLICY "Users can view all essays" ON essays FOR SELECT USING (true);
CREATE POLICY "Users can insert own essays" ON essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own essays" ON essays FOR UPDATE USING (auth.uid() = user_id);

-- Review policies
CREATE POLICY "Users can view all reviews" ON peer_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON peer_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
