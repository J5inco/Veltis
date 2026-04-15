'use client'
import { useState, useMemo } from 'react'

export default function InteractiveETFvsActif() {
  const [capital, setCapital] = useState(10000)
  const [horizon, setHorizon] = useState(20)
  const [rendementBrut, setRendementBrut] = useState(7)

  const fraisETF = 0.20
  const fraisActif = 1.80

  const data = useMemo(() => {
    const points = []
    for (let y = 0; y <= horizon; y++) {
      const etf = capital * Math.pow(1 + (rendementBrut - fraisETF) / 100, y)
      const actif = capital * Math.pow(1 + (rendementBrut - fraisActif) / 100, y)
      points.push({ year: y, etf: Math.round(etf), actif: Math.round(actif) })
    }
    const last = points[points.length - 1]
    const ecart = last.etf - last.actif
    const fraisPerdusTotaux = Math.round(capital * Math.pow(1 + rendementBrut / 100, horizon) - last.etf)
    return { points, finalETF: last.etf, finalActif: last.actif, ecart, fraisPerdusTotaux }
  }, [capital, horizon, rendementBrut])

  const maxVal = Math.max(...data.points.map(p => p.etf))
  const chartH = 140

  const formatK = (n: number) => n >= 1000 ? `${Math.round(n / 1000)}k€` : `${n}€`

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20,
      padding: '28px 24px',
      margin: '24px 0',
      border: '1px solid rgba(0,212,126,.3)',
      fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#00D47E', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>
        Visuel interactif
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>
        ETF indiciel vs Fonds actif
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>
        L'impact réel des frais sur ton patrimoine sur le long terme
      </div>

      {/* CURSEURS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Capital initial', value: capital, min: 1000, max: 50000, step: 1000, format: (v: number) => `${v.toLocaleString('fr-FR')}€`, setter: setCapital, color: '#FFD700' },
          { label: 'Horizon de placement', value: horizon, min: 5, max: 30, step: 1, format: (v: number) => `${v} ans`, setter: setHorizon, color: '#3B3BF9' },
          { label: 'Rendement brut annuel', value: rendementBrut, min: 3, max: 12, step: 0.5, format: (v: number) => `${v}%`, setter: setRendementBrut, color: '#00D47E' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.format(s.value)}</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`,
                background: s.color, borderRadius: 3, transition: 'width .1s'
              }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseFloat(e.target.value))}
                style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* LÉGENDE FRAIS */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: `ETF indiciel (${fraisETF}%/an)`, color: '#00D47E', val: data.finalETF },
          { label: `Fonds actif (${fraisActif}%/an)`, color: '#FF6B6B', val: data.finalActif },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 140,
            background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '12px 16px',
            border: `1px solid ${item.color}40`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>{item.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>
              {item.val.toLocaleString('fr-FR')}€
            </div>
          </div>
        ))}
      </div>

      {/* GRAPHIQUE SVG */}
      <div style={{ marginBottom: 16 }}>
        <svg width="100%" viewBox={`0 0 400 ${chartH + 30}`} style={{ overflow: 'visible' }}>
          {/* Grille */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
            <g key={i}>
              <line x1={0} y1={chartH * (1 - frac)} x2={400} y2={chartH * (1 - frac)}
                stroke="rgba(255,255,255,.06)" strokeWidth={1} />
              <text x={-4} y={chartH * (1 - frac) + 4} fontSize={9} fill="rgba(255,255,255,.3)" textAnchor="end">
                {formatK(Math.round(maxVal * frac))}
              </text>
            </g>
          ))}

          {/* Courbe fonds actif */}
          <polyline
            points={data.points.map((p, i) =>
              `${(i / (data.points.length - 1)) * 400},${chartH - (p.actif / maxVal) * chartH}`
            ).join(' ')}
            fill="none" stroke="#FF6B6B" strokeWidth={2.5} strokeDasharray="6,3"
            style={{ transition: 'points .3s ease' }}
          />

          {/* Courbe ETF */}
          <polyline
            points={data.points.map((p, i) =>
              `${(i / (data.points.length - 1)) * 400},${chartH - (p.etf / maxVal) * chartH}`
            ).join(' ')}
            fill="none" stroke="#00D47E" strokeWidth={2.5}
            style={{ transition: 'points .3s ease' }}
          />

          {/* Zone entre les courbes */}
          <polygon
            points={[
              ...data.points.map((p, i) => `${(i / (data.points.length - 1)) * 400},${chartH - (p.etf / maxVal) * chartH}`),
              ...[...data.points].reverse().map((p, i) =>
                `${((data.points.length - 1 - i) / (data.points.length - 1)) * 400},${chartH - (p.actif / maxVal) * chartH}`
              )
            ].join(' ')}
            fill="rgba(0,212,126,.08)"
          />

          {/* Axe X — années */}
          {data.points.filter((_, i) => i % Math.ceil(horizon / 5) === 0 || i === horizon).map((p, i) => (
            <text key={i}
              x={(p.year / horizon) * 400}
              y={chartH + 18}
              fontSize={9} fill="rgba(255,255,255,.3)" textAnchor="middle"
            >
              A{p.year}
            </text>
          ))}
        </svg>
      </div>

      {/* ÉCART */}
      <div style={{
        background: 'rgba(0,212,126,.1)', border: '1px solid rgba(0,212,126,.25)',
        borderRadius: 14, padding: '14px 18px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>
            Avantage ETF après {horizon} ans
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#00D47E' }}>
            +{data.ecart.toLocaleString('fr-FR')}€
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>
            Uniquement à cause des frais
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>
            {fraisActif - fraisETF}%/an de différence → {((data.ecart / capital) * 100).toFixed(0)}% de capital en plus
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 14px',
        background: 'rgba(255,255,255,.04)', borderRadius: 10,
        fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300
      }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Essaie un horizon de 30 ans. La différence dépasse souvent ton capital initial. Les frais ne semblent pas importants au quotidien (1,6% d'écart), mais sur 30 ans les intérêts composés transforment cet écart en une fortune entière.
      </div>
    </div>
  )
}
