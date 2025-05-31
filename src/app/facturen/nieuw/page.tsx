'use client'

import { useState } from 'react'

export default function NieuweFactuur() {
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
    setLoading(true)

    const res = await fetch(
      'https://dljzsubnvstfsblegdqs.functions.supabase.co/createInvoice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanpzdWJudnN0ZnNibGVnZHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODkwMDUsImV4cCI6MjA2NDI2NTAwNX0.rUpsUc5UmraPjrIghN4I9B-d6LGH9vkHHG9ss_Lu6vw',
        },
        body: JSON.stringify({
          klant,
          bedrag: parseFloat(bedrag),
          datum,
          beschrijving: beschrijving || null,
        }),
      }
    )

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setMessage('✅ Factuur succesvol opgeslagen')
      setKlant('')
      setBedrag('')
      setDatum('')
      setBeschrijving('')
    } else {
      setError(data.error || '❌ Er ging iets mis')
    }
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
