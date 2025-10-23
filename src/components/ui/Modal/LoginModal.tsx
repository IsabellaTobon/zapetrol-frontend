import React from 'react'
import './LoginModal.css'

interface LoginModalProps {
  onClose?: () => void
}

interface LoginData {
  email: string
  password: string
}

function LoginModal({ onClose }: LoginModalProps) {
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <button className='close-btn' onClick={onClose}>X</button>
        
        <h2>Login</h2>

        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
