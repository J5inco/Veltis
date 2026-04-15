'use client'
import { useState, useMemo } from 'react'

export default function InteractivePortfolioBuilder() {
  const [age, setAge] = useState(28)
  const [montant, setMontant] = useState(300)
  const [horizon, setHorizon] = useState(20)
  const [risque, setRisque] = useState(2) // 1=prudent, 2=équilibré, 3=dynamique

  const profils = [
    { label: 'Prudent', color: '#9898B8' },
    { label: 'Équilibré', color: '#3B3BF9' },
    { label: 'Dynamique', color: '#00D47E' },
  ]

  const allocation = useMemo(() => {
    // Base allocation par horizon et risque
    let actions = 0
    const horizonFactor = Math.min((horizon - 5) / 25, 1) // 0 à 1 selon horizon 5-30 ans
    const ageFactor = Math.max(0, (65 - age) / 65) // plus jeune = plus d'actions

    if (risque === 1) actions = Math.round(30 + horizonFactor * 30 + ageFactor * 10)
    if (risque === 2) actions = Math.round(50 + horizonFactor * 30 + ageFactor * 10)
    if (risque === 3) actions = Math.round(70 + horizonFactor * 20 + ageFactor * 8)

    actions = Math.min(95, Math.max(20, actions))
    const obligations = Math.round((100 - actions) * 0.8)
    const or = 100 - actions - obligations

    return { actions, obligations, or }
  }, [age, horizon, risque])

  const etfs = useMemo(() => {
    const list = []
    const actionsAmount = Math.round(montant * allocation.actions / 100)
    const obliAmount = Math.round(montant * allocation.obligations / 100)
    const orAmount = montant - actionsAmount - obliAmount

    list.push({
      ticker: 'CW8',
      nom: 'Amundi MSCI World',
      type: 'Actions Monde',
      pct: Math.round(allocation.actions * 0.65),
      montant: Math.round(actionsAmount * 0.65),
      color: '#3B3BF9',
    })
    list.push({
      ticker: 'ESE',
      nom: 'Amundi Euro Stoxx 600',
      type: 'Actions Europe',
      pct: allocation.actions - Math.round(allocation.actions * 0.65),
      montant: actionsAmount - Math.round(actionsAmount * 0.65),
      color: '#6B6BFA',
    })
    if (obliAmount > 0) list.push({
      ticker: 'MTH',
      nom: 'Amundi Oblig Court Terme',
      type: 'Obligations',
      pct: allocation.obligations,
      montant: obliAmount,
      color: '#FFD700',
    })
    if (orAmount > 0) list.push({
      ticker: 'GOLD',
      nom: 'Amundi Physical Gold',
      type: 'Or physique',
      pct: allocation.or,
      montant: orAmount,
      color: '#FFA500',
    })
    return list
  }, [montant, allocation])

  // Projection capital
  const projection = useMemo(() => {
    const rendement = risque === 1 ? 4.5 : risque === 2 ? 6.0 : 7.5
    const points = []
    for (let y = 0; y <= horizon; y++) {
      // FV of annuity = PMT * [(1+r)^n - 1] / r
      const r = rendement / 100
      const fv = montant * 12 * ((Math.pow(1 + r, y) - 1) / r)
      points.push({ year: y, val: Math.round(fv) })
    }
    const totalVerse = montant * 12 * horizon
    const finalVal = points[points.length - 1].val
    const interets = finalVal - totalVerse
    return { points, totalVerse, finalVal, interets, rendement }
  }, [montant, horizon, risque])

  const maxVal = Math.max(...projection.points.map(p => p.val), 1)
  const formatK = (n: number) => n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M€`
    : n >= 1000 ? `${Math.round(n / 1000)}k€` : `${n}€`

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20,
      padding: '28px 24px',
      margin: '24px 0',
      border: '1px solid rgba(59,59,249,.3)',
      fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>
        Visuel interactif
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>
        Construis ton portefeuille
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>
        Ajuste tes paramètres — l'allocation et la projection se calculent en temps réel
      </div>

      {/* PARAMÈTRES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
        {[
          { label: 'Ton âge', value: age, min: 18, max: 60, step: 1, format: (v: number) => `${v} ans`, setter: setAge, color: '#FFD700' },
          { label: 'Versement mensuel', value: montant, min: 50, max: 2000, step: 50, format: (v: number) => `${v}€/mois`, setter: setMontant, color: '#00D47E' },
          { label: "Horizon de placement", value: horizon, min: 5, max: 30, step: 1, format: (v: number) => `${v} ans`, setter: setHorizon, color: '#3B3BF9' },
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

        {/* PROFIL RISQUE */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>Profil de risque</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {profils.map((p, i) => (
              <button key={i} onClick={() => setRisque(i + 1)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
                background: risque === i + 1 ? p.color : 'rgba(255,255,255,.05)',
                color: risque === i + 1 ? 'white' : 'rgba(255,255,255,.4)',
                border: risque === i + 1 ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,.1)',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ALLOCATION RECOMMANDÉE */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
          Allocation recommandée
        </div>

        {/* BARRE ALLOCATION */}
        <div style={{ height: 20, borderRadius: 10, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
          <div style={{ width: `${allocation.actions}%`, background: '#3B3BF9', transition: 'width .3s ease' }} />
          <div style={{ width: `${allocation.obligations}%`, background: '#FFD700', transition: 'width .3s ease' }} />
          <div style={{ width: `${allocation.or}%`, background: '#FFA500', transition: 'width .3s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'Actions', pct: allocation.actions, color: '#3B3BF9' },
            { label: 'Obligations', pct: allocation.obligations, color: '#FFD700' },
            { label: 'Or', pct: allocation.or, color: '#FFA500' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ETF RECOMMANDÉS */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 10 }}>
          ETF concrets à acheter dans ton PEA ({montant}€/mois)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {etfs.map((etf, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 14px',
              border: `1px solid ${etf.color}25`
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: `${etf.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 800, color: etf.color, flexShrink: 0
              }}>
                {etf.ticker}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{etf.nom}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{etf.type}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: etf.color }}>{etf.montant}€</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{etf.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTION */}
      <div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
          Projection à {horizon} ans · rendement estimé {projection.rendement}%/an
        </div>

        {/* GRAPHIQUE */}
        <svg width="100%" viewBox="0 0 400 100" style={{ overflow: 'visible', marginBottom: 8 }}>
          {[0, 0.5, 1].map((frac, i) => (
            <g key={i}>
              <line x1={0} y1={90 * (1 - frac)} x2={400} y2={90 * (1 - frac)}
                stroke="rgba(255,255,255,.05)" strokeWidth={1} />
              <text x={-4} y={90 * (1 - frac) + 4} fontSize={8} fill="rgba(255,255,255,.25)" textAnchor="end">
                {formatK(Math.round(maxVal * frac))}
              </text>
            </g>
          ))}
          {/* Zone versements */}
          <polygon
            points={projection.points.map((p, i) => {
              const x = (i / (projection.points.length - 1)) * 400
              const versement = Math.min(montant * 12 * p.year, p.val)
              return `${x},${90 - (versement / maxVal) * 90}`
            }).join(' ') + ` 400,90 0,90`}
            fill="rgba(59,59,249,.2)"
          />
          {/* Courbe totale */}
          <polyline
            points={projection.points.map((p, i) =>
              `${(i / (projection.points.length - 1)) * 400},${90 - (p.val / maxVal) * 90}`
            ).join(' ')}
            fill="none"
            stroke={profils[risque - 1].color}
            strokeWidth={2.5}
            style={{ transition: 'points .3s ease' }}
          />
          {/* Labels axe X */}
          {[0, Math.floor(horizon / 2), horizon].map((y) => (
            <text key={y}
              x={(y / horizon) * 400} y={105}
              fontSize={8} fill="rgba(255,255,255,.25)" textAnchor="middle"
            >
              A{y}
            </text>
          ))}
        </svg>

        {/* RÉSULTATS FINAUX */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Capital final', val: formatK(projection.finalVal), color: profils[risque - 1].color },
            { label: 'Total versé', val: formatK(projection.totalVerse), color: '#9898B8' },
            { label: 'Intérêts composés', val: `+${formatK(projection.interets)}`, color: '#00D47E' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 12px',
              textAlign: 'center', border: `1px solid ${item.color}25`
            }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: '10px 14px',
          background: 'rgba(255,255,255,.04)', borderRadius: 10,
          fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300
        }}>
          💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — La zone bleue représente tes versements réels. La surface au-dessus c'est les intérêts composés — de l'argent généré par ton argent, sans effort supplémentaire de ta part. Plus l'horizon est long, plus cette zone domine.
        </div>
      </div>
    </div>
  )
}
