// src/components/AvatarUpload.tsx
import { useState, useEffect } from 'react'
import { storageService } from '../services/storageService'
import { useAuthContext } from '../context/AuthContext'

export function AvatarUpload() {
  const { user } = useAuthContext()
  const [url, setUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Try to load existing avatar on mount
  useEffect(() => {
    if (user) {
      // Try common extensions
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
      for (const ext of extensions) {
        const publicUrl = storageService.avatares.getPublicUrl(user.id, ext)
        // We'll just try to set the first one and let the img handle errors
        setUrl(publicUrl)
        break
      }
    }
  }, [user])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setError(null)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG, GIF o WebP')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo no puede superar los 2 MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      await storageService.avatares.upload(user.id, file)
      const newUrl = storageService.avatares.getPublicUrl(user.id, ext)
      // Add timestamp to force refresh
      setUrl(`${newUrl}?t=${Date.now()}`)
    } catch (err: any) {
      setError(err.message || 'Error al subir el avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleImageError = () => {
    setUrl(null)
  }

  return (
    <div className="profile-section">
      <div className="profile-avatar">
        {url ? (
          <img 
            src={url} 
            alt="Avatar" 
            className="profile-avatar__image"
            onError={handleImageError}
          />
        ) : (
          <span className="profile-avatar__placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
        )}
        <label className="profile-avatar__upload">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className="loading__spinner" style={{ width: 24, height: 24 }} />
          ) : (
            <span className="profile-avatar__upload-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
          )}
        </label>
      </div>

      <div className="profile-info">
        <h3 className="profile-info__name">
          {user?.email?.split('@')[0] || 'Usuario'}
        </h3>
        <p className="profile-info__email">{user?.email}</p>
        {error && (
          <p style={{ color: 'var(--destructive)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            {error}
          </p>
        )}
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          Haz clic en la imagen para cambiar tu avatar
        </p>
      </div>
    </div>
  )
}
