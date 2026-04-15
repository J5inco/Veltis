'use client'
import { useState } from 'react'

export default function InteractivePEAvsCTO() {
  const [gain, setGain] = useState(10000)
  const [apres5ans, setApres5ans] = useState(true)

  const flatTax = Math.round(gain * 0.30)
  const prelevSociaux = Math.round(gain * 0.172)
  const economie = flatTax - prelevSociaux

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(0,212,126,.3)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#00D47E', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>PEA vs CTO — Comparateur fiscal</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Saisis tes gains et vois l'impôt dans chaque enveloppe</div>

      {/* CURSEUR GAIN */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Plus-value réalisée</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>{gain.toLocaleString('fr-FR')}€</span>
        </div>
        <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((gain - 1000) / 99000) * 100}%`, background: '#FFD700', borderRadius: 3, transition: 'width .1s' }} />
          <input type="range" min={1000} max={100000} step={1000} value={gain}
            onChange={e => setGain(parseInt(e.target.value))}
            style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
        </div>
      </div>

      {/* TOGGLE 5 ANS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[true, false].map(val => (
          <button key={String(val)} onClick={() => setApres5ans(val)} style={{
            flex: 1, padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif',
            background: apres5ans === val ? (val ? 'rgba(0,212,126,.15)' : 'rgba(255,107,107,.12)') : 'rgba(255,255,255,.04)',
            color: apres5ans === val ? (val ? '#00D47E' : '#FF9999') : 'rgba(255,255,255,.35)',
            border: apres5ans === val ? `1px solid ${val ? 'rgba(0,212,126,.4)' : 'rgba(255,107,107,.3)'}` : '1px solid rgba(255,255,255,.06)',
          }}>
            {val ? '✓ PEA +5 ans' : '✗ PEA -5 ans ou clôture'}
          </button>
        ))}
      </div>

      {/* COMPARAISON */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* CTO */}
        <div style={{ background: 'rgba(255,107,107,.1)', border: '1px solid rgba(255,107,107,.25)', borderRadius: 16, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>CTO</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 12, fontWeight: 300 }}>Flat tax 30% obligatoire</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
              <span>IR (12,8%)</span>
              <span>{Math.round(gain * 0.128).toLocaleString('fr-FR')}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
              <span>Prélèvements sociaux (17,2%)</span>
              <span>{Math.round(gain * 0.172).toLocaleString('fr-FR')}€</span>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#FF9999' }}>
              <span>Total impôt</span>
              <span>-{flatTax.toLocaleString('fr-FR')}€</span>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FF6B6B' }}>
            Net : {(gain - flatTax).toLocaleString('fr-FR')}€
          </div>
        </div>

        {/* PEA */}
        <div style={{ background: apres5ans ? 'rgba(0,212,126,.1)' : 'rgba(255,107,107,.08)', border: `1px solid ${apres5ans ? 'rgba(0,212,126,.25)' : 'rgba(255,107,107,.2)'}`, borderRadius: 16, padding: '18px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>PEA</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 12, fontWeight: 300 }}>
            {apres5ans ? 'Exonération IR après 5 ans' : 'Clôture avant 5 ans = flat tax'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
              <span>IR</span>
              <span style={{ color: apres5ans ? '#00D47E' : '#FF9999' }}>{apres5ans ? '0€ ✓' : `${Math.round(gain * 0.128).toLocaleString('fr-FR')}€`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>
              <span>Prélèvements sociaux (17,2%)</span>
              <span>{Math.round(gain * 0.172).toLocaleString('fr-FR')}€</span>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: apres5ans ? '#00D47E' : '#FF9999' }}>
              <span>Total impôt</span>
              <span>-{apres5ans ? prelevSociaux.toLocaleString('fr-FR') : flatTax.toLocaleString('fr-FR')}€</span>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: apres5ans ? '#00D47E' : '#FF6B6B' }}>
            Net : {apres5ans ? (gain - prelevSociaux).toLocaleString('fr-FR') : (gain - flatTax).toLocaleString('fr-FR')}€
          </div>
        </div>
      </div>

      {/* ÉCONOMIE */}
      {apres5ans && (
        <div style={{ background: 'rgba(0,212,126,.08)', border: '1px solid rgba(0,212,126,.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Économie fiscale grâce au PEA (+5 ans)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#00D47E' }}>+{economie.toLocaleString('fr-FR')}€ gardés</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>soit {Math.round((economie / gain) * 100)}% de tes gains conservés en plus</div>
        </div>
      )}

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Sur 10 000€ de gains, le PEA te fait économiser {economie.toLocaleString('fr-FR')}€ d'impôt. Sur 100 000€ de gains après 20 ans de DCA, cette différence peut représenter {Math.round(economie * 10).toLocaleString('fr-FR')}€. L'enveloppe est le premier levier d'optimisation.
      </div>
    </div>
  )
}
