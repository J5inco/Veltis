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
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        setLoading(false)
      }
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
        <Link href="/" style={{fontSize:18,fontWeight:700,textDecoration:'none',color:'#0F0F1A'}}>Veltis<span style={{color:'#3B3BF9'}}>.</span></Link>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontSize:13,color:'#4A4A6A'}}>{user?.email}</div>
          <button onClick={handleLogout} style={{fontSize:12,color:'#9898B8',background:'none',border:'none',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Déconnexion</button>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>

        {/* HEADER */}
        <div style={{marginBottom:32}}>
          <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em',marginBottom:4}}>Bonjour {prenom} 👋</h1>
          <p style={{fontSize:14,color:'#4A4A6A',fontWeight:300}}>Continue ta progression — commence par le module 1</p>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:32}}>
          {[
            {label:'Modules gratuits',val:'2',sub:'disponibles maintenant'},
            {label:'Leçons totales',val:'14',sub:'modules 1 et 2'},
            {label:'Progression',val:'0%',sub:'commence ta première leçon'},
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
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Tes modules disponibles</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {modules.map((mod) => (
              <div key={mod.id} style={{background:'white',borderRadius:16,border:`1px solid ${mod.free?'rgba(59,59,249,.2)':'rgba(0,0,0,.07)'}`,padding:20,display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:mod.free?'#EBEBFF':'#F8F7F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:mod.free?'#3B3BF9':'#9898B8',flexShrink:0}}>
                  {String(mod.id).padStart(2,'0')}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#0F0F1A',marginBottom:3}}>{mod.title}</div>
                  <div style={{fontSize:12,color:'#4A4A6A',fontWeight:300}}>{mod.description}</div>
                  <div style={{fontSize:11,color:'#9898B8',marginTop:4}}>{mod.lecons.length} leçons</div>
                </div>
                <div style={{flexShrink:0}}>
                  {mod.free ? (
                    <Link href={`/module/${mod.id}/lecon/1`} style={{background:'#3B3BF9',color:'white',padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:700,textDecoration:'none',display:'inline-block'}}>
                      Commencer
                    </Link>
                  ) : (
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:20,marginBottom:4}}>🔒</div>
                      <div style={{fontSize:10,color:'#9898B8'}}>Premium</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Modules Premium verrouillés */}
            {[
              {n:'03',t:'Évaluer une entreprise'},
              {n:'04',t:'Construire un portefeuille'},
              {n:'05',t:"Passer à l'action"},
              {n:'06',t:'Boussole — suivi continu'},
            ].map((m,i) => (
              <div key={i} style={{background:'white',borderRadius:16,border:'1px solid rgba(0,0,0,.07)',padding:20,display:'flex',alignItems:'center',gap:16,opacity:.5}}>
                <div style={{width:44,height:44,borderRadius:12,background:'#F8F7F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#9898B8',flexShrink:0}}>{m.n}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:'#0F0F1A',marginBottom:3}}>{m.t}</div>
                  <div style={{fontSize:12,color:'#9898B8',fontWeight:300}}>Disponible en Premium</div>
                </div>
                <div style={{fontSize:20}}>🔒</div>
              </div>
            ))}
          </div>
        </div>

        {/* UPGRADE BANNER */}
        <div style={{background:'#0F0F2A',borderRadius:20,padding:28,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:'white',marginBottom:6}}>Passe au Premium pour tout débloquer</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.5)',fontWeight:300}}>6 modules, Boussole, certificat investisseur — à partir de 7,99€/mois</div>
          </div>
          <Link href="/#pricing" style={{background:'#3B3BF9',color:'white',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>
            Voir les offres
          </Link>
        </div>
      </div>
    </div>
  )
}
