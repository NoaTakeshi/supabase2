// src/pages/Register.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import '../App.css'

export function Register() {
  const { signUp } = useAuthContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Las contrasenas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      setSuccess('Cuenta creada exitosamente. Revisa tu correo para confirmar.')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
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
            backgroundColor: 'var(--accent)', 
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1 className="auth-card__title">Crear Cuenta</h1>
          <p className="auth-card__subtitle">Registrate para comenzar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
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

          <div style={{ marginBottom: '0.5rem' }}>
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
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
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
                Creando cuenta...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">Inicia sesion aqui</Link>
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
