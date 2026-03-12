// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import '../App.css'

export function Login() {
  const { signIn } = useAuthContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas')
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
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="auth-card__title">Bienvenido</h1>
          <p className="auth-card__subtitle">Inicia sesion para continuar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.5rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              marginBottom: '0.5rem',
              color: 'var(--foreground)'
            }}>
              Contrasena
            </label>
            <input
              type="password"
              placeholder="Tu contrasena"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
                Iniciando sesion...
              </>
            ) : (
              'Iniciar Sesion'
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          <p style={{ marginBottom: '0.75rem' }}>
            <Link to="/forgot-password">¿Olvidaste tu contrasena?</Link>
          </p>
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register">Registrate aqui</Link>
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
