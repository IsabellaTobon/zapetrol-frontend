import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import toast from 'react-hot-toast';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
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
    <button onClick={toggleTheme} className="btn btn-outline" aria-label="Cambiar tema" title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
      {theme === 'light' ? '🌙' : '🌞'}
    </button>
  );
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  const { user, logout } = useAuthContext();

  // Muestra el botón solo si el usuario existe y tiene role admin
  const isAdmin = user?.role === 'admin';

  const shortName = user
    ? (user.email?.split('@')[0] || 'usuario')
    : null;

  function handleLogout() {
    logout();
    toast.success('Sesión cerrada');
  }

  return (
    <header className="navbar">
      <div className="nav-inner container">
        <Link className="nav-brand" to="/">
          <span className="brand-mark">ZP</span>
          <span className="brand-text">Zapetrol</span>
        </Link>

        <nav className="nav-links" aria-label="Principal">
          {user && (
            <Link to="/favoritos" className="btn btn-outline">
              ❤️ Favoritos
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="btn btn-outline">
              Panel de Admin
            </Link>
          )}
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

          {!user ? (
            <button className="btn btn-primary" onClick={onOpenAuthModal}>
              Iniciar sesión
            </button>
          ) : (
            <>
              <span className="welcome">Hola, {shortName}👋!</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
