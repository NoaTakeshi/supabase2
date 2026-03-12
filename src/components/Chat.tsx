// src/components/Chat.tsx
import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import { useAuthContext } from '../context/AuthContext'

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

const SALAS_DISPONIBLES = [
  { id: 'sala-general', nombre: 'General' },
  { id: 'sala-trabajo', nombre: 'Trabajo' },
  { id: 'sala-proyectos', nombre: 'Proyectos' },
  { id: 'sala-random', nombre: 'Random' },
]

export function Chat({ isOpen, onClose }: ChatProps) {
  const { user } = useAuthContext()
  const [salaActual, setSalaActual] = useState('sala-general')
  const [mostrarSalas, setMostrarSalas] = useState(false)
  const { mensajes, enviarMensaje } = useChat(salaActual)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || !user || enviando) return

    setEnviando(true)
    try {
      const nombreUsuario = user.email?.split('@')[0] || 'Usuario'
      await enviarMensaje(texto.trim(), nombreUsuario, user.email || '')
      setTexto('')
    } finally {
      setEnviando(false)
    }
  }

  const cambiarSala = (salaId: string) => {
    setSalaActual(salaId)
    setMostrarSalas(false)
  }

  const salaNombre = SALAS_DISPONIBLES.find(s => s.id === salaActual)?.nombre || 'General'

  if (!isOpen) return null

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
          <button
            onClick={() => setMostrarSalas(!mostrarSalas)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '0.375rem 0.75rem',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            #{salaNombre}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {mostrarSalas && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
              minWidth: '160px',
              overflow: 'hidden'
            }}>
              {SALAS_DISPONIBLES.map(sala => (
                <button
                  key={sala.id}
                  onClick={() => cambiarSala(sala.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.625rem 1rem',
                    textAlign: 'left',
                    background: salaActual === sala.id ? 'var(--accent)' : 'transparent',
                    color: salaActual === sala.id ? 'var(--accent-foreground)' : 'var(--foreground)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (salaActual !== sala.id) {
                      e.currentTarget.style.backgroundColor = 'var(--muted)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (salaActual !== sala.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  #{sala.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
        <button 
          className="chat-header__close" 
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="chat-messages">
        {mensajes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="empty-state__title">Sin mensajes en #{salaNombre}</p>
            <p>Se el primero en enviar un mensaje</p>
          </div>
        ) : (
          mensajes.map((msg) => {
            const esMio = msg.email === user?.email
            return (
              <div
                key={msg.id}
                className={`chat-message ${esMio ? 'chat-message--self' : 'chat-message--other'}`}
              >
                {!esMio && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    marginBottom: '0.25rem'
                  }}>
                    {msg.usuario}
                  </div>
                )}
                <div>{msg.texto}</div>
                <div className="chat-message__meta">
                  {msg.hora}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input__field"
          placeholder={`Escribe en #${salaNombre}...`}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={enviando}
        />
        <button
          type="submit"
          className="chat-input__send"
          disabled={!texto.trim() || enviando}
        >
          {enviando ? (
            <svg className="loading__spinner" width="20" height="20" viewBox="0 0 24 24" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

// Chat toggle button component
export function ChatToggle({ onClick, hasUnread }: { onClick: () => void; hasUnread?: boolean }) {
  return (
    <button 
      className="chat-toggle" 
      onClick={onClick}
      aria-label="Abrir chat"
    >
      <svg className="chat-toggle__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {hasUnread && (
        <span 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 12,
            height: 12,
            backgroundColor: 'var(--destructive)',
            borderRadius: '50%',
            border: '2px solid var(--card)'
          }}
        />
      )}
    </button>
  )
}
