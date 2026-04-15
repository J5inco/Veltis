'use client'
import { useState } from 'react'

export default function InteractiveMarginOfSafety() {
  const [valeurIntrinseque, setValeurIntrinseque] = useState(100)
  const [coursMArche, setCoursMarche] = useState(70)

  const marge = valeurIntrinseque > 0
    ? Math.round(((valeurIntrinseque - coursMArche) / valeurIntrinseque) * 100)
    : 0

  const isOvervalued = coursMArche > valeurIntrinseque
  const color = isOvervalued ? '#FF6B6B' : marge >= 30 ? '#00D47E' : marge >= 15 ? '#FFD700' : '#FF9999'
  const label = isOvervalued ? 'Surévaluée ❌' : marge >= 30 ? 'Marge confortable ✅' : marge >= 15 ? 'Marge acceptable ⚠️' : 'Marge insuffisante ❌'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(59,59,249,.3)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de marge de sécurité</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Saisis ta valorisation et le cours du marché</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Valeur intrinsèque estimée', value: valeurIntrinseque, min: 10, max: 500, step: 5, setter: setValeurIntrinseque, color: '#00D47E' },
          { label: 'Cours actuel du marché', value: coursMArche, min: 5, max: 500, step: 5, setter: setCoursMarche, color: '#FFD700' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}€</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`, background: s.color, borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseInt(e.target.value))}
                style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}
      </div>

      {/* RÉSULTAT */}
      <div style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 16, padding: '20px 24px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Marge de sécurité</div>
        <div style={{ fontSize: 52, fontWeight: 800, color, letterSpacing: '-.04em', lineHeight: 1 }}>
          {isOvervalued ? `-${Math.abs(marge)}%` : `${marge}%`}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color, marginTop: 8 }}>{label}</div>
      </div>

      {/* VISUALISATION */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', height: 40, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
          {!isOvervalued ? (
            <>
              <div style={{ width: `${(coursMArche / valeurIntrinseque) * 100}%`, background: '#3B3BF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700, minWidth: 40 }}>
                {coursMArche}€
              </div>
              <div style={{ flex: 1, background: `${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color, fontWeight: 700 }}>
                Marge {marge}%
              </div>
            </>
          ) : (
            <div style={{ width: '100%', background: '#FF6B6B40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#FF9999', fontWeight: 700 }}>
              Cours ({coursMArche}€) &gt; Valeur intrinsèque ({valeurIntrinseque}€) — action surévaluée
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'rgba(255,255,255,.3)' }}>
          <span>0€</span>
          <span style={{ color: '#00D47E' }}>Valeur intrinsèque : {valeurIntrinseque}€</span>
        </div>
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Graham recommandait</strong> une marge de sécurité d'au moins 30-40%. Plus tu es incertain de ta valorisation, plus la marge doit être grande. Une marge de 30% signifie que même si tu t'es trompé de 30% dans ton estimation, tu ne perds pas d'argent.
      </div>
    </div>
  )
}
