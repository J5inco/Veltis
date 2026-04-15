'use client'
import { useState, useMemo } from 'react'

export default function InteractiveDividend() {
  const [prixAchat, setPrixAchat] = useState(100)
  const [dividende, setDividende] = useState(4)
  const [croissance, setCroissance] = useState(5)
  const [horizon, setHorizon] = useState(15)
  const [reinvestir, setReinvestir] = useState(true)

  const data = useMemo(() => {
    const points = []
    let actions = 100 // on achète 100 actions à prixAchat€
    let capital = 100 * prixAchat
    let totalDividendes = 0

    for (let y = 0; y <= horizon; y++) {
      const prixActuel = prixAchat * Math.pow(1 + croissance / 100, y)
      const dividendeParAction = dividende / 100 * prixActuel
      const dividendeTotal = actions * dividendeParAction
      totalDividendes += dividendeTotal

      if (reinvestir && y > 0) {
        const nouvellesActions = dividendeTotal / prixActuel
        actions += nouvellesActions
      }

      capital = actions * prixActuel
      points.push({ year: y, capital: Math.round(capital), dividendeAnnuel: Math.round(dividendeTotal), actions: Math.round(actions * 10) / 10 })
    }

    const investissementInitial = 100 * prixAchat
    const rendementSurPrixAchat = Math.round((points[horizon].dividendeAnnuel / investissementInitial) * 100 * 10) / 10

    return { points, rendementSurPrixAchat, investissementInitial, totalDividendes: Math.round(totalDividendes) }
  }, [prixAchat, dividende, croissance, horizon, reinvestir])

  const maxVal = Math.max(...data.points.map(p => p.capital))
  const last = data.points[data.points.length - 1]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(0,212,126,.3)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#00D47E', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de dividendes</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Modélise l'impact du réinvestissement des dividendes sur le long terme</div>

      {/* CURSEURS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Prix d\'achat par action', value: prixAchat, min: 10, max: 500, step: 5, unit: '€', setter: setPrixAchat, color: '#FFD700' },
          { label: 'Rendement dividende initial', value: dividende, min: 0.5, max: 10, step: 0.5, unit: '%', setter: setDividende, color: '#00D47E' },
          { label: 'Croissance annuelle du cours', value: croissance, min: 0, max: 15, step: 1, unit: '%', setter: setCroissance, color: '#3B3BF9' },
          { label: 'Horizon', value: horizon, min: 5, max: 30, step: 1, unit: ' ans', setter: setHorizon, color: '#9898B8' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}{s.unit}</span>
            </div>
            <div style={{ position: 'relative', height: 5, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`, background: s.color, borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseFloat(e.target.value))}
                style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}
      </div>

      {/* TOGGLE RÉINVESTISSEMENT */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[true, false].map(val => (
          <button key={String(val)} onClick={() => setReinvestir(val)} style={{
            flex: 1, padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            background: reinvestir === val ? (val ? 'rgba(0,212,126,.15)' : 'rgba(255,107,107,.1)') : 'rgba(255,255,255,.04)',
            color: reinvestir === val ? (val ? '#00D47E' : '#FF9999') : 'rgba(255,255,255,.35)',
            border: reinvestir === val ? `1px solid ${val ? 'rgba(0,212,126,.4)' : 'rgba(255,107,107,.3)'}` : '1px solid rgba(255,255,255,.06)',
          }}>
            {val ? '↺ Dividendes réinvestis' : '💸 Dividendes encaissés'}
          </button>
        ))}
      </div>

      {/* GRAPHIQUE */}
      <div style={{ marginBottom: 16 }}>
        <svg width="100%" viewBox="0 0 400 110" style={{ overflow: 'visible' }}>
          <line x1={0} y1={90 - (data.investissementInitial / maxVal) * 90} x2={400} y2={90 - (data.investissementInitial / maxVal) * 90}
            stroke="rgba(255,255,255,.1)" strokeWidth={1} strokeDasharray="4,3" />
          <text x={404} y={90 - (data.investissementInitial / maxVal) * 90 + 4} fontSize={8} fill="rgba(255,255,255,.25)">
            {(data.investissementInitial / 1000).toFixed(0)}k€
          </text>
          <polyline
            points={data.points.map((p, i) => `${(i / (data.points.length - 1)) * 400},${90 - (p.capital / maxVal) * 90}`).join(' ')}
            fill="none" stroke="#00D47E" strokeWidth={2.5} style={{ transition: 'points .3s' }}
          />
          {[0, Math.floor(horizon / 2), horizon].map(y => (
            <text key={y} x={(y / horizon) * 400} y={107} fontSize={8} fill="rgba(255,255,255,.25)" textAnchor="middle">A{y}</text>
          ))}
        </svg>
      </div>

      {/* RÉSULTATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Capital final', val: `${(last.capital / 1000).toFixed(0)}k€`, sub: `vs ${(data.investissementInitial / 1000).toFixed(0)}k€ investi`, color: '#00D47E' },
          { label: 'Dividendes totaux perçus', val: `${(data.totalDividendes / 1000).toFixed(0)}k€`, sub: `sur ${horizon} ans`, color: '#FFD700' },
          { label: 'Dividende annuel en A' + horizon, val: `${(last.dividendeAnnuel / 1000).toFixed(1)}k€`, sub: `rendement/${prixAchat}€ = ${data.rendementSurPrixAchat}%`, color: '#3B3BF9' },
          { label: 'Nombre d\'actions', val: `${last.actions}`, sub: reinvestir ? 'grâce au réinvestissement' : '100 (inchangé)', color: '#9898B8' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '12px 14px', border: `1px solid ${item.color}20` }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Le "yield on cost"</strong> — {data.rendementSurPrixAchat}% c'est le rendement sur ton prix d'achat initial après {horizon} ans. Si tu achètes une action à {prixAchat}€ avec {dividende}% de rendement, dans {horizon} ans ton dividende annuel représente {data.rendementSurPrixAchat}% de ton prix d'achat initial. Le dividende grossit, le prix payé lui ne change pas.
      </div>
    </div>
  )
}
