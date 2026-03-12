// src/pages/ForgotPassword.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../App.css'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperacion')
    } finally {
      setLoading(false)
    }
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="auth-card__title">Recuperar Contrasena</h1>
          <p className="auth-card__subtitle">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena
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
              Correo Enviado
            </h2>
            <p style={{ 
              color: 'var(--muted-foreground)', 
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              Revisa tu bandeja de entrada en <strong>{email}</strong>. 
              Te hemos enviado un enlace para restablecer tu contrasena.
            </p>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              marginBottom: '1.5rem'
            }}>
              No olvides revisar la carpeta de spam si no encuentras el correo.
            </p>
            <Link 
              to="/login"
              className="btn btn-primary"
              style={{ display: 'inline-flex', justifyContent: 'center' }}
            >
              Volver al Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'var(--foreground)'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                  Enviando...
                </>
              ) : (
                'Enviar Enlace de Recuperacion'
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
