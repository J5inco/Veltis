'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{fontFamily:'Sora,sans-serif',minHeight:'100vh',background:'#F8F7F5',display:'flex',flexDirection:'column'}}>
      <nav style={{padding:'18px 40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontSize:20,fontWeight:700,textDecoration:'none',color:'#0F0F1A'}}>Veltis<span style={{color:'#3B3BF9'}}>.</span></Link>
        <Link href="/signup" style={{fontSize:13,color:'#4A4A6A',textDecoration:'none'}}>Pas encore de compte ? S&apos;inscrire</Link>
      </nav>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{background:'white',borderRadius:24,padding:40,width:'100%',maxWidth:420,border:'1px solid rgba(0,0,0,.08)'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <h1 style={{fontSize:28,fontWeight:800,letterSpacing:'-.03em',marginBottom:8}}>Bon retour !</h1>
            <p style={{fontSize:14,color:'#4A4A6A',fontWeight:300}}>Connecte-toi pour continuer ta formation</p>
          </div>

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:14}}>
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
                placeholder="Ton mot de passe"
                required
                style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid rgba(0,0,0,.12)',fontSize:14,outline:'none',fontFamily:'Sora,sans-serif'}}
              />
            </div>

            {error && <div style={{background:'#FCEBEB',color:'#A32D2D',padding:'10px 12px',borderRadius:8,fontSize:12}}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{background:'#3B3BF9',color:'white',padding:'14px',borderRadius:100,fontSize:14,fontWeight:700,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?.7:1,fontFamily:'Sora,sans-serif',marginTop:8}}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
