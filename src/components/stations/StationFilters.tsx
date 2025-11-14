import { useState } from 'react';
import './StationFilters.css';

export type FuelType = 'all' | 'Gasoline95' | 'Gasoline98' | 'Diesel' | 'DieselPremium';
export type SortBy = 'none' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface StationFiltersProps {
  brands: string[];
  selectedBrand: string;
  selectedFuel: FuelType;
  sortBy: SortBy;
  onBrandChange: (brand: string) => void;
  onFuelChange: (fuel: FuelType) => void;
  onSortChange: (sort: SortBy) => void;
  onReset: () => void;
}

const FUEL_OPTIONS = [
  { value: 'all', label: 'Todos los combustibles', icon: '⛽' },
  { value: 'Gasoline95', label: 'Gasolina 95', icon: '⛽' },
  { value: 'Gasoline98', label: 'Gasolina 98', icon: '⛽' },
  { value: 'Diesel', label: 'Diesel', icon: '🚛' },
  { value: 'DieselPremium', label: 'Diesel Premium', icon: '🚛' },
] as const;

const SORT_OPTIONS = [
  { value: 'none', label: 'Sin ordenar' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
] as const;

export default function StationFilters({
  brands,
  selectedBrand,
  selectedFuel,
  sortBy,
  onBrandChange,
  onFuelChange,
  onSortChange,
  onReset,
}: StationFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedBrand !== 'all' || selectedFuel !== 'all' || sortBy !== 'none';

  return (
    <div className="station-filters">
      <div className="filters-header">
        <button
          className="filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="filter-icon">🔍</span>
          <span>Filtros y ordenación</span>
          <span className={`toggle-arrow ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        {hasActiveFilters && (
          <button className="reset-button" onClick={onReset}>
            <span>✕</span> Limpiar filtros
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="filter-group">
            <label htmlFor="brand-filter" className="filter-label">
              <span className="label-icon">🏢</span>
              Marca
            </label>
            <select
              id="brand-filter"
              className="filter-select"
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
            >
              <option value="all">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="fuel-filter" className="filter-label">
              <span className="label-icon">⛽</span>
              Tipo de combustible
            </label>
            <select
              id="fuel-filter"
              className="filter-select"
              value={selectedFuel}
              onChange={(e) => onFuelChange(e.target.value as FuelType)}
            >
              {FUEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter" className="filter-label">
              <span className="label-icon">↕️</span>
              Ordenar por
            </label>
            <select
              id="sort-filter"
              className="filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
