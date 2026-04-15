'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { modules } from '@/lib/modules'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const InteractiveDCF = dynamic(() => import('@/components/InteractiveDCF'), { ssr: false })
const InteractiveETFvsActif = dynamic(() => import('@/components/InteractiveETFvsActif'), { ssr: false })
const InteractivePortfolioBuilder = dynamic(() => import('@/components/InteractivePortfolioBuilder'), { ssr: false })

export default function LeconPage() {
  const params = useParams()
  const moduleId = Number(params.moduleId)
  const leconId = Number(params.leconId)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [view, setView] = useState<'texte'|'flashcards'|'quiz'|'celebration'>('texte')
  const [cardIndex, setCardIndex] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answered, setAnswered] = useState<number|null>(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)
  const confettiRef = useRef<boolean>(false)

  const mod = modules.find(m => m?.id === moduleId)
  const lecon = mod?.lecons.find(l => l.id === leconId)
  const isLastLecon = !!mod && leconId === mod.lecons.length
  const nextLecon = mod?.lecons.find(l => l.id === leconId + 1)
  const prevLecon = mod?.lecons.find(l => l.id === leconId - 1)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else { setUserId(data.user.id); setLoading(false) }
    })
  }, [router])

  // Confetti animation
  useEffect(() => {
    if (view === 'celebration' && !confettiRef.current) {
      confettiRef.current = true
      import('canvas-confetti').then(({ default: confetti }) => {
        const duration = 3000
        const end = Date.now() + duration
        const frame = () => {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3B3BF9', '#00D47E', '#FFD700'] })
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3B3BF9', '#00D47E', '#FFD700'] })
          if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()
      })
    }
  }, [view])

  const saveProgress = async (finalScore: number) => {
    if (!userId || scoreSaved) return
    setScoreSaved(true)
    const totalQ = lecon?.quiz.length || 0

    // Save lecon progress
    await supabase.from('progressions').upsert({
      user_id: userId,
      module_id: moduleId,
      lecon_id: leconId,
      quiz_score: finalScore,
      quiz_total: totalQ,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,module_id,lecon_id' })

    // If last lecon, update module score
    if (isLastLecon) {
      const { data: existing } = await supabase
        .from('module_scores')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single()

      const totalModuleQ = mod?.lecons.reduce((acc, l) => acc + l.quiz.length, 0) || 0

      if (existing) {
        await supabase.from('module_scores').update({
          best_score: Math.max(existing.best_score, finalScore),
          total_questions: totalModuleQ,
          attempts: existing.attempts + 1,
          last_completed_at: new Date().toISOString()
        }).eq('user_id', userId).eq('module_id', moduleId)
      } else {
        await supabase.from('module_scores').insert({
          user_id: userId,
          module_id: moduleId,
          best_score: finalScore,
          total_questions: totalModuleQ,
          attempts: 1,
          last_completed_at: new Date().toISOString()
        })
      }
    }
  }

  if (loading) return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8F7F5'}}>
      <div style={{fontSize:14,color:'#9898B8'}}>Chargement...</div>
    </div>
  )
  if (!mod || !lecon) return <div style={{fontFamily:'Sora,sans-serif',padding:40}}>Leçon introuvable. <Link href="/dashboard">Retour</Link></div>

  const handleAnswer = (idx: number) => {
    if (answered !== null) return
    setAnswered(idx)
    if (idx === lecon.quiz[quizIndex].reponse) setScore(s => s + 1)
  }

  const nextQuestion = () => {
    if (quizIndex < lecon.quiz.length - 1) {
      setQuizIndex(q => q + 1)
      setAnswered(null)
    } else {
      const finalScore = answered === lecon.quiz[quizIndex].reponse ? score + 1 : score
      setQuizDone(true)
      if (isLastLecon) {
        saveProgress(finalScore)
        setTimeout(() => setView('celebration'), 500)
      }
    }
  }

  const pct = Math.round((score / lecon.quiz.length) * 100)
  const getCelebrationMsg = () => {
    if (pct === 100) return { emoji: '🏆', title: 'Parfait !', sub: 'Module maîtrisé à 100% — performance exceptionnelle !', color: '#FFD700' }
    if (pct >= 80) return { emoji: '⭐', title: 'Très bien !', sub: 'Tu maîtrises l\'essentiel du module.', color: '#3B3BF9' }
    if (pct >= 60) return { emoji: '👍', title: 'Bien !', sub: 'Quelques points à revoir pour consolider.', color: '#00D47E' }
    return { emoji: '💪', title: 'Continue !', sub: 'La pratique rend parfait — tu peux refaire le module.', color: '#9898B8' }
  }

  const msg = getCelebrationMsg()

  // CELEBRATION SCREEN
  if (view === 'celebration') {
    return (
      <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'linear-gradient(135deg,#0F0F2A 0%,#1a1a3a 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center'}}>
        <div style={{fontSize:80,marginBottom:24,animation:'bounce 1s infinite alternate'}}>{msg.emoji}</div>
        <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:12}}>Module {moduleId} terminé</div>
        <h1 style={{fontSize:48,fontWeight:800,color:'white',letterSpacing:'-.04em',marginBottom:8}}>{msg.title}</h1>
        <p style={{fontSize:16,color:'rgba(255,255,255,.5)',marginBottom:40,fontWeight:300,maxWidth:420}}>{msg.sub}</p>

        <div style={{background:'rgba(255,255,255,.07)',borderRadius:24,padding:'32px 48px',marginBottom:40,border:'1px solid rgba(255,255,255,.1)'}}>
          <div style={{fontSize:72,fontWeight:800,color:msg.color,letterSpacing:'-.04em',lineHeight:1}}>{pct}%</div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.4)',marginTop:8,fontWeight:300}}>{score} / {lecon.quiz.length} bonnes réponses · Module {moduleId}</div>
          <div style={{marginTop:20,height:6,background:'rgba(255,255,255,.1)',borderRadius:3,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:msg.color,borderRadius:3,transition:'width 1s ease'}}></div>
          </div>
        </div>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
          <Link href="/dashboard" style={{background:'#3B3BF9',color:'white',padding:'14px 32px',borderRadius:100,fontSize:14,fontWeight:700,textDecoration:'none'}}>
            Voir mon tableau de bord
          </Link>
          <button
            onClick={() => {
              setView('quiz')
              setQuizIndex(0)
              setAnswered(null)
              setScore(0)
              setQuizDone(false)
              setScoreSaved(false)
              confettiRef.current = false
            }}
            style={{background:'rgba(255,255,255,.07)',color:'white',padding:'14px 32px',borderRadius:100,fontSize:14,fontWeight:600,border:'1px solid rgba(255,255,255,.15)',cursor:'pointer',fontFamily:'Sora,sans-serif'}}
          >
            Refaire le quiz
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            from { transform: translateY(0px) scale(1); }
            to { transform: translateY(-20px) scale(1.1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'#F8F7F5'}}>

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid rgba(0,0,0,.08)',padding:'14px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontSize:22,fontWeight:800,textDecoration:'none',color:'#0F0F1A',letterSpacing:'-.04em'}}>
          Veltis<span style={{color:'#3B3BF9'}}>.</span>
        </Link>
        <div style={{fontSize:13,color:'#4A4A6A',fontWeight:500}}>Module {moduleId} · Leçon {leconId}/{mod.lecons.length}</div>
        <Link href="/dashboard" style={{fontSize:12,color:'#9898B8',textDecoration:'none'}}>← Tableau de bord</Link>
      </nav>

      {/* PROGRESS BAR */}
      <div style={{background:'white',height:4}}>
        <div style={{height:4,background:'#3B3BF9',width:`${(leconId/mod.lecons.length)*100}%`,transition:'width .3s'}}></div>
      </div>

      <div style={{maxWidth:720,margin:'0 auto',padding:'40px 24px'}}>

        {/* HEADER */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:11,color:'#3B3BF9',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>
            Module {moduleId} · {mod.title}
          </div>
          <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-.03em',color:'#0F0F1A'}}>{lecon.title}</h1>
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {(['texte','flashcards','quiz'] as const).map(tab => (
            <button key={tab} onClick={() => setView(tab)} style={{padding:'8px 18px',borderRadius:100,fontSize:12,fontWeight:600,border:view===tab?'none':'1px solid rgba(0,0,0,.08)',cursor:'pointer',fontFamily:'Sora,sans-serif',background:view===tab?'#3B3BF9':'white',color:view===tab?'white':'#4A4A6A'}}>
              {tab === 'texte' ? '📖 Leçon' : tab === 'flashcards' ? '🃏 Flashcards' : '🎯 Quiz'}
            </button>
          ))}
        </div>

        {/* TEXTE */}
        {view === 'texte' && (
          <div style={{background:'white',borderRadius:20,padding:32,border:'1px solid rgba(0,0,0,.08)'}}>
            {lecon.texte.split('\n\n').map((para, i) => (
              <p key={i} style={{fontSize:15,color:'#4A4A6A',lineHeight:1.8,marginBottom:16,fontWeight:300}} dangerouslySetInnerHTML={{__html:para.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#0F0F1A;font-weight:600">$1</strong>')}} />
            ))}
            {/* INTERACTIVE VISUALS */}
            {moduleId === 3 && leconId === 2 && <InteractiveDCF />}
            {moduleId === 4 && leconId === 2 && <InteractiveETFvsActif />}
            {moduleId === 4 && leconId === 5 && <InteractivePortfolioBuilder />}
            <div style={{marginTop:24,paddingTop:20,borderTop:'1px solid rgba(0,0,0,.08)',display:'flex',justifyContent:'center'}}>
              <button onClick={() => setView('flashcards')} style={{background:'#3B3BF9',color:'white',padding:'12px 28px',borderRadius:100,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Continuer avec les flashcards →
              </button>
            </div>
          </div>
        )}

        {/* FLASHCARDS */}
        {view === 'flashcards' && (
          <div>
            <div style={{textAlign:'center',marginBottom:16,fontSize:12,color:'#9898B8'}}>{cardIndex+1} / {lecon.flashcards.length}</div>
            <div
              onClick={() => setCardFlipped(f => !f)}
              style={{background:cardFlipped?'#0F0F2A':'white',borderRadius:20,padding:40,border:'1px solid rgba(0,0,0,.08)',minHeight:200,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all .2s',textAlign:'center'}}
            >
              <div>
                <div style={{fontSize:10,color:cardFlipped?'rgba(255,255,255,.4)':'#9898B8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>
                  {cardFlipped ? 'Réponse' : 'Question — clique pour retourner'}
                </div>
                <div style={{fontSize:16,fontWeight:600,color:cardFlipped?'white':'#0F0F1A',lineHeight:1.5}}>
                  {cardFlipped ? lecon.flashcards[cardIndex].verso : lecon.flashcards[cardIndex].recto}
                </div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:16}}>
              <button onClick={() => {setCardIndex(i => Math.max(0,i-1));setCardFlipped(false)}} disabled={cardIndex===0} style={{padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:600,border:'1px solid rgba(0,0,0,.08)',background:'white',cursor:cardIndex===0?'not-allowed':'pointer',opacity:cardIndex===0?.4:1,fontFamily:'Sora,sans-serif'}}>← Précédente</button>
              {cardIndex < lecon.flashcards.length-1 ? (
                <button onClick={() => {setCardIndex(i => i+1);setCardFlipped(false)}} style={{padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:600,background:'#3B3BF9',color:'white',border:'none',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Suivante →</button>
              ) : (
                <button onClick={() => setView('quiz')} style={{padding:'10px 20px',borderRadius:100,fontSize:12,fontWeight:700,background:'#3B3BF9',color:'white',border:'none',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>Faire le quiz →</button>
              )}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {view === 'quiz' && !quizDone && (
          <div style={{background:'white',borderRadius:20,padding:28,border:'1px solid rgba(0,0,0,.08)'}}>
            <div style={{display:'flex',gap:4,marginBottom:20}}>
              {lecon.quiz.map((_,i) => (
                <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<quizIndex?'#3B3BF9':i===quizIndex?'#EBEBFF':'rgba(0,0,0,.08)'}}></div>
              ))}
            </div>
            <div style={{fontSize:11,color:'#9898B8',marginBottom:8}}>Question {quizIndex+1} sur {lecon.quiz.length}</div>
            <div style={{fontSize:16,fontWeight:700,color:'#0F0F1A',marginBottom:20,lineHeight:1.5}}>{lecon.quiz[quizIndex].question}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
              {lecon.quiz[quizIndex].options.map((opt,i) => {
                let bg = 'white', borderC = 'rgba(0,0,0,.1)', color = '#0F0F1A'
                if (answered !== null) {
                  if (i === lecon.quiz[quizIndex].reponse) { bg='#EAF3DE'; borderC='#3B6D11'; color='#27500A' }
                  else if (i === answered && answered !== lecon.quiz[quizIndex].reponse) { bg='#FCEBEB'; borderC='#A32D2D'; color='#791F1F' }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} style={{padding:'12px 14px',borderRadius:10,fontSize:13,textAlign:'left',cursor:answered!==null?'default':'pointer',background:bg,border:`1px solid ${borderC}`,color,fontFamily:'Sora,sans-serif',transition:'all .12s'}}>
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered !== null && (
              <div>
                <div style={{background:answered===lecon.quiz[quizIndex].reponse?'#EAF3DE':'#FCEBEB',color:answered===lecon.quiz[quizIndex].reponse?'#27500A':'#791F1F',padding:'10px 14px',borderRadius:10,fontSize:12,marginBottom:12,lineHeight:1.5}}>
                  {answered===lecon.quiz[quizIndex].reponse?'✓ ':'✗ '}{lecon.quiz[quizIndex].feedback}
                </div>
                <button onClick={nextQuestion} style={{background:'#3B3BF9',color:'white',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                  {quizIndex < lecon.quiz.length-1 ? 'Question suivante →' : isLastLecon ? '🎉 Voir mes résultats' : 'Voir les résultats'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUIZ DONE (non-last lecon) */}
        {view === 'quiz' && quizDone && !isLastLecon && (
          <div style={{background:'white',borderRadius:20,padding:40,textAlign:'center',border:'1px solid rgba(0,0,0,.08)'}}>
            <div style={{fontSize:48,marginBottom:16}}>{pct === 100 ? '🏆' : pct >= 80 ? '⭐' : '👍'}</div>
            <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>{pct === 100 ? 'Parfait !' : pct >= 80 ? 'Très bien !' : 'Bien !'}</div>
            <div style={{fontSize:14,color:'#4A4A6A',marginBottom:8,fontWeight:300}}>{score} / {lecon.quiz.length} bonnes réponses</div>
            <div style={{fontSize:24,fontWeight:800,color:'#3B3BF9',marginBottom:24}}>{pct}%</div>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              {nextLecon && (
                <Link href={`/module/${moduleId}/lecon/${leconId+1}`} style={{background:'#3B3BF9',color:'white',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:700,textDecoration:'none'}}>
                  Leçon suivante →
                </Link>
              )}
              <button onClick={() => {setView('quiz');setQuizIndex(0);setAnswered(null);setScore(0);setQuizDone(false)}} style={{background:'white',color:'#4A4A6A',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:600,border:'1px solid rgba(0,0,0,.08)',cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Refaire
              </button>
              <Link href="/dashboard" style={{background:'white',color:'#4A4A6A',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:600,textDecoration:'none',border:'1px solid rgba(0,0,0,.08)'}}>
                Tableau de bord
              </Link>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div style={{display:'flex',justifyContent:'space-between',marginTop:24}}>
          {prevLecon ? (
            <Link href={`/module/${moduleId}/lecon/${leconId-1}`} style={{fontSize:12,color:'#9898B8',textDecoration:'none'}}>← {prevLecon.title}</Link>
          ) : <div></div>}
          {nextLecon && !quizDone && (
            <Link href={`/module/${moduleId}/lecon/${leconId+1}`} style={{fontSize:12,color:'#3B3BF9',textDecoration:'none',fontWeight:600}}>{nextLecon.title} →</Link>
          )}
        </div>
      </div>
    </div>
  )
}
