const apiCarburantes = {
    estacionesPorCodigoPostal: (codigoPostal: string) =>
        `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres?codigoPostal=${codigoPostal}`,

    estacionesPorCoordenadas: (lat: string, lon: string) =>
        `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres?lat=${lat}&lon=${lon}`,
}

export interface GasStation {
    Rótulo: string
    Dirección: string
    "C.P.": string
    Municipio: string
    Horario: string
    "Precio Gasolina 95 E5": string
    "Precio Gasolina 98 E5": string
    "Precio Gasóleo A": string
    Latitud: string
    "Longitud (WGS84)": string
}

export async function fetchGasPrices(location: string, isCoordinates: boolean = false): Promise<GasStation[]> {
    try {
        let url: string;

        // SI ES POR COORDENADAS, SEPARAMOS LAT Y LON
        if (isCoordinates) {
            const [lat, lon] = location.split(",");
            url = apiCarburantes.estacionesPorCoordenadas(lat.trim(), lon.trim());
        } else {
            url = apiCarburantes.estacionesPorCodigoPostal(location.trim());
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudieron obtener los datos`);
        }

        const data = await response.json();

        if (!data.ListaEESSPrecio) {
            throw new Error("Datos no disponibles");
        }

        // FILTRAMOS LAS ESTACIONES POR MUNICIPIO O CÓDIGO POSTAL
        const filteredStations = data.ListaEESSPrecio.filter((station: { [key: string]: string }) => {
            const municipio = station["Municipio"] || "";
            const codigoPostal = station["C.P."] || "";

            // FILTRAR POR MUNICIPIO O CÓDIGO POSTAL
            return municipio.toLowerCase().includes(location.toLowerCase()) ||
                codigoPostal.includes(location.trim());
        });

        // MAPEAMOS LOS RESULTADOS A LA INTERFAZ GASSTATION
        return filteredStations.map((station: { [key: string]: string }): GasStation => ({
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
        console.error("Error obteniendo datos de gasolina:", error);
        return [];
    }
}
