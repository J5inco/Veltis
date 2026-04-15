'use client'
import { useState } from 'react'

const secteurs = [
  { nom: 'Luxe', color: '#FFD700', per: [18, 30], evEbitda: [12, 22], evFcf: [20, 35], ex: ['Hermès', 'LVMH', 'Kering'] },
  { nom: 'Technologie', color: '#3B3BF9', per: [20, 40], evEbitda: [15, 30], evFcf: [22, 45], ex: ['Dassault Sys.', 'Capgemini', 'Atos'] },
  { nom: 'Énergie', color: '#00D47E', per: [6, 12], evEbitda: [3, 8], evFcf: [8, 15], ex: ['TotalEnergies', 'Engie', 'Vallourec'] },
  { nom: 'Banque', color: '#9090FC', per: [5, 10], evEbitda: [0, 0], evFcf: [0, 0], ex: ['BNP Paribas', 'SocGen', 'Crédit Agr.'] },
  { nom: 'Grande Conso', color: '#FF9966', per: [14, 22], evEbitda: [8, 15], evFcf: [14, 22], ex: ['Danone', 'L\'Oréal', 'Carrefour'] },
]

export default function InteractiveMultiples() {
  const [selectedSecteur, setSelectedSecteur] = useState(0)
  const [userPer, setUserPer] = useState(20)
  const [userEvEbitda, setUserEvEbitda] = useState(12)

  const s = secteurs[selectedSecteur]

  const getStatus = (val: number, min: number, max: number) => {
    if (min === 0 && max === 0) return null
    if (val < min) return { label: 'Sous-évalué', color: '#00D47E', emoji: '🟢' }
    if (val > max) return { label: 'Surévalué', color: '#FF6B6B', emoji: '🔴' }
    return { label: 'Dans la norme', color: '#FFD700', emoji: '🟡' }
  }

  const perStatus = getStatus(userPer, s.per[0], s.per[1])
  const evStatus = getStatus(userEvEbitda, s.evEbitda[0], s.evEbitda[1])

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(255,215,0,.25)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Comparateur de multiples sectoriel</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Choisis un secteur et saisis les multiples d'une entreprise pour la positionner</div>

      {/* Secteurs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {secteurs.map((sec, i) => (
          <button key={i} onClick={() => setSelectedSecteur(i)} style={{
            padding: '7px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .15s',
            background: i === selectedSecteur ? sec.color : 'rgba(255,255,255,.05)',
            color: i === selectedSecteur ? '#0F0F2A' : 'rgba(255,255,255,.5)',
            border: `1px solid ${i === selectedSecteur ? sec.color : 'rgba(255,255,255,.08)'}`,
          }}>
            {sec.nom}
          </button>
        ))}
      </div>

      {/* Fourchettes normales */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: `1px solid ${s.color}30` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 12 }}>
          Fourchettes normales — {s.nom}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'PER', range: s.per },
            { label: 'EV/EBITDA', range: s.evEbitda },
            { label: 'EV/FCF', range: s.evFcf },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 8px' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>{m.label}</div>
              {m.range[0] === 0 ? (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontStyle: 'italic' }}>N/A<br/><span style={{ fontSize: 9 }}>Banques : ratio P/B</span></div>
              ) : (
                <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{m.range[0]}x – {m.range[1]}x</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,.35)' }}>
          Exemples : {s.ex.join(' · ')}
        </div>
      </div>

      {/* Saisie utilisateur */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>
          Positionne ton entreprise dans ce secteur :
        </div>
        {[
          { label: 'PER de ton entreprise', value: userPer, min: 3, max: 60, setter: setUserPer, status: perStatus },
          ...(s.evEbitda[0] > 0 ? [{ label: 'EV/EBITDA de ton entreprise', value: userEvEbitda, min: 1, max: 40, setter: setUserEvEbitda, status: evStatus }] : []),
        ].map((slider, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{slider.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: slider.status?.color || 'white' }}>{slider.value}x</span>
                {slider.status && <span style={{ fontSize: 10, fontWeight: 700, color: slider.status.color }}>{slider.status.emoji} {slider.status.label}</span>}
              </div>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%`, background: slider.status?.color || s.color, borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={slider.min} max={slider.max} step={1} value={slider.value} onChange={e => slider.setter(Number(e.target.value))} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Un PER de 25x est surévalué dans l'énergie, normal dans la grande conso, et même bas dans le luxe. Toujours contextualiser dans le secteur avant de conclure.
      </div>
    </div>
  )
}
