'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { modules } from '@/lib/modules'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<{email?:string, user_metadata?:{nom?:string}} | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else { setUser(data.user); setLoading(false) }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8F7F5'}}>
      <div style={{fontSize:14,color:'#9898B8'}}>Chargement...</div>
    </div>
  )

  const prenom = user?.user_metadata?.nom || user?.email?.split('@')[0] || 'toi'

  return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'#F8F7F5'}}>

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid rgba(0,0,0,.08)',padding:'14px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontSize:24,fontWeight:800,textDecoration:'none',color:'#0F0F1A',letterSpacing:'-.04em'}}>
          Veltis<span style={{color:'#3B3BF9'}}>.</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontSize:12,color:'#9898B8',background:'#F8F7F5',padding:'6px 12px',borderRadius:100}}>{user?.email}</div>
          <button onClick={handleLogout} style={{fontSize:12,color:'#9898B8',background:'none',border:'1px solid rgba(0,0,0,.1)',borderRadius:100,padding:'6px 14px',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Déconnexion</button>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>

        {/* HEADER */}
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em',marginBottom:4}}>Bonjour {prenom} 👋</h1>
          <p style={{fontSize:14,color:'#4A4A6A',fontWeight:300}}>Tous les modules sont accessibles gratuitement — bonne formation !</p>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:32}}>
          {[
            {label:'Modules disponibles',val:'6',sub:'tous accessibles gratuitement'},
            {label:'Leçons totales',val:'42',sub:'flashcards + quiz inclus'},
            {label:'Durée estimée',val:'~8h',sub:'à ton rythme, 10 min/jour'},
          ].map((s,i) => (
            <div key={i} style={{background:'white',borderRadius:12,padding:16,border:'1px solid rgba(0,0,0,.07)'}}>
              <div style={{fontSize:11,color:'#9898B8',marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:24,fontWeight:700,color:'#0F0F1A',marginBottom:2}}>{s.val}</div>
              <div style={{fontSize:11,color:'#9898B8'}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* MODULES */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16,color:'#0F0F1A'}}>Tes modules</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {modules.map((mod) => (
              <div key={mod.id} style={{background:'white',borderRadius:16,border:'1px solid rgba(59,59,249,.15)',padding:20,display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:'#EBEBFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#3B3BF9',flexShrink:0}}>
                  {String(mod.id).padStart(2,'0')}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#0F0F1A',marginBottom:3}}>{mod.title}</div>
                  <div style={{fontSize:12,color:'#4A4A6A',fontWeight:300}}>{mod.description}</div>
                  <div style={{fontSize:11,color:'#9898B8',marginTop:4}}>{mod.lecons.length} leçons · flashcards · quiz</div>
                </div>
                <Link href={`/module/${mod.id}/lecon/1`} style={{background:'#3B3BF9',color:'white',padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:700,textDecoration:'none',flexShrink:0,whiteSpace:'nowrap'}}>
                  {mod.id === 1 ? 'Commencer' : 'Module ' + mod.id}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
