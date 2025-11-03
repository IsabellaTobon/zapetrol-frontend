import { useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

/* Botón para cambiar entre modo claro/oscuro */
function ThemeToggle() {
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  return (
    <button onClick={toggleTheme} className="btn btn-outline" aria-label="Cambiar tema">
      🌓
    </button>
  );
}

/* Navbar principal */
export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  // Recupera tema guardado o usa preferencia del sistema
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute(
      'data-theme',
      saved ?? (prefersDark ? 'dark' : 'light')
    );
  }, []);

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <a className="nav-brand" href="/">
          <span className="brand-mark">ZP</span>
          <span className="brand-text">Zapetrol</span>
        </a>

        <nav className="nav-links" aria-label="Principal">
        </nav>

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
