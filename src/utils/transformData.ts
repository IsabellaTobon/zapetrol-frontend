export interface GasStation {
    id: string;
    name: string;
    schedule: string;
    address: string;
    postalCode: string;
    town: string;
    municipality: string;
    province: string;
    lat: string;
    lon: string;
    prices: {
        gasoline95?: string;
        gasoline98?: string;
        diesel?: string;
    }
}

export interface GasStationApiResponse {
    "C.P.": string;
    "Dirección": string;
    "Horario": string;
    "Latitud": string;
    "Localidad": string;
    "Longitud (WGS84)": string;
    "Municipio": string;
    "Precio Gasolina 95 E5"?: string;
    "Precio Gasolina 98 E5"?: string;
    "Precio Gasoleo A"?: string;
    "Provincia": string;
    "Rótulo": string;
    "IDEESS"?: string;
}

// CONVIERTE DE ESPAÑOL (API) A INGLÉS
export const transformGasStationResponse = (list: GasStationApiResponse[]): GasStation[] => {
    return list.map((item, index) => ({
        id: item.IDEESS || `temp-id-${index}`,
        name: item["Rótulo"] || 'No name available',
        schedule: item["Horario"] || 'No schedule available',
        address: item["Dirección"] || 'No address available',
        postalCode: item["C.P."] || 'No postal code available',
        town: item["Localidad"] || 'No town available',
        municipality: item["Municipio"] || 'No municipality available',
        province: item["Provincia"] || 'No province available',
        lat: item["Latitud"].replace(',', '.') || '0.0',
        lon: item["Longitud (WGS84)"].replace(',', '.') || '0.0',
        prices: {
            gasoline95: item["Precio Gasolina 95 E5"] || undefined,
            gasoline98: item["Precio Gasolina 98 E5"] || undefined,
            diesel: item["Precio Gasoleo A"] || undefined,
        },
    }))
}