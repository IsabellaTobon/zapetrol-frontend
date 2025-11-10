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
import { getStationsInRadiusAPI, getStationDetailsAPI, type StationDetails, type StationInRadius } from './lib/api'

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const nearbyStations = await getStationsInRadiusAPI(latitude, longitude, 5000, 1, 6);
          const detailedStations = await Promise.all(
            nearbyStations
              .filter((station: StationInRadius) => station.stationId) // Filtrar estaciones sin ID
              .map((station: StationInRadius) => getStationDetailsAPI(station.stationId!))
          );
          setStations(detailedStations);
        } catch (err) {
          console.error('Error cargando estaciones:', err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error obteniendo ubicación:', err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
      <main>
        {loading && <p>Cargando estaciones cercanas...</p>}
        {!loading && stations.length === 0 && <p>No se encontraron estaciones cercanas</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', padding: '2rem' }}>
          {stations.map((station) => (
            <StationCard key={station.stationId} station={station} />
          ))}
        </div>
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
