'use client'
import { useState } from 'react'

const crises = [
  { nom: 'Covid-19 (2020)', secteurs: { Tourisme: -65, Banques: -40, Énergie: -50, Tech: +35, Santé: +15, Luxe: -30, Alimentation: +5 } },
  { nom: 'Crise financière (2008)', secteurs: { Tourisme: -45, Banques: -75, Énergie: -55, Tech: -50, Santé: -20, Luxe: -55, Alimentation: -15 } },
  { nom: 'Bulle tech (2001)', secteurs: { Tourisme: -35, Banques: -25, Énergie: +10, Tech: -80, Santé: -10, Luxe: -20, Alimentation: -5 } },
]

const couleurs: Record<string, string> = {
  Tourisme: '#FF6B6B', Banques: '#9090FC', Énergie: '#00D47E',
  Tech: '#3B3BF9', Santé: '#FFD700', Luxe: '#FF9966', Alimentation: '#88D4AB',
}

export default function InteractiveDiversification() {
  const [crise, setCrise] = useState(0)
  const [simulated, setSimulated] = useState(false)

  // Portefeuille A : concentré (100% tourisme)
  // Portefeuille B : diversifié (équiréparti sur tous les secteurs)
  const c = crises[crise]
  const sectList = Object.keys(c.secteurs) as (keyof typeof c.secteurs)[]
  const perfConcentre = c.secteurs['Tourisme']
  const perfDiversifie = Math.round(sectList.reduce((acc, s) => acc + c.secteurs[s], 0) / sectList.length)

  const capitalInit = 10000
  const finalConcentre = Math.round(capitalInit * (1 + perfConcentre / 100))
  const finalDiversifie = Math.round(capitalInit * (1 + perfDiversifie / 100))

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(0,212,126,.3)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#00D47E', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de diversification</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Choisis une crise et vois comment deux portefeuilles réagissent différemment</div>

      {/* Sélection crise */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {crises.map((cr, i) => (
          <button key={i} onClick={() => { setCrise(i); setSimulated(false) }} style={{
            flex: 1, padding: '8px 6px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Sora,sans-serif', transition: 'all .15s', whiteSpace: 'nowrap',
            background: i === crise ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)',
            color: i === crise ? 'white' : 'rgba(255,255,255,.4)',
            border: i === crise ? '1px solid rgba(255,255,255,.2)' : '1px solid rgba(255,255,255,.06)',
          }}>
            {cr.nom}
          </button>
        ))}
      </div>

      {/* Les deux portefeuilles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Portefeuille A', desc: '100% Tourisme', color: '#FF6B6B', perf: perfConcentre, final: finalConcentre },
          { label: 'Portefeuille B', desc: '7 secteurs équirépartis', color: '#00D47E', perf: perfDiversifie, final: finalDiversifie },
        ].map((p, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '16px', border: `1px solid ${p.color}30` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>{p.desc}</div>
            {simulated ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 800, color: p.perf >= 0 ? '#00D47E' : '#FF6B6B' }}>
                  {p.perf >= 0 ? '+' : ''}{p.perf}%
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 4, fontWeight: 600 }}>
                  {p.final.toLocaleString('fr-FR')}€
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>
                  départ : 10 000€
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>
                Lance la simulation →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performances par secteur */}
      {simulated && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 10 }}>Performance par secteur durant {c.nom}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {sectList.map(s => {
              const perf = c.secteurs[s]
              const barW = Math.abs(perf) / 80 * 100
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 80, fontSize: 10, color: 'rgba(255,255,255,.5)', textAlign: 'right', flexShrink: 0 }}>{s}</div>
                  <div style={{ flex: 1, height: 14, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      [perf >= 0 ? 'left' : 'right']: 0,
                      top: 0, height: '100%',
                      width: `${Math.min(barW, 100)}%`,
                      background: perf >= 0 ? couleurs[s] || '#00D47E' : '#FF6B6B',
                      borderRadius: 3,
                    }} />
                  </div>
                  <div style={{ width: 44, fontSize: 10, fontWeight: 700, color: perf >= 0 ? '#00D47E' : '#FF6B6B', flexShrink: 0 }}>
                    {perf >= 0 ? '+' : ''}{perf}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bouton simulation */}
      <button onClick={() => setSimulated(true)} style={{
        width: '100%', padding: '12px', borderRadius: 100, fontSize: 13, fontWeight: 700,
        background: simulated ? 'rgba(255,255,255,.06)' : '#3B3BF9', color: 'white',
        border: simulated ? '1px solid rgba(255,255,255,.1)' : 'none',
        cursor: 'pointer', fontFamily: 'Sora,sans-serif', marginBottom: 14,
        transition: 'all .2s'
      }}>
        {simulated ? '🔄 Changer de crise' : `📊 Simuler la crise ${c.nom}`}
      </button>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Le portefeuille B ne supprime pas la baisse. Mais il la transforme en correction surmontable plutôt qu'en catastrophe irrécupérable. C'est le vrai rôle de la diversification.
      </div>
    </div>
  )
}
