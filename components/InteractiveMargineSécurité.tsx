'use client'
import { useState } from 'react'

export default function InteractiveMargineSécurité() {
  const [valeurIntrinseque, setValeurIntrinseque] = useState(100)
  const [coursBourse, setCoursBourse] = useState(70)

  const marge = valeurIntrinseque > 0 ? Math.round(((valeurIntrinseque - coursBourse) / valeurIntrinseque) * 100) : 0
  const surEvalue = coursBourse > valeurIntrinseque

  const getColor = () => {
    if (surEvalue) return '#FF6B6B'
    if (marge >= 30) return '#00D47E'
    if (marge >= 15) return '#FFD700'
    return '#FF9999'
  }

  const getLabel = () => {
    if (surEvalue) return { text: 'Surévaluée — éviter', emoji: '🚫' }
    if (marge >= 30) return { text: 'Marge confortable — opportunité', emoji: '✅' }
    if (marge >= 15) return { text: 'Marge acceptable — surveiller', emoji: '⚠️' }
    return { text: 'Marge insuffisante — attendre', emoji: '🔴' }
  }

  const verdict = getLabel()
  const color = getColor()
  const barWidth = Math.min(100, Math.max(0, surEvalue ? 0 : marge))

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(59,59,249,.3)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur marge de sécurité</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Saisis la valeur intrinsèque estimée et le cours actuel</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Valeur intrinsèque estimée', value: valeurIntrinseque, min: 10, max: 500, step: 5, setter: setValeurIntrinseque, color: '#3B3BF9' },
          { label: 'Cours actuel en bourse', value: coursBourse, min: 10, max: 500, step: 5, setter: setCoursBourse, color: '#FFD700' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}€</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`, background: s.color, borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.setter(Number(e.target.value))} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Résultat */}
      <div style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 16, padding: '20px', marginBottom: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Marge de sécurité</div>
        <div style={{ fontSize: 52, fontWeight: 800, color, letterSpacing: '-.04em', lineHeight: 1 }}>{surEvalue ? `-${Math.abs(marge)}%` : `${marge}%`}</div>
        <div style={{ fontSize: 13, marginTop: 10, fontWeight: 600, color }}>{verdict.emoji} {verdict.text}</div>
      </div>

      {/* Barre visuelle */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>
          <span>Cours ({coursBourse}€)</span>
          <span>Valeur intrinsèque ({valeurIntrinseque}€)</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,.08)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min(100, (coursBourse / valeurIntrinseque) * 100)}%`, background: color, borderRadius: 5, transition: 'all .3s' }} />
          {!surEvalue && <div style={{ position: 'absolute', left: `${Math.min(100, (coursBourse / valeurIntrinseque) * 100)}%`, top: 0, height: '100%', right: 0, background: `${color}30` }} />}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,.25)', marginTop: 4 }}>
          <span>← Prix payé</span>
          {!surEvalue && <span style={{ color: `${color}80` }}>← Marge ({marge}%) →</span>}
          <span>Valeur réelle →</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[{ label: '< 15%', desc: 'Insuffisant', c: '#FF6B6B' }, { label: '15–30%', desc: 'Acceptable', c: '#FFD700' }, { label: '> 30%', desc: 'Confortable', c: '#00D47E' }].map((z, i) => (
          <div key={i} style={{ background: `${z.c}10`, border: `1px solid ${z.c}25`, borderRadius: 10, padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: z.c }}>{z.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{z.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — La marge de sécurité protège contre tes propres erreurs d'estimation. Si tu estimes mal la valeur intrinsèque de 20%, une marge de 30% t'évite quand même de perdre de l'argent.
      </div>
    </div>
  )
}
