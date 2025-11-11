import { useState, useEffect } from "react";
import StationList from "../components/stations/StationList";
import MapView from "../components/stations/MapView";
import { getStationsInRadiusWithDetailsAPI, type StationDetails } from "../lib/api";
import "./Home.css";

const RADIUS_KM = 5000;
const MAX_STATIONS = 30;

type ViewMode = 'list' | 'map';

export default function Home() {
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    const loadNearbyStations = async (latitude: number, longitude: number) => {
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
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        setError(`Error cargando estaciones: ${message}`);
        console.error("Error cargando estaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => loadNearbyStations(position.coords.latitude, position.coords.longitude),
      (err) => {
        setError(`Error obteniendo ubicación: ${err.message}`);
        setLoading(false);
      }
    );
  }, []);

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p style={{ color: "var(--error-color, #f44336)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Toggle solo visible en móvil */}
      <div className="view-toggle mobile-only">
        <button
          className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          <span className="toggle-icon">📋</span>
          Lista
        </button>
        <button
          className={`toggle-button ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          <span className="toggle-icon">🗺️</span>
          Mapa
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
  );
}
