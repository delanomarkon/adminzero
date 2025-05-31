'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from '@/providers'
import { useState } from 'react'

export default function LoginPage() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inloggen</h1>

      <input
        type="email"
        placeholder="E-mail"
        className="w-full mb-2 p-2 border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        className="w-full mb-2 p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white p-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Bezig...' : 'Log in'}
      </button>
    </div>
  )
}
