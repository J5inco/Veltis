'use client'
import { useState, useMemo } from 'react'

export default function InteractiveDCF() {
  const [fcf, setFcf] = useState(10)
  const [growth, setGrowth] = useState(5)
  const [discount, setDiscount] = useState(9)

  const isUnstable = growth >= discount

  const data = useMemo(() => {
    const years = Array.from({ length: 10 }, (_, i) => i + 1)
    let totalValue = 0
    const bars = years.map(year => {
      const futureFCF = fcf * Math.pow(1 + growth / 100, year)
      const discounted = futureFCF / Math.pow(1 + discount / 100, year)
      totalValue += discounted
      return { year, discounted: Math.round(discounted * 10) / 10 }
    })
    const terminalGrowth = Math.min(growth * 0.4, 3)
    const terminalValue = isUnstable ? null :
      Math.round((bars[9].discounted * (1 + terminalGrowth / 100)) / ((discount - terminalGrowth) / 100) * 10) / 10
    return { bars, totalValue: Math.round(totalValue * 10) / 10, terminalValue }
  }, [fcf, growth, discount, isUnstable])

  const maxBar = Math.max(...data.bars.map(b => b.discounted), 0.1)

  const sliders = [
    { label: 'Free Cash Flow annuel', value: fcf, min: 1, max: 20, step: 0.5, unit: 'Md€', setter: setFcf, color: '#00D47E', warn: false },
    { label: 'Taux de croissance annuel', value: growth, min: 0, max: 15, step: 0.5, unit: '%', setter: setGrowth, color: '#3B3BF9', warn: isUnstable },
    { label: "Taux d'actualisation (WACC)", value: discount, min: 5, max: 15, step: 0.5, unit: '%', setter: setDiscount, color: '#FFD700', warn: false },
  ]

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
        Simulateur DCF
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>
        Modifie les curseurs et vois la valorisation changer en temps réel
      </div>

      {/* SLIDERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        {sliders.map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 400 }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.warn ? '#FF6B6B' : s.color }}>
                {s.value}{s.unit}{s.warn ? ' ⚠️' : ''}
              </span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`,
                background: s.warn ? '#FF6B6B' : s.color,
                borderRadius: 3, transition: 'width .1s'
              }} />
              <input
                type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseFloat(e.target.value))}
                style={{
                  position: 'absolute', top: -6, left: 0, width: '100%',
                  opacity: 0, cursor: 'pointer', height: 18, margin: 0, padding: 0,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,.2)' }}>{s.min}{s.unit}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,.2)' }}>{s.max}{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* WARNING MODÈLE INSTABLE */}
      {isUnstable && (
        <div style={{
          background: 'rgba(255,107,107,.12)', border: '1px solid rgba(255,107,107,.35)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
          fontSize: 12, color: '#FF9999', lineHeight: 1.6
        }}>
          ⚠️ <strong>Modèle instable</strong> — Le taux de croissance ({growth}%) dépasse le taux d'actualisation ({discount}%). En DCF, cela génère une valorisation infinie. En pratique, aucune entreprise ne peut croître indéfiniment plus vite que son coût du capital. Baisse le taux de croissance ou augmente le WACC.
        </div>
      )}

      {/* RÉSULTAT */}
      {!isUnstable && (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24
          }}>
            <div style={{
              background: 'rgba(59,59,249,.15)', border: '1px solid rgba(59,59,249,.3)',
              borderRadius: 14, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Valeur flux sur 10 ans
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3B3BF9', letterSpacing: '-.03em' }}>
                {data.totalValue} Md€
              </div>
            </div>
            {data.terminalValue && (
              <div style={{
                background: 'rgba(0,212,126,.1)', border: '1px solid rgba(0,212,126,.25)',
                borderRadius: 14, padding: '16px 18px',
              }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Valeur terminale
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#00D47E', letterSpacing: '-.03em' }}>
                  {data.terminalValue} Md€
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 2 }}>
                  ~{Math.round(data.terminalValue / (data.totalValue + data.terminalValue) * 100)}% de la valeur totale
                </div>
              </div>
            )}
          </div>

          {/* VALEUR TOTALE */}
          <div style={{
            background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.2)',
            borderRadius: 12, padding: '12px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>Valeur intrinsèque totale estimée</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#FFD700' }}>
              {data.terminalValue ? Math.round((data.totalValue + data.terminalValue) * 10) / 10 : data.totalValue} Md€
            </span>
          </div>

          {/* GRAPHIQUE */}
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 12 }}>
              Flux de trésorerie actualisés par année (Md€) — les barres décroissent car un euro futur vaut moins qu'un euro aujourd'hui
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 90 }}>
              {data.bars.map((bar, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,.45)', fontWeight: 600 }}>
                    {bar.discounted.toFixed(1)}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${Math.max((bar.discounted / maxBar) * 68, 4)}px`,
                    background: `rgba(59,59,249,${0.9 - (i / 10) * 0.5})`,
                    borderRadius: '3px 3px 0 0',
                    transition: 'height .25s ease',
                  }} />
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,.3)' }}>A{bar.year}</div>
                </div>
              ))}
            </div>
          </div>

          {/* INSIGHT */}
          <div style={{
            marginTop: 18, padding: '10px 14px',
            background: 'rgba(255,255,255,.04)', borderRadius: 10,
            fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300
          }}>
            💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Essaie d'augmenter le taux d'actualisation de 2% et observe la chute de la valorisation. C'est pourquoi la hausse des taux d'intérêt fait baisser les marchés actions : elle augmente le WACC et réduit la valeur intrinsèque de toutes les entreprises.
          </div>
        </>
      )}
    </div>
  )
}
