'use client'

import { useState, useEffect } from 'react'
import { supabase, Guest, Vendor, Task, Budget, WeddingInfo } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signOut }
}

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchGuests = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setGuests(data)
    }
    setLoading(false)
  }

  const addGuest = async (guest: Omit<Guest, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('guests')
      .insert([{ ...guest, user_id: user.id }])
      .select()

    if (!error && data) {
      setGuests(prev => [data[0], ...prev])
    }
  }

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    const { error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setGuests(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    }
  }

  const deleteGuest = async (id: string) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)

    if (!error) {
      setGuests(prev => prev.filter(g => g.id !== id))
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [user])

  return { guests, loading, addGuest, updateGuest, deleteGuest, refetch: fetchGuests }
}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchVendors = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVendors(data)
    }
    setLoading(false)
  }

  const addVendor = async (vendor: Omit<Vendor, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('vendors')
      .insert([{ ...vendor, user_id: user.id }])
      .select()

    if (!error && data) {
      setVendors(prev => [data[0], ...prev])
    }
  }

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    const { error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
    }
  }

  const deleteVendor = async (id: string) => {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id)

    if (!error) {
      setVendors(prev => prev.filter(v => v.id !== id))
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [user])

  return { vendors, loading, addVendor, updateVendor, deleteVendor, refetch: fetchVendors }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTasks = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })

    if (!error && data) {
      setTasks(data)
    }
    setLoading(false)
  }

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()

    if (!error && data) {
      setTasks(prev => [...prev, data[0]].sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ))
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetchTasks }
}

export function useBudget() {
  const [budget, setBudget] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchBudget = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('budget')
      .select('*')
      .eq('user_id', user.id)
      .order('category', { ascending: true })

    if (!error && data) {
      setBudget(data)
    }
    setLoading(false)
  }

  const addBudgetItem = async (item: Omit<Budget, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('budget')
      .insert([{ ...item, user_id: user.id }])
      .select()

    if (!error && data) {
      setBudget(prev => [...prev, data[0]].sort((a, b) => a.category.localeCompare(b.category)))
    }
  }

  const updateBudgetItem = async (id: string, updates: Partial<Budget>) => {
    const { error } = await supabase
      .from('budget')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setBudget(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    }
  }

  const deleteBudgetItem = async (id: string) => {
    const { error } = await supabase
      .from('budget')
      .delete()
      .eq('id', id)

    if (!error) {
      setBudget(prev => prev.filter(b => b.id !== id))
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [user])

  return { budget, loading, addBudgetItem, updateBudgetItem, deleteBudgetItem, refetch: fetchBudget }
}

export function useWeddingInfo() {
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchWeddingInfo = async () => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('wedding_info')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setWeddingInfo(data)
    }
    setLoading(false)
  }

  const updateWeddingInfo = async (info: Omit<WeddingInfo, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('wedding_info')
      .upsert([{ ...info, user_id: user.id, updated_at: new Date().toISOString() }])
      .select()
      .single()

    if (!error && data) {
      setWeddingInfo(data)
    }
  }

  useEffect(() => {
    fetchWeddingInfo()
  }, [user])

  return { weddingInfo, loading, updateWeddingInfo, refetch: fetchWeddingInfo }
}