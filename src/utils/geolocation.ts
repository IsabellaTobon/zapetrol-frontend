import { GasStation } from "./transformData"

// Calcula la distancia entre dos puntos geográficos (en km)
export function getDistanceFromLatLonInKm(
    lat1: number, lon1: number, lat2: number, lon2: number
): number {
    const EarthRadius = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EarthRadius * c;
}

// Devuelve las estaciones ordenadas por cercanía al usuario
export function getNearestStations(
    stations: GasStation[],
    userLat: number,
    userLon: number,
    limit: number = 10
): GasStation[] {
    return stations
        .map(station => ({
            ...station,
            distance: getDistanceFromLatLonInKm(
                userLat,
                userLon,
                parseFloat(station.lat),
                parseFloat(station.lon)
            )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
}