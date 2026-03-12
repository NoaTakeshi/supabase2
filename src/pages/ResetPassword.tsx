// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../App.css'

export function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesion valida desde el enlace de recuperacion
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setValidSession(true)
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirigir al login despues de 3 segundos
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contrasena')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading__spinner" style={{ width: 32, height: 32, margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>Verificando enlace...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              backgroundColor: 'var(--destructive)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--foreground)'
            }}>
              Enlace Invalido o Expirado
            </h2>
            <p style={{ 
              color: 'var(--muted-foreground)', 
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              El enlace de recuperacion ha expirado o no es valido. 
              Por favor, solicita un nuevo enlace.
            </p>
            <Link 
              to="/forgot-password"
              className="btn btn-primary"
              style={{ display: 'inline-flex', justifyContent: 'center' }}
            >
              Solicitar Nuevo Enlace
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div style={{ 
            width: 48, 
            height: 48, 
            backgroundColor: 'var(--primary)', 
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <h1 className="auth-card__title">Nueva Contrasena</h1>
          <p className="auth-card__subtitle">
            Ingresa tu nueva contrasena
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              backgroundColor: 'var(--success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              color: 'var(--foreground)'
            }}>
              Contrasena Actualizada
            </h2>
            <p style={{ 
              color: 'var(--muted-foreground)', 
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              Tu contrasena ha sido actualizada exitosamente. 
              Seras redirigido al login en unos segundos...
            </p>
            <div className="loading__spinner" style={{ width: 24, height: 24, margin: '0 auto' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'var(--foreground)'
              }}>
                Nueva Contrasena
              </label>
              <input
                type="password"
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'var(--foreground)'
              }}>
                Confirmar Contrasena
              </label>
              <input
                type="password"
                placeholder="Repite tu contrasena"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <div className="loading__spinner" style={{ width: 16, height: 16 }} />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contrasena'
              )}
            </button>
          </form>
        )}

        <div className="auth-card__footer">
          <p>
            <Link to="/login">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Volver al Login
            </Link>
          </p>
        </div>
      </div>

      <p style={{ 
        marginTop: '2rem', 
        fontSize: '0.75rem', 
        color: 'var(--muted-foreground)',
        textAlign: 'center'
      }}>
        TaskFlow - Gestiona tus tareas de manera eficiente
      </p>
    </div>
  )
}
