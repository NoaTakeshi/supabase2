// src/components/TaskForm.tsx
import { useState } from 'react'

interface Props {
  onCrear: (titulo: string, descripcion: string) => Promise<void>
}

export function TaskForm({ onCrear }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) return
    setSubmitting(true)
    try {
      await onCrear(titulo.trim(), descripcion.trim())
      setTitulo('')
      setDescripcion('')
      setExpanded(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: expanded ? '1rem' : 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <input
          type="text"
          placeholder="Agregar nueva tarea..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          onFocus={() => setExpanded(true)}
          style={{ marginBottom: 0, flex: 1 }}
          required
        />
        {!expanded && (
          <button 
            type="button" 
            onClick={() => setExpanded(true)}
            style={{ whiteSpace: 'nowrap' }}
          >
            Nueva Tarea
          </button>
        )}
      </div>

      {expanded && (
        <div className="animate-fadeIn">
          <textarea
            placeholder="Descripcion (opcional)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setExpanded(false)
                setTitulo('')
                setDescripcion('')
              }}
              disabled={submitting}
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                border: '1px solid var(--border)'
              }}
            >
              Cancelar
            </button>
            <button type="submit" disabled={submitting || !titulo.trim()}>
              {submitting ? (
                <>
                  <div className="loading__spinner" style={{ width: 16, height: 16 }} />
                  Guardando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Agregar Tarea
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
