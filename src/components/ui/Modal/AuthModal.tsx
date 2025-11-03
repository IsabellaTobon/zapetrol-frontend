import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

type Mode = 'login' | 'register';

interface AuthModalProps {
  initialMode?: Mode;
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

  const { doLogin, doRegister, loading } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Limpia contraseñas al cambiar de modo (UX)
  useEffect(() => {
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    try {
      if (mode === 'register') {
        if (password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
        if (password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        await doRegister({
          name: formData.name.trim(),
          email,
          password,
        });

        // ✅ Mantén el modal abierto y cambia a la pestaña Login
        toast.success('Registro exitoso. Inicia sesión para continuar 🎉');
        setMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        return;
      }

      // LOGIN
      await doLogin({ email, password });
      toast.success('Inicio de sesión correcto 👋');
      onClose?.(); // ✅ cierra el modal tras loguear
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        (mode === 'register' ? 'Error registrando' : 'Error iniciando sesión')
      );
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-tabs">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Tabs */}
        <div className="tabs" role="tablist" id="auth-tabs">
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
              value={formData.name}
              onChange={handleChange}
              className="input"
              autoComplete="name"
              autoFocus={mode === 'register'}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
            autoComplete="email"
            autoFocus={mode === 'login'}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            value={formData.password}
            onChange={handleChange}
            className="input"
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
              className="input"
              autoComplete="new-password"
            />
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? 'Procesando...'
              : mode === 'login'
                ? 'Iniciar sesión'
                : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}
