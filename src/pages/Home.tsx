import { useState, useEffect } from "react";
import StationList from "../components/stations/StationList";
import {
  getStationsInRadiusAPI,
  getStationDetailsAPI,
  type StationDetails,
  type StationInRadius,
} from "../lib/api";

const RADIUS_KM = 5000;
const MAX_STATIONS = 30;

export default function Home() {
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNearbyStations = async (latitude: number, longitude: number) => {
      try {
        const nearbyStations = await getStationsInRadiusAPI(latitude, longitude, RADIUS_KM, 1, MAX_STATIONS);

        const validStations = nearbyStations.filter((station: StationInRadius) => station.stationId);
        const detailedStations = await Promise.all(
          validStations.map((station: StationInRadius) => getStationDetailsAPI(station.stationId!))
        );

        setStations(detailedStations);
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
      <div className="error-container" style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--error-color, #f44336)" }}>{error}</p>
      </div>
    );
  }

  return <StationList stations={stations} loading={loading} itemsPerPage={6} />;
}
