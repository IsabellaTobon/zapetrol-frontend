import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

type Mode = 'login' | 'register';

interface AuthModalProps {
  initialMode?: Mode;  // por defecto 'login'
  onClose?: () => void;
}

export default function AuthModal({ initialMode = 'login', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { doLogin, doRegister, loading, error } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = formData.email.trim();
    const password = formData.password;
    const name = formData.name.trim();

    if (mode === 'register') {
      if (password !== formData.confirmPassword) return toast.error('Las contraseñas no coinciden');
      if (password.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres');

      try {
        await doRegister({ name, email, password }); // no envío confirmPassword
        toast.success('Registro correcto');
        onClose?.();
      } catch {
        toast.error(error ?? 'Error registrando');
      }
      return;
    }

    // login
    try {
      await doLogin({ email, password });
      toast.success('Inicio de sesión correcto');
      onClose?.();
    } catch {
      toast.error(error ?? 'Error iniciando sesión');
    }
  }

  return (
    <div className="modal-overlay auth-modal">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">X</button>

        {/* Tabs */}
        <div className="tabs" role="tablist" aria-label="Autenticación" id="auth-tabs">
          <button
            id="tab-login"
            role="tab"
            aria-controls="panel-login"
            aria-selected={mode === 'login'}
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Iniciar sesión
          </button>
          <button
            id="tab-register"
            role="tab"
            aria-controls="panel-register"
            aria-selected={mode === 'register'}
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <h2 id="auth-title" className="sr-only">
          {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </h2>

        <form onSubmit={handleSubmit} aria-labelledby="auth-title">
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

          <button type="submit" disabled={loading}>
            {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </button>

          {/* PRUEBA: además del toast, muestro error abajo */}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
