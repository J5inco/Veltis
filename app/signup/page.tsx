'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'#F8F7F5',display:'flex',flexDirection:'column'}}>
      <nav style={{padding:'18px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontSize:20,fontWeight:700,textDecoration:'none',color:'#0F0F1A'}}>Veltis<span style={{color:'#3B3BF9'}}>.</span></Link>
        <Link href="/login" style={{fontSize:13,color:'#4A4A6A',textDecoration:'none'}}>Déjà un compte ? Se connecter</Link>
      </nav>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{background:'white',borderRadius:24,padding:40,width:'100%',maxWidth:420,border:'1px solid rgba(0,0,0,.08)'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em',marginBottom:8}}>Créer ton compte</h1>
            <p style={{fontSize:14,color:'#4A4A6A',fontWeight:300}}>2 modules gratuits, sans carte bancaire</p>
          </div>

          {success ? (
            <div style={{textAlign:'center',padding:24}}>
              <div style={{fontSize:40,marginBottom:16}}>🎉</div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Compte créé !</div>
              <div style={{fontSize:13,color:'#4A4A6A'}}>Redirection vers ton tableau de bord...</div>
            </div>
          ) : (
            <form onSubmit={handleSignup} style={{display:'flex',flexDirection:'column',gap:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'#4A4A6A',marginBottom:6,display:'block'}}>Prénom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ton prénom"
                  required
                  style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid rgba(0,0,0,.12)',fontSize:14,outline:'none',fontFamily:'Sora,sans-serif'}}
                />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'#4A4A6A',marginBottom:6,display:'block'}}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.fr"
                  required
                  style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid rgba(0,0,0,.12)',fontSize:14,outline:'none',fontFamily:'Sora,sans-serif'}}
                />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'#4A4A6A',marginBottom:6,display:'block'}}>Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  required
                  minLength={8}
                  style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid rgba(0,0,0,.12)',fontSize:14,outline:'none',fontFamily:'Sora,sans-serif'}}
                />
              </div>

              {error && <div style={{background:'#FCEBEB',color:'#A32D2D',padding:'10px 12px',borderRadius:8,fontSize:12}}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                style={{background:'#3B3BF9',color:'white',padding:'14px',borderRadius:100,fontSize:14,fontWeight:700,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,fontFamily:'Sora,sans-serif',marginTop:8}}
              >
                {loading ? 'Création en cours...' : 'Créer mon compte gratuit'}
              </button>
            </form>
          )}

          <div style={{marginTop:20,textAlign:'center'}}>
            <div style={{fontSize:11,color:'#9898B8'}}>En créant un compte tu acceptes nos <a href="#" style={{color:'#3B3BF9'}}>CGU</a></div>
          </div>
        </div>
      </div>
    </div>
  )
}
