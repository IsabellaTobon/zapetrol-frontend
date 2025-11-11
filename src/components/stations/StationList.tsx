import { useState } from 'react';
import StationCard from './StationCard';
import Pagination from '../ui/Pagination/Pagination';
import type { StationDetails } from '../../lib/api';
import './StationList.css';

interface StationListProps {
  stations: StationDetails[];
  loading?: boolean;
  itemsPerPage?: number;
}

export default function StationList({
  stations,
  loading = false,
  itemsPerPage = 6
}: StationListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(stations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStations = stations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave al inicio de la lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="station-list-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Cargando estaciones cercanas...</p>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="station-list-container">
        <div className="empty-message">
          <span className="empty-icon">📍</span>
          <p>No se encontraron estaciones cercanas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="station-list-container">
      <div className="station-list-header">
        <h2>Estaciones cercanas</h2>
        <p className="station-count">
          Mostrando {startIndex + 1}-{Math.min(endIndex, stations.length)} de {stations.length} estaciones
        </p>
      </div>

      <div className="station-grid">
        {currentStations.map((station) => (
          <StationCard key={station.stationId} station={station} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
