import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import { useAuthContext } from '../../../hooks/useAuthContext';
import toast from 'react-hot-toast';
import {
  VALIDATION_RULES,
  validateField,
  sanitizeEmail,
  sanitizeName,
} from '../../../lib/validators';
import PasswordStrength from '../PasswordStrength/PasswordStrength';

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

  // Estado de errores por campo
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Estado de campos válidos (para mostrar checkmarks)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { doLogin, doRegister, loading } = useAuthContext();

  // Limpiar formulario al cambiar de modo
  useEffect(() => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setTouched({ name: false, email: false, password: false, confirmPassword: false });
  }, [mode]);

  // Validar un campo específico
  const validateSingleField = (name: string, value: string) => {
    let result = { isValid: true, error: '' };

    switch (name) {
      case 'email':
        result = validateField(value, VALIDATION_RULES.email);
        break;
      case 'password':
        result = validateField(value, VALIDATION_RULES.password(6));
        break;
      case 'confirmPassword':
        result = validateField(value, VALIDATION_RULES.confirmPassword(formData.password));
        break;
      case 'name':
        if (mode === 'register') {
          result = validateField(value, VALIDATION_RULES.name(3));
        }
        break;
    }

    return result;
  };

  // Validar ambos campos de contraseña cuando es necesario
  const validatePasswordFields = (password: string, confirmPassword: string) => {
    const newErrors: { password: string; confirmPassword: string } = {
      password: '',
      confirmPassword: '',
    };

    // Validar password
    const passwordResult = validateField(password, VALIDATION_RULES.password(6));
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error;
    }

    // En modo registro, validar coincidencia si confirmPassword tiene contenido
    if (mode === 'register' && confirmPassword) {
      const confirmResult = validateField(
        confirmPassword,
        VALIDATION_RULES.confirmPassword(password)
      );
      if (!confirmResult.isValid) {
        newErrors.confirmPassword = confirmResult.error;
      }

      // Si password es válido pero no coinciden
      if (!newErrors.password && password && password !== confirmPassword) {
        newErrors.password = 'Las contraseñas no coinciden';
      }
    }

    return newErrors;
  };

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Solo validar si el campo ya fue tocado
    if (!touched[name as keyof typeof touched]) return;

    // Casos especiales para contraseñas
    if (name === 'password' || name === 'confirmPassword') {
      const pwd = name === 'password' ? value : formData.password;
      const confirmPwd = name === 'confirmPassword' ? value : formData.confirmPassword;

      const passwordErrors = validatePasswordFields(pwd, confirmPwd);
      setErrors(prev => ({
        ...prev,
        password: touched.password ? passwordErrors.password : prev.password,
        confirmPassword: touched.confirmPassword ? passwordErrors.confirmPassword : prev.confirmPassword,
      }));
    } else {
      // Validación normal para otros campos
      const result = validateSingleField(name, value);
      setErrors(prev => ({ ...prev, [name]: result.error }));
    }
  };

  // Marcar campo como tocado al perder el foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validar campos de contraseña
    if (name === 'password' || name === 'confirmPassword') {
      const pwd = name === 'password' ? value : formData.password;
      const confirmPwd = name === 'confirmPassword' ? value : formData.confirmPassword;

      const passwordErrors = validatePasswordFields(pwd, confirmPwd);
      setErrors(prev => ({ ...prev, ...passwordErrors }));
    } else {
      // Validación normal
      const result = validateSingleField(name, value);
      setErrors(prev => ({ ...prev, [name]: result.error }));
    }
  };

  // Marcar como tocado al enfocar (para confirmPassword)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // Si es confirmPassword y ya hay una contraseña escrita, marcar como tocado
    if (name === 'confirmPassword' && formData.password) {
      setTouched(prev => ({ ...prev, confirmPassword: true }));
    }
  };

  // Validar todo el formulario antes de enviar
  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Validar email
    const emailResult = validateField(formData.email, VALIDATION_RULES.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
      isValid = false;
    }

    // Validar password
    const passwordResult = validateField(formData.password, VALIDATION_RULES.password(6));
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.error;
      isValid = false;
    }

    // Validaciones específicas de registro
    if (mode === 'register') {
      const nameResult = validateField(formData.name, VALIDATION_RULES.name(3));
      if (!nameResult.isValid) {
        newErrors.name = nameResult.error;
        isValid = false;
      }

      const confirmResult = validateField(
        formData.confirmPassword,
        VALIDATION_RULES.confirmPassword(formData.password)
      );
      if (!confirmResult.isValid) {
        newErrors.confirmPassword = confirmResult.error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Sanitizar datos
    const email = sanitizeEmail(formData.email);
    const password = formData.password;

    try {
      if (mode === 'register') {
        const name = sanitizeName(formData.name);
        await doRegister({ name, email, password });

        toast.success('¡Registro exitoso! Inicia sesión para continuar 🎉', {
          duration: 4000,
        });
        setMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        return;
      }

      await doLogin({ email, password });
      toast.success('¡Bienvenido de nuevo! 👋');
      onClose?.();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error?.response?.data?.message ??
        (mode === 'register' ? 'Error al registrarse' : 'Error al iniciar sesión')
      );
    }
  }

  // Determinar estado visual de un campo
  const getFieldState = (fieldName: keyof typeof errors) => {
    const value = formData[fieldName];
    const hasError = touched[fieldName] && !!errors[fieldName];

    // Solo mostrar como válido si:
    // 1. El campo fue tocado
    // 2. No tiene errores
    // 3. Tiene contenido
    let isValid = touched[fieldName] && !errors[fieldName] && value.length > 0;

    // Para password en modo registro: solo verde si confirmPassword también coincide
    if (fieldName === 'password' && mode === 'register') {
      isValid = isValid && formData.confirmPassword.length > 0 && value === formData.confirmPassword;
    }

    // Para confirmPassword: solo verde si coincide con password
    if (fieldName === 'confirmPassword') {
      isValid = isValid && formData.password.length > 0 && value === formData.password;
    }

    return { hasError, isValid };
  };

  // Obtener clase CSS para el input
  const getInputClassName = (fieldName: keyof typeof errors) => {
    const { hasError, isValid } = getFieldState(fieldName);
    return `input ${hasError ? 'error' : isValid ? 'success' : ''}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="auth-tabs">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

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

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="field">
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('name')}
                autoComplete="name"
                autoFocus={mode === 'register'}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="error-text" id="name-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="field">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('email')}
              autoComplete="email"
              autoFocus={mode === 'login'}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p className="error-text" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName('password')}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p className="error-text" id="password-error" role="alert">
                {errors.password}
              </p>
            )}
            {mode === 'register' && (
              <PasswordStrength password={formData.password} show={touched.password} />
            )}
          </div>

          {mode === 'register' && (
            <div className="field">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className={getInputClassName('confirmPassword')}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
              />
              {errors.confirmPassword && (
                <p className="error-text" id="confirm-error" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
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
