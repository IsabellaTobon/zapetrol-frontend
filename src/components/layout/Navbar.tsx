import React, { useState } from 'react'
import './Navbar.css'
import LoginModal from '../ui/Modal/LoginModal'

export default function Navbar() {
const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <nav className="navbar">
        <h1>Zapetrol Navbar</h1>
        <button onClick={() => setShowLoginModal(true)}>Login</button>
      </nav>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  )
}
