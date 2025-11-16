import { useState, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { StationDetails } from '../../lib/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapView.css';

interface MapViewProps {
  stations: StationDetails[];
  userLocation?: { latitude: number; longitude: number };
}

// Constantes
const DEFAULT_CENTER = { longitude: -3.7038, latitude: 40.4168 }; // Madrid
const CLUSTER_THRESHOLD = 0.001; // ~100m
const PRICE_COLORS = {
  CHEAP: '#22c55e',    // Verde
  NORMAL: '#eab308',   // Amarillo
  EXPENSIVE: '#ef4444', // Rojo
  DEFAULT: '#6366f1',  // Azul
};
const PRICE_THRESHOLD = 3; // % diferencia para considerar normal

const LEGEND_ITEMS = [
  { color: PRICE_COLORS.CHEAP, label: 'Barato (por debajo de la media)' },
  { color: PRICE_COLORS.NORMAL, label: 'Normal (±3% de la media)' },
  { color: PRICE_COLORS.EXPENSIVE, label: 'Caro (por encima de la media)' },
];

export default function MapView({ stations, userLocation }: MapViewProps) {
  const [popupInfo, setPopupInfo] = useState<StationDetails | null>(null);
  const [viewState, setViewState] = useState({
    longitude: userLocation?.longitude || DEFAULT_CENTER.longitude,
    latitude: userLocation?.latitude || DEFAULT_CENTER.latitude,
    zoom: userLocation ? 12 : 6,
  });

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Agrupar estaciones cercanas para evitar superposición
  const displayStations = useMemo(() => {
    const clustered: StationDetails[] = [];
    const processed = new Set<number>();

    stations.forEach((station) => {
      if (processed.has(station.stationId)) return;

      const nearby = stations.filter(
        (s) =>
          !processed.has(s.stationId) &&
          Math.abs(s.latitude - station.latitude) < CLUSTER_THRESHOLD &&
          Math.abs(s.longitude - station.longitude) < CLUSTER_THRESHOLD
      );

      nearby.forEach((s) => processed.add(s.stationId));
      clustered.push(station);
    });

    return clustered;
  }, [stations]);

  const getPriceColor = useCallback((station: StationDetails): string => {
    const price = station.Gasoline95;
    const avg = station.Gasoline95_avg;

    if (!price || !avg) return PRICE_COLORS.DEFAULT;

    const diffPercent = ((price - avg) / avg) * 100;

    if (diffPercent < 0) return PRICE_COLORS.CHEAP;
    if (diffPercent < PRICE_THRESHOLD) return PRICE_COLORS.NORMAL;
    return PRICE_COLORS.EXPENSIVE;
  }, []);

  const handleMarkerClick = useCallback((station: StationDetails) => {
    setPopupInfo(station);
  }, []);

  if (!mapboxToken) {
    return (
      <div className="map-error">
        <p>⚠️ Falta configurar VITE_MAPBOX_TOKEN en las variables de entorno</p>
        {/* <p className="map-error-hint">
          Obtén un token gratuito en{' '}
          <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">
            mapbox.com
          </a>
        </p> */}
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="gradient-heading-h2 heading-underline">Mapa de estaciones</h2>
      </div>
      <div className="map-wrapper">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={mapboxToken}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            trackUserLocation
            showUserHeading
          />

          {/* Marcador de ubicación del usuario */}
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="center"
            >
              <div className="user-marker" title="Tu ubicación">
                <div className="user-marker-pulse"></div>
                <div className="user-marker-dot"></div>
              </div>
            </Marker>
          )}

          {/* Marcadores de estaciones */}
          {displayStations.map((station) => (
            <Marker
              key={station.stationId}
              longitude={station.longitude}
              latitude={station.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(station);
              }}
            >
              <div
                className="station-marker"
                style={{ backgroundColor: getPriceColor(station) }}
                title={station.stationName}
              >
                <span className="station-marker-icon">⛽</span>
              </div>
            </Marker>
          ))}

          {/* Popup con información de la estación */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              anchor="top"
              onClose={() => setPopupInfo(null)}
              closeButton={true}
              closeOnClick={false}
              className="station-popup"
            >
              <div className="station-popup-content">
                <h3 className="station-popup-title">{popupInfo.stationName}</h3>
                {popupInfo.brand && (
                  <p className="station-popup-brand">{popupInfo.brand}</p>
                )}
                <p className="station-popup-address">{popupInfo.address}</p>
                <p className="station-popup-locality">
                  {popupInfo.locality}, {popupInfo.province}
                </p>

                <div className="station-popup-prices">
                  <h4>Precios</h4>
                  {[
                    { type: 'Gasolina 95', price: popupInfo.Gasoline95, avg: popupInfo.Gasoline95_avg },
                    { type: 'Gasolina 98', price: popupInfo.Gasoline98, avg: popupInfo.Gasoline98_avg },
                    { type: 'Diesel', price: popupInfo.Diesel, avg: popupInfo.Diesel_avg },
                    { type: 'Diesel Premium', price: popupInfo.DieselPremium, avg: popupInfo.DieselPremium_avg },
                  ].map(
                    ({ type, price, avg }) =>
                      price && (
                        <div key={type} className="price-row">
                          <span className="fuel-type">{type}</span>
                          <span className="fuel-price">{price.toFixed(3)}€</span>
                          {avg && <span className="fuel-avg">(media: {avg.toFixed(3)}€)</span>}
                        </div>
                      )
                  )}
                </div>

                {popupInfo.openingHours && (
                  <p className="station-popup-hours">
                    <strong>Horario:</strong> {popupInfo.openingHours}
                  </p>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {/* Leyenda */}
        <div className="map-legend">
          <h4>Leyenda de precios (Gasolina 95)</h4>
          <div className="legend-items">
            {LEGEND_ITEMS.map(({ color, label }) => (
              <div key={label} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
