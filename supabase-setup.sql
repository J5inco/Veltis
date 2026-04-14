-- Table pour sauvegarder la progression des modules
CREATE TABLE IF NOT EXISTS progressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INTEGER NOT NULL,
  lecon_id INTEGER NOT NULL,
  quiz_score INTEGER,
  quiz_total INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, lecon_id)
);

-- Table pour les meilleurs scores par module
CREATE TABLE IF NOT EXISTS module_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INTEGER NOT NULL,
  best_score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- RLS policies
ALTER TABLE progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progressions"
  ON progressions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progressions"
  ON progressions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progressions"
  ON progressions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own module scores"
  ON module_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module scores"
  ON module_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module scores"
  ON module_scores FOR UPDATE
  USING (auth.uid() = user_id);
