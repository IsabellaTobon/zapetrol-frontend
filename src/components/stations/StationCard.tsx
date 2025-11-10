import "./StationCard.css";
import type { StationDetails } from "../../lib/api";

export default function StationCard({ station }: { station: StationDetails }) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h3 className="station-name">{station.stationName}</h3>
        <div className="station-meta">
          <span className="station-brand">{station.brand}</span>
        </div>
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
        <div className="fuel-item">
          <span className="fuel-type">⛽ Gasolina 95</span>
          <span className="price">{station.Gasoline95?.toFixed(3) ?? 'N/D'} €</span>
        </div>
        <div className="fuel-item">
          <span className="fuel-type">⛽ Gasolina 98</span>
          <span className="price">{station.Gasoline98?.toFixed(3) ?? 'N/D'} €</span>
        </div>
        <div className="fuel-item">
          <span className="fuel-type">🚛 Diesel</span>
          <span className="price">{station.Diesel?.toFixed(3) ?? 'N/D'} €</span>
        </div>
      </div>
    </div>
  );
}
