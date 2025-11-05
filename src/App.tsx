import { useState } from 'react'
import './App.css'
import './styles/theme.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthModal from './components/ui/Modal/AuthModal'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
      <main>
        <h1>Principal Zapetrol</h1>
      </main>
      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </AuthProvider>
  )
}

export default App
