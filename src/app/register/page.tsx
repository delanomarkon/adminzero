'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from '@/providers'
import { useState } from 'react'

export default function RegisterPage() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setMessage('')
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
    } else {
      setMessage(
        '✅ Registratie gelukt! Bevestig je e-mailadres via de link in je inbox.'
      )
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account aanmaken</h1>

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

      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-black text-white p-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Bezig...' : 'Registreren'}
      </button>
    </div>
  )
}
