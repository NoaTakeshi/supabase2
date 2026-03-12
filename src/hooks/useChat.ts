// src/hooks/useChat.ts
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Mensaje { 
  id: string
  texto: string
  usuario: string
  email: string
  hora: string 
}

export function useChat(sala: string) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    // Limpiar mensajes al cambiar de sala
    setMensajes([])

    // Crear canal con configuracion de self-broadcast
    const channel = supabase.channel(sala, {
      config: {
        broadcast: { self: true }
      }
    })

    channel
      .on('broadcast', { event: 'mensaje' }, ({ payload }) => {
        setMensajes(prev => [...prev, payload as Mensaje])
      })
      .subscribe()

    channelRef.current = channel

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [sala])

  const enviarMensaje = async (texto: string, usuario: string, email: string) => {
    if (!channelRef.current) return

    const mensaje: Mensaje = {
      id: crypto.randomUUID(),
      texto,
      usuario,
      email,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
    
    await channelRef.current.send({ 
      type: 'broadcast', 
      event: 'mensaje', 
      payload: mensaje
    })
  }

  return { mensajes, enviarMensaje }
}
