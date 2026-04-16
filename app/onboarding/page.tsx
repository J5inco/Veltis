'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const questions = [
  {
    q: "Tu as déjà investi en bourse ?",
    options: [
      { label: "Jamais — je commence de zéro", points: 0 },
      { label: "J'ai regardé mais jamais sauté le pas", points: 1 },
      { label: "Oui, quelques achats en ETF ou actions", points: 2 },
      { label: "Oui, je gère activement mon portefeuille", points: 4 },
    ]
  },
  {
    q: "Tu sais ce qu'est le PEA ?",
    options: [
      { label: "Non, jamais entendu parler", points: 0 },
      { label: "J'en ai entendu parler mais je ne sais pas comment ça marche", points: 1 },
      { label: "Oui, je sais que c'est avantageux fiscalement", points: 2 },
      { label: "Oui, j'en ai déjà un d'ouvert", points: 3 },
    ]
  },
  {
    q: "Le PER d'une action, tu sais ce que c'est ?",
    options: [
      { label: "Non, aucune idée", points: 0 },
      { label: "Vaguement — c'est un ratio de valorisation", points: 1 },
      { label: "Oui — cours divisé par bénéfice par action", points: 3 },
      { label: "Oui, et je l'utilise pour comparer les actions", points: 4 },
    ]
  },
  {
    q: "Tu sais lire un bilan comptable ?",
    options: [
      { label: "Non, les mots actif/passif ne me disent rien", points: 0 },
      { label: "Je sais qu'il y a un actif et un passif", points: 1 },
      { label: "Je peux analyser les grandes lignes", points: 3 },
      { label: "Oui, je sais calculer la dette nette et l'EBITDA", points: 4 },
    ]
  },
  {
    q: "Tu as déjà passé un ordre en bourse ?",
    options: [
      { label: "Non, jamais", points: 0 },
      { label: "Non, mais je sais qu'il existe des ordres à cours limité", points: 1 },
      { label: "Oui, quelques ordres sur ETF", points: 2 },
      { label: "Oui, régulièrement sur actions et ETF", points: 4 },
    ]
  },
]

function getRecommendation(score: number) {
  if (score <= 3) return { module: 1, niveau: 'débutant', message: "Commence par les bases — tu seras surpris de la vitesse à laquelle tu progresseras !", icon: '🌱' }
  if (score <= 8) return { module: 2, niveau: 'intermédiaire', message: "Tu connais les bases. On attaque directement la lecture des cours et la fiscalité.", icon: '📚' }
  if (score <= 14) return { module: 3, niveau: 'avancé', message: "Bon niveau ! On passe directement à l'évaluation d'entreprises et la construction de portefeuille.", icon: '📈' }
  return { module: 4, niveau: 'expert', message: "Excellent niveau. Tu peux aller directement aux modules avancés.", icon: '🏆' }
}

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const totalScore = answers.reduce((a, b) => a + b, 0)
  const reco = getRecommendation(totalScore)

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    } else {
      setDone(true)
    }
  }

  const handleSave = async (skipToModule1 = false) => {
    setSaving(true)
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const finalReco = skipToModule1 ? { module: 1, niveau: 'débutant' } : reco
      await supabase.from('user_onboarding').upsert({
        user_id: data.user.id,
        recommended_module: finalReco.module,
        niveau: finalReco.niveau,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    }
    router.push('/dashboard')
  }

  if (done) return (
    <div style={{ fontFamily: 'Sora,sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>{reco.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Ton niveau</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-.03em', marginBottom: 12, textTransform: 'capitalize' }}>{reco.niveau}</h1>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', maxWidth: 460, lineHeight: 1.7, marginBottom: 40, fontWeight: 300 }}>{reco.message}</p>
      <div style={{ background: 'rgba(59,59,249,.15)', border: '1px solid rgba(59,59,249,.3)', borderRadius: 20, padding: '24px 32px', marginBottom: 32, maxWidth: 400, width: '100%' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 8 }}>Module recommandé pour toi</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#3B3BF9' }}>Module {reco.module}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 4, fontWeight: 300 }}>tu peux aussi commencer depuis le début</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
        <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: '15px 32px', background: '#3B3BF9', color: 'white', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
          {saving ? 'Chargement...' : `Démarrer au Module ${reco.module} →`}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: '12px 32px', background: 'transparent', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
          Commencer depuis le Module 1
        </button>
      </div>
    </div>
  )

  const q = questions[current]

  return (
    <div style={{ fontFamily: 'Sora,sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 800, color: 'white', textDecoration: 'none', letterSpacing: '-.04em' }}>
            Veltis<span style={{ color: '#3B3BF9' }}>.</span>
          </Link>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', marginTop: 8, fontWeight: 300 }}>Quiz de positionnement · {current + 1} / {questions.length}</div>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(current / questions.length) * 100}%`, background: '#3B3BF9', borderRadius: 2, transition: 'width .3s' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-.02em', marginBottom: 24, lineHeight: 1.3 }}>{q.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setSelected(opt.points)} style={{
              padding: '16px 20px', borderRadius: 14, fontSize: 14, textAlign: 'left',
              cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .15s',
              background: selected === opt.points ? 'rgba(59,59,249,.2)' : 'rgba(255,255,255,.05)',
              color: selected === opt.points ? 'white' : 'rgba(255,255,255,.65)',
              border: selected === opt.points ? '1px solid rgba(59,59,249,.6)' : '1px solid rgba(255,255,255,.08)',
              fontWeight: selected === opt.points ? 600 : 300,
            }}>
              {opt.label}
            </button>
          ))}
        </div>
        <button onClick={handleNext} disabled={selected === null} style={{
          width: '100%', padding: '15px', borderRadius: 100, fontSize: 15, fontWeight: 700,
          background: selected !== null ? '#3B3BF9' : 'rgba(255,255,255,.08)',
          color: selected !== null ? 'white' : 'rgba(255,255,255,.25)',
          border: 'none', cursor: selected !== null ? 'pointer' : 'default',
          fontFamily: 'Sora,sans-serif', marginBottom: 14,
        }}>
          {current < questions.length - 1 ? 'Continuer →' : 'Voir mon résultat →'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => handleSave(true)} style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
            Passer le quiz
          </button>
        </div>
      </div>
    </div>
  )
}
