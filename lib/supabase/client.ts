// Cliente Supabase para operaciones desde el cliente (navegador)
// Recomendado: usar las variables públicas NEXT_PUBLIC_SUPABASE_URL y
// NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (no exponer keys privadas).

import { createClient, SupabaseClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
  )
}

let supabase: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase

  supabase = createClient(url!, anonKey!)
  return supabase
}

// Export por defecto para imports directos
export default getSupabaseClient()
