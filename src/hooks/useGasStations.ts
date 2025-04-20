'use client';

import { useEffect, useState } from 'react';
import { fetchGasPrices, GasStation } from '@/api/carburantesApi';
import { calculateDistance } from '@/utils/geolocation';

// OBTENER ESTACIONES DE SERVICIO
export function useGasStations(
    location: string,
    isCoordinates = false,
    fuelType: keyof GasStation | null = null,
    sortByPrice = false,
    userCoords?: { lat: number; lon: number }
) {
    const [stations, setStations] = useState<GasStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        fetchGasPrices(location, isCoordinates)
            .then((data) => {
                let result = [...data];
                
                if (fuelType) {
                    result = result.filter(st => st[fuelType] !== 'No disponible');
                }
                // ORDENAR POR PRECIO SI SE ESPECIFICA UN TIPO DE CARBURANTE
                if (sortByPrice && fuelType) {
                    result.sort((a, b) => {
                        const priceA = parseFloat(a[fuelType]?.replace(',', '.') || '0');
                        const priceB = parseFloat(b[fuelType]?.replace(',', '.') || '0');
                        return priceA - priceB;
                    });
                }
                // FILTRAR ESTACIONES CON PRECIOS DISPONIBLES
                if (userCoords) {
                    result = result
                        .map(station => {
                            const lat = parseFloat(station.Latitud.replace(',', '.'));
                            const lon = parseFloat(station["Longitud (WGS84)"].replace(',', '.'));
                            const distance = calculateDistance(userCoords.lat, userCoords.lon, lat, lon);
                            return { ...station, distance };
                        })
                        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
                }

                if (isMounted) setStations(result);
            })
            .catch(err => isMounted && setError(err.message))
            .finally(() => isMounted && setLoading(false));

        return () => {
            isMounted = false;
        };
    }, [location, isCoordinates, fuelType, sortByPrice, userCoords]);

    return { stations, loading, error };
}
