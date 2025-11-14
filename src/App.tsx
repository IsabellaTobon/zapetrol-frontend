import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './styles/theme.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import AuthModal from './components/ui/Modal/AuthModal'
import { AuthProvider } from './contexts/AuthContext'
import { AuthModalProvider } from './contexts/AuthModalContext'
import { useAuthModal } from './hooks/useAuthModal'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import Favorites from './pages/Favorites'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const { showAuthModal, openAuthModal, closeAuthModal } = useAuthModal();

  return (
    <>
      <Navbar onOpenAuthModal={openAuthModal} />
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

      {showAuthModal && <AuthModal onClose={closeAuthModal} />}

      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
          <AppContent />
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
