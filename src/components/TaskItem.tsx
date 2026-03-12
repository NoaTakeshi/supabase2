// src/components/TaskItem.tsx
import { useState } from 'react'
import type { Tarea } from '../types/database'

interface Props {
  tarea: Tarea
  onActualizar: (id: string, cambios: { completada?: boolean; titulo?: string; descripcion?: string }) => Promise<void>
  onEliminar: (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {
  const [eliminando, setEliminando] = useState(false)
  const [actualizando, setActualizando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(tarea.titulo)
  const [descripcion, setDescripcion] = useState(tarea.descripcion || '')

  const handleToggle = async () => {
    if (actualizando) return
    setActualizando(true)
    try {
      await onActualizar(tarea.id, { completada: !tarea.completada })
    } finally {
      setActualizando(false)
    }
  }

  const handleEliminar = async () => {
    if (!confirm('Estas seguro de que deseas eliminar esta tarea?')) return
    setEliminando(true)
    try {
      await onEliminar(tarea.id)
    } catch {
      setEliminando(false)
    }
  }

  const handleEditar = () => {
    setTitulo(tarea.titulo)
    setDescripcion(tarea.descripcion || '')
    setEditando(true)
  }

  const handleGuardar = async () => {
    if (!titulo.trim()) return
    setActualizando(true)
    try {
      await onActualizar(tarea.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined
      })
      setEditando(false)
    } finally {
      setActualizando(false)
    }
  }

  const handleCancelar = () => {
    setTitulo(tarea.titulo)
    setDescripcion(tarea.descripcion || '')
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="task-item task-item--editing" style={{
        opacity: actualizando ? 0.7 : 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '0.75rem'
      }}>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Titulo de la tarea"
          disabled={actualizando}
          autoFocus
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)'
          }}
        />
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripcion (opcional)"
          disabled={actualizando}
          rows={2}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            fontSize: '0.875rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            resize: 'vertical',
            minHeight: '60px'
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleCancelar}
            disabled={actualizando}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              backgroundColor: 'var(--muted)',
              color: 'var(--muted-foreground)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={actualizando || !titulo.trim()}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            {actualizando ? (
              <div className="loading__spinner" style={{ width: 14, height: 14 }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            Guardar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`task-item ${tarea.completada ? 'task-item--completed' : ''}`}
      style={{ opacity: eliminando ? 0.5 : 1 }}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={actualizando}
        style={{
          width: 22,
          height: 22,
          minWidth: 22,
          padding: 0,
          borderRadius: 6,
          border: `2px solid ${tarea.completada ? 'var(--accent)' : 'var(--border)'}`,
          backgroundColor: tarea.completada ? 'var(--accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 2
        }}
        aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {tarea.completada && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="task-item__content">
        <p
          className={`task-item__title ${tarea.completada ? 'task-item__title--completed' : ''}`}
          style={{
            fontWeight: 500,
            color: tarea.completada ? 'var(--muted-foreground)' : 'var(--foreground)',
            textDecoration: tarea.completada ? 'line-through' : 'none'
          }}
        >
          {tarea.titulo}
        </p>
        {tarea.descripcion && (
          <p className="task-item__description">
            {tarea.descripcion}
          </p>
        )}
        {tarea.created_at && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            marginTop: '0.5rem'
          }}>
            {new Date(tarea.created_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>

      <div className="task-item__actions" style={{ display: 'flex', gap: '0.25rem' }}>
        {/* Boton Editar */}
        <button
          type="button"
          onClick={handleEditar}
          style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            borderRadius: 'var(--radius)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--muted-foreground)'
          }}
          aria-label="Editar tarea"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Boton Eliminar */}
        <button
          type="button"
          onClick={handleEliminar}
          disabled={eliminando}
          style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            borderRadius: 'var(--radius)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.color = 'var(--destructive)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--muted-foreground)'
          }}
          aria-label="Eliminar tarea"
        >
          {eliminando ? (
            <div className="loading__spinner" style={{ width: 16, height: 16 }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
