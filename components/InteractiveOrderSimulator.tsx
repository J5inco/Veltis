'use client'
import { useState } from 'react'

export default function InteractiveOrderSimulator() {
  const [typeOrdre, setTypeOrdre] = useState<'marché' | 'limite' | 'stop'>('marché')
  const [montant, setMontant] = useState(300)
  const [limite, setLimite] = useState(148)
  const [stopLevel, setStopLevel] = useState(85)
  const [executed, setExecuted] = useState(false)

  const coursActuel = 150.24
  const spread = 0.05
  const prixAchat = coursActuel + spread

  const getNbParts = () => Math.floor(montant / coursActuel)
  const getPrixExec = () => {
    if (typeOrdre === 'marché') return prixAchat
    if (typeOrdre === 'limite') return limite
    return null
  }

  const getExecStatus = () => {
    if (typeOrdre === 'marché') return { executed: true, label: 'Exécuté immédiatement', color: '#00D47E' }
    if (typeOrdre === 'limite') {
      if (limite >= coursActuel) return { executed: true, label: 'Exécuté (limite ≥ cours)', color: '#00D47E' }
      return { executed: false, label: `En attente — cours doit descendre à ${limite}€`, color: '#FFD700' }
    }
    return { executed: false, label: `Stop actif — vente déclenchée si cours ≤ ${stopLevel}€`, color: '#FF9966' }
  }

  const status = getExecStatus()
  const nbParts = getNbParts()
  const prixExec = getPrixExec()

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(59,59,249,.3)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Simulateur de passage d'ordre</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Simule le passage d'un ordre en bourse sans risque réel</div>

      {/* Cours actuel */}
      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,.08)' }}>
        <div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 3 }}>ETF MSCI World (CW8)</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{coursActuel}€</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginBottom: 3 }}>Bid / Ask</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
            {(coursActuel - spread).toFixed(2)}€ / {prixAchat.toFixed(2)}€
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.25)' }}>Spread : {spread}€ (0,03%)</div>
        </div>
      </div>

      {/* Type d'ordre */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>Type d'ordre</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {([
            { key: 'marché', label: '⚡ Au marché', desc: 'Exécution immédiate' },
            { key: 'limite', label: '🎯 À cours limité', desc: 'Prix garanti' },
            { key: 'stop', label: '🛡️ Stop-loss', desc: 'Protection automatique' },
          ] as const).map(t => (
            <button key={t.key} onClick={() => { setTypeOrdre(t.key); setExecuted(false) }} style={{
              flex: 1, padding: '10px 6px', borderRadius: 12, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Sora,sans-serif',
              background: typeOrdre === t.key ? 'rgba(59,59,249,.25)' : 'rgba(255,255,255,.04)',
              color: typeOrdre === t.key ? 'white' : 'rgba(255,255,255,.4)',
              border: typeOrdre === t.key ? '1px solid #3B3BF9' : '1px solid rgba(255,255,255,.08)',
              textAlign: 'center',
            }}>
              {t.label}<br /><span style={{ fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,.4)' }}>{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Paramètres selon type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {/* Montant toujours visible */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Montant à investir</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FFD700' }}>{montant}€</span>
          </div>
          <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((montant - 50) / 950) * 100}%`, background: '#FFD700', borderRadius: 3 }} />
            <input type="range" min={50} max={1000} step={50} value={montant} onChange={e => { setMontant(Number(e.target.value)); setExecuted(false) }} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
          </div>
        </div>

        {/* Cours limité */}
        {typeOrdre === 'limite' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Prix limite maximum</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#3B3BF9' }}>{limite}€</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((limite - 100) / 100) * 100}%`, background: '#3B3BF9', borderRadius: 3 }} />
              <input type="range" min={100} max={200} step={1} value={limite} onChange={e => { setLimite(Number(e.target.value)); setExecuted(false) }} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Cours actuel : {coursActuel}€ {limite >= coursActuel ? '→ exécution immédiate' : '→ en attente'}</div>
          </div>
        )}

        {/* Stop-loss */}
        {typeOrdre === 'stop' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Niveau stop-loss</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FF9966' }}>{stopLevel}€</span>
            </div>
            <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,.1)', borderRadius: 3 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${((stopLevel - 80) / 70) * 100}%`, background: '#FF9966', borderRadius: 3 }} />
              <input type="range" min={80} max={149} step={1} value={stopLevel} onChange={e => { setStopLevel(Number(e.target.value)); setExecuted(false) }} style={{ position: 'absolute', top: -6, left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: 18, margin: 0 }} />
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>
              Protection : -{Math.round((1 - stopLevel / coursActuel) * 100)}% par rapport au cours actuel
            </div>
          </div>
        )}
      </div>

      {/* Statut */}
      <div style={{ background: `${status.color}15`, border: `1px solid ${status.color}35`, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: status.color, marginBottom: 6 }}>
          {status.executed ? '✅' : '⏳'} {status.label}
        </div>
        {typeOrdre !== 'stop' && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
            <span>Parts achetées : <strong style={{ color: 'white' }}>{nbParts}</strong></span>
            {prixExec && <span>Prix d'exécution : <strong style={{ color: 'white' }}>{prixExec.toFixed(2)}€</strong></span>}
            <span>Montant réel : <strong style={{ color: 'white' }}>{(nbParts * (prixExec || coursActuel)).toFixed(2)}€</strong></span>
          </div>
        )}
      </div>

      {/* Bouton passer l'ordre */}
      {!executed && typeOrdre !== 'stop' && (
        <button onClick={() => setExecuted(true)} style={{
          width: '100%', padding: '13px', borderRadius: 100, fontSize: 13, fontWeight: 700,
          background: '#3B3BF9', color: 'white', border: 'none', cursor: 'pointer',
          fontFamily: 'Sora,sans-serif', marginBottom: 14,
        }}>
          Confirmer l'ordre (simulation) 🔒
        </button>
      )}
      {executed && (
        <div style={{ background: 'rgba(0,212,126,.1)', border: '1px solid rgba(0,212,126,.3)', borderRadius: 12, padding: '14px', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#00D47E' }}>Ordre simulé confirmé</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>
            {nbParts} parts achetées à {(prixExec || coursActuel).toFixed(2)}€ · Total : {(nbParts * (prixExec || coursActuel)).toFixed(2)}€
          </div>
          <button onClick={() => setExecuted(false)} style={{ marginTop: 10, padding: '6px 16px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'transparent', color: '#00D47E', border: '1px solid rgba(0,212,126,.3)', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
            Recommencer
          </button>
        </div>
      )}

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>À retenir</strong> — Pour un ETF très liquide comme le CW8, l'ordre au marché est parfaitement adapté : le spread de 0,03% est négligeable. Pour une action peu liquide, le spread peut atteindre 1-2% — utilise toujours un ordre à cours limité.
      </div>
    </div>
  )
}
