'use client'
import { actus } from '@/lib/actu'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ActuPage() {
  const [user, setUser] = useState<{email?: string} | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user)
    })
  }, [])

  return (
    <div style={{ fontFamily: 'Sora,sans-serif', minHeight: '100vh', background: '#F8F7F5' }}>
      {/* NAV */}
      <nav style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,.08)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: 'none', color: '#0F0F1A', letterSpacing: '-.04em' }}>
          Veltis<span style={{ color: '#3B3BF9' }}>.</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={{ background: '#3B3BF9', color: 'white', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Mon espace →</Link>
          ) : (
            <Link href="/signup" style={{ background: '#0F0F1A', color: 'white', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Commencer</Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3B3BF9', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Actualité boursière</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 10 }}>L'actu expliquée avec tes leçons</h1>
          <p style={{ fontSize: 15, color: '#4A4A6A', fontWeight: 300, lineHeight: 1.6 }}>
            Chaque semaine, des événements réels analysés avec les concepts que tu as appris. La théorie rencontre la pratique.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {actus.map(actu => (
            <div key={actu.id} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid rgba(0,0,0,.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: `${actu.tag_color}18`, color: actu.tag_color, padding: '3px 10px', borderRadius: 100 }}>{actu.tag}</span>
                <span style={{ fontSize: 11, color: '#9898B8' }}>{actu.date}</span>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F0F1A', marginBottom: 10, lineHeight: 1.4 }}>{actu.titre}</h2>
              <p style={{ fontSize: 14, color: '#4A4A6A', lineHeight: 1.7, fontWeight: 300, marginBottom: 16 }}>{actu.resume}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F8F7F5', borderRadius: 12, border: '1px solid rgba(59,59,249,.12)' }}>
                <span style={{ fontSize: 11, color: '#9898B8' }}>📚 Leçon liée :</span>
                <Link href={`/module/${actu.lecon_liee.module}/lecon/${actu.lecon_liee.lecon}`} style={{ fontSize: 12, fontWeight: 700, color: '#3B3BF9', textDecoration: 'none' }}>
                  Module {actu.lecon_liee.module} · {actu.lecon_liee.titre} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: '#0F0F2A', borderRadius: 20, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>Tu veux recevoir l'actu chaque semaine ?</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 20, fontWeight: 300 }}>Inscris-toi sur Veltis — c'est gratuit</div>
          <Link href="/signup" style={{ background: '#3B3BF9', color: 'white', padding: '12px 28px', borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Créer mon compte gratuit →
          </Link>
        </div>
      </div>
    </div>
  )
}
