import { supabase } from './supabase'

export const XP_PER_LECON = 20
export const XP_PER_MODULE = 100

export const LEVELS = [
  { name: 'Débutant', min: 0, max: 199, icon: '🌱', color: '#9898B8' },
  { name: 'Apprenti', min: 200, max: 499, icon: '📚', color: '#3B3BF9' },
  { name: 'Investisseur', min: 500, max: 999, icon: '📈', color: '#00D47E' },
  { name: 'Expert', min: 1000, max: 99999, icon: '🏆', color: '#FFD700' },
]

export function getLevel(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0]
}

export function getLevelProgress(xp: number) {
  const level = getLevel(xp)
  const range = level.max - level.min
  const progress = xp - level.min
  return Math.min(Math.round((progress / range) * 100), 100)
}

export async function updateStreak(userId: string, xpGained: number = XP_PER_LECON) {
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!existing) {
    await supabase.from('user_streaks').insert({
      user_id: userId,
      streak_days: 1,
      last_activity_date: today,
      longest_streak: 1,
      total_xp: xpGained,
    })
    return { streak: 1, xp: xpGained, isNewDay: true }
  }

  const lastDate = existing.last_activity_date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = existing.streak_days
  let isNewDay = false

  if (lastDate === today) {
    // Already active today — just add XP
  } else if (lastDate === yesterdayStr) {
    // Consecutive day
    newStreak = existing.streak_days + 1
    isNewDay = true
  } else {
    // Streak broken
    newStreak = 1
    isNewDay = true
  }

  const newXP = existing.total_xp + xpGained
  await supabase.from('user_streaks').update({
    streak_days: newStreak,
    last_activity_date: today,
    longest_streak: Math.max(existing.longest_streak, newStreak),
    total_xp: newXP,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId)

  return { streak: newStreak, xp: newXP, isNewDay }
}

export async function getStreak(userId: string) {
  const { data } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}
