import React from 'react'
import './Log-Register-Modal.css'

interface SignInModalProps {
  onClose?: () => void
}

interface SignInData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

function SignInModal({ onClose }: SignInModalProps) {
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <button className='close-btn' onClick={onClose}>X</button>

        <h2>Registro</h2>

        <form>
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
