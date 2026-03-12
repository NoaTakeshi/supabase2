// src/pages/Dashboard.tsx
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { AvatarUpload } from '../components/AvatarUpload'
import '../App.css'

export function Dashboard() {
  const { user, signOut } = useAuthContext()
  const { tareas, loading } = useTasks()

  const completadas = tareas.filter(t => t.completada).length
  const pendientes = tareas.length - completadas
  const porcentaje = tareas.length > 0 
    ? Math.round((completadas / tareas.length) * 100) 
    : 0

  return (
    <div className="page-container" style={{ padding: '2rem 1rem' }}>
      {/* Header */}
      <div className="dashboard__header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Dashboard</h1>
          <p className="text-muted">Gestiona tu perfil y revisa tu progreso</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/" className="btn-secondary" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
            border: '1px solid var(--border)',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver al Inicio
          </Link>
          <button 
            onClick={signOut}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--muted-foreground)',
              border: '1px solid var(--border)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar Sesion
          </button>
        </div>
      </div>

      {/* Avatar Upload Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Tu Perfil</h2>
        <AvatarUpload />
      </section>

      {/* Stats Grid */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Estadisticas</h2>
        <div className="dashboard__grid">
          <div className="stats-card">
            <p className="stats-card__label">Total de Tareas</p>
            <p className="stats-card__value">{loading ? '-' : tareas.length}</p>
          </div>
          <div className="stats-card">
            <p className="stats-card__label">Completadas</p>
            <p className="stats-card__value" style={{ color: 'var(--accent)' }}>
              {loading ? '-' : completadas}
            </p>
            {!loading && tareas.length > 0 && (
              <p className="stats-card__trend">{porcentaje}% del total</p>
            )}
          </div>
          <div className="stats-card">
            <p className="stats-card__label">Pendientes</p>
            <p className="stats-card__value" style={{ color: pendientes > 0 ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {loading ? '-' : pendientes}
            </p>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      {!loading && tareas.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Progreso General</h2>
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.75rem',
              fontSize: '0.875rem' 
            }}>
              <span className="text-muted">Progreso</span>
              <span style={{ fontWeight: 600 }}>{porcentaje}%</span>
            </div>
            <div style={{ 
              height: 8, 
              backgroundColor: 'var(--muted)', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${porcentaje}%`,
                backgroundColor: 'var(--accent)',
                borderRadius: 4,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </section>
      )}

      {/* Account Info */}
      <section>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Informacion de Cuenta</h2>
        <div className="card">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr',
            gap: '1rem',
            fontSize: '0.875rem'
          }}>
            <span className="text-muted">Email:</span>
            <span>{user?.email}</span>
            <span className="text-muted">ID de Usuario:</span>
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem',
              wordBreak: 'break-all'
            }}>
              {user?.id}
            </span>
            <span className="text-muted">Creado:</span>
            <span>
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'
              }
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
