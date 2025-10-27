import React, { useState } from 'react'
import './Navbar.css'
import LoginModal from '../ui/Modal/LoginModal'
import SignInModal from '../ui/Modal/SignInModal'

export default function Navbar() {
const [showLoginModal, setShowLoginModal] = useState(false)
const [isRegistering, setIsRegistering] = useState(false);


  return (
    <>
      <nav className="navbar">
        <h1>Zapetrol Navbar</h1>
        {/* Botones */}
        <button onClick={() => { setShowLoginModal(true); setIsRegistering(false); }}>Iniciar sesión</button>
        <button onClick={() => { setIsRegistering(true); setShowLoginModal(false); }}>Registrarse</button>
      </nav>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {isRegistering && <SignInModal onClose={() => setIsRegistering(false)} />}
    </>
  )
}
