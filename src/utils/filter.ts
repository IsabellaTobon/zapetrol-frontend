import { Gasolinera } from "./transformData"

export const filtrarEstaciones = (
    estaciones: Gasolinera[],
    termino: string
): Gasolinera[] => {
    const filtro = termino.toLowerCase().trim()

    // Filtrar por coincidencia exacta en municipio o localidad
    const coincidenciaExacta = estaciones.filter((e) =>
        e.municipio.toLowerCase() === filtro || e.localidad.toLowerCase() === filtro
    )

    if (coincidenciaExacta.length > 0) {
        return coincidenciaExacta
    }

    // Si no hay coincidencia exacta, buscar por inclusión en otros campos
    return estaciones.filter((e) =>
        e.nombre.toLowerCase().includes(filtro) ||
        e.municipio.toLowerCase().includes(filtro) ||
        e.localidad.toLowerCase().includes(filtro) ||
        e.provincia.toLowerCase().includes(filtro) ||
        e.direccion.toLowerCase().includes(filtro) ||
        e.codigoPostal.includes(filtro)
    )
}
