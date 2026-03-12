// src/pages/Home.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import { useAuthContext } from '../context/AuthContext'
import { TaskForm } from '../components/TaskForm'
import { TaskItem } from '../components/TaskItem'
import { Chat, ChatToggle } from '../components/Chat'
import '../App.css'

export function Home() {
  const { user, signOut } = useAuthContext()
  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks()
  const [chatOpen, setChatOpen] = useState(false)

  const completadas = tareas.filter(t => t.completada).length

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="loading__spinner" />
        <span>Cargando tareas...</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          TaskFlow
        </div>
        <nav className="app-header__nav">
          <Link 
            to="/dashboard" 
            className="nav-link"
            style={{ textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </Link>
          <button 
            onClick={signOut}
            className="btn-ghost"
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="page-container">
          {/* Page Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Mis Tareas</h1>
            <p className="text-muted">
              Bienvenido, {user?.email?.split('@')[0]}. Organiza tu dia de manera eficiente.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Task Form */}
          <TaskForm
            onCrear={(titulo, descripcion) => crearTarea({ titulo, descripcion })}
          />

          {/* Tasks Stats */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--muted)',
            borderRadius: 'var(--radius)'
          }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              {tareas.length === 0 
                ? 'No tienes tareas' 
                : `${tareas.length} tarea${tareas.length === 1 ? '' : 's'}`
              }
            </span>
            <span className="badge-accent" style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-foreground)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              {completadas} / {tareas.length} completadas
            </span>
          </div>

          {/* Tasks List */}
          <div className="tasks-container">
            {tareas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <h3 className="empty-state__title">No tienes tareas aun</h3>
                <p>Crea tu primera tarea usando el formulario de arriba</p>
              </div>
            ) : (
              tareas.map(tarea => (
<TaskItem
  key={tarea.id}
  tarea={tarea}
  onActualizar={(id, cambios) => actualizarTarea(id, cambios)}
                  onEliminar={eliminarTarea}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Chat */}
      <div className="chat-container">
        <Chat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        {!chatOpen && <ChatToggle onClick={() => setChatOpen(true)} />}
      </div>
    </>
  )
}
