'use client'
import { useState } from 'react'

const secteurs = [
  { nom: 'Luxe', icon: '💎', per: [20, 35], evEbitda: [12, 22], evFcf: [18, 30], exemple: 'Hermès, LVMH, Kering' },
  { nom: 'Technologie', icon: '💻', per: [25, 50], evEbitda: [18, 40], evFcf: [25, 45], exemple: 'Dassault, Capgemini, Atos' },
  { nom: 'Énergie', icon: '⚡', per: [8, 15], evEbitda: [4, 8], evFcf: [8, 15], exemple: 'TotalEnergies, Engie' },
  { nom: 'Banque', icon: '🏦', per: [6, 12], evEbitda: [0, 0], evFcf: [0, 0], exemple: 'BNP, SocGen, Crédit Agricole' },
  { nom: 'Grande Conso', icon: '🛒', per: [16, 28], evEbitda: [10, 18], evFcf: [14, 22], exemple: 'Danone, L\'Oréal, Pernod' },
  { nom: 'Santé', icon: '💊', per: [18, 30], evEbitda: [12, 22], evFcf: [15, 25], exemple: 'Sanofi, bioMérieux' },
]

export default function InteractiveSectorMultiples() {
  const [selected, setSelected] = useState(0)
  const [per, setPer] = useState(22)
  const [evEbitda, setEvEbitda] = useState(15)

  const secteur = secteurs[selected]
  const perZone = per < secteur.per[0] ? 'sous' : per > secteur.per[1] ? 'sur' : 'juste'
  const ebitdaZone = secteur.evEbitda[0] === 0 ? 'na' : evEbitda < secteur.evEbitda[0] ? 'sous' : evEbitda > secteur.evEbitda[1] ? 'sur' : 'juste'

  const getColor = (zone: string) => zone === 'sous' ? '#00D47E' : zone === 'sur' ? '#FF6B6B' : zone === 'juste' ? '#3B3BF9' : '#9898B8'
  const getLabel = (zone: string) => zone === 'sous' ? '🟢 Potentiellement sous-évalué' : zone === 'sur' ? '🔴 Potentiellement surévalué' : zone === 'juste' ? '🔵 Valorisation normale' : 'N/A pour ce secteur'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(255,215,0,.25)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FFD700', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Comparateur de multiples par secteur</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>Sélectionne un secteur et saisis les multiples d'une entreprise</div>

      {/* SÉLECTION SECTEUR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 24 }}>
        {secteurs.map((s, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: '10px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: selected === i ? 'rgba(255,215,0,.15)' : 'rgba(255,255,255,.04)',
            color: selected === i ? '#FFD700' : 'rgba(255,255,255,.4)',
            border: selected === i ? '1px solid rgba(255,215,0,.4)' : '1px solid rgba(255,255,255,.06)',
          }}>
            {s.icon} {s.nom}
          </button>
        ))}
      </div>

      {/* FOURCHETTES DU SECTEUR */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, border: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>Fourchettes normales — secteur {secteur.icon} {secteur.nom}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', marginBottom: 10 }}>Ex. : {secteur.exemple}</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'PER', range: secteur.per },
            { label: 'EV/EBITDA', range: secteur.evEbitda },
            { label: 'EV/FCF', range: secteur.evFcf },
          ].map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>
                {m.range[0] === 0 ? 'N/A' : `${m.range[0]}x — ${m.range[1]}x`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAISIE MULTIPLES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
        {[
          { label: 'PER de l\'entreprise analysée', value: per, min: 3, max: 80, step: 1, setter: setPer },
          ...(secteur.evEbitda[0] > 0 ? [{ label: 'EV/EBITDA de l\'entreprise analysée', value: evEbitda, min: 2, max: 50, step: 1, setter: setEvEbitda }] : []),
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>{s.value}x</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((s.value - s.min) / (s.max - s.min)) * 100}%`, background: '#FFD700', borderRadius: 3, transition: 'width .1s' }} />
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(parseInt(e.target.value))}
                style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
            {/* BARRE CONTEXTUELLE */}
            <div style={{ position: 'relative', height: 8, marginTop: 6, borderRadius: 4, overflow: 'visible' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '100%', background: 'rgba(255,255,255,.05)', borderRadius: 4 }} />
              {i === 0 && secteur.per[0] > 0 && (
                <>
                  <div style={{ position: 'absolute', left: `${(secteur.per[0] / 80) * 100}%`, top: -2, width: 2, height: 12, background: '#00D47E', borderRadius: 1 }} />
                  <div style={{ position: 'absolute', left: `${(secteur.per[1] / 80) * 100}%`, top: -2, width: 2, height: 12, background: '#FF6B6B', borderRadius: 1 }} />
                  <div style={{ position: 'absolute', left: `${(secteur.per[0] / 80) * 100}%`, right: `${100 - (secteur.per[1] / 80) * 100}%`, top: 1, height: 6, background: 'rgba(59,59,249,.4)', borderRadius: 2 }} />
                  <div style={{ position: 'absolute', left: `${(per / 80) * 100}%`, top: -3, width: 8, height: 14, background: '#FFD700', borderRadius: 2, transform: 'translateX(-50%)' }} />
                </>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 8, color: 'rgba(255,255,255,.25)' }}>
              <span style={{ color: '#00D47E' }}>Sous-évalué &lt; {i === 0 ? secteur.per[0] : secteur.evEbitda[0]}x</span>
              <span style={{ color: '#3B3BF9' }}>Normale</span>
              <span style={{ color: '#FF6B6B' }}>&gt; {i === 0 ? secteur.per[1] : secteur.evEbitda[1]}x Surévalué</span>
            </div>
          </div>
        ))}
      </div>

      {/* VERDICT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: `${getColor(perZone)}15`, border: `1px solid ${getColor(perZone)}40`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>PER {per}x vs fourchette {secteur.per[0]}-{secteur.per[1]}x</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: getColor(perZone) }}>{getLabel(perZone)}</span>
        </div>
        {secteur.evEbitda[0] > 0 && (
          <div style={{ background: `${getColor(ebitdaZone)}15`, border: `1px solid ${getColor(ebitdaZone)}40`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>EV/EBITDA {evEbitda}x vs fourchette {secteur.evEbitda[0]}-{secteur.evEbitda[1]}x</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: getColor(ebitdaZone) }}>{getLabel(ebitdaZone)}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Important</strong> — Ces fourchettes sont des indications, pas des règles absolues. Une entreprise peut justifier un multiple supérieur à la norme sectorielle si sa croissance, ses marges ou son moat sont exceptionnels. Les multiples donnent du contexte, pas des certitudes.
      </div>
    </div>
  )
}
