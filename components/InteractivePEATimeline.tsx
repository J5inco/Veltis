'use client'
import { useState } from 'react'

const etapes = [
  { id: 1, emoji: '📱', titre: 'Télécharger l\'app', duree: '2 min', detail: 'Télécharge l\'application Trade Republic, XTB ou Boursobank depuis l\'App Store ou Google Play. Crée un compte avec ton adresse email et un mot de passe sécurisé.', color: '#3B3BF9' },
  { id: 2, emoji: '📝', titre: 'Informations personnelles', duree: '5 min', detail: 'Saisis tes informations : nom, prénom, date de naissance, adresse fiscale française, numéro fiscal. Ces informations sont obligatoires pour l\'ouverture d\'une enveloppe fiscale PEA.', color: '#6B6BFA' },
  { id: 3, emoji: '🪪', titre: 'Pièce d\'identité', duree: '3 min', detail: 'Prends en photo recto/verso ta CNI ou ton passeport. L\'image doit être nette, sans reflet. La vérification est automatisée par IA — résultat en moins d\'une minute généralement.', color: '#9090FC' },
  { id: 4, emoji: '🎥', titre: 'Vérification vidéo (KYC)', duree: '2 min', detail: 'Montre ta pièce d\'identité face caméra. C\'est la vérification KYC (Know Your Customer) imposée par la réglementation européenne. Elle prend 30 secondes et se fait en direct ou via une IA.', color: '#00D47E' },
  { id: 5, emoji: '✍️', titre: 'Signature électronique', duree: '2 min', detail: 'Signe électroniquement la convention de compte PEA. Lis les conditions avant de signer — notamment les plafonds de versement (150 000€) et les règles de retrait avant 5 ans.', color: '#FFD700' },
  { id: 6, emoji: '💸', titre: 'Premier virement', duree: '1 min', detail: '10€ suffisent pour ouvrir le PEA. Le compteur fiscal des 5 ans démarre dès réception de ce virement. N\'attends pas d\'avoir plus d\'argent — chaque mois de retard est un mois d\'avantage fiscal perdu.', color: '#FF9966' },
]

export default function InteractivePEATimeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [dateOuverture, setDateOuverture] = useState('')

  const dateFiscale = dateOuverture ? (() => {
    const d = new Date(dateOuverture)
    d.setFullYear(d.getFullYear() + 5)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  })() : null

  const today = new Date().toISOString().split('T')[0]
  const moisRestants = dateOuverture ? (() => {
    const ouv = new Date(dateOuverture)
    const fin = new Date(ouv)
    fin.setFullYear(fin.getFullYear() + 5)
    const now = new Date()
    if (now > fin) return 0
    return Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
  })() : null

  return (
    <div style={{ background: 'linear-gradient(135deg,#0F0F2A,#1a1a3e)', borderRadius: 20, padding: '28px 24px', margin: '24px 0', border: '1px solid rgba(0,212,126,.3)', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#00D47E', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Visuel interactif</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>Guide d'ouverture PEA</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 24, fontWeight: 300 }}>Clique sur chaque étape pour voir les détails · Durée totale : ~15 minutes</div>

      {/* TIMELINE */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,.08)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {etapes.map((e, i) => (
            <div key={e.id}>
              <div
                onClick={() => setActiveStep(activeStep === e.id ? null : e.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {/* Cercle */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: activeStep === e.id ? e.color : 'rgba(255,255,255,.08)',
                  border: `2px solid ${activeStep === e.id ? e.color : 'rgba(255,255,255,.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, transition: 'all .2s', zIndex: 1, position: 'relative',
                }}>
                  {e.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: activeStep === e.id ? 'white' : 'rgba(255,255,255,.7)' }}>
                      {e.id}. {e.titre}
                    </span>
                    <span style={{ fontSize: 10, color: e.color, fontWeight: 600, background: `${e.color}15`, padding: '2px 8px', borderRadius: 100 }}>
                      {e.duree}
                    </span>
                  </div>
                </div>
              </div>
              {/* Détail dépliable */}
              {activeStep === e.id && (
                <div style={{
                  marginLeft: 56, marginBottom: 8, padding: '14px 16px',
                  background: `${e.color}12`, border: `1px solid ${e.color}25`,
                  borderRadius: 12, fontSize: 12, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, fontWeight: 300,
                }}>
                  {e.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Calculateur avantage fiscal */}
      <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12 }}>
          📅 Calculateur — quand seras-tu exonéré d'impôt sur le revenu ?
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Date d'ouverture du PEA :</div>
          <input
            type="date" value={dateOuverture} max={today}
            onChange={e => setDateOuverture(e.target.value)}
            style={{
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)',
              borderRadius: 8, padding: '6px 10px', color: 'white', fontSize: 12,
              fontFamily: 'Sora,sans-serif', cursor: 'pointer',
            }}
          />
        </div>
        {dateFiscale && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(0,212,126,.1)', border: '1px solid rgba(0,212,126,.25)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Exonération IR dès le</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#00D47E' }}>{dateFiscale}</div>
            </div>
            <div style={{ background: moisRestants === 0 ? 'rgba(0,212,126,.1)' : 'rgba(255,215,0,.08)', border: `1px solid ${moisRestants === 0 ? 'rgba(0,212,126,.25)' : 'rgba(255,215,0,.2)'}`, borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>
                {moisRestants === 0 ? 'Statut' : 'Il te reste'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: moisRestants === 0 ? '#00D47E' : '#FFD700' }}>
                {moisRestants === 0 ? '✅ Exonéré !' : `~${moisRestants} mois`}
              </div>
            </div>
          </div>
        )}
        {!dateOuverture && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', fontStyle: 'italic' }}>
            Saisis ta date d'ouverture pour voir quand tu seras exonéré d'impôt sur le revenu
          </div>
        )}
      </div>
    </div>
  )
}
