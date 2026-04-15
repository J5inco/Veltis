'use client'
import { useState } from 'react'

const secteurs = [
  { nom: 'Luxe', icon: '💎', ex: 'Hermès', margeBrute: 70, margeOpe: 40, margeNette: 32, roe: 38, color: '#FFD700' },
  { nom: 'SaaS / Tech', icon: '💻', ex: 'Dassault Systèmes', margeBrute: 78, margeOpe: 22, margeNette: 18, roe: 25, color: '#3B3BF9' },
  { nom: 'Distribution', icon: '🛒', ex: 'Carrefour', margeBrute: 7, margeOpe: 2, margeNette: 1, roe: 12, color: '#00D47E' },
  { nom: 'Énergie', icon: '⚡', ex: 'TotalEnergies', margeBrute: 28, margeOpe: 14, margeNette: 10, roe: 18, color: '#FFA500' },
]

export default function InteractiveMargins() {
  const [selected, setSelected] = useState<number | null>(null)
  const [metric, setMetric] = useState<'margeBrute' | 'margeOpe' | 'margeNette' | 'roe'>('margeOpe')

  const metrics = [
    { key: 'margeBrute' as const, label: 'Marge brute', color: '#9898B8' },
    { key: 'margeOpe' as const, label: 'Marge opérationnelle', color: '#3B3BF9' },
    { key: 'margeNette' as const, label: 'Marge nette', color: '#00D47E' },
    { key: 'roe' as const, label: 'ROE', color: '#FFD700' },
  ]

  const maxVal = Math.max(...secteurs.map(s => s[metric]))

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0F2A 0%, #1a1a3e 100%)',
      borderRadius: 20, padding: '28px 24px', margin: '24px 0',
      border: '1px solid rgba(255,107,107,.2)', fontFamily: 'Sora, sans-serif',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9999', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Comparateur de marges sectoriel</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 20, fontWeight: 300 }}>Compare les marges de 4 secteurs très différents — clique pour le détail</div>

      {/* SÉLECTEUR MÉTRIQUE */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {metrics.map(m => (
          <button key={m.key} onClick={() => setMetric(m.key)} style={{
            padding: '7px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s',
            background: metric === m.key ? `${m.color}20` : 'rgba(255,255,255,.04)',
            color: metric === m.key ? m.color : 'rgba(255,255,255,.35)',
            border: metric === m.key ? `1px solid ${m.color}50` : '1px solid rgba(255,255,255,.06)',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* GRAPHIQUE BARRES HORIZONTALES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {[...secteurs].sort((a, b) => b[metric] - a[metric]).map((s, i) => (
          <button key={s.nom} onClick={() => setSelected(selected === i ? null : i)} style={{
            background: selected === i ? `${s.color}15` : 'rgba(255,255,255,.04)',
            border: selected === i ? `1px solid ${s.color}40` : '1px solid rgba(255,255,255,.06)',
            borderRadius: 14, padding: '14px 16px', cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{s.nom}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>ex. {s.ex}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 800, color: s.color }}>{s[metric]}%</div>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(s[metric] / maxVal) * 100}%`,
                background: s.color,
                borderRadius: 4,
                transition: 'width .4s ease',
              }} />
            </div>
            {selected === i && (
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {metrics.map(m => (
                  <div key={m.key} style={{ textAlign: 'center', background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '8px 6px' }}>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 3, textTransform: 'uppercase' }}>{m.label.replace('Marge ', '')}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: m.key === metric ? s.color : 'rgba(255,255,255,.6)' }}>{s[m.key]}%</div>
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* EXPLICATION */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)', marginBottom: 8 }}>Pourquoi ces différences ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { icon: '💎', text: 'Le luxe a des marges extrêmes car la marque permet un pricing power pur — un sac Hermès coûte 300€ à produire et se vend 10 000€.' },
            { icon: '💻', text: 'Le SaaS a une marge brute très élevée car copier un logiciel coûte quasi zéro — mais les frais commerciaux et R&D compriment la marge finale.' },
            { icon: '🛒', text: 'La distribution a des marges structurellement basses car Carrefour revend des produits achetés à prix élevé. Le modèle tient sur le volume.' },
            { icon: '⚡', text: 'L\'énergie a des marges modérées liées à la cyclicité des prix du pétrole et aux investissements massifs en infrastructure.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,.04)', borderRadius: 10, fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.65, fontWeight: 300 }}>
        💡 <strong style={{ color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>Ne jamais comparer les marges entre secteurs</strong> — Une marge opérationnelle de 2% est excellente pour Carrefour et catastrophique pour Hermès. Toujours comparer une entreprise à ses pairs sectoriels, jamais à une valeur absolue.
      </div>
    </div>
  )
}
