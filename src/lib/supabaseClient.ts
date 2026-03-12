// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Support both VITE_ prefixed (for Vite) and NEXT_PUBLIC_ prefixed (from Vercel integration)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)')
}

// Exportar una sola instancia — singleton
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
