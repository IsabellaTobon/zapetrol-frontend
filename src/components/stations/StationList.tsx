import { useState, useMemo, useEffect } from 'react';
import StationCard from './StationCard';
import Pagination from '../ui/Pagination/Pagination';
import StationFilters, { type FuelType, type SortBy } from './StationFilters';
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
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('none');

  // Extraer todas las marcas únicas
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(stations.map(s => s.brand))].filter(Boolean);
    return uniqueBrands.sort();
  }, [stations]);

  // Filtrar y ordenar estaciones
  const filteredAndSortedStations = useMemo(() => {
    let result = [...stations];

    // Filtrar por marca
    if (selectedBrand !== 'all') {
      result = result.filter(s => s.brand === selectedBrand);
    }

    // Filtrar por tipo de combustible
    if (selectedFuel !== 'all') {
      result = result.filter(s => s[selectedFuel] !== undefined && s[selectedFuel] !== null);
    }

    // Ordenar
    if (sortBy !== 'none') {
      result.sort((a, b) => {
        if (sortBy === 'price-asc' || sortBy === 'price-desc') {
          // Si hay un combustible seleccionado, ordenar por ese combustible
          if (selectedFuel !== 'all') {
            const priceA = a[selectedFuel] ?? Infinity;
            const priceB = b[selectedFuel] ?? Infinity;
            return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
          }

          // Si no hay filtro de combustible, ordenar por Gasolina 95 (el más común)
          const priceA = a.Gasoline95 ?? Infinity;
          const priceB = b.Gasoline95 ?? Infinity;
          return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
        } else if (sortBy === 'name-asc') {
          return a.stationName.localeCompare(b.stationName);
        } else if (sortBy === 'name-desc') {
          return b.stationName.localeCompare(a.stationName);
        }
        return 0;
      });
    }

    return result;
  }, [stations, selectedBrand, selectedFuel, sortBy]);

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedFuel, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStations = filteredAndSortedStations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave al inicio de la lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedBrand('all');
    setSelectedFuel('all');
    setSortBy('none');
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredAndSortedStations.length)} de {filteredAndSortedStations.length} estaciones
          {filteredAndSortedStations.length !== stations.length && (
            <span className="filtered-count"> (filtradas de {stations.length})</span>
          )}
        </p>
      </div>

      <StationFilters
        brands={brands}
        selectedBrand={selectedBrand}
        selectedFuel={selectedFuel}
        sortBy={sortBy}
        onBrandChange={setSelectedBrand}
        onFuelChange={setSelectedFuel}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {filteredAndSortedStations.length === 0 ? (
        <div className="empty-message">
          <span className="empty-icon">🔍</span>
          <p>No se encontraron estaciones con los filtros aplicados</p>
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
