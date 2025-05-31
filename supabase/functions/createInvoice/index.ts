// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2.49.8/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')

    const body = await req.json()
    const { klant, bedrag, datum, beschrijving } = body

    if (!klant || !bedrag || !datum) {
      return new Response(
        JSON.stringify({ error: 'Verplichte velden ontbreken' }),
        { status: 400 },
      )
    }

    if (isNaN(Number(bedrag)) || Number(bedrag) <= 0) {
      return new Response(
        JSON.stringify({ error: 'Bedrag is ongeldig' }),
        { status: 400 },
      )
    }

    // @ts-ignore – Deno env-types zijn niet beschikbaar in VS Code
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Gebruiker kon niet worden opgehaald' }),
        { status: 401 },
      )
    }

    const { error } = await supabase.from('invoices').insert([
      {
        klant,
        bedrag,
        datum,
        beschrijving: beschrijving ?? null,
        user_id: user.id,
      },
    ])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (_err) {
    return new Response(
      JSON.stringify({ error: 'Ongeldige of ontbrekende JSON' }),
      { status: 400 },
    )
  }
})
