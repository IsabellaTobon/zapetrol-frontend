import './Navbar.css';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="nav-inner container">
        <a className="nav-brand" href="/">
          <span className="brand-mark">ZP</span>
          <span className="brand-text">Zapetrol</span>
        </a>

        <nav className="nav-links" aria-label="Principal">
          {/* <a href="#">Inicio</a> */}
          {/* <a href="#">Favoritos</a> */}
        </nav>

        <div className="nav-actions">
          <button className="btn ghost">Docs</button> {/* TODO: Implementar enlace a la documentación */}
          <button className="btn primary" onClick={onOpenAuthModal}>Iniciar sesión</button>
        </div>
      </div>
    </header>
  );
}
