'use client'
import { useState, useMemo } from 'react'

export default function InteractiveRebalancing() {
  const [annees, setAnnees] = useState(3)
  const [rebalanced, setRebalanced] = useState(false)

  const cibleActions = 70
  const cibleObligations = 20
  const cibleOr = 10

  // Simulation de dérive sur N années
  const drift = useMemo(() => {
    const rendActions = 0.10
    const rendObli = 0.03
    const rendOr = 0.06

    let actions = 70000
    let obligations = 20000
    let or = 10000

    for (let y = 0; y < annees; y++) {
      actions *= (1 + rendActions)
      obligations *= (1 + rendObli)
      or *= (1 + rendOr)
    }

    const total = actions + obligations + or
    return {
      actions: Math.round(actions),
      obligations: Math.round(obligations),
      or: Math.round(or),
      total: Math.round(total),
      pctActions: Math.round((actions / total) * 100),
      pctObligations: Math.round((obligations / total) * 100),
      pctOr: Math.round((or / total) * 100),
    }
  }, [annees])

  const ops = useMemo(() => {
    if (!rebalanced) return []
    const targetActions = Math.round(drift.total * cibleActions / 100)
    const targetObligations = Math.round(drift.total * cibleObligations / 100)
    const targetOr = Math.round(drift.total * cibleOr / 100)
    return [
      { label: 'Actions', current: drift.actions, target: targetActions, diff: targetActions - drift.actions, color: '#3B3BF9' },
      { label: 'Obligations', current: drift.obligations, target: targetObligations, diff: targetObligations - drift.obligations, color: '#FFD700' },
      { label: 'Or', current: drift.or, target: targetOr, diff: targetOr - drift.or, color: '#FFA500' },
    ]
  }, [rebalanced, drift])

  const fmt = (n: number) => `${(n / 1000).toFixed(1)}k€`

  const allocs = rebalanced
    ? [{ pct: cibleActions, color: '#3B3BF9' }, { pct: cibleObligations, color: '#FFD700' }, { pct: cibleOr, color: '#FFA500' }]
    : [{ pct: drift.pctActions, color: '#3B3BF9' }, { pct: drift.pctObligations, color: '#FFD700' }, { pct: drift.pctOr, color: '#FFA500' }]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(59,59,249,.25)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de dérive d'allocation</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Vois comment ton portefeuille dérive avec le temps et le coût du non-rebalancing</div>

      {/* ALLOCATION CIBLE */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 8 }}>Allocation cible de départ · Capital initial 100 000€</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Actions', pct: cibleActions, color: '#3B3BF9', montant: 70000 },
            { label: 'Obligations', pct: cibleObligations, color: '#FFD700', montant: 20000 },
            { label: 'Or', pct: cibleOr, color: '#FFA500', montant: 10000 },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: `${item.color}15`, borderRadius: 10, padding: '10px', border: `1px solid ${item.color}30`, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.pct}%</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{fmt(item.montant)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CURSEUR ANNÉES */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Années sans rebalancing</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#3B3BF9' }}>{annees} ans</span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((annees - 1) / 9) * 100}%`, background: '#3B3BF9', borderRadius: 3, transition: 'width .1s' }} />
          <input type="range" min={1} max={10} step={1} value={annees}
            onChange={e => { setAnnees(parseInt(e.target.value)); setRebalanced(false) }}
            style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
        </div>
      </div>

      {/* DÉRIVE VISUELLE */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>
          {rebalanced ? 'Après rebalancing ✓' : `Après ${annees} ans sans rebalancing`}
        </div>
        <div style={{ height: 24, borderRadius: 10, overflow: 'hidden', display: 'flex', marginBottom: 8, transition: 'all .4s' }}>
          {allocs.map((a, i) => (
            <div key={i} style={{ width: `${a.pct}%`, background: a.color, transition: 'width .4s ease' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Actions', pct: rebalanced ? cibleActions : drift.pctActions, target: cibleActions, color: '#3B3BF9' },
            { label: 'Obligations', pct: rebalanced ? cibleObligations : drift.pctObligations, target: cibleObligations, color: '#FFD700' },
            { label: 'Or', pct: rebalanced ? cibleOr : drift.pctOr, target: cibleOr, color: '#FFA500' },
          ].map((item, i) => {
            const ecart = item.pct - item.target
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span>
                {!rebalanced && Math.abs(ecart) >= 2 && (
                  <span style={{ fontSize: 10, color: ecart > 0 ? '#FF9999' : '#9898B8' }}>
                    ({ecart > 0 ? '+' : ''}{ecart}pts)
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CAPITAL */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Capital total après {annees} ans</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#00D47E' }}>{fmt(drift.total)}</span>
        </div>
      </div>

      {/* BOUTON REBALANCER */}
      {!rebalanced ? (
        <button onClick={() => setRebalanced(true)} style={{
          width: '100%', padding: '12px', borderRadius: 100, fontSize: 13, fontWeight: 700,
          background: '#3B3BF9', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Sora, sans-serif', marginBottom: 16
        }}>
          ⚖️ Rebalancer maintenant
        </button>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 10 }}>Opérations nécessaires pour rebalancer :</div>
            {ops.map((op, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 10, marginBottom: 6,
                background: op.diff < 0 ? 'rgba(255,107,107,.1)' : 'rgba(0,212,126,.08)',
                border: `1px solid ${op.diff < 0 ? 'rgba(255,107,107,.2)' : 'rgba(0,212,126,.2)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: op.color }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>{op.label}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>{fmt(op.current)} → {fmt(op.target)}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: op.diff < 0 ? '#FF9999' : '#00D47E' }}>
                  {op.diff < 0 ? '↓ Vendre ' : '↑ Acheter '}{fmt(Math.abs(op.diff))}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => setRebalanced(false)} style={{
            width: '100%', padding: '10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
            background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.1)',
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', marginBottom: 16
          }}>
            ← Revenir avant rebalancing
          </button>
        </>
      )}

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Pourquoi rebalancer</strong> — Sans rebalancing, les actions surperformantes prennent de plus en plus de place. Ton portefeuille devient progressivement plus risqué sans que tu l'aies décidé. Le rebalancing te force à vendre ce qui a monté et acheter ce qui a sous-performé — contre-intuitif mais rationnel.
      </div>
    </div>
  )
}
