// src/components/layout/Navbar.tsx
import './Navbar.css';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  return (
    <nav className="navbar">
      <h1>Zapetrol Navbar</h1>
      <button onClick={onOpenAuthModal}>Iniciar sesión</button>
    </nav>
  );
}
