'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Position = {
  id: string
  ticker: string
  nom: string
  prix_achat: number
  prix_actuel: number | null
  quantite: number
  enveloppe: string
  date_achat: string
}

type JournalEntry = {
  id: string
  ticker: string
  nom: string
  date_achat: string
  prix_achat: number | null
  these: string
  stop_intellectuel: string
  horizon: string
  risque_principal: string
  statut: string
  created_at: string
}

type Tab = 'portefeuille' | 'journal' | 'rapport'

// Prix : 1) saisi manuellement > 2) Yahoo Finance > 3) prix d'achat
function getPrixActuel(ticker: string, prixAchat: number, prixManuel: number | null, prixReels: Record<string, number | null>): number {
  if (prixManuel && prixManuel > 0) return prixManuel
  const real = prixReels[ticker.toUpperCase()]
  if (real && real > 0) return real
  return prixAchat
}

export default function BoussollePage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [tab, setTab] = useState<Tab>('portefeuille')
  const [positions, setPositions] = useState<Position[]>([])
  const [journal, setJournal] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [prixReels, setPrixReels] = useState<Record<string, number | null>>({})
  const [prixLoading, setPrixLoading] = useState(false)
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [showAddJournal, setShowAddJournal] = useState(false)
  const router = useRouter()

  // Form states — position
  const [formTicker, setFormTicker] = useState('')
  const [formNom, setFormNom] = useState('')
  const [formPrix, setFormPrix] = useState('')
  const [formQte, setFormQte] = useState('')
  const [formEnv, setFormEnv] = useState('PEA')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])

  // Form states — journal
  const [jTicker, setJTicker] = useState('')
  const [jNom, setJNom] = useState('')
  const [jDate, setJDate] = useState(new Date().toISOString().split('T')[0])
  const [jPrix, setJPrix] = useState('')
  const [jThese, setJThese] = useState('')
  const [jStop, setJStop] = useState('')
  const [jHorizon, setJHorizon] = useState('')
  const [jRisque, setJRisque] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async (userId: string) => {
    const [{ data: pos }, { data: jrn }] = await Promise.all([
      supabase.from('boussole_positions').select('*').eq('user_id', userId).order('date_achat', { ascending: false }),
      supabase.from('boussole_journal').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])
    const posData = pos || []
    setPositions(posData)
    setJournal(jrn || [])
    setLoading(false)
    // Fetch real prices from Yahoo Finance
    if (posData.length > 0) {
      setPrixLoading(true)
      const tickers = posData.map(p => p.ticker).join(',')
      try {
        const res = await fetch(`/api/prix?tickers=${tickers}`)
        if (res.ok) {
          const data = await res.json()
          setPrixReels(data)
        }
      } catch { /* fallback to prix achat */ }
      setPrixLoading(false)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      loadData(data.user.id)
    })
  }, [router, loadData])

  const addPosition = async () => {
    if (!user || !formTicker || !formNom || !formPrix || !formQte) return
    setSaving(true)
    await supabase.from('boussole_positions').insert({
      user_id: user.id,
      ticker: formTicker.toUpperCase(),
      nom: formNom,
      prix_achat: parseFloat(formPrix),
      quantite: parseFloat(formQte),
      enveloppe: formEnv,
      date_achat: formDate,
    })
    await loadData(user.id)
    setShowAddPosition(false)
    setFormTicker(''); setFormNom(''); setFormPrix(''); setFormQte('')
    setSaving(false)
  }

  const addJournalEntry = async () => {
    if (!user || !jTicker || !jNom || !jThese || !jStop || !jHorizon || !jRisque) return
    setSaving(true)
    await supabase.from('boussole_journal').insert({
      user_id: user.id,
      ticker: jTicker.toUpperCase(),
      nom: jNom,
      date_achat: jDate,
      prix_achat: jPrix ? parseFloat(jPrix) : null,
      these: jThese,
      stop_intellectuel: jStop,
      horizon: jHorizon,
      risque_principal: jRisque,
      statut: 'active',
    })
    await loadData(user.id)
    setShowAddJournal(false)
    setJTicker(''); setJNom(''); setJThese(''); setJStop(''); setJHorizon(''); setJRisque(''); setJPrix('')
    setSaving(false)
  }

  const deletePosition = async (id: string) => {
    await supabase.from('boussole_positions').delete().eq('id', id)
    setPositions(prev => prev.filter(p => p.id !== id))
  }

  const updatePrixActuel = async (id: string, nouveauPrix: string) => {
    const prix = parseFloat(nouveauPrix)
    const valeur = isNaN(prix) ? null : prix
    await supabase.from('boussole_positions').update({ prix_actuel: valeur }).eq('id', id)
    setPositions(prev => prev.map(p => p.id === id ? { ...p, prix_actuel: valeur } : p))
  }

  const updateJournalStatut = async (id: string, statut: string) => {
    await supabase.from('boussole_journal').update({ statut }).eq('id', id)
    setJournal(prev => prev.map(j => j.id === id ? { ...j, statut } : j))
  }

  // Portfolio calculations
  const portfolioStats = positions.reduce((acc, pos) => {
    const prixActuel = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels)
    const valeurActuelle = prixActuel * pos.quantite
    const valeurAchat = pos.prix_achat * pos.quantite
    const pnl = valeurActuelle - valeurAchat
    return {
      totalActuel: acc.totalActuel + valeurActuelle,
      totalAchat: acc.totalAchat + valeurAchat,
      totalPnl: acc.totalPnl + pnl,
    }
  }, { totalActuel: 0, totalAchat: 0, totalPnl: 0 })

  const pnlPct = portfolioStats.totalAchat > 0
    ? ((portfolioStats.totalPnl / portfolioStats.totalAchat) * 100).toFixed(1)
    : '0.0'

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13,
    border: '1px solid rgba(0,0,0,.12)', fontFamily: 'Sora,sans-serif',
    background: 'white', color: '#0F0F1A', boxSizing: 'border-box' as const,
  }

  const labelStyle = { fontSize: 11, fontWeight: 600, color: '#4A4A6A', marginBottom: 4, display: 'block' as const }

  if (loading) return (
    <div style={{ fontFamily: 'Sora,sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F7F5' }}>
      <div style={{ fontSize: 14, color: '#9898B8' }}>Chargement de ta Boussole...</div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Sora,sans-serif', minHeight: '100vh', background: '#F8F7F5' }}>

      {/* NAV */}
      <nav style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,.08)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: 'none', color: '#0F0F1A', letterSpacing: '-.04em' }}>
          Veltis<span style={{ color: '#3B3BF9' }}>.</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, background: '#EBEBFF', color: '#3B3BF9', padding: '4px 12px', borderRadius: 100, fontWeight: 700 }}>🧭 Boussole</div>
          <Link href="/dashboard" style={{ fontSize: 12, color: '#9898B8', textDecoration: 'none', padding: '6px 12px', borderRadius: 100, border: '1px solid rgba(0,0,0,.08)' }}>← Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 4 }}>🧭 Ma Boussole</h1>
          <p style={{ fontSize: 13, color: '#9898B8', fontWeight: 300 }}>
            Saisie manuelle · Connexion DSP2 broker disponible prochainement
          </p>
          {prixLoading && (
            <div style={{ fontSize: 11, color: '#3B3BF9', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⟳</span> Récupération des cours en temps réel...
            </div>
          )}
          {!prixLoading && Object.keys(prixReels).length > 0 && (
            <div style={{ fontSize: 11, color: '#00D47E', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✓</span> Cours Yahoo Finance mis à jour
            </div>
          )}
        </div>

        {/* STATS RAPIDES */}
        {positions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
            {[
              { label: 'Valeur du portefeuille', val: `${portfolioStats.totalActuel.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€`, color: '#0F0F1A' },
              { label: 'Plus/Moins-values', val: `${portfolioStats.totalPnl >= 0 ? '+' : ''}${portfolioStats.totalPnl.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€`, color: portfolioStats.totalPnl >= 0 ? '#00D47E' : '#FF6B6B' },
              { label: 'Performance globale', val: `${portfolioStats.totalPnl >= 0 ? '+' : ''}${pnlPct}%`, color: portfolioStats.totalPnl >= 0 ? '#00D47E' : '#FF6B6B' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(0,0,0,.07)' }}>
                <div style={{ fontSize: 11, color: '#9898B8', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {([
            { id: 'portefeuille', label: '📊 Portefeuille' },
            { id: 'journal', label: '📓 Journal de bord' },
            { id: 'rapport', label: '📈 Rapport' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '9px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .15s',
              background: tab === t.id ? '#3B3BF9' : 'white',
              color: tab === t.id ? 'white' : '#4A4A6A',
              border: tab === t.id ? 'none' : '1px solid rgba(0,0,0,.08)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== PORTEFEUILLE ===== */}
        {tab === 'portefeuille' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Mes positions ({positions.length})</div>
              <button onClick={() => setShowAddPosition(true)} style={{
                background: '#3B3BF9', color: 'white', padding: '9px 18px', borderRadius: 100,
                fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif',
              }}>
                + Ajouter une position
              </button>
            </div>

            {positions.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px dashed rgba(0,0,0,.1)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Aucune position encore</div>
                <div style={{ fontSize: 13, color: '#9898B8', marginBottom: 20, fontWeight: 300 }}>Saisis tes premières positions pour voir la valorisation de ton portefeuille</div>
                <button onClick={() => setShowAddPosition(true)} style={{ background: '#3B3BF9', color: 'white', padding: '11px 24px', borderRadius: 100, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                  Ajouter ma première position
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 40px', gap: 8, padding: '8px 16px', fontSize: 10, color: '#9898B8', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>
                  <span>Titre</span><span>Qté</span><span>Prix achat</span><span>Prix actuel</span><span>+/- value</span><span>Enveloppe</span><span></span>
                </div>
                {positions.map(pos => {
                  const prixActuel = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels)
                  const valActuelle = prixActuel * pos.quantite
                  const pnl = valActuelle - pos.prix_achat * pos.quantite
                  const pnlPct = ((pnl / (pos.prix_achat * pos.quantite)) * 100).toFixed(1)
                  const isPos = pnl >= 0
                  return (
                    <div key={pos.id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(0,0,0,.07)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 40px', gap: 8, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{pos.ticker}</div>
                        <div style={{ fontSize: 11, color: '#9898B8' }}>{pos.nom}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#4A4A6A' }}>{pos.quantite}</div>
                      <div style={{ fontSize: 13, color: '#4A4A6A' }}>{pos.prix_achat.toFixed(2)}€</div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={pos.prix_actuel ?? (prixReels[pos.ticker.toUpperCase()] ?? '')}
                          placeholder={prixReels[pos.ticker.toUpperCase()] ? prixReels[pos.ticker.toUpperCase()]?.toFixed(2) : 'Saisir'}
                          onBlur={(e) => updatePrixActuel(pos.id, e.target.value)}
                          style={{
                            width: '80px', padding: '5px 8px', fontSize: 12, fontWeight: 600,
                            border: '1px solid rgba(0,0,0,.1)', borderRadius: 6, fontFamily: 'Sora,sans-serif',
                            background: pos.prix_actuel ? '#EBEBFF' : 'white', color: '#0F0F1A',
                          }}
                        />
                        <div style={{ fontSize: 9, color: '#9898B8', marginTop: 2 }}>{valActuelle.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isPos ? '#00D47E' : '#FF6B6B' }}>
                        {isPos ? '+' : ''}{pnl.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
                        <div style={{ fontSize: 10, fontWeight: 600 }}>{isPos ? '+' : ''}{pnlPct}%</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, background: pos.enveloppe === 'PEA' ? '#EBEBFF' : '#F0FFF4', color: pos.enveloppe === 'PEA' ? '#3B3BF9' : '#00D47E', padding: '3px 8px', borderRadius: 100, fontWeight: 700 }}>
                          {pos.enveloppe}
                        </span>
                      </div>
                      <button onClick={() => deletePosition(pos.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#9898B8', padding: 4 }}>🗑</button>
                    </div>
                  )
                })}

                {/* Allocation par enveloppe */}
                {positions.length > 1 && (
                  <div style={{ background: 'white', borderRadius: 14, padding: 18, border: '1px solid rgba(0,0,0,.07)', marginTop: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Répartition sectorielle</div>
                    <div style={{ height: 10, borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
                      {positions.map((pos, i) => {
                        const val = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels) * pos.quantite
                        const pct = (val / portfolioStats.totalActuel) * 100
                        const colors = ['#3B3BF9', '#00D47E', '#FFD700', '#FF6B6B', '#FFA500', '#9898B8', '#C4B5FD']
                        return <div key={pos.id} style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {positions.map((pos, i) => {
                        const val = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels) * pos.quantite
                        const pct = ((val / portfolioStats.totalActuel) * 100).toFixed(0)
                        const colors = ['#3B3BF9', '#00D47E', '#FFD700', '#FF6B6B', '#FFA500', '#9898B8', '#C4B5FD']
                        return (
                          <div key={pos.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length] }} />
                            <span style={{ fontSize: 11, color: '#4A4A6A' }}>{pos.ticker} <span style={{ fontWeight: 700 }}>{pct}%</span></span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODAL AJOUT POSITION */}
            {showAddPosition && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
                <div style={{ background: 'white', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>Ajouter une position</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={labelStyle}>Ticker *</label>
                      <input style={inputStyle} placeholder="ex: TTE, AAPL, CW8" value={formTicker} onChange={e => setFormTicker(e.target.value.toUpperCase())} />
                    </div>
                    <div>
                      <label style={labelStyle}>Nom de l'actif *</label>
                      <input style={inputStyle} placeholder="ex: TotalEnergies" value={formNom} onChange={e => setFormNom(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Prix d'achat (€) *</label>
                      <input style={inputStyle} type="number" placeholder="ex: 58.50" value={formPrix} onChange={e => setFormPrix(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Quantité *</label>
                      <input style={inputStyle} type="number" placeholder="ex: 10" value={formQte} onChange={e => setFormQte(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Enveloppe</label>
                      <select style={inputStyle} value={formEnv} onChange={e => setFormEnv(e.target.value)}>
                        <option value="PEA">PEA</option>
                        <option value="CTO">CTO</option>
                        <option value="Assurance-vie">Assurance-vie</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Date d'achat</label>
                      <input style={inputStyle} type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ background: '#EBEBFF', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: '#3B3BF9' }}>
                    💡 La valorisation est mise à jour avec des cours de marché approximatifs. La connexion DSP2 donnera des cours en temps réel.
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={addPosition} disabled={saving || !formTicker || !formNom || !formPrix || !formQte} style={{
                      flex: 1, background: '#3B3BF9', color: 'white', padding: '12px', borderRadius: 100,
                      fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif',
                    }}>
                      {saving ? 'Enregistrement...' : 'Ajouter'}
                    </button>
                    <button onClick={() => setShowAddPosition(false)} style={{ padding: '12px 20px', background: '#F8F7F5', color: '#4A4A6A', border: 'none', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== JOURNAL DE BORD ===== */}
        {tab === 'journal' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Mes thèses d'investissement ({journal.length})</div>
              <button onClick={() => setShowAddJournal(true)} style={{ background: '#3B3BF9', color: 'white', padding: '9px 18px', borderRadius: 100, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                + Nouvelle thèse
              </button>
            </div>

            {journal.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px dashed rgba(0,0,0,.1)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📓</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Aucune thèse encore</div>
                <div style={{ fontSize: 13, color: '#9898B8', marginBottom: 20, fontWeight: 300, maxWidth: 360, margin: '0 auto 20px' }}>
                  Avant chaque achat, documente ta thèse. Dans 6 mois, tu verras si tu avais raison — et pour quelles raisons.
                </div>
                <button onClick={() => setShowAddJournal(true)} style={{ background: '#3B3BF9', color: 'white', padding: '11px 24px', borderRadius: 100, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                  Écrire ma première thèse
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {journal.map(entry => (
                  <div key={entry.id} style={{
                    background: 'white', borderRadius: 16, padding: 22,
                    border: `1px solid ${entry.statut === 'active' ? 'rgba(59,59,249,.15)' : entry.statut === 'vendu' ? 'rgba(255,107,107,.15)' : 'rgba(0,212,126,.15)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EBEBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#3B3BF9' }}>
                          {entry.ticker}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{entry.nom}</div>
                          <div style={{ fontSize: 11, color: '#9898B8' }}>
                            Acheté le {new Date(entry.date_achat).toLocaleDateString('fr-FR')}
                            {entry.prix_achat && ` · ${entry.prix_achat}€`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                          background: entry.statut === 'active' ? '#EBEBFF' : entry.statut === 'vendu' ? 'rgba(255,107,107,.12)' : 'rgba(0,212,126,.1)',
                          color: entry.statut === 'active' ? '#3B3BF9' : entry.statut === 'vendu' ? '#FF6B6B' : '#00D47E',
                        }}>
                          {entry.statut === 'active' ? '🔵 Active' : entry.statut === 'vendu' ? '🔴 Vendu' : '✅ Thèse validée'}
                        </span>
                        <select
                          value={entry.statut}
                          onChange={e => updateJournalStatut(entry.id, e.target.value)}
                          style={{ fontSize: 10, border: '1px solid rgba(0,0,0,.1)', borderRadius: 8, padding: '4px 6px', fontFamily: 'Sora,sans-serif', cursor: 'pointer' }}
                        >
                          <option value="active">Active</option>
                          <option value="validée">Validée</option>
                          <option value="vendu">Vendu</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { q: '💡 Ma thèse', a: entry.these },
                        { q: '🛑 Stop intellectuel', a: entry.stop_intellectuel },
                        { q: '⏱ Horizon', a: entry.horizon },
                        { q: '⚠️ Risque principal', a: entry.risque_principal },
                      ].map((item, i) => (
                        <div key={i} style={{ background: '#F8F7F5', borderRadius: 10, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#9898B8', marginBottom: 4 }}>{item.q}</div>
                          <div style={{ fontSize: 12, color: '#4A4A6A', lineHeight: 1.5, fontWeight: 300 }}>{item.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MODAL JOURNAL */}
            {showAddJournal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20, overflowY: 'auto' }}>
                <div style={{ background: 'white', borderRadius: 20, padding: 28, width: '100%', maxWidth: 560, margin: 'auto' }}>
                  <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Documenter ma thèse d'investissement</div>
                  <div style={{ fontSize: 12, color: '#9898B8', marginBottom: 20, fontWeight: 300 }}>4 questions — 5 minutes — une décision plus rationnelle</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={labelStyle}>Ticker *</label>
                      <input style={inputStyle} placeholder="ex: TTE" value={jTicker} onChange={e => setJTicker(e.target.value.toUpperCase())} />
                    </div>
                    <div>
                      <label style={labelStyle}>Nom de l'entreprise *</label>
                      <input style={inputStyle} placeholder="ex: TotalEnergies" value={jNom} onChange={e => setJNom(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date d'achat</label>
                      <input style={inputStyle} type="date" value={jDate} onChange={e => setJDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Prix d'achat (€)</label>
                      <input style={inputStyle} type="number" placeholder="optionnel" value={jPrix} onChange={e => setJPrix(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>💡 Pourquoi achètes-tu cet actif maintenant ? (ta thèse en 2-3 phrases) *</label>
                      <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }} placeholder="ex: TotalEnergies trade à 8x l'EBITDA avec un dividende de 6% durable. La baisse récente est liée au pétrole, pas aux fondamentaux..." value={jThese} onChange={e => setJThese(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>🛑 Dans quelles conditions vendras-tu si ta thèse est invalidée ? *</label>
                      <input style={inputStyle} placeholder="ex: Je vends si le dividende est coupé ou si la dette dépasse 3x l'EBITDA" value={jStop} onChange={e => setJStop(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>⏱ Quel est ton horizon de placement ? *</label>
                      <input style={inputStyle} placeholder="ex: 3 à 5 ans" value={jHorizon} onChange={e => setJHorizon(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>⚠️ Quel est le risque principal qui pourrait invalider ta thèse ? *</label>
                      <input style={inputStyle} placeholder="ex: Chute prolongée du prix du pétrole sous 60$/baril" value={jRisque} onChange={e => setJRisque(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={addJournalEntry} disabled={saving || !jTicker || !jNom || !jThese || !jStop || !jHorizon || !jRisque} style={{
                      flex: 1, background: '#3B3BF9', color: 'white', padding: '12px', borderRadius: 100,
                      fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Sora,sans-serif',
                    }}>
                      {saving ? 'Enregistrement...' : 'Sauvegarder ma thèse'}
                    </button>
                    <button onClick={() => setShowAddJournal(false)} style={{ padding: '12px 20px', background: '#F8F7F5', color: '#4A4A6A', border: 'none', borderRadius: 100, fontSize: 13, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== RAPPORT ===== */}
        {tab === 'rapport' && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Rapport trimestriel automatique</div>

            {positions.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', border: '1px dashed rgba(0,0,0,.1)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Ajoute des positions pour générer ton rapport</div>
                <div style={{ fontSize: 13, color: '#9898B8', fontWeight: 300 }}>Le rapport analyse automatiquement tes positions, ta diversification et tes thèses du journal</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Résumé exécutif */}
                <div style={{ background: '#0F0F2A', borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>Résumé exécutif · {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
                    {[
                      { label: 'Valeur totale', val: `${portfolioStats.totalActuel.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€`, color: 'white' },
                      { label: 'Performance', val: `${portfolioStats.totalPnl >= 0 ? '+' : ''}${pnlPct}%`, color: portfolioStats.totalPnl >= 0 ? '#00D47E' : '#FF6B6B' },
                      { label: 'Positions actives', val: `${positions.length}`, color: '#3B3BF9' },
                    ].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analyse des positions */}
                <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid rgba(0,0,0,.07)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Analyse de chaque position</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {positions.map(pos => {
                      const prixActuel = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels)
                      const pnl = (prixActuel - pos.prix_achat) * pos.quantite
                      const pnlPct = ((prixActuel - pos.prix_achat) / pos.prix_achat * 100).toFixed(1)
                      const isPos = pnl >= 0
                      const journalEntry = journal.find(j => j.ticker === pos.ticker)
                      return (
                        <div key={pos.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F8F7F5', borderRadius: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EBEBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#3B3BF9', flexShrink: 0 }}>
                            {pos.ticker}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{pos.nom}</div>
                            {journalEntry ? (
                              <div style={{ fontSize: 10, color: '#9898B8' }}>Thèse : {journalEntry.these.substring(0, 60)}...</div>
                            ) : (
                              <div style={{ fontSize: 10, color: '#FF9999' }}>⚠️ Pas de thèse documentée</div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isPos ? '#00D47E' : '#FF6B6B' }}>
                              {isPos ? '+' : ''}{pnlPct}%
                            </div>
                            <div style={{ fontSize: 10, color: '#9898B8' }}>
                              {(prixActuel * pos.quantite).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Alertes et points d'attention */}
                <div style={{ background: 'white', borderRadius: 16, padding: 22, border: '1px solid rgba(0,0,0,.07)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Points d'attention</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {positions.filter(p => !journal.find(j => j.ticker === p.ticker)).length > 0 && (
                      <div style={{ background: 'rgba(255,215,0,.08)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#B8860B' }}>
                        ⚠️ {positions.filter(p => !journal.find(j => j.ticker === p.ticker)).length} position(s) sans thèse documentée — va dans le Journal de bord pour les documenter.
                      </div>
                    )}
                    {positions.length > 0 && (() => {
                      const maxPos = positions.reduce((max, pos) => {
                        const val = getPrixActuel(pos.ticker, pos.prix_achat, pos.prix_actuel, prixReels) * pos.quantite
                        return val > max.val ? { ticker: pos.ticker, val } : max
                      }, { ticker: '', val: 0 })
                      const pct = (maxPos.val / portfolioStats.totalActuel * 100).toFixed(0)
                      if (parseInt(pct) > 40) {
                        return (
                          <div style={{ background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.2)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#CC0000' }}>
                            🔴 {maxPos.ticker} représente {pct}% de ton portefeuille — concentration élevée. Pense à diversifier.
                          </div>
                        )
                      }
                      return null
                    })()}
                    {journal.filter(j => j.statut === 'active').length > 0 && (
                      <div style={{ background: 'rgba(59,59,249,.05)', border: '1px solid rgba(59,59,249,.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#3B3BF9' }}>
                        💡 {journal.filter(j => j.statut === 'active').length} thèse(s) active(s) à réévaluer ce trimestre. Mets à jour le statut dans le journal de bord.
                      </div>
                    )}
                    {positions.length > 0 && portfolioStats.totalPnl < 0 && (
                      <div style={{ background: 'rgba(255,107,107,.06)', border: '1px solid rgba(255,107,107,.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#CC0000' }}>
                        📉 Ton portefeuille est en moins-value de {Math.abs(parseFloat(pnlPct))}%. Relis tes thèses — si elles sont intactes, c'est temporaire. Si invalidées, il faut agir.
                      </div>
                    )}
                    {portfolioStats.totalPnl >= 0 && positions.length > 0 && parseInt(pnlPct) > 0 && (
                      <div style={{ background: 'rgba(0,212,126,.06)', border: '1px solid rgba(0,212,126,.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#00875A' }}>
                        ✅ Ton portefeuille est en plus-value de +{pnlPct}%. Continue à tenir ton journal de bord et à rebalancer si l'allocation dérive.
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan d'action */}
                <div style={{ background: '#F8F7F5', borderRadius: 16, padding: 22, border: '1px solid rgba(0,0,0,.07)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Plan d'action pour le prochain trimestre</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      journal.filter(j => j.statut === 'active').length > 0
                        ? `Réévaluer ${journal.filter(j => j.statut === 'active').length} thèse(s) active(s) dans le journal de bord`
                        : null,
                      positions.filter(p => !journal.find(j => j.ticker === p.ticker)).length > 0
                        ? `Documenter ${positions.filter(p => !journal.find(j => j.ticker === p.ticker)).length} position(s) sans thèse`
                        : null,
                      positions.length > 0 ? 'Vérifier que l\'allocation reste conforme à tes objectifs' : null,
                      'Continuer ton DCA mensuel selon ton plan initial',
                    ].filter(Boolean).slice(0, 3).map((action, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#4A4A6A' }}>
                        <span style={{ color: '#3B3BF9', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
