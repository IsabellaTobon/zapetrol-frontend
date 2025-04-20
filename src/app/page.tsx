'use client';
import { useState, useEffect, useCallback } from "react";
import StationList from "@/components/StationList";
import { fetchGasPrices } from "@/api/carburantesApi";
import { GasStation } from "@/api/carburantesApi";

export default function Home() {
  const [searchParams, setSearchParams] = useState(""); // Término de búsqueda
  const [stations, setStations] = useState<GasStation[]>([]); // Estaciones encontradas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Error

  // Función para manejar la búsqueda, con debounce
  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setStations([]); // Limpiar resultados si el campo de búsqueda está vacío
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results: GasStation[] = await fetchGasPrices(term);
      setStations(results);
    } catch {
      setError("Hubo un error al obtener las estaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ejecuta la búsqueda cuando cambia el término de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchParams);
    }, 500); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(delayDebounceFn); // Limpia el timeout si el término de búsqueda cambia rápidamente
  }, [searchParams, handleSearch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24 bg-">
      <h1 className="text-3xl mb-4">Bienvenid@ a mi primera PWA!</h1>
      
      {/* Buscador */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-lg mb-2">Buscar por código postal o coordenadas</label>
        <input
          type="text"
          id="search"
          className="p-2 border border-gray-300 rounded"
          placeholder="Ej. 28001 o 40.4168,-3.7038"
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)} // Actualiza el término de búsqueda
        />
      </div>
      
      {/* Mostrar mensaje de carga o error */}
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Mostrar las estaciones encontradas */}
      <StationList stations={stations} />
    </div>
  );
}
