import "./StationCard.css";
import type { StationDetails } from "../../lib/api";

const FUELS = [
  { key: 'Gasoline95', label: '⛽ Gasolina 95' },
  { key: 'Gasoline98', label: '⛽ Gasolina 98' },
  { key: 'Diesel', label: '🚛 Diesel' },
] as const;

interface StationCardProps {
  station: StationDetails;
  isFavorite?: boolean;
  onToggleFavorite?: (stationId: number) => void;
  showFavoriteButton?: boolean;
}

export default function StationCard({
  station,
  isFavorite = false,
  onToggleFavorite,
  showFavoriteButton = false
}: StationCardProps) {
  return (
    <div className="station-card">
      <div className="station-header">
        <div className="station-title-group">
          <h3 className="station-name">{station.stationName}</h3>
          <span className="station-brand">{station.brand}</span>
        </div>
        {showFavoriteButton && onToggleFavorite && (
          <button
            className="favorite-btn"
            onClick={() => onToggleFavorite(station.stationId)}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      <div className="station-info">
        <div className="location">
          <span className="icon">📍</span>
          <div>
            <p className="address">{station.address}</p>
            <p className="city">{station.locality} - {station.postalCode}</p>
          </div>
        </div>

        {station.openingHours && (
          <div className="schedule">
            <span className="icon">🕒</span>
            <p>{station.openingHours}</p>
          </div>
        )}
      </div>

      <div className="fuel-prices">
        {FUELS.map(({ key, label }) => (
          <div key={key} className="fuel-item">
            <span className="fuel-type">{label}</span>
            <span className="price">
              {station[key]?.toFixed(3) ?? 'N/D'} €
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
