'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Session, SupabaseClient } from '@supabase/supabase-js'
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react'

type SupabaseContextType = {
  supabase: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
)

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('SupabaseContext not found')
  return context
}

export default function Providers({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession: Session | null
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [session, setSession] = useState<Session | null>(
    initialSession ?? null
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}
