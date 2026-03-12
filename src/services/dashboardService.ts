// src/services/dashboardService.ts
import { supabase } from '../lib/supabaseClient'

export const dashboardService = {

    getStats: async () => {
        const { data, error } = await supabase
            .from('tareas')
            .select('completada, created_at')
        if (error) throw error

        const total = data.length
        const completadas = data.filter(t => t.completada).length
        const pendientes = total - completadas
        const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0
        const hoy = new Date().toISOString().split('T')[0]  // ✅ string, no Date
        const creadasHoy = data.filter(t => t.created_at?.startsWith(hoy)).length  // ✅ optional chaining

        return { total, completadas, pendientes, porcentaje, creadasHoy }
    },

    getActivityByDay: async () => {
        const hace7 = new Date()
        hace7.setDate(hace7.getDate() - 7)

        const { data, error } = await supabase
            .from('tareas')
            .select('created_at, completada')
            .gte('created_at', hace7.toISOString())
            .order('created_at', { ascending: true })
        if (error) throw error

        const grouped: Record<string, { creadas: number; completadas: number }> = {}
        data.forEach(t => {
            if (!t.created_at) return  // ✅ guard contra null
            const d = t.created_at.split('T')[0]
            if (!grouped[d]) grouped[d] = { creadas: 0, completadas: 0 }
            grouped[d].creadas++
            if (t.completada) grouped[d].completadas++
        })

        return Object.entries(grouped).map(([fecha, v]) => ({
            fecha: new Date(fecha).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }),
            ...v
        }))
    },

    getDistribution: async () => {
        const { data, error } = await supabase.from('tareas').select('completada')
        if (error) throw error

        const total = data.length
        const pendientes = data.filter(t => !t.completada).length
        return [
            { name: 'Completadas', value: total - pendientes, color: '#10b981' },
            { name: 'Pendientes', value: pendientes, color: '#f59e0b' },
        ]
    },

    getRecentFeed: async (limit = 10) => {
        const { data, error } = await supabase  // ✅ retorna array directo
            .from('tareas')
            .select('id, titulo, completada, created_at')
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) throw error
        return data ?? []
    },
}