import React, { useState } from 'react'
import './AuthModal.css'

type Mode = 'login' | 'register'

interface AuthModalProps {
  initialMode?: Mode // por defecto 'login'
  onClose?: () => void
}

export default function AuthModal({ initialMode = 'login', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    console.log('Datos enviados:', { mode, ...formData })
  }

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-tabs">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">X</button>

        {/* Pestañas */}
        <div className="tabs" role="tablist" aria-label="Autenticación" id="auth-tabs">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            role="tab"
            aria-selected={mode === 'register'}
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            value={formData.password}
            onChange={handleChange}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          )}

          <button type="submit">
            {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  )
}
