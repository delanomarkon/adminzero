'use client'

import { useState } from 'react'
import { useSupabase } from '@/providers'

export default function NieuweFactuur() {
  const { supabase, session } = useSupabase()

  const [klant, setKlant] = useState('')
  const [bedrag, setBedrag] = useState('')
  const [datum, setDatum] = useState('')
  const [beschrijving, setBeschrijving] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setMessage('')
    setError('')

    const bedragNum = Number(bedrag)
    if (!bedrag || isNaN(bedragNum) || bedragNum <= 0) {
      setError('❌ Bedrag is ongeldig')
      return
    }

    if (!session?.access_token) {
      setError('❌ Je bent niet ingelogd')
      return
    }

    const url = process.env.NEXT_PUBLIC_FUNCTION_URL
    if (!url) {
      setError('❌ Server configuratie ontbreekt')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          klant,
          bedrag: bedragNum,
          datum,
          beschrijving: beschrijving || null,
        }),
      })

      let data
      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (res.ok) {
        setMessage('✅ Factuur succesvol opgeslagen')
        setKlant('')
        setBedrag('')
        setDatum('')
        setBeschrijving('')
      } else {
        setError(data?.error || '❌ Ongeldig antwoord van server')
      }
    } catch (err) {
      setError('❌ Netwerkfout of onbekende fout')
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nieuwe Factuur</h1>

      <input
        type="text"
        placeholder="Klant"
        className="w-full border p-2 mb-2"
        value={klant}
        onChange={(e) => setKlant(e.target.value)}
      />
      <input
        type="number"
        placeholder="Bedrag"
        className="w-full border p-2 mb-2"
        value={bedrag}
        onChange={(e) => setBedrag(e.target.value)}
      />
      <input
        type="date"
        className="w-full border p-2 mb-2"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
      />
      <textarea
        placeholder="Beschrijving (optioneel)"
        className="w-full border p-2 mb-2"
        value={beschrijving}
        onChange={(e) => setBeschrijving(e.target.value)}
      />

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white p-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Versturen...' : 'Verstuur factuur'}
      </button>
    </div>
  )
}
