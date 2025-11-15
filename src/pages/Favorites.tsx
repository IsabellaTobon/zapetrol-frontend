import { useState, useEffect, useCallback } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { getStationDetailsAPI, type StationDetails } from '../lib/api';
import StationCard from '../components/stations/StationCard';
import './Favorites.css';

export default function Favorites() {
  const { favorites, toggleFavorite, isAuthenticated, loading: favLoading } = useFavorites();
  const [stations, setStations] = useState<StationDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavoriteStations = useCallback(async () => {
    if (favorites.length === 0) {
      setStations([]);
      return;
    }

    setLoading(true);
    try {
      const stationsData = await Promise.all(
        favorites.map(id => getStationDetailsAPI(id))
      );
      setStations(stationsData.filter(Boolean));
    } catch (error) {
      console.error('Error loading favorite stations:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    loadFavoriteStations();
  }, [loadFavoriteStations]);

  if (!isAuthenticated) {
    return (
      <div className="favorites-container">
        <div className="favorites-empty">
          <span className="empty-icon">🔒</span>
          <h2>Inicia sesión</h2>
          <p>Inicia sesión para guardar tus estaciones favoritas</p>
        </div>
      </div>
    );
  }

  if (favLoading || loading) {
    return (
      <div className="favorites-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="gradient-heading-h1 heading-underline-large">Mis Favoritos</h1>
        <p className="favorites-count">
          {favorites.length === 0
            ? 'No tienes estaciones favoritas'
            : `${favorites.length} ${favorites.length === 1 ? 'estación' : 'estaciones'}`
          }
        </p>
      </div>

      {stations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">❤️</span>
          <h2>Sin favoritos</h2>
          <p>Añade estaciones a favoritos para verlas aquí</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {stations.map((station) => (
            <StationCard
              key={station.stationId}
              station={station}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
