'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSupabase } from '../../providers'
import { useSupabase } from '@/providers'

export default function DashboardPage() {
  const { session, supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!session) {
    return <p className="p-4">Bezig met laden...</p>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welkom bij AdminZero</h1>
      <p className="text-sm text-gray-500">
        Je bent ingelogd als: {session.user.email}