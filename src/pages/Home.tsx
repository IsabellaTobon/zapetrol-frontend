import { useState, useEffect } from "react";
import StationList from "../components/stations/StationList";
import { getStationsInRadiusWithDetailsAPI, type StationDetails } from "../lib/api";

const RADIUS_KM = 5000;
const MAX_STATIONS = 30;

export default function Home() {
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNearbyStations = async (latitude: number, longitude: number) => {
      try {
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
      <div className="station-list-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p style={{ color: "var(--error-color, #f44336)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return <StationList stations={stations} loading={loading} itemsPerPage={6} />;
}
