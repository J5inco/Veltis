'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { modules } from '@/lib/modules'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getStreak, getLevel, getLevelProgress } from '@/lib/streak'

type ModuleScore = {
  module_id: number
  best_score: number
  total_questions: number
  attempts: number
  last_completed_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<{email?:string, user_metadata?:{nom?:string}} | null>(null)
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<ModuleScore[]>([])
  const [streakData, setStreakData] = useState<{streak_days:number,total_xp:number,longest_streak:number}|null>(null)
  const [recommendedModule, setRecommendedModule] = useState<number|null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: scoresData } = await supabase
        .from('module_scores')
        .select('*')
        .eq('user_id', data.user.id)
      setScores(scoresData || [])
      // Fetch streak
      const streak = await getStreak(data.user.id)
      if (streak) setStreakData(streak)
      // Fetch recommended module
      const { data: onb } = await supabase.from('user_onboarding').select('recommended_module').eq('user_id', data.user.id).single()
      if (onb) setRecommendedModule(onb.recommended_module)
      setLoading(false)
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getScore = (moduleId: number) => scores.find(s => s.module_id === moduleId)

  const getStatusLabel = (moduleId: number) => {
    const s = getScore(moduleId)
    if (!s) return null
    const pct = Math.round((s.best_score / s.total_questions) * 100)
    return { pct, attempts: s.attempts }
  }

  const getBadgeColor = (pct: number) => {
    if (pct === 100) return '#FFD700'
    if (pct >= 80) return '#3B3BF9'
    if (pct >= 60) return '#00D47E'
    return '#9898B8'
  }

  const getBadgeEmoji = (pct: number) => {
    if (pct === 100) return '🏆'
    if (pct >= 80) return '⭐'
    if (pct >= 60) return '✓'
    return '↺'
  }

  if (loading) return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8F7F5'}}>
      <div style={{fontSize:14,color:'#9898B8'}}>Chargement...</div>
    </div>
  )

  const prenom = user?.user_metadata?.nom || user?.email?.split('@')[0] || 'toi'
  const completedModules = scores.length
  const totalXP = scores.reduce((acc, s) => acc + Math.round((s.best_score / s.total_questions) * 100), 0)

  return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'#F8F7F5'}}>

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid rgba(0,0,0,.08)',padding:'14px 40px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontSize:22,fontWeight:800,textDecoration:'none',color:'#0F0F1A',letterSpacing:'-.04em'}}>
          Veltis<span style={{color:'#3B3BF9'}}>.</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Link href="/actu" style={{fontSize:12,color:'#4A4A6A',textDecoration:'none',padding:'6px 12px',borderRadius:100,border:'1px solid rgba(0,0,0,.08)'}}>📰 Actu</Link>
          <div style={{fontSize:12,color:'#9898B8',background:'#F8F7F5',padding:'6px 12px',borderRadius:100}}>{user?.email}</div>
          <button onClick={handleLogout} style={{fontSize:12,color:'#9898B8',background:'none',border:'1px solid rgba(0,0,0,.1)',borderRadius:100,padding:'6px 14px',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Déconnexion</button>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>

        {/* HEADER */}
        <div style={{marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:16}}>
            <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em'}}>Bonjour {prenom} 👋</h1>
            {streakData && (() => {
              const level = getLevel(streakData.total_xp)
              const progress = getLevelProgress(streakData.total_xp)
              return (
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <div style={{background:'#FFF8E7',border:'1px solid #FFD700',borderRadius:100,padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:14}}>🔥</span>
                    <span style={{fontSize:13,fontWeight:700,color:'#B8860B'}}>{streakData.streak_days} jour{streakData.streak_days > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{background:'white',border:'1px solid rgba(0,0,0,.08)',borderRadius:100,padding:'6px 14px',display:'flex',alignItems:'center',gap:8,minWidth:160}}>
                    <span style={{fontSize:14}}>{level.icon}</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:level.color}}>{level.name}</div>
                      <div style={{width:80,height:3,background:'#F0F0F0',borderRadius:2,overflow:'hidden',marginTop:2}}>
                        <div style={{height:'100%',width:`${progress}%`,background:level.color,borderRadius:2}}/>
                      </div>
                    </div>
                    <span style={{fontSize:11,color:'#9898B8',fontWeight:600}}>{streakData.total_xp} XP</span>
                  </div>
                </div>
              )
            })()}
          </div>
          <p style={{fontSize:14,color:'#4A4A6A',fontWeight:300}}>Continue ta progression — tous les modules sont accessibles gratuitement</p>
          {recommendedModule && recommendedModule > 1 && (
            <div style={{marginTop:10,background:'#EBEBFF',border:'1px solid rgba(59,59,249,.2)',borderRadius:10,padding:'8px 14px',display:'inline-flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:11,color:'#3B3BF9'}}>💡</span>
              <span style={{fontSize:12,color:'#3B3BF9',fontWeight:600}}>Recommandé pour toi : commence au Module {recommendedModule}</span>
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:32}}>
          <div style={{background:'white',borderRadius:12,padding:16,border:'1px solid rgba(0,0,0,.07)'}}>
            <div style={{fontSize:11,color:'#9898B8',marginBottom:4}}>Modules validés</div>
            <div style={{fontSize:24,fontWeight:700,color:'#0F0F1A',marginBottom:2}}>{completedModules} / 6</div>
            <div style={{height:4,background:'#F8F7F5',borderRadius:2,overflow:'hidden',marginTop:8}}>
              <div style={{height:'100%',width:`${(completedModules/6)*100}%`,background:'#3B3BF9',borderRadius:2}}></div>
            </div>
          </div>
          <div style={{background:'white',borderRadius:12,padding:16,border:'1px solid rgba(0,0,0,.07)'}}>
            <div style={{fontSize:11,color:'#9898B8',marginBottom:4}}>Score moyen</div>
            <div style={{fontSize:24,fontWeight:700,color:'#0F0F1A',marginBottom:2}}>
              {completedModules > 0 ? `${Math.round(totalXP / completedModules)}%` : '--'}
            </div>
            <div style={{fontSize:11,color:'#9898B8'}}>sur les modules validés</div>
          </div>
          <div style={{background:'white',borderRadius:12,padding:16,border:'1px solid rgba(0,0,0,.07)'}}>
            <div style={{fontSize:11,color:'#9898B8',marginBottom:4}}>Leçons disponibles</div>
            <div style={{fontSize:24,fontWeight:700,color:'#0F0F1A',marginBottom:2}}>42</div>
            <div style={{fontSize:11,color:'#9898B8'}}>flashcards + quiz inclus</div>
          </div>
        </div>

        {/* MODULES */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16,color:'#0F0F1A'}}>Tes modules</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {modules.map((mod) => { if (!mod) return null;
              const status = getStatusLabel(mod.id)
              const isCompleted = !!status
              const pct = status?.pct || 0
              const badgeColor = getBadgeColor(pct)

              return (
                <div key={mod.id} style={{background:'white',borderRadius:16,border:`1px solid ${isCompleted ? badgeColor + '40' : 'rgba(59,59,249,.12)'}`,padding:20,display:'flex',alignItems:'center',gap:16,transition:'all .15s'}}>

                  {/* MODULE NUMBER + RING */}
                  <div style={{position:'relative',width:52,height:52,flexShrink:0}}>
                    <svg width="52" height="52" style={{position:'absolute',top:0,left:0,transform:'rotate(-90deg)'}}>
                      <circle cx="26" cy="26" r="22" fill="none" stroke="#F8F7F5" strokeWidth="3"/>
                      {isCompleted && <circle cx="26" cy="26" r="22" fill="none" stroke={badgeColor} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 22}`} strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct/100)}`} strokeLinecap="round" style={{transition:'stroke-dashoffset 1s ease'}}/>}
                    </svg>
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:isCompleted?badgeColor:'#9898B8'}}>
                      {String(mod.id).padStart(2,'0')}
                    </div>
                  </div>

                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#0F0F1A'}}>{mod.title}</div>
                      {isCompleted && (
                        <div style={{fontSize:10,fontWeight:700,background:badgeColor+'20',color:badgeColor,padding:'2px 8px',borderRadius:100}}>
                          {getBadgeEmoji(pct)} {pct}%
                        </div>
                      )}
                    </div>
                    <div style={{fontSize:12,color:'#4A4A6A',fontWeight:300}}>{mod.description}</div>
                    <div style={{fontSize:11,color:'#9898B8',marginTop:4}}>
                      {mod.lecons.length} leçons
                      {status && ` · ${status.attempts} tentative${status.attempts > 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <div style={{flexShrink:0,display:'flex',gap:8}}>
                    {isCompleted && (
                      <Link href={`/module/${mod.id}/lecon/1`} style={{background:'transparent',color:'#9898B8',padding:'9px 16px',borderRadius:100,fontSize:11,fontWeight:600,textDecoration:'none',border:'1px solid rgba(0,0,0,.1)',whiteSpace:'nowrap'}}>
                        Refaire
                      </Link>
                    )}
                    <Link href={`/module/${mod.id}/lecon/1`} style={{background: isCompleted ? '#F8F7F5' : '#3B3BF9',color:isCompleted?'#4A4A6A':'white',padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:700,textDecoration:'none',flexShrink:0,whiteSpace:'nowrap',border:isCompleted?'1px solid rgba(0,0,0,.08)':'none'}}>
                      {isCompleted ? 'Continuer' : mod.id === 1 ? 'Commencer' : `Module ${mod.id}`}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* BOUSSOLE BANNER */}
        <div style={{background:'#0F0F2A',borderRadius:20,padding:28,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <div style={{fontSize:16,fontWeight:800,color:'white'}}>🧭 Boussole — Suivi de ton portefeuille</div>
              <span style={{fontSize:11,fontWeight:700,background:'rgba(0,212,126,.2)',color:'#00D47E',padding:'2px 10px',borderRadius:100}}>Nouveau</span>
            </div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.5)',fontWeight:300}}>Saisis tes positions, tiens ton journal de bord, génère ton rapport trimestriel.</div>
          </div>
          <Link href="/boussole" style={{background:'#3B3BF9',color:'white',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',flexShrink:0}}>
            Ouvrir la Boussole →
          </Link>
        </div>
      </div>
    </div>
  )
}
