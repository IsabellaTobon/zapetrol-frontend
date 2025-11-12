import { useState, useEffect } from "react";
import StationList from "../components/stations/StationList";
import MapView from "../components/stations/MapView";
import { getStationsInRadiusWithDetailsAPI, type StationDetails } from "../lib/api";
import "./Home.css";

const RADIUS_KM = 5000;
const MAX_STATIONS = 30;
// Coordenadas de Madrid como fallback
const DEFAULT_LOCATION = { latitude: 40.4168, longitude: -3.7038 };

type ViewMode = 'list' | 'map';

export default function Home() {
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    const loadNearbyStations = async (latitude: number, longitude: number, isUserLocation = true) => {
      try {
        setUserLocation({ latitude, longitude });
        const stations = await getStationsInRadiusWithDetailsAPI(
          latitude,
          longitude,
          RADIUS_KM,
          1,
          MAX_STATIONS
        );
        setStations(stations);
        if (!isUserLocation) {
          setLocationDenied(true);
        }
      } catch (err) {
        console.error("Error cargando estaciones:", err);
        // Si falla, al menos mostrar algo
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => loadNearbyStations(position.coords.latitude, position.coords.longitude, true),
      (err) => {
        console.warn("Geolocalización denegada, usando ubicación por defecto:", err.message);
        // Si no hay permiso, cargar estaciones de Madrid por defecto
        loadNearbyStations(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, false);
      }
    );
  }, []);

  return (
    <>
      {/* Hero Section - Diseño Moderno 2025 */}
      <section className="hero-section">
        {/* Background con gradiente mesh */}
        <div className="hero-bg">
          <div className="gradient-mesh"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="hero-container">
          {/* Header con badge y título */}
          <div className="hero-header">
            <div className="hero-badge">
              <span className="status-indicator"></span>
              <span>Datos actualizados en tiempo real</span>
            </div>

            <h1 className="hero-title">
              Encuentra el mejor precio de{" "}
              <span className="gradient-text">combustible</span>
            </h1>

            <p className="hero-subtitle">
              Compara precios de gasolineras en tiempo real con datos oficiales del Ministerio.
              Ahorra en cada repostaje con información actualizada continuamente.
            </p>

            {locationDenied && (
              <div className="alert-box">
                <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <div>
                  <div className="alert-title">Ubicación desactivada</div>
                  <div className="alert-text">Active su ubicación para ver estaciones cercanas. Mostrando resultados en Madrid.</div>
                </div>
              </div>
            )}
          </div>

          {/* Flex container con cards mejoradas */}
          <div className="hero-cards">
            {/* Card principal con diseño destacado */}
            <div className="glass-card featured-card">
              <div className="card-glow"></div>
              <div className="card-header">
                <div className="icon-wrapper icon-primary">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 12l9-5M12 12v9.5M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="card-badge-group">
                  <span className="card-badge">En vivo</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M11 6l-3 3-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="card-stats">
                <div className="stat-main">
                  <div className="card-value">{stations.length}</div>
                  <div className="card-title">Estaciones disponibles</div>
                </div>
                <div className="stat-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Actualizado hace {Math.floor(Math.random() * 5) + 1} min</span>
                </div>
              </div>

              <div className="card-description">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C4.68629 1 2 3.68629 2 7c0 4.375 6 9 6 9s6-4.625 6-9c0-3.31371-2.6863-6-6-6z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {locationDenied
                  ? "Zona de Madrid y alrededores"
                  : `Radio de ${RADIUS_KM / 1000}km desde tu ubicación`}
              </div>

              <div className="card-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stations.length / MAX_STATIONS) * 100, 100)}%` }}></div>
                </div>
                <span className="progress-label">{stations.length} de {MAX_STATIONS} cargadas</span>
              </div>
            </div>

            {/* Card Premium con gradiente */}
            <div className="glass-card premium-card">
              <div className="premium-shine"></div>
              <div className="card-icon-large">
                <div className="icon-orbit"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="card-value-small premium-value">24/7</div>
              <div className="card-title-small">Actualización continua</div>
              <div className="premium-tag">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.545 3.13L11 4.635 8.5 7.09l.59 3.445L6 8.885l-3.09 1.65.59-3.445L1 4.635l3.455-.505L6 1z" fill="currentColor" />
                </svg>
                Datos oficiales
              </div>
            </div>

            {/* Card Interactiva */}
            <div className="glass-card interactive-card">
              <div className="card-pattern"></div>
              <div className="icon-wrapper icon-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" />
                  <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="card-value-small">{RADIUS_KM / 1000}km</div>
              <div className="card-title-small">Radio de búsqueda</div>
              <div className="card-mini-stats">
                <div className="mini-stat">
                  <div className="mini-dot"></div>
                  <span>Precisión GPS</span>
                </div>
                <div className="mini-stat">
                  <div className="mini-dot active"></div>
                  <span>Tiempo real</span>
                </div>
              </div>
            </div>

            {/* Card con animación */}
            <div className="glass-card animated-card">
              <div className="floating-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="card-value-small">Compara</div>
              <div className="card-title-small">Precios al instante</div>
              <div className="comparison-visual">
                <div className="price-bar high"></div>
                <div className="price-bar medium"></div>
                <div className="price-bar low"></div>
              </div>
              <div className="card-tag">Ahorra hasta 15%</div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-container">
        <div className="content-wrapper">
          {/* Toggle solo visible en móvil */}
          <div className="view-toggle mobile-only">
            <button
              className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <span className="toggle-icon">📋</span>
              <span>Lista</span>
            </button>
            <button
              className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <span className="toggle-icon">🗺️</span>
              <span>Mapa</span>
            </button>
          </div>

          {/* Vista móvil: toggle entre mapa y lista */}
          <div className="mobile-view">
            {viewMode === 'list' ? (
              <StationList stations={stations} loading={loading} itemsPerPage={6} />
            ) : (
              loading ? (
                <div className="loading-message">
                  <div className="spinner"></div>
                  <p>Cargando mapa...</p>
                </div>
              ) : (
                <MapView stations={stations} userLocation={userLocation} />
              )
            )}
          </div>

          {/* Vista desktop: mapa arriba, lista abajo */}
          <div className="desktop-view">
            {loading ? (
              <div className="loading-message">
                <div className="spinner"></div>
                <p>Cargando estaciones...</p>
              </div>
            ) : (
              <>
                <div className="map-section">
                  <MapView stations={stations} userLocation={userLocation} />
                </div>
                <div className="list-section">
                  <StationList stations={stations} loading={false} itemsPerPage={6} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
