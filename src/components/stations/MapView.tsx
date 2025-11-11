import { useState, useCallback, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import type { StationDetails } from '../../lib/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapView.css';

interface MapViewProps {
  stations: StationDetails[];
  userLocation?: { latitude: number; longitude: number };
}

export default function MapView({ stations, userLocation }: MapViewProps) {
  const [popupInfo, setPopupInfo] = useState<StationDetails | null>(null);
  const [viewState, setViewState] = useState({
    longitude: userLocation?.longitude || -3.7038,
    latitude: userLocation?.latitude || 40.4168,
    zoom: userLocation ? 12 : 6,
  });

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Agrupar estaciones muy cercanas para evitar superposición
  const displayStations = useMemo(() => {
    const CLUSTER_THRESHOLD = 0.001; // ~100m
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

  const handleMarkerClick = useCallback((station: StationDetails) => {
    setPopupInfo(station);
  }, []);

  const getPriceColor = (station: StationDetails): string => {
    // Colorear por precio de Gasolina 95 (más común)
    const price = station.Gasoline95;
    if (!price) return '#6366f1'; // Azul por defecto

    const avg = station.Gasoline95_avg;
    if (!avg) return '#6366f1';

    const diff = ((price - avg) / avg) * 100;

    if (diff < 0) return '#22c55e';
    if (diff < 3) return '#eab308';
    return '#ef4444';
  };

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
                {popupInfo.Gasoline95 && (
                  <div className="price-row">
                    <span className="fuel-type">Gasolina 95</span>
                    <span className="fuel-price">{popupInfo.Gasoline95.toFixed(3)}€</span>
                    {popupInfo.Gasoline95_avg && (
                      <span className="fuel-avg">
                        (media: {popupInfo.Gasoline95_avg.toFixed(3)}€)
                      </span>
                    )}
                  </div>
                )}
                {popupInfo.Gasoline98 && (
                  <div className="price-row">
                    <span className="fuel-type">Gasolina 98</span>
                    <span className="fuel-price">{popupInfo.Gasoline98.toFixed(3)}€</span>
                    {popupInfo.Gasoline98_avg && (
                      <span className="fuel-avg">
                        (media: {popupInfo.Gasoline98_avg.toFixed(3)}€)
                      </span>
                    )}
                  </div>
                )}
                {popupInfo.Diesel && (
                  <div className="price-row">
                    <span className="fuel-type">Diesel</span>
                    <span className="fuel-price">{popupInfo.Diesel.toFixed(3)}€</span>
                    {popupInfo.Diesel_avg && (
                      <span className="fuel-avg">
                        (media: {popupInfo.Diesel_avg.toFixed(3)}€)
                      </span>
                    )}
                  </div>
                )}
                {popupInfo.DieselPremium && (
                  <div className="price-row">
                    <span className="fuel-type">Diesel Premium</span>
                    <span className="fuel-price">{popupInfo.DieselPremium.toFixed(3)}€</span>
                  </div>
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
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }}></span>
            <span>Barato (por debajo de la media)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#eab308' }}></span>
            <span>Normal (±3% de la media)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            <span>Caro (por encima de la media)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
