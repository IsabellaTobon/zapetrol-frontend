import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthModal from './components/ui/Modal/AuthModal'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import Favorites from './pages/Favorites'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
