import React, { useState } from 'react'
import './Navbar.css'
import LoginModal from '../ui/Modal/LoginModal'
import SignInModal from '../ui/Modal/SignInModal'
import AuthModal from '../ui/Modal/AuthModal'

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false)


  return (
    <>
      <nav className="navbar">
        <h1>Zapetrol Navbar</h1>
        <button onClick={() => setShowAuthModal(true)}>Iniciar sesión</button>
      </nav>

      {showAuthModal && (
        <AuthModal
          initialMode="login"
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
  // return (
  //   <>
  //     <nav className="navbar">
  //       <h1>Zapetrol Navbar</h1>
  //       {/* Botones */}
  //       <button onClick={() => { setShowLoginModal(true); setIsRegistering(false); }}>Iniciar sesión</button>
  //       <button onClick={() => { setIsRegistering(true); setShowLoginModal(false); }}>Registrarse</button>
  //     </nav>

  //     {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
  //     {isRegistering && <SignInModal onClose={() => setIsRegistering(false)} />}
  //   </>
  // )
}
