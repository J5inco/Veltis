'use client'
import { useState } from 'react'

export default function InteractiveTaxHarvesting() {
  const [plusValues, setPlusValues] = useState(8000)
  const [moinsValues, setMoinsValues] = useState(3000)
  const [tranche, setTranche] = useState(30) // flat tax par défaut

  const baseImposableAvant = plusValues
  const baseImposableApres = Math.max(0, plusValues - moinsValues)
  const impotAvant = Math.round(baseImposableAvant * (tranche / 100))
  const impotApres = Math.round(baseImposableApres * (tranche / 100))
  const economie = impotAvant - impotApres
  const reportable = moinsValues > plusValues ? moinsValues - plusValues : 0

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(255,215,0,.25)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Calculateur fiscal — Tax Harvesting</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Saisis tes plus-values et moins-values de l'année pour calculer ton optimisation fiscale</div>

      {/* CURSEURS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 20 }}>
        {[
          { label: 'Plus-values réalisées dans ton CTO', value: plusValues, min: 0, max: 50000, step: 500, setter: setPlusValues, color: '#FF9999' },
          { label: 'Moins-values latentes (à réaliser avant le 31/12)', value: moinsValues, min: 0, max: 50000, step: 500, setter: setMoinsValues, color: '#00D47E' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value.toLocaleString('fr-FR')}€</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(s.value / 50000) * 100}%`, background: s.color, borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseInt(e.target.value))}
                style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
          </div>
        ))}

        {/* TAUX */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>Taux d'imposition applicable</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { val: 30, label: 'Flat tax 30%' },
              { val: 23, label: 'Barème 11% + PS' },
              { val: 45, label: 'Barème 45% + PS' },
            ].map(t => (
              <button key={t.val} onClick={() => setTranche(t.val)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                background: tranche === t.val ? 'rgba(255,215,0,.15)' : 'rgba(255,255,255,.04)',
                color: tranche === t.val ? '#FFD700' : 'rgba(255,255,255,.35)',
                border: tranche === t.val ? '1px solid rgba(255,215,0,.4)' : '1px solid rgba(255,255,255,.06)',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RÉSULTAT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,107,107,.1)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Sans optimisation</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>Base : {plusValues.toLocaleString('fr-FR')}€</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FF6B6B' }}>-{impotAvant.toLocaleString('fr-FR')}€</div>
          <div style={{ fontSize: 10, color: '#FF9999', marginTop: 4 }}>d'impôt à payer</div>
        </div>
        <div style={{ background: 'rgba(0,212,126,.08)', border: '1px solid rgba(0,212,126,.2)', borderRadius: 14, padding: '16px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 6 }}>Avec tax harvesting</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>Base : {baseImposableApres.toLocaleString('fr-FR')}€</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00D47E' }}>-{impotApres.toLocaleString('fr-FR')}€</div>
          <div style={{ fontSize: 10, color: '#00D47E', marginTop: 4 }}>d'impôt à payer</div>
        </div>
      </div>

      {economie > 0 && (
        <div style={{ background: 'rgba(0,212,126,.08)', border: '1px solid rgba(0,212,126,.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Économie fiscale réalisée</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#00D47E' }}>+{economie.toLocaleString('fr-FR')}€ économisés</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>
            en réalisant {moinsValues.toLocaleString('fr-FR')}€ de moins-values avant le 31 décembre
          </div>
        </div>
      )}

      {reportable > 0 && (
        <div style={{ background: 'rgba(59,59,249,.1)', border: '1px solid rgba(59,59,249,.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8888FF', marginBottom: 4 }}>📋 Moins-values reportables</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
            Tes moins-values ({moinsValues.toLocaleString('fr-FR')}€) dépassent tes plus-values ({plusValues.toLocaleString('fr-FR')}€).
            Le solde de <strong style={{ color: '#8888FF' }}>{reportable.toLocaleString('fr-FR')}€</strong> est reportable sur les 10 prochaines années.
            Il apparaîtra sur ton IFU — conserve-le précieusement.
          </div>
        </div>
      )}

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Rappel important</strong> — Tu peux racheter l'action le lendemain de la vente. Aucune règle "wash sale" en France contrairement aux États-Unis. Réalise la moins-value le 30 décembre, rachète le 2 janvier — ton exposition reste identique mais tu as économisé de l'impôt.
      </div>
    </div>
  )
}
