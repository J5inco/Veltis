'use client'
import { useState } from 'react'

const indicateurs = [
  { id: 'per', label: 'PER', valeur: '22x', color: '#3B3BF9', explication: 'Price-to-Earnings Ratio — tu paies 22 fois les bénéfices annuels. Pour une action à 22€ qui gagne 1€ par action, le PER est 22x. Un PER de 22x est normal pour une grande entreprise de qualité. Au-delà de 30x, le marché anticipe une forte croissance future.' },
  { id: 'rendement', label: 'Rendement dividende', valeur: '3,8%', color: '#00D47E', explication: 'Le dividende annuel divisé par le cours de l\'action. Un rendement de 3,8% signifie que pour 100€ investis, tu reçois 3,80€ de dividende par an. En France, ce dividende est soumis à la flat tax de 30% hors PEA, ou exonéré d\'IR dans un PEA après 5 ans.' },
  { id: '52s', label: 'Plus haut 52 semaines', valeur: '185€', color: '#FFD700', explication: 'Le cours le plus élevé atteint sur les 12 derniers mois. Si le cours actuel est bien en dessous du plus haut 52 semaines, il peut y avoir une opportunité — ou un problème structurel. Toujours analyser pourquoi le cours a baissé avant de conclure.' },
  { id: 'capi', label: 'Capitalisation', valeur: '45 Md€', color: '#FFA500', explication: 'La valeur totale de l\'entreprise selon le marché. Capitalisation = cours × nombre d\'actions. Une capi de 45 Md€ classe cette entreprise parmi les grandes capitalisations (large cap). Plus une entreprise est grande, plus elle est en général liquide et stable.' },
  { id: 'volume', label: 'Volume journalier', valeur: '2,3M actions', color: '#9898B8', explication: 'Le nombre d\'actions échangées en une journée. Un volume élevé signifie que l\'action est liquide — tu peux acheter et vendre facilement sans faire bouger le cours. Un volume faible sur une petite entreprise peut créer un spread (écart) important entre prix achat et vente.' },
  { id: 'beta', label: 'Bêta', valeur: '0,85', color: '#FF9999', explication: 'Mesure la sensibilité de l\'action aux mouvements du marché global. Un bêta de 0,85 signifie que si le CAC 40 baisse de 10%, l\'action tend à baisser de 8,5%. Bêta > 1 = plus volatile que le marché. Bêta < 1 = moins volatile. Bêta négatif = contre-cyclique (rare).' },
]

export default function InteractiveStockCard() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = indicateurs.find(i => i.id === activeId)

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(59,59,249,.3)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Fiche action interactive</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>Clique sur chaque indicateur pour comprendre ce qu'il signifie</div>

      {/* EN-TÊTE ACTION */}
      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>EXEMPLE SA</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>CAC 40 · Secteur Grande Consommation</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>142,50€</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#00D47E' }}>+1,24% aujourd'hui</div>
          </div>
        </div>
      </div>

      {/* GRILLE INDICATEURS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
        {indicateurs.map(ind => (
          <button key={ind.id} onClick={() => setActiveId(activeId === ind.id ? null : ind.id)} style={{
            padding: '12px 10px', borderRadius: 12, textAlign: 'left',
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: activeId === ind.id ? `${ind.color}18` : 'rgba(255,255,255,.04)',
            border: activeId === ind.id ? `1px solid ${ind.color}50` : '1px solid rgba(255,255,255,.07)',
          }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 4 }}>{ind.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: activeId === ind.id ? ind.color : 'white' }}>{ind.valeur}</div>
            <div style={{ fontSize: 9, color: ind.color, marginTop: 3 }}>{activeId === ind.id ? '↑ fermer' : '→ explication'}</div>
          </button>
        ))}
      </div>

      {/* EXPLICATION */}
      {active && (
        <div style={{ background: `${active.color}12`, border: `1px solid ${active.color}35`, borderRadius: 14, padding: '16px 18px', marginBottom: 12, transition: 'all .2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: active.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: active.color }}>{active.label} — {active.valeur}</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, fontWeight: 300 }}>{active.explication}</div>
        </div>
      )}

      {!active && (
        <div style={{ textAlign: 'center', padding: '12px', fontSize: 11, color: 'rgba(255,255,255,.2)', fontStyle: 'italic' }}>
          Clique sur un indicateur pour voir son explication détaillée
        </div>
      )}

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>En pratique</strong> — Ces 6 indicateurs sont disponibles gratuitement sur Yahoo Finance, Boursorama ou Investir.fr. Apprendre à les lire rapidement te permet d'évaluer une action en 5 minutes avant d'approfondir l'analyse.
      </div>
    </div>
  )
}
