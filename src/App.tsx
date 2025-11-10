import { useState, useEffect } from 'react'
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
import ProtectedRoute from './components/ProtectedRoute'
import StationCard from './components/stations/StationCard'
import { getStationDetailsAPI } from './lib/api'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stationData, setStationData] = useState(null);

  useEffect(() => {
    getStationDetailsAPI(1)
      .then(data => setStationData(data))
      .catch(err => console.error('Error cargando estación:', err));
  }, []);

  return (
    <>
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
      <main>
        {stationData && <StationCard station={stationData} />}
        <Routes>
          <Route path="/" element={<Home />} />
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
