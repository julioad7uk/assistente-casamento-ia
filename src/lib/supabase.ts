import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  confirmed: boolean
  plus_one: boolean
  dietary_restrictions: string
  created_at: string
  user_id: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  contact: string
  price: number
  status: string
  notes: string
  created_at: string
  user_id: string
}

export interface Task {
  id: string
  title: string
  description: string
  due_date: string
  completed: boolean
  priority: string
  category: string
  created_at: string
  user_id: string
}

export interface Budget {
  id: string
  category: string
  planned_amount: number
  actual_amount: number
  notes: string
  created_at: string
  user_id: string
}

export interface WeddingInfo {
  id: string
  couple_names: string
  wedding_date: string
  venue: string
  guest_count: number
  budget_total: number
  style: string
  created_at: string
  updated_at: string
  user_id: string
}