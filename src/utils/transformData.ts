export interface Gasolinera {
    id: string;
    nombre: string;
    horario: string;
    direccion: string;
    codigoPostal: string;
    localidad: string;
    municipio: string;
    provincia: string;
    lat: string;
    lon: string;
    precios: {
        gasolina95?: string;
        gasolina98?: string;
        diesel?: string;
    }
}

// DEFINE LA INTERFAZ PARA LOS DATOS DE ENTRADA 
export interface GasolineraRaw {
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

// ACTUALIZA EL TIPO DEL PARÁMETRO 'LISTA' A 'GasolineraRaw[]'
export const transformarRespuesta = (lista: GasolineraRaw[]): Gasolinera[] => {
    return lista.map((item, index) => ({
        id: item.IDEESS || `temp-id-${index}`, // Genera un ID temporal si no está presente
        nombre: item["Rótulo"] || 'Nombre no disponible',
        horario: item["Horario"] || 'Horario no disponible',
        direccion: item["Dirección"] || 'Dirección no disponible',
        codigoPostal: item["C.P."] || 'Código Postal no disponible',
        localidad: item["Localidad"] || 'Localidad no disponible', // Asegúrate de que esté presente
        municipio: item["Municipio"] || 'Municipio no disponible', // Asegúrate de que esté presente
        provincia: item["Provincia"] || 'Provincia no disponible', // Asegúrate de que esté presente
        lat: item["Latitud"].replace(',', '.') || '0.0', // Asegúrate de que la latitud esté bien definida
        lon: item["Longitud (WGS84)"].replace(',', '.') || '0.0', // Asegúrate de que la longitud esté bien definida
        precios: {
            gasolina95: item["Precio Gasolina 95 E5"] || undefined,
            gasolina98: item["Precio Gasolina 98 E5"] || undefined,
            diesel: item["Precio Gasoleo A"] || undefined,
        },
    }))
}