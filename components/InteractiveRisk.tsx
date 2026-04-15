'use client'
import { useState, useMemo } from 'react'

const actifs = [
  { nom: 'ETF Monde (MSCI World)', rendement: 7, volatilite: 15, color: '#3B3BF9', icon: '🌍' },
  { nom: 'Action tech (ex. NVIDIA)', rendement: 14, volatilite: 40, color: '#00D47E', icon: '💻' },
  { nom: 'Obligation d\'État', rendement: 3, volatilite: 5, color: '#FFD700', icon: '🏛️' },
  { nom: 'Or', rendement: 5, volatilite: 18, color: '#FFA500', icon: '🥇' },
]

function simulatePath(rendement: number, volatilite: number, horizon: number, seed: number) {
  const points = [100]
  let val = 100
  for (let y = 1; y <= horizon; y++) {
    // Simple GBM approximation with pseudo-random
    const noise = Math.sin(seed * 9301 + y * 49297 + 233720) * volatilite / 100
    const growth = (rendement / 100) + noise
    val = val * (1 + growth)
    points.push(Math.max(val, 5))
  }
  return points
}

export default function InteractiveRisk() {
  const [selected, setSelected] = useState(0)
  const [horizon, setHorizon] = useState(10)
  const actif = actifs[selected]

  const paths = useMemo(() => {
    return [42, 137, 283, 571].map(seed => simulatePath(actif.rendement, actif.volatilite, horizon, seed))
  }, [actif, horizon])

  const maxVal = Math.max(...paths.flat())
  const minVal = Math.min(...paths.flat())
  const chartH = 120
  const chartW = 400

  const getY = (val: number) => chartH - ((val - minVal) / (maxVal - minVal + 1)) * chartH

  const finalVals = paths.map(p => p[p.length - 1])
  const bestCase = Math.round(Math.max(...finalVals))
  const worstCase = Math.round(Math.min(...finalVals))
  const median = Math.round(finalVals.sort((a, b) => a - b)[1])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(255,107,107,.25)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9999', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de risque et volatilité</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>Visualise ce que la volatilité fait réellement à ton capital sur 100€ investis</div>

      {/* CHOIX ACTIF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6, marginBottom: 20 }}>
        {actifs.map((a, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: '10px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, textAlign: 'left',
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: selected === i ? `${a.color}18` : 'rgba(255,255,255,.04)',
            color: selected === i ? a.color : 'rgba(255,255,255,.4)',
            border: selected === i ? `1px solid ${a.color}50` : '1px solid rgba(255,255,255,.06)',
          }}>
            <div>{a.icon} {a.nom}</div>
            <div style={{ fontSize: 10, marginTop: 3, opacity: 0.7 }}>Rend. ~{a.rendement}%/an · Volatilité ~{a.volatilite}%</div>
          </button>
        ))}
      </div>

      {/* HORIZON */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Horizon de placement</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: actif.color }}>{horizon} ans</span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((horizon - 1) / 29) * 100}%`, background: actif.color, borderRadius: 3, transition: 'width .1s' }} />
          <input type="range" min={1} max={30} step={1} value={horizon}
            onChange={e => setHorizon(parseInt(e.target.value))}
            style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
        </div>
      </div>

      {/* GRAPHIQUE */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>4 scénarios simulés pour 100€ investis</div>
        <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} style={{ overflow: 'visible' }}>
          {/* Ligne 100€ */}
          <line x1={0} y1={getY(100)} x2={chartW} y2={getY(100)} stroke="rgba(255,255,255,.1)" strokeWidth={1} strokeDasharray="4,3" />
          <text x={chartW + 4} y={getY(100) + 4} fontSize={8} fill="rgba(255,255,255,.25)">100€</text>

          {/* Chemins */}
          {paths.map((path, pi) => (
            <polyline key={pi}
              points={path.map((val, i) => `${(i / (path.length - 1)) * chartW},${getY(val)}`).join(' ')}
              fill="none"
              stroke={actif.color}
              strokeWidth={pi === 0 ? 2.5 : 1.5}
              strokeOpacity={pi === 0 ? 0.9 : 0.35}
            />
          ))}

          {/* Axe X */}
          {[0, Math.floor(horizon / 2), horizon].map(y => (
            <text key={y} x={(y / horizon) * chartW} y={chartH + 16} fontSize={8} fill="rgba(255,255,255,.25)" textAnchor="middle">
              A{y}
            </text>
          ))}
        </svg>
      </div>

      {/* RÉSULTATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Meilleur scénario', val: `${bestCase}€`, color: '#00D47E' },
          { label: 'Scénario médian', val: `${median}€`, color: actif.color },
          { label: 'Pire scénario', val: `${worstCase}€`, color: '#FF9999' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 12px', textAlign: 'center', border: `1px solid ${item.color}25` }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 4, textTransform: 'uppercase' }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>pour 100€ investis</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Ce que la volatilité signifie vraiment</strong> — Une volatilité de {actif.volatilite}% ne veut pas dire que tu perds {actif.volatilite}% par an. Ça veut dire que les rendements oscillent fortement autour de la moyenne. Sur le long terme, les hauts et les bas se compensent. C'est pourquoi l'horizon de placement est la variable qui change tout.
      </div>
    </div>
  )
}
