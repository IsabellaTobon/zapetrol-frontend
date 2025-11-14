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
            {/* Card 1: Actualización continua - Siempre visible */}
            <div className="glass-card premium-card">
              <div className="premium-shine"></div>
              <div className="card-icon-large">
                <div className="icon-orbit"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="card-title-small">Actualización continua</div>
              <div className="card-value-small premium-value">24/7</div>
              <div className="premium-tag">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1l1.545 3.13L11 4.635 8.5 7.09l.59 3.445L6 8.885l-3.09 1.65.59-3.445L1 4.635l3.455-.505L6 1z" fill="currentColor" />
                </svg>
                Datos oficiales
              </div>
            </div>

            {/* Card 2: Comparación de precios - Siempre visible */}
            <div className="glass-card animated-card premium-card">
              <div className="premium-shine"></div>
              <div className="floating-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="card-title-small">Precios al instante</div>
              <div className="card-value-small">Compara</div>
              <div className="comparison-visual">
                <div className="price-bar high"></div>
                <div className="price-bar medium"></div>
                <div className="price-bar low"></div>
              </div>
              <div className="card-tag">Ahorra hasta 15%</div>
            </div>

            {/* Cards condicionales según ubicación */}
            {!locationDenied ? (
              <>
                {/* Card 3: Estaciones cercanas - Con ubicación */}
                <div className="glass-card featured-card premium-card">
                  <div className="card-glow"></div>
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-primary">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M12 12l9-5M12 12v9.5M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="card-title-small">Estaciones cercanas</div>
                  <div className="card-value">{stations.length}</div>
                  <div className="card-description">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1C4.68629 1 2 3.68629 2 7c0 4.375 6 9 6 9s6-4.625 6-9c0-3.31371-2.6863-6-6-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    En tu ubicación actual
                  </div>
                </div>

                {/* Card 4: Radio de búsqueda - Con ubicación */}
                <div className="glass-card interactive-card premium-card">
                  <div className="card-pattern"></div>
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" />
                      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="card-title-small">Radio de búsqueda</div>
                  <div className="card-value-small">{RADIUS_KM / 1000}km</div>
                  <div className="card-mini-stats-horizontal">
                    <div className="mini-stat">
                      <div className="mini-dot active"></div>
                      <span>Precisión GPS</span>
                    </div>
                    <div className="mini-stat">
                      <div className="mini-dot active"></div>
                      <span>Tiempo real</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Card 3: Invitación a activar ubicación - Sin ubicación */}
                <div className="glass-card location-prompt-card premium-card">
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-warning">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="card-title-small">Activa tu ubicación</div>
                  <div className="card-value-small">GPS</div>
                  <div className="card-description">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Encuentra gasolineras cerca de ti
                  </div>
                </div>

                {/* Card 4: Resultados por defecto - Sin ubicación */}
                <div className="glass-card default-results-card premium-card">
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-info">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="card-title-small">Estaciones listadas</div>
                  <div className="card-value-small">?</div>
                  <div className="card-description">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1C4.68629 1 2 3.68629 2 7c0 4.375 6 9 6 9s6-4.625 6-9c0-3.31371-2.6863-6-6-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Activa GPS para ver tus estaciones
                  </div>
                </div>
              </>
            )}
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
