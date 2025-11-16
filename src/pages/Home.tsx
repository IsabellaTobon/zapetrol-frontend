import { useState, useEffect } from "react";
import StationList from "../components/stations/StationList";
import MapView from "../components/stations/MapView";
import { getStationsInRadiusWithDetailsAPI, type StationDetails } from "../lib/api";
import "./Home.css";

const RADIUS_KM = 5000;
const MAX_STATIONS = 30;
const GEOLOCATION_TIMEOUT = 8000; // 8 segundos máximo para geolocalización
// Coordenadas del centro de Zaragoza como ubicación predeterminada
const DEFAULT_LOCATION = { latitude: 41.6488, longitude: -0.8891 };

type ViewMode = 'list' | 'map';

export default function Home() {
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [outOfSpain, setOutOfSpain] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [requestingLocation, setRequestingLocation] = useState(false);

  const requestGeolocation = () => {
    setRequestingLocation(true);
    setLocationDenied(false);
    setOutOfSpain(false);

    const loadNearbyStations = async (latitude: number, longitude: number, isUserLocation = true) => {
      try {
        const stations = await getStationsInRadiusWithDetailsAPI(
          latitude,
          longitude,
          RADIUS_KM,
          1,
          MAX_STATIONS
        );

        // Si no se encontraron estaciones y es la ubicación del usuario, podría estar fuera de España
        if (stations.length === 0 && isUserLocation) {
          console.warn("No se encontraron estaciones en la ubicación del usuario");
          setOutOfSpain(true);
          // Cargar estaciones de Zaragoza como respaldo
          const defaultStations = await getStationsInRadiusWithDetailsAPI(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            RADIUS_KM,
            1,
            MAX_STATIONS
          );
          setStations(defaultStations);
          setUserLocation(DEFAULT_LOCATION);
        } else {
          setStations(stations);
          setUserLocation({ latitude, longitude });
        }
      } catch (err) {
        console.error("Error cargando estaciones:", err);
        // Si hay error, intentar cargar estaciones de Zaragoza
        if (isUserLocation) {
          try {
            const defaultStations = await getStationsInRadiusWithDetailsAPI(
              DEFAULT_LOCATION.latitude,
              DEFAULT_LOCATION.longitude,
              RADIUS_KM,
              1,
              MAX_STATIONS
            );
            setStations(defaultStations);
            setUserLocation(DEFAULT_LOCATION);
            setOutOfSpain(true);
          } catch (fallbackErr) {
            console.error("Error cargando estaciones de respaldo:", fallbackErr);
            setStations([]);
          }
        } else {
          setStations([]);
        }
      } finally {
        setRequestingLocation(false);
      }
    };

    let timeoutId: number;
    let geolocationCompleted = false;

    // Crear una promesa de timeout
    const timeoutPromise = new Promise<void>((resolve) => {
      timeoutId = window.setTimeout(() => {
        if (!geolocationCompleted) {
          console.warn("Timeout de geolocalización alcanzado");
          setLocationDenied(true);
          setRequestingLocation(false);
          resolve();
        }
      }, GEOLOCATION_TIMEOUT);
    });

    // Crear una promesa de geolocalización
    const geolocationPromise = new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geolocationCompleted = true;
          clearTimeout(timeoutId);
          loadNearbyStations(position.coords.latitude, position.coords.longitude, true)
            .then(resolve)
            .catch(reject);
        },
        (err) => {
          geolocationCompleted = true;
          clearTimeout(timeoutId);
          console.warn("Geolocalización denegada:", err.message);
          setLocationDenied(true);
          setRequestingLocation(false);
          resolve();
        },
        {
          timeout: GEOLOCATION_TIMEOUT,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutos
        }
      );
    });

    // Esperar a que termine la geolocalización o el timeout
    Promise.race([geolocationPromise, timeoutPromise]);
  };

  useEffect(() => {
    const loadNearbyStations = async (latitude: number, longitude: number, isUserLocation = true) => {
      try {
        const stations = await getStationsInRadiusWithDetailsAPI(
          latitude,
          longitude,
          RADIUS_KM,
          1,
          MAX_STATIONS
        );

        // Si no se encontraron estaciones y es la ubicación del usuario, podría estar fuera de España
        if (stations.length === 0 && isUserLocation) {
          console.warn("No se encontraron estaciones en la ubicación del usuario");
          setOutOfSpain(true);
          // Cargar estaciones de Zaragoza como respaldo
          const defaultStations = await getStationsInRadiusWithDetailsAPI(
            DEFAULT_LOCATION.latitude,
            DEFAULT_LOCATION.longitude,
            RADIUS_KM,
            1,
            MAX_STATIONS
          );
          setStations(defaultStations);
          setUserLocation(DEFAULT_LOCATION);
        } else {
          setStations(stations);
          setUserLocation({ latitude, longitude });
        }
      } catch (err) {
        console.error("Error cargando estaciones:", err);
        // Si hay error, intentar cargar estaciones de Zaragoza
        if (isUserLocation) {
          try {
            const defaultStations = await getStationsInRadiusWithDetailsAPI(
              DEFAULT_LOCATION.latitude,
              DEFAULT_LOCATION.longitude,
              RADIUS_KM,
              1,
              MAX_STATIONS
            );
            setStations(defaultStations);
            setUserLocation(DEFAULT_LOCATION);
            setOutOfSpain(true);
          } catch (fallbackErr) {
            console.error("Error cargando estaciones de respaldo:", fallbackErr);
            setStations([]);
          }
        } else {
          setStations([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Primero cargar estaciones de Zaragoza inmediatamente
    const init = async () => {
      try {
        await loadNearbyStations(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, false);
      } catch (err) {
        console.error("Error en carga inicial:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Luego intentar obtener ubicación del usuario en segundo plano
    let timeoutId: number;
    let geolocationCompleted = false;

    const timeoutPromise = new Promise<void>((resolve) => {
      timeoutId = window.setTimeout(() => {
        if (!geolocationCompleted) {
          console.warn("Timeout de geolocalización alcanzado");
          resolve();
        }
      }, GEOLOCATION_TIMEOUT);
    });

    const geolocationPromise = new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geolocationCompleted = true;
          clearTimeout(timeoutId);
          // Cargar estaciones cercanas al usuario sin cambiar loading
          loadNearbyStations(position.coords.latitude, position.coords.longitude, true)
            .then(resolve);
        },
        (err) => {
          geolocationCompleted = true;
          clearTimeout(timeoutId);
          console.warn("Geolocalización denegada:", err.message);
          setLocationDenied(true);
          resolve();
        },
        {
          timeout: GEOLOCATION_TIMEOUT,
          enableHighAccuracy: false,
          maximumAge: 300000
        }
      );
    });

    Promise.race([geolocationPromise, timeoutPromise]);
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

            {outOfSpain && (
              <div className="alert-box">
                <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="alert-content">
                  <div className="alert-title">Ubicación fuera de España</div>
                  <div className="alert-text">No se encontraron estaciones en tu ubicación. Mostrando estaciones en Zaragoza.</div>
                </div>
              </div>
            )}

            {locationDenied && !outOfSpain && (
              <div className="alert-box">
                <svg className="alert-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="alert-content">
                  <div className="alert-title">Ubicación desactivada</div>
                  <div className="alert-text">Active su ubicación para ver estaciones cercanas a usted. Mostrando estaciones en Zaragoza.</div>
                </div>
                <button
                  className="alert-button"
                  onClick={requestGeolocation}
                  disabled={requestingLocation}
                >
                  {requestingLocation ? (
                    <>
                      <div className="button-spinner"></div>
                      Solicitando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1C4.68629 1 2 3.68629 2 7c0 4.375 6 9 6 9s6-4.625 6-9c0-3.31371-2.6863-6-6-6z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      Activar ubicación
                    </>
                  )}
                </button>
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
            {!locationDenied && !outOfSpain ? (
              <>
                {/* Card 3: Estaciones cercanas - Con ubicación del usuario */}
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

                {/* Card 4: Radio de búsqueda - Con ubicación del usuario */}
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
                {/* Card 3: Estaciones disponibles - Sin ubicación o fuera de España */}
                <div className="glass-card featured-card premium-card">
                  <div className="card-glow"></div>
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-primary">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M12 12l9-5M12 12v9.5M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="card-title-small">Estaciones en Zaragoza</div>
                  <div className="card-value">{stations.length}</div>
                  <div className="card-description">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1C4.68629 1 2 3.68629 2 7c0 4.375 6 9 6 9s6-4.625 6-9c0-3.31371-2.6863-6-6-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Centro de Zaragoza
                  </div>
                </div>

                {/* Card 4: Invitación a activar ubicación */}
                <div className="glass-card location-prompt-card premium-card">
                  <div className="premium-shine"></div>
                  <div className="icon-wrapper icon-warning">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="card-title-small">
                    {outOfSpain ? 'Fuera de España' : 'Activa tu ubicación'}
                  </div>
                  <div className="card-value-small">GPS</div>
                  <div className="card-description">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {outOfSpain ? 'Sin estaciones en tu zona' : 'Para ver estaciones cerca de ti'}
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
                  <div className="loading-spinner"></div>
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
                <div className="loading-spinner"></div>
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
