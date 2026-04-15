'use client'
import { useState, useMemo } from 'react'

export default function InteractiveDCA() {
  const [montantTotal, setMontantTotal] = useState(6000)
  const [moisDCA, setMoisDCA] = useState(12)
  const [volatilite, setVolatilite] = useState(2) // 1=stable, 2=volatile, 3=crash

  const scenarios = [
    { label: 'Marché stable', emoji: '📈', color: '#00D47E' },
    { label: 'Marché volatile', emoji: '〰️', color: '#FFD700' },
    { label: 'Crash puis rebond', emoji: '📉📈', color: '#FF9999' },
  ]

  // Génère des cours simulés selon le scénario
  const cours = useMemo(() => {
    const base = 100
    const result = [base]
    if (volatilite === 1) {
      // Stable : hausse régulière +5%/an
      for (let i = 1; i <= moisDCA; i++) result.push(Math.round(base * (1 + 0.05 / 12 * i) * 10) / 10)
    } else if (volatilite === 2) {
      // Volatile : oscillations autour d'une tendance haussière
      for (let i = 1; i <= moisDCA; i++) {
        const trend = base * (1 + 0.06 / 12 * i)
        const noise = Math.sin(i * 1.2) * 12 + Math.cos(i * 0.8) * 8
        result.push(Math.round((trend + noise) * 10) / 10)
      }
    } else {
      // Crash puis rebond
      for (let i = 1; i <= moisDCA; i++) {
        const crashPct = Math.min(1, i / (moisDCA * 0.4))
        const reboundPct = Math.max(0, (i - moisDCA * 0.4) / (moisDCA * 0.6))
        const crashVal = base * (1 - 0.35 * crashPct)
        const reboundVal = crashVal + (base * 1.1 - crashVal) * reboundPct
        result.push(Math.round(reboundVal * 10) / 10)
      }
    }
    return result
  }, [moisDCA, volatilite])

  // Calcul DCA
  const resultDCA = useMemo(() => {
    const mensuel = montantTotal / moisDCA
    let parts = 0
    let invested = 0
    const snapshots = []
    for (let i = 1; i <= moisDCA; i++) {
      parts += mensuel / cours[i]
      invested += mensuel
      snapshots.push({ mois: i, parts, valeur: Math.round(parts * cours[i]) })
    }
    const prixMoyen = montantTotal / parts
    return { parts, valeur: Math.round(parts * cours[cours.length - 1]), prixMoyen: Math.round(prixMoyen * 10) / 10, snapshots }
  }, [montantTotal, moisDCA, cours])

  // Calcul Lump Sum (tout en une fois au cours initial)
  const resultLS = useMemo(() => {
    const parts = montantTotal / cours[0]
    const valeur = Math.round(parts * cours[cours.length - 1])
    return { parts, valeur, prixMoyen: cours[0] }
  }, [montantTotal, cours])

  const maxVal = Math.max(resultDCA.valeur, resultLS.valeur, montantTotal)
  const chartH = 80
  const winner = resultDCA.valeur >= resultLS.valeur ? 'DCA' : 'Lump Sum'

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(59,59,249,.3)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>DCA vs Investissement unique</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Compare les deux stratégies selon le type de marché</div>

      {/* Paramètres */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
        {[
          { label: 'Capital total à investir', value: montantTotal, min: 1000, max: 20000, step: 500, format: (v: number) => `${v.toLocaleString('fr-FR')}€`, setter: setMontantTotal, color: '#FFD700' },
          { label: 'Durée du DCA', value: moisDCA, min: 3, max: 24, step: 3, format: (v: number) => `${v} mois`, setter: setMoisDCA, color: '#3B3BF9' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.format(s.value)}</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`, background: s.color, borderRadius: 3 }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.setter(Number(e.target.value))} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}

        {/* Scénario marché */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>Scénario de marché</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {scenarios.map((sc, i) => (
              <button key={i} onClick={() => setVolatilite(i + 1)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .15s',
                background: volatilite === i + 1 ? sc.color + '30' : 'rgba(255,255,255,.04)',
                color: volatilite === i + 1 ? 'white' : 'rgba(255,255,255,.4)',
                border: `1px solid ${volatilite === i + 1 ? sc.color : 'rgba(255,255,255,.08)'}`,
              }}>
                {sc.emoji}<br />{sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courbe des cours */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 6 }}>Évolution du cours simulé (base 100)</div>
        <svg width="100%" viewBox={`0 0 400 ${chartH}`} style={{ overflow: 'visible' }}>
          <polyline
            points={cours.map((c, i) => `${(i / cours.length) * 400},${chartH - ((c - Math.min(...cours)) / (Math.max(...cours) - Math.min(...cours) + 1)) * (chartH - 10)}`).join(' ')}
            fill="none" stroke={scenarios[volatilite - 1].color} strokeWidth={2}
          />
          {/* Prix d'achat DCA = cours moyen */}
          <line x1={0} y1={chartH - ((resultDCA.prixMoyen - Math.min(...cours)) / (Math.max(...cours) - Math.min(...cours) + 1)) * (chartH - 10)} x2={400} y2={chartH - ((resultDCA.prixMoyen - Math.min(...cours)) / (Math.max(...cours) - Math.min(...cours) + 1)) * (chartH - 10)} stroke="#3B3BF9" strokeWidth={1} strokeDasharray="4,3" />
          <line x1={0} y1={chartH - ((cours[0] - Math.min(...cours)) / (Math.max(...cours) - Math.min(...cours) + 1)) * (chartH - 10)} x2={400} y2={chartH - ((cours[0] - Math.min(...cours)) / (Math.max(...cours) - Math.min(...cours) + 1)) * (chartH - 10)} stroke="#FFD700" strokeWidth={1} strokeDasharray="4,3" />
        </svg>
        <div style={{ display: 'flex', gap: 16, fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>
          <span><span style={{ color: '#FFD700' }}>——</span> Prix Lump Sum : {cours[0]}€</span>
          <span><span style={{ color: '#3B3BF9' }}>- - -</span> Prix moyen DCA : {resultDCA.prixMoyen}€</span>
        </div>
      </div>

      {/* Résultats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: '💧 DCA', sub: `${montantTotal / moisDCA}€/mois × ${moisDCA} mois`, valeur: resultDCA.valeur, prixMoyen: resultDCA.prixMoyen, color: '#3B3BF9', isWinner: winner === 'DCA' },
          { label: '💰 Lump Sum', sub: `Tout investi au départ`, valeur: resultLS.valeur, prixMoyen: resultLS.prixMoyen, color: '#FFD700', isWinner: winner === 'Lump Sum' },
        ].map((r, i) => (
          <div key={i} style={{ background: r.isWinner ? `${r.color}20` : 'rgba(255,255,255,.04)', borderRadius: 14, padding: '14px', border: `1px solid ${r.isWinner ? r.color + '50' : 'rgba(255,255,255,.08)'}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.isWinner ? r.color : 'rgba(255,255,255,.6)', marginBottom: 2 }}>
              {r.label} {r.isWinner ? '🏆' : ''}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>{r.sub}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: r.isWinner ? r.color : 'rgba(255,255,255,.7)' }}>
              {r.valeur.toLocaleString('fr-FR')}€
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>
              Prix moyen : {r.prixMoyen}€/part
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Le DCA brille dans les marchés volatils et en crash. Le Lump Sum gagne en marché haussier stable. Pour 95% des investisseurs particuliers, le DCA est préférable car il élimine la décision de timing — la plus émotionnelle qui soit.
      </div>
    </div>
  )
}
