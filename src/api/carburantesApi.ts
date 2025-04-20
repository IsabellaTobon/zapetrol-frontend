
// API URL PARA OBTENER LOS PRECIOS DE LOS CARBURANTES
const carburantesApi = {
    // Endpoint para obtener datos por código postal
    porCodigoPostal: (codigoPostal: string) =>
        `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres?codigoPostal=${codigoPostal}`,

    // Endpoint para obtener datos por coordenadas GPS
    porCoordenadas: (lat: string, lon: string) =>
        `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres?lat=${lat}&lon=${lon}`,
}

// INTERFAZ PARA LAS ESTACIONES DE SERVICIO
export interface GasStation {
    Rótulo: string;
    Dirección: string;
    "C.P.": string;
    Municipio: string;
    Horario: string;
    "Precio Gasolina 95 E5": string;
    "Precio Gasolina 98 E5": string;
    "Precio Gasóleo A": string;
    Latitud: string;
    "Longitud (WGS84)": string;
    // "Precio Biodiesel": string;
}

// FUNCIÓN PARA OBTENER LOS PRECIOS DE LOS CARBURANTES
export async function fetchGasPrices(location: string, isCoordinates: boolean = false): Promise<GasStation[]> {
    try {
        const url = isCoordinates
            ? carburantesApi.porCoordenadas(...(location.split(',').map(s => s.trim()) as [string, string]))
            : carburantesApi.porCodigoPostal(location.trim());

        const response = await fetch(url)
        const data = await response.json()

        if (!data.ListaEESSPrecio) throw new Error("Sin datos")

        // Filtramos las estaciones de gasolina según la ubicación
        return data.ListaEESSPrecio.map((station: Record<string, string>): GasStation => ({
            Rótulo: station["Rótulo"] || "",
            Dirección: station["Dirección"] || "",
            "C.P.": station["C.P."] || "",
            Municipio: station["Municipio"] || "",
            Horario: station["Horario"] || "Horario no disponible",
            "Precio Gasolina 95 E5": station["Precio Gasolina 95 E5"] || "No disponible",
            "Precio Gasolina 98 E5": station["Precio Gasolina 98 E5"] || "No disponible",
            "Precio Gasóleo A": station["Precio Gasóleo A"] || "No disponible",
            Latitud: station["Latitud"] || "",
            "Longitud (WGS84)": station["Longitud (WGS84)"] || "",
        }));
    } catch (error) {
        console.error("Error API:", error);
        return [];
    }
}
