import { useEffect, useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

/* =========================================
  ThemeToggle: alterna entre modo claro/oscuro
========================================= */
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Al cargar: detecta tema guardado o preferencia del sistema
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline"
      aria-label="Cambiar tema"
      title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      {theme === 'light' ? '🌙' : '🌞'}
    </button>
  );
}

/* =========================================
  Navbar principal
========================================= */
export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="nav-inner container">
        {/* === Logo / marca === */}
        <a className="nav-brand" href="/">
          <span className="brand-mark">ZP</span>
          <span className="brand-text">Zapetrol</span>
        </a>

        {/* === Espacio para links de navegación === */}
        <nav className="nav-links" aria-label="Principal">
          {/* Ejemplo:
          <a href="/productos">Productos</a>
          <a href="/contacto">Contacto</a> */}
        </nav>

        {/* === Acciones principales === */}
        <div className="nav-actions">
          <ThemeToggle />
          <a
            href="https://api.precioil.es"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            API Docs
          </a>
          <button className="btn btn-primary" onClick={onOpenAuthModal}>
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
