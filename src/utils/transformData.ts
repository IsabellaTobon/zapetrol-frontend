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
interface GasolineraRaw {
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
        id: item.IDEESS || `temp-id-${index}`, // IDEESS o genera un id temporal para evitar duplicados/errores
        nombre: item["Rótulo"],
        horario: item["Horario"],
        direccion: item["Dirección"],
        codigoPostal: item["C.P."],
        localidad: item["Localidad"],
        municipio: item["Municipio"],
        provincia: item["Provincia"],
        lat: item["Latitud"].replace(',', '.'),
        lon: item["Longitud (WGS84)"].replace(',', '.'),
        precios: {
            gasolina95: item["Precio Gasolina 95 E5"] || undefined,
            gasolina98: item["Precio Gasolina 98 E5"] || undefined,
            diesel: item["Precio Gasoleo A"] || undefined,
        },
    }))
}