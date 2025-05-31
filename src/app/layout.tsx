import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Providers from '../providers'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Session } from '@supabase/supabase-js'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AdminZero',
  description: 'Volledige administratie zonder gedoe.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          // Server can't set cookies in this context; skip
        },
        remove(name, options) {
          // Server can't remove cookies in this context; skip
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialSession={session as Session | null}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
