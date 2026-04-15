'use client'
import { useState } from 'react'

const profils = [
  {
    nom: 'Entreprise saine',
    icon: '✅',
    color: '#00D47E',
    actifCourant: 3500,
    actifNonCourant: 8000,
    passifCourant: 1500,
    passifNonCourant: 4000,
    capitaux: 6000,
    ebitda: 2000,
    desc: 'TotalEnergies-type : bilan solide, dette maîtrisée, capitaux propres positifs en croissance.',
  },
  {
    nom: 'Entreprise endettée',
    icon: '⚠️',
    color: '#FFD700',
    actifCourant: 2000,
    actifNonCourant: 12000,
    passifCourant: 2500,
    passifNonCourant: 9000,
    capitaux: 2500,
    ebitda: 1200,
    desc: 'Société avec fort levier financier. Possible si les actifs génèrent suffisamment de cash pour rembourser.',
  },
  {
    nom: 'Entreprise en difficulté',
    icon: '❌',
    color: '#FF6B6B',
    actifCourant: 800,
    actifNonCourant: 3000,
    passifCourant: 1500,
    passifNonCourant: 3500,
    capitaux: -1200,
    ebitda: 400,
    desc: 'Capitaux propres négatifs — les dettes dépassent les actifs. Signal d\'alarme sérieux. Risque de défaut.',
  },
]

export default function InteractiveBalanceSheet() {
  const [selected, setSelected] = useState(0)
  const p = profils[selected]

  const actifTotal = p.actifCourant + p.actifNonCourant
  const passifTotal = p.passifCourant + p.passifNonCourant
  const detteNette = passifTotal - p.actifCourant
  const ratioDetteEbitda = Math.round((detteNette / p.ebitda) * 10) / 10
  const maxBar = Math.max(actifTotal, passifTotal + Math.max(p.capitaux, 0))

  const fmt = (n: number) => `${(n / 1000).toFixed(1)} Md€`

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(255,215,0,.2)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Bilan comptable interactif</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>Compare 3 profils d'entreprise et vois les ratios clés en temps réel</div>

      {/* CHOIX PROFIL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {profils.map((prof, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: '12px 16px', borderRadius: 12, textAlign: 'left',
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: selected === i ? `${prof.color}15` : 'rgba(255,255,255,.04)',
            border: selected === i ? `1px solid ${prof.color}50` : '1px solid rgba(255,255,255,.06)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: selected === i ? prof.color : 'rgba(255,255,255,.6)' }}>
              {prof.icon} {prof.nom}
            </div>
            {selected === i && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4, fontWeight: 300 }}>{prof.desc}</div>}
          </button>
        ))}
      </div>

      {/* BILAN VISUEL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* ACTIF */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#3B3BF9', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>ACTIF — {fmt(actifTotal)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Actif courant', val: p.actifCourant, color: '#3B3BF9', note: 'Trésorerie, créances, stocks' },
              { label: 'Actif non courant', val: p.actifNonCourant, color: '#6B6BFA', note: 'Usines, brevets, marques' },
            ].map((item, i) => (
              <div key={i} style={{ background: `${item.color}18`, borderRadius: 8, padding: '10px 12px', border: `1px solid ${item.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{fmt(item.val)}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(item.val / maxBar) * 100}%`, background: item.color, borderRadius: 2, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PASSIF + CAPITAUX */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#FF9999', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>PASSIF & CAPITAUX — {fmt(passifTotal + Math.max(p.capitaux, 0))}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Passif courant', val: p.passifCourant, color: '#FF9999', note: 'Dettes < 1 an' },
              { label: 'Passif non courant', val: p.passifNonCourant, color: '#FF6B6B', note: 'Dettes long terme' },
              { label: 'Capitaux propres', val: p.capitaux, color: p.capitaux >= 0 ? '#00D47E' : '#FF0000', note: 'Ce qui appartient aux actionnaires' },
            ].map((item, i) => (
              <div key={i} style={{ background: `${item.color}15`, borderRadius: 8, padding: '10px 12px', border: `1px solid ${item.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.val < 0 ? '-' : ''}{fmt(Math.abs(item.val))}</span>
                </div>
                {item.val > 0 && <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(item.val / maxBar) * 100}%`, background: item.color, borderRadius: 2, transition: 'width .4s' }} />
                </div>}
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RATIOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Dette nette', val: `${fmt(detteNette)}`, color: detteNette < 0 ? '#00D47E' : '#FFD700' },
          { label: 'Dette/EBITDA', val: `${ratioDetteEbitda}x`, color: ratioDetteEbitda < 2 ? '#00D47E' : ratioDetteEbitda < 4 ? '#FFD700' : '#FF6B6B' },
          { label: 'Capitaux propres', val: `${p.capitaux >= 0 ? '+' : ''}${fmt(p.capitaux)}`, color: p.capitaux >= 0 ? '#00D47E' : '#FF6B6B' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 12px', textAlign: 'center', border: `1px solid ${item.color}25` }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.25)', marginTop: 2 }}>
              {i === 1 ? (ratioDetteEbitda < 2 ? 'Sain ✓' : ratioDetteEbitda < 4 ? 'À surveiller' : 'Élevé ⚠️') : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>La règle des deux colonnes</strong> — Le total de l'actif est toujours égal au passif + capitaux propres. C'est la règle fondamentale de la comptabilité. Si les capitaux propres sont négatifs, l'entreprise a plus de dettes que d'actifs — c'est un signal d'alarme qui nécessite une analyse approfondie.
      </div>
    </div>
  )
}
