-- Table streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streak_read" ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streak_insert" ON user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "streak_update" ON user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Table onboarding quiz
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  recommended_module INTEGER NOT NULL DEFAULT 1,
  niveau TEXT NOT NULL DEFAULT 'débutant',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onboarding_read" ON user_onboarding FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "onboarding_insert" ON user_onboarding FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "onboarding_update" ON user_onboarding FOR UPDATE USING (auth.uid() = user_id);

-- Table boussole positions
CREATE TABLE IF NOT EXISTS boussole_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  nom TEXT NOT NULL,
  prix_achat DECIMAL(10,2) NOT NULL,
  quantite DECIMAL(10,4) NOT NULL,
  enveloppe TEXT NOT NULL DEFAULT 'PEA',
  date_achat DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE boussole_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "positions_read" ON boussole_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "positions_insert" ON boussole_positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "positions_update" ON boussole_positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "positions_delete" ON boussole_positions FOR DELETE USING (auth.uid() = user_id);

-- Table journal de bord
CREATE TABLE IF NOT EXISTS boussole_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker TEXT NOT NULL,
  nom TEXT NOT NULL,
  date_achat DATE NOT NULL,
  prix_achat DECIMAL(10,2),
  these TEXT NOT NULL,
  stop_intellectuel TEXT NOT NULL,
  horizon TEXT NOT NULL,
  risque_principal TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE boussole_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journal_read" ON boussole_journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_insert" ON boussole_journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_update" ON boussole_journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_delete" ON boussole_journal FOR DELETE USING (auth.uid() = user_id);
