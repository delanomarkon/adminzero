// @deno-types="https://esm.sh/v135/@supabase/supabase-js@2.49.8/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  try {
    const body = await req.json()
    const { klant, bedrag, datum, beschrijving } = body

    if (!klant || !bedrag || !datum) {
      return new Response(
        JSON.stringify({ error: 'Verplichte velden ontbreken' }),
        { status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('PUBLIC_SUPABASE_URL')!,
      Deno.env.get('PUBLIC_SUPABASE_ANON_KEY')!
    )

    const { error } = await supabase.from('invoices').insert([
      {
        klant,
        bedrag,
        datum,
        beschrijving: beschrijving ?? null,
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
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Ongeldige of ontbrekende JSON' }),
      { status: 400 }
    )
  }
})
