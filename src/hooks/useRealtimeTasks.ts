// src/hooks/useRealtimeTasks.ts
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { taskService } from '../services/taskService'
import type { Tarea, TareaInsert, TareaUpdate } from '../types/database'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtimeTasks() {
  const [tareas, setTareas]       = useState<Tarea[]>([])
  const [loading, setLoading]     = useState(true)
  const [conectado, setConectado] = useState(false)

  const fetchTareas = useCallback(async () => {
    setLoading(true)
    const { data } = await taskService.getAll()  // usa el servicio
    setTareas(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTareas()

    const channel = supabase
      .channel('tareas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tareas' },
        (payload: RealtimePostgresChangesPayload<Tarea>) => {
          // el estado en actualiza AQUÍ, después del insert/update/delete
          if (payload.eventType === 'UPDATE') {
            setTareas(prev => prev.map(t =>
              t.id === payload.new.id ? payload.new : t
            ))
          }

          if (payload.eventType === 'INSERT') {
            setTareas(prev => [payload.new, ...prev])
          }

          if (payload.eventType === 'DELETE') {
            setTareas(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe(status => setConectado(status === 'SUBSCRIBED'))

    return () => { supabase.removeChannel(channel) }
  }, [fetchTareas])

  // Los métodos usan el servicio — realtime actualiza el estado
  const crearTarea = async (t: TareaInsert) => {
    const { error } = await taskService.create(t)
    if (error) throw error
  }

  const actualizarTarea = async (id: string, c: TareaUpdate) => {
    const { error } = await taskService.update(id, c)
    if (error) throw error
  }

  const eliminarTarea = async (id: string) => {
    const { error } = await taskService.delete(id)
    if (error) throw error
  }

  return { tareas, loading, conectado, crearTarea, actualizarTarea, eliminarTarea }
}