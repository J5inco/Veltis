'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<{email?: string, user_metadata?: {nom?: string}} | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser(data.session.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const prenom = user?.user_metadata?.nom || user?.email?.split('@')[0] || null

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{fontFamily:'Sora,sans-serif',background:'#fff',color:'#0F0F1A'}}>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 56px',background:'#fff',borderBottom:'1px solid rgba(0,0,0,.08)',position:'sticky',top:0,zIndex:100}}>
        <div style={{fontSize:24,fontWeight:800,color:'#0F0F1A',letterSpacing:'-.04em',cursor:'pointer'}} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
          Veltis<span style={{color:'#3B3BF9'}}>.</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:32}}>
          <a href="#modules" onClick={scrollTo('modules')} style={{fontSize:13,color:'#4A4A6A',textDecoration:'none'}}>Modules</a>
          <a href="#how" onClick={scrollTo('how')} style={{fontSize:13,color:'#4A4A6A',textDecoration:'none'}}>Comment ça marche</a>
          <a href="#pricing" onClick={scrollTo('pricing')} style={{fontSize:13,color:'#4A4A6A',textDecoration:'none'}}>Tarifs</a>
          {user ? (
            <Link href="/dashboard" style={{background:'#3B3BF9',color:'white',padding:'10px 22px',borderRadius:100,fontSize:13,fontWeight:600,textDecoration:'none'}}>
              {prenom ? `Mon espace →` : 'Mon espace →'}
            </Link>
          ) : (
            <Link href="/signup" style={{background:'#0F0F1A',color:'white',padding:'10px 22px',borderRadius:100,fontSize:13,fontWeight:600,textDecoration:'none'}}>Commencer gratuitement</Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{textAlign:'center',padding:'88px 40px 80px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#EBEBFF',color:'#3B3BF9',fontSize:11,fontWeight:600,padding:'5px 14px',borderRadius:100,marginBottom:28,border:'1px solid rgba(59,59,249,.2)'}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'#3B3BF9'}}></div>
          Éducation financière · 100% France
        </div>
        <h1 style={{fontSize:58,fontWeight:800,lineHeight:1.05,letterSpacing:'-.04em',marginBottom:18}}>
          Investir en bourse.<br/><span style={{color:'#3B3BF9'}}>On t&apos;explique tout.</span>
        </h1>
        <p style={{fontSize:18,color:'#4A4A6A',lineHeight:1.65,maxWidth:520,margin:'0 auto 36px',fontWeight:300}}>
          Des modules concrets, une fiscalité PEA pensée pour la France, et la Boussole pour t&apos;accompagner à chaque décision.
        </p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:14}}>
          {user ? (
            <Link href="/dashboard" style={{background:'#3B3BF9',color:'white',padding:'15px 36px',borderRadius:100,fontSize:15,fontWeight:700,textDecoration:'none'}}>
              Reprendre ma formation →
            </Link>
          ) : (
            <>
              <Link href="/signup" style={{background:'#3B3BF9',color:'white',padding:'15px 36px',borderRadius:100,fontSize:15,fontWeight:700,textDecoration:'none'}}>Découvrir Veltis</Link>
              <a href="#modules" onClick={scrollTo('modules')} style={{border:'1px solid rgba(0,0,0,.08)',color:'#4A4A6A',padding:'15px 28px',borderRadius:100,fontSize:14,textDecoration:'none'}}>Voir les modules</a>
            </>
          )}
        </div>
        <p style={{fontSize:11,color:'#9898B8'}}>6 modules gratuits · Sans carte bancaire · Résiliable à tout moment</p>
      </section>

      {/* STATS */}
      <div style={{background:'#F8F7F5',padding:'48px 56px',borderTop:'1px solid rgba(0,0,0,.08)',borderBottom:'1px solid rgba(0,0,0,.08)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',textAlign:'center'}}>
          {[
            {n:'2,5%',d:'des Français ont fait une transaction boursière en 2024',s:'AMF · Juil. 2024'},
            {n:'58%',d:'des Américains investissent en bourse, soit 23× plus',s:'Gallup · 2024'},
            {n:'56%',d:'des Français confondent encore investir et spéculer',s:'Goliaths.io · Oct. 2024'},
            {n:'53%',d:"des moins de 35 ans veulent investir mais n'osent pas",s:'Baromètre AMF · 2024'},
          ].map((s,i) => (
            <div key={i} style={{padding:'0 20px',borderRight:i<3?'1px solid rgba(0,0,0,.07)':'none'}}>
              <div style={{fontSize:38,fontWeight:800,letterSpacing:'-.03em',lineHeight:1,color:'#3B3BF9'}}>{s.n}</div>
              <div style={{fontSize:12,color:'#4A4A6A',marginTop:7,lineHeight:1.5,fontWeight:300}}>{s.d}</div>
              <div style={{fontSize:9,color:'#9898B8',marginTop:5,textTransform:'uppercase',letterSpacing:'.05em'}}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW */}
      <section id="how" style={{padding:'80px 56px',textAlign:'center'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#3B3BF9',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>Comment ça marche</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:'-.03em',marginBottom:52,color:'#0F0F1A'}}>De zéro à ton premier<br/>vrai investissement</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',maxWidth:900,margin:'0 auto',position:'relative'}}>
            <div style={{position:'absolute',top:20,left:'12.5%',right:'12.5%',height:1,background:'rgba(0,0,0,.08)'}}></div>
            {[
              {n:'1',t:'Tu apprends les bases',d:'Quiz, fiches, scénarios réels. 10 min/jour.',active:false},
              {n:'2',t:'Tu valides tes compétences',d:'6 scénarios de marché réels. Un certificat.',active:true},
              {n:'3',t:'Tu ouvres ton vrai compte',d:'Veltis te guide vers le bon broker.',active:false},
              {n:'4',t:'La Boussole suit tes positions',d:'Alertes, journal de bord, rapport trimestriel.',active:false},
            ].map((s,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'0 16px',position:'relative',zIndex:1}}>
                <div style={{width:40,height:40,borderRadius:'50%',border:s.active?'none':'1.5px solid rgba(0,0,0,.08)',background:s.active?'#3B3BF9':'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:s.active?'white':'#9898B8',marginBottom:16}}>{s.n}</div>
                <div style={{fontSize:13,fontWeight:700,color:s.active?'#3B3BF9':'#0F0F1A',marginBottom:6}}>{s.t}</div>
                <div style={{fontSize:11,color:'#4A4A6A',lineHeight:1.6,fontWeight:300}}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RETARD */}
      <section style={{background:'#F8F7F5',padding:'88px 56px',borderTop:'1px solid rgba(0,0,0,.08)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center'}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:'#3B3BF9',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>Le constat</div>
            <h2 style={{fontSize:34,fontWeight:800,letterSpacing:'-.03em',marginBottom:14,lineHeight:1.1}}>La France a <span style={{color:'#3B3BF9'}}>25 ans de retard</span> en éducation financière.</h2>
            <p style={{fontSize:14,color:'#4A4A6A',lineHeight:1.8,fontWeight:300}}>Aux États-Unis, investir fait partie de la culture depuis des décennies. En France, la bourse reste perçue comme complexe et risquée. Ce n&apos;est pas un problème de marché, c&apos;est un problème d&apos;éducation.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            <div style={{fontSize:10,fontWeight:600,color:'#9898B8',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:4}}>Population qui investit en bourse</div>
            {[
              {c:'États-Unis',p:58,col:'#3B3BF9'},
              {c:'Suède',p:43,col:'#6B6BFA'},
              {c:'Irlande',p:33,col:'#9090FC'},
              {c:'Pays-Bas',p:29,col:'#AAAAFB'},
              {c:'France',p:23,col:'#3B3BF9',fr:true},
            ].map((b,i) => (
              <div key={i} style={{display:'flex',flexDirection:'column',gap:5}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontSize:13,color:b.fr?'#0F0F1A':'#4A4A6A',fontWeight:b.fr?700:400}}>{b.c}</span>
                  <span style={{fontSize:13,fontWeight:700,color:b.fr?'#3B3BF9':'#0F0F1A'}}>{b.p}%</span>
                </div>
                <div style={{height:5,background:'rgba(0,0,0,.07)',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${b.p}%`,background:b.col,borderRadius:3}}></div>
                </div>
                {b.fr && <div style={{fontSize:10,color:'#9898B8',fontWeight:300}}>dont 2,5% actifs seulement · AMF 2024</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREINS */}
      <section style={{padding:'88px 56px',background:'white'}}>
        <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#3B3BF9',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>Pourquoi les Français n&apos;investissent pas</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:'-.03em',color:'#0F0F1A'}}>Trois freins. Une réponse.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:44,textAlign:'left'}}>
            {[
              {n:'82%',t:'Le manque de connaissances',d:'La première barrière citée. Pas le risque, l\'incompréhension. Veltis comble exactement ce fossé.',s:'Goliaths.io · 2024'},
              {n:'56%',t:'Investir confondu avec spéculer',d:'Un Français sur deux croit que la bourse c\'est le casino. Pourtant le CAC 40 a rapporté +7%/an sur 20 ans.',s:'Goliaths.io · 2024'},
              {n:'17%',t:'L\'épargne réellement investie',d:'17% seulement des épargnants placent en bourse. Le reste dort à 3% pendant que l\'inflation ronge le capital.',s:'Baromètre AMF · 2024'},
            ].map((f,i) => (
              <div key={i} style={{background:'#F8F7F5',border:'1px solid rgba(0,0,0,.08)',borderRadius:20,padding:28}}>
                <div style={{fontSize:46,fontWeight:800,color:'#3B3BF9',letterSpacing:'-.04em',lineHeight:1,marginBottom:12}}>{f.n}</div>
                <div style={{fontSize:15,fontWeight:700,color:'#0F0F1A',marginBottom:8}}>{f.t}</div>
                <div style={{fontSize:13,color:'#4A4A6A',lineHeight:1.65,fontWeight:300}}>{f.d}</div>
                <div style={{fontSize:9,color:'#9898B8',marginTop:12,letterSpacing:'.05em',textTransform:'uppercase'}}>{f.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" style={{background:'#F8F7F5',padding:'88px 56px',borderTop:'1px solid rgba(0,0,0,.08)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#3B3BF9',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:14}}>La formation</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:'-.03em',marginBottom:8,color:'#0F0F1A'}}>Six modules. Un parcours complet.</h2>
          <p style={{fontSize:13,color:'#9898B8',marginBottom:44,fontWeight:300}}>42 leçons · ~8h de contenu · Du débutant à l&apos;investisseur autonome</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,textAlign:'left'}}>
            {[
              {n:'01',t:'Les bases absolues',d:"Action, dividende, PEA, CTO, flat tax 30%. Tout ce qu'on n'enseigne pas à l'école."},
              {n:'02',t:"Lire un cours d'action",d:'PER, rendement, 52 semaines, résultats trimestriels. Décrypter une fiche comme un analyste.'},
              {n:'03',t:'Évaluer une entreprise',d:'DCF simplifié, juste prix, marge de sécurité. Savoir ce que vaut vraiment une action.'},
              {n:'04',t:'Construire un portefeuille',d:'Diversification, ETF, DCA, rebalancing. La stratégie long terme qui résiste aux crises.'},
              {n:'05',t:"Passer à l'action",d:"Choisir son broker, ouvrir un PEA, passer son premier ordre. De la théorie au vrai compte."},
              {n:'06',t:'Boussole — suivi continu',d:'Connecte ton vrai compte. Analyse tes positions. Journal de bord. Affine chaque décision.',special:true},
            ].map((m,i) => (
              <div key={i} style={{background:m.special?'#0F0F1A':'white',border:'1px solid rgba(59,59,249,.15)',borderRadius:18,padding:24,transition:'all .15s'}}>
                <div style={{fontSize:28,fontWeight:800,color:m.special?'rgba(255,255,255,.07)':'rgba(59,59,249,.1)',letterSpacing:'-.04em',marginBottom:12}}>{m.n}</div>
                <div style={{fontSize:14,fontWeight:700,color:m.special?'white':'#0F0F1A',marginBottom:6}}>{m.t}</div>
                <div style={{fontSize:12,color:m.special?'rgba(255,255,255,.4)':'#4A4A6A',lineHeight:1.6,fontWeight:300,marginBottom:16}}>{m.d}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:10,background:m.special?'rgba(59,59,249,.2)':'#EBEBFF',color:m.special?'#8888FF':'#3B3BF9',padding:'3px 10px',borderRadius:100,fontWeight:700}}>GRATUIT</span>
                  <span style={{fontSize:10,color:m.special?'rgba(255,255,255,.2)':'#9898B8'}}>7 leçons</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{background:'#0F0F2A',padding:'88px 56px'}}>
        <div style={{maxWidth:1060,margin:'0 auto',textAlign:'center'}}>
          <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.3)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:12}}>Tarifs</div>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:'-.03em',color:'white',marginBottom:8}}>Simple et transparent.</h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,.35)',marginBottom:48,fontWeight:300}}>Commence gratuitement. Passe Premium quand tu es prêt.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,textAlign:'left',alignItems:'stretch'}}>
            {[
              {tier:'Gratuit',price:'0€',period:'pour toujours',featured:false,duo:false,items:['Modules 1 et 2 complets','Quiz et scénarios de base','Streak et XP'],locked:['Modules 3 à 6','Boussole portefeuille'],btn:'Gratuit'},
              {tier:'Premium',price:'7,99€',period:'par mois · sans engagement',featured:true,duo:false,popular:true,items:['Tous les modules (6)','Boussole sur ton vrai compte','Journal de bord investisseur','Alertes résultats personnalisées','Certificat Investisseur Veltis'],locked:[],btn:'Premium'},
              {tier:'Duo Famille',price:'11,99€',period:'par mois · 2 comptes',featured:false,duo:true,items:['Premium pour 2 comptes','Tableau de bord commun','Module "Investir en couple"','Boussole consolidée du foyer','Certificat Investisseur Veltis'],locked:[],btn:'Duo Famille'},
              {tier:'Pro',price:'14,99€',period:'par mois · sans engagement',featured:false,duo:false,items:['Tous les modules (6)','Screener actions avancé','Rapport trimestriel IA','Webinaire mensuel live','Communauté Discord privée'],locked:[],btn:'Pro'},
            ].map((p,i) => (
              <div key={i} style={{background:p.featured?'#3B3BF9':'#181830',border:p.duo?'1px solid rgba(0,212,126,.25)':p.featured?'1px solid #3B3BF9':'1px solid rgba(255,255,255,.07)',borderRadius:20,padding:'20px',position:'relative',display:'flex',flexDirection:'column'}}>
                {p.popular && <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'white',color:'#3B3BF9',fontSize:10,fontWeight:800,padding:'3px 12px',borderRadius:100,whiteSpace:'nowrap'}}>Plus populaire</div>}
                <div style={{fontSize:10,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:p.duo?'#00D47E':p.featured?'rgba(255,255,255,.6)':'rgba(255,255,255,.3)',marginBottom:12}}>{p.tier}</div>
                <div style={{fontSize:36,fontWeight:800,color:'white',letterSpacing:'-.04em',lineHeight:1}}>{p.price}</div>
                <div style={{fontSize:11,color:p.featured?'rgba(255,255,255,.55)':'rgba(255,255,255,.3)',marginTop:3,marginBottom:16,fontWeight:300}}>{p.period}</div>
                <div style={{height:1,background:'rgba(255,255,255,.07)',marginBottom:14}}></div>
                <div style={{display:'flex',flexDirection:'column',gap:7,flex:1}}>
                  {p.items.map((item,j) => <div key={j} style={{display:'flex',gap:7,fontSize:11.5,color:p.featured?'rgba(255,255,255,.85)':'rgba(255,255,255,.5)',fontWeight:300,lineHeight:1.35,alignItems:'flex-start'}}><span style={{color:'#00D47E',flexShrink:0,marginTop:1}}>✓</span>{item}</div>)}
                  {p.locked.map((item,j) => <div key={j} style={{display:'flex',gap:7,fontSize:11.5,color:'rgba(255,255,255,.25)',fontWeight:300,lineHeight:1.35,alignItems:'flex-start'}}><span style={{flexShrink:0,fontSize:10}}>🔒</span>{item}</div>)}
                </div>
                <Link href="/signup" style={{display:'block',width:'100%',padding:'12px',borderRadius:100,fontSize:12,fontWeight:700,textAlign:'center',textDecoration:'none',background:p.featured?'white':p.duo?'rgba(0,212,126,.12)':'rgba(255,255,255,.07)',color:p.featured?'#3B3BF9':p.duo?'#00D47E':'white',marginTop:18,border:p.duo?'1px solid rgba(0,212,126,.3)':'none',boxSizing:'border-box'}}>
                  {p.btn}
                </Link>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:'rgba(255,255,255,.18)',marginTop:20,fontWeight:300}}>Données sécurisées · Connexion broker DSP2 · Résiliable à tout moment</p>
        </div>
      </section>

      <footer style={{background:'#0F0F2A',borderTop:'1px solid rgba(255,255,255,.05)',padding:'36px 56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:18,fontWeight:700,color:'white'}}>Veltis<span style={{color:'rgba(255,255,255,.25)'}}>.</span></div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.2)',fontWeight:300}}>Investir en bourse. On t&apos;explique tout.</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.12)'}}>© 2025 Veltis</div>
      </footer>
    </div>
  )
}
