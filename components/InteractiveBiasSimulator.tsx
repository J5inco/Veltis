'use client'
import { useState } from 'react'

type Scenario = {
  id: number
  title: string
  context: string
  question: string
  emoji: string
  options: {
    label: string
    biais: string | null
    consequence: string
    resultat: '✅' | '⚠️' | '❌'
    gain: string
  }[]
}

const scenarios: Scenario[] = [
  {
    id: 1,
    emoji: '📉',
    title: 'La crise de 2020',
    context: 'Nous sommes en mars 2020. Le CAC 40 vient de perdre 38% en 6 semaines. Ton portefeuille ETF vaut 7 200€ au lieu de 10 000€. Les médias annoncent "le pire krach depuis 1929". Tes fondamentaux n\'ont pas changé — tu investis sur un horizon de 20 ans.',
    question: 'Que fais-tu ?',
    options: [
      {
        label: '😰 Je vends tout pour limiter les pertes',
        biais: 'Biais de panique',
        consequence: 'Tu cristallises une perte de 2 800€. Le marché remonte de +60% en 14 mois. Ton portefeuille aurait valu 15 200€ en juin 2021.',
        resultat: '❌',
        gain: '-2 800€ de perte permanente',
      },
      {
        label: '😬 Je vends la moitié et j\'attends',
        biais: 'Biais de panique partiel',
        consequence: 'Tu rates la moitié du rebond. En juin 2021, tu as 11 200€ au lieu de 15 200€. La demi-mesure est souvent pire que la discipline totale.',
        resultat: '⚠️',
        gain: '-4 000€ vs tenir la totalité',
      },
      {
        label: '💪 Je continue mon DCA et ne vends rien',
        biais: null,
        consequence: 'Tu achètes des parts à -38% pendant la crise. En juin 2021, ton portefeuille vaut 15 200€ soit +52% depuis le début. La panique était temporaire.',
        resultat: '✅',
        gain: '+5 200€ vs point de départ',
      },
      {
        label: '🚀 Je double mes versements — les prix sont bradés',
        biais: null,
        consequence: 'Stratégie optimale si tu avais la liquidité. En juin 2021, ton portefeuille vaut 17 800€. Acheter dans la panique quand les fondamentaux sont intacts est la définition de l\'opportunité.',
        resultat: '✅',
        gain: '+7 800€ — meilleur scénario',
      },
    ],
  },
  {
    id: 2,
    emoji: '🚀',
    title: 'L\'euphorie tech de 2021',
    context: 'Nous sommes en novembre 2021. Ton ETF tech a progressé de +85% en 18 mois. Partout on parle de la "nouvelle économie". Ton beau-frère t\'explique que les valorisations ne comptent plus. Le PER moyen du Nasdaq est à 45x.',
    question: 'Que fais-tu ?',
    options: [
      {
        label: '🤩 J\'investis encore plus — ça monte toujours',
        biais: 'Biais de récence + FOMO',
        consequence: 'Tu rentres au plus haut. En 2022, les actions tech perdent en moyenne -55%. Tu perds une grande partie de tes gains récents et tu paies le prix de l\'euphorie collective.',
        resultat: '❌',
        gain: '-55% sur les nouveaux versements en 2022',
      },
      {
        label: '📊 Je rebalance — les tech sont surpondérées dans mon allocation',
        biais: null,
        consequence: 'Tu vends une partie de la plus-value pour revenir à ton allocation cible. En 2022, tu limites les pertes et tu rachètes des tech à -55% avec ta poche obligataire. Discipline totale.',
        resultat: '✅',
        gain: 'Allocation cible respectée, rebond capturé',
      },
      {
        label: '😐 Je ne change rien et je regarde',
        biais: 'Inaction',
        consequence: 'Pas catastrophique, mais tu aurais dû rebalancer. En 2022 ton portefeuille surexposé tech souffre plus que prévu. La dérive d\'allocation a un coût réel.',
        resultat: '⚠️',
        gain: 'Sous-optimal — la dérive a un coût',
      },
      {
        label: '💰 Je vends tout et je sécurise les gains',
        biais: 'Aversion à la perte + timing',
        consequence: 'Psychologiquement compréhensible mais dangereux. Quand rentres-tu ? Souvent jamais ou au mauvais moment. Les études montrent que "market timing" coûte en moyenne 2%/an aux particuliers.',
        resultat: '⚠️',
        gain: 'Gains sécurisés mais croissance perdue',
      },
    ],
  },
  {
    id: 3,
    emoji: '📊',
    title: 'Les mauvais résultats de LVMH',
    context: 'LVMH publie des résultats trimestriels décevants — BPA en baisse de 12% vs consensus. Le cours chute de 8% dans la journée. Ta thèse d\'investissement était : "leadership mondial du luxe avec pricing power durable sur 10 ans". La baisse est due à un ralentissement temporaire en Chine.',
    question: 'Que fais-tu ?',
    options: [
      {
        label: '😱 Je vends immédiatement — mauvais résultats = signal de sortie',
        biais: 'Réaction émotionnelle aux résultats',
        consequence: 'Tu vends à -8% sur un facteur temporaire. 6 mois plus tard le cours est revenu à son niveau initial. Ta thèse long terme était intacte mais tu ne l\'as pas relue avant de décider.',
        resultat: '❌',
        gain: '-8% de perte + opportunité manquée',
      },
      {
        label: '📖 Je relis ma thèse : le ralentissement Chine invalide-t-il mon hypothèse ?',
        biais: null,
        consequence: 'Tu analyses froidement. Le pricing power de LVMH est intact, la Chine est cyclique et représente 28% des ventes. Ta thèse de 10 ans n\'est pas invalidée. Tu conserves voire tu renforces.',
        resultat: '✅',
        gain: 'Décision rationnelle basée sur les fondamentaux',
      },
      {
        label: '💪 Je renforce immédiatement — baisse = opportunité',
        biais: 'Précipitation sans analyse',
        consequence: 'Intuitivement correct mais risqué sans analyse. Si les résultats révèlent un problème structurel (perte de pricing power), renforcer sans réfléchir amplifie l\'erreur initiale.',
        resultat: '⚠️',
        gain: 'Correct si thèse intacte, dangereux sinon',
      },
      {
        label: '⏳ J\'attends 24h et je lis les analyses approfondies',
        biais: null,
        consequence: 'Excellente approche. Les premières réactions du marché sont souvent excessives. 24h après, les analystes ont lu le rapport complet. Tu décides avec une information plus complète et moins d\'adrénaline.',
        resultat: '✅',
        gain: 'Décision plus rationnelle, bruit filtré',
      },
    ],
  },
]

export default function InteractiveBiasSimulator() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [completed, setCompleted] = useState<number[]>([])

  const scenario = scenarios[currentScenario]
  const isAnswered = selectedOption !== null
  const selected = isAnswered ? scenario.options[selectedOption] : null

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
    if (!completed.includes(currentScenario)) {
      setCompleted(prev => [...prev, currentScenario])
    }
  }

  const nextScenario = () => {
    setSelectedOption(null)
    setCurrentScenario(s => (s + 1) % scenarios.length)
  }

  const getBorderColor = (idx: number) => {
    if (!isAnswered) return 'rgba(255,255,255,.08)'
    const opt = scenario.options[idx]
    if (idx === selectedOption) {
      return opt.resultat === '✅' ? '#00D47E' : opt.resultat === '⚠️' ? '#FFD700' : '#FF6B6B'
    }
    if (opt.resultat === '✅') return 'rgba(0,212,126,.25)'
    return 'rgba(255,255,255,.05)'
  }

  const getBg = (idx: number) => {
    if (!isAnswered) return 'rgba(255,255,255,.04)'
    const opt = scenario.options[idx]
    if (idx === selectedOption) {
      return opt.resultat === '✅' ? 'rgba(0,212,126,.12)' : opt.resultat === '⚠️' ? 'rgba(255,215,0,.08)' : 'rgba(255,107,107,.1)'
    }
    if (opt.resultat === '✅') return 'rgba(0,212,126,.05)'
    return 'rgba(255,255,255,.02)'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20,
      padding: '28px 24px',
      margin: '24px 0',
      border: '1px solid rgba(255,107,107,.3)',
      fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9999', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>
        Visuel interactif
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>
        Simulateur de biais comportementaux
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>
        3 scénarios réels — choisis ta réaction et découvre tes biais
      </div>

      {/* PROGRESS */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => { setCurrentScenario(i); setSelectedOption(null) }} style={{
            flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: i === currentScenario ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)',
            color: i === currentScenario ? 'white' : completed.includes(i) ? '#00D47E' : 'rgba(255,255,255,.3)',
            border: i === currentScenario ? '1px solid rgba(255,255,255,.2)' : '1px solid rgba(255,255,255,.06)',
          }}>
            {completed.includes(i) ? '✓ ' : ''}{s.emoji} {s.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      {/* CONTEXTE */}
      <div style={{
        background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: '16px 18px', marginBottom: 20,
        border: '1px solid rgba(255,255,255,.08)'
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 8 }}>
          {scenario.emoji} {scenario.title}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, fontWeight: 300 }}>
          {scenario.context}
        </div>
      </div>

      {/* QUESTION */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.7)', marginBottom: 12 }}>
        {scenario.question}
      </div>

      {/* OPTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {scenario.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)} style={{
            padding: '12px 16px', borderRadius: 12, fontSize: 12, textAlign: 'left',
            cursor: isAnswered ? 'default' : 'pointer',
            background: getBg(idx),
            border: `1px solid ${getBorderColor(idx)}`,
            color: 'rgba(255,255,255,.75)',
            fontFamily: 'Sora, sans-serif',
            transition: 'all .15s',
            fontWeight: idx === selectedOption ? 600 : 400,
          }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      {isAnswered && selected && (
        <div style={{
          background: selected.resultat === '✅' ? 'rgba(0,212,126,.1)' : selected.resultat === '⚠️' ? 'rgba(255,215,0,.08)' : 'rgba(255,107,107,.1)',
          border: `1px solid ${selected.resultat === '✅' ? 'rgba(0,212,126,.3)' : selected.resultat === '⚠️' ? 'rgba(255,215,0,.25)' : 'rgba(255,107,107,.3)'}`,
          borderRadius: 14, padding: '16px 18px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{selected.resultat}</span>
            {selected.biais && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                background: 'rgba(255,107,107,.2)', color: '#FF9999',
                textTransform: 'uppercase', letterSpacing: '.05em'
              }}>
                {selected.biais} détecté
              </span>
            )}
            {!selected.biais && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                background: 'rgba(0,212,126,.2)', color: '#00D47E',
                textTransform: 'uppercase', letterSpacing: '.05em'
              }}>
                Décision rationnelle
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: 10, fontWeight: 300 }}>
            {selected.consequence}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: selected.resultat === '✅' ? '#00D47E' : selected.resultat === '⚠️' ? '#FFD700' : '#FF9999' }}>
            Impact : {selected.gain}
          </div>
        </div>
      )}

      {/* MEILLEURE RÉPONSE */}
      {isAnswered && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>
            Toutes les options et leurs conséquences :
          </div>
          {scenario.options.map((opt, idx) => idx !== selectedOption && (
            <div key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6,
              fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.5
            }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>{opt.resultat}</span>
              <span><strong style={{ color: 'rgba(255,255,255,.6)' }}>{opt.label.replace(/^[^\s]+ /, '')}</strong> — {opt.biais ? `Biais : ${opt.biais}. ` : 'Décision rationnelle. '}</span>
            </div>
          ))}
        </div>
      )}

      {/* NAVIGATION */}
      {isAnswered && (
        <button onClick={nextScenario} style={{
          width: '100%', padding: '12px', borderRadius: 100, fontSize: 13, fontWeight: 700,
          background: '#3B3BF9', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Sora, sans-serif',
        }}>
          {currentScenario < scenarios.length - 1 ? `Scénario suivant → ${scenarios[currentScenario + 1].emoji} ${scenarios[currentScenario + 1].title}` : '🔄 Recommencer les 3 scénarios'}
        </button>
      )}

      {!isAnswered && (
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', textAlign: 'center', fontStyle: 'italic' }}>
          Clique sur la réaction qui correspond le mieux à ce que tu ferais vraiment
        </div>
      )}
    </div>
  )
}
