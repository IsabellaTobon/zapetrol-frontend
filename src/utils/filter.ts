import { GasStation } from "./transformData"

const normalize = (text: string = "") =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export const stationsFilter = (
    stations: GasStation[],
    searchTerm: string
): GasStation[] => {
    const filter = normalize(searchTerm)

    // FILTRAR POR COINCIDENCIA EXACTA EN MUNICIPIO O CIUDAD
    const exactMatches = stations.filter((e) =>
        e.municipality.toLowerCase() === filter || e.town.toLowerCase() === filter
    )

    if (exactMatches.length > 0) {
        return exactMatches
    }

    // SI NO HAY COINCIDENCIA EXACTA, BUSCAR POR INCLUSIÓN EN OTROS CAMPOS
    return stations.filter((e) =>
        e.name.toLowerCase().includes(filter) ||
        e.municipality.toLowerCase().includes(filter) ||
        e.town.toLowerCase().includes(filter) ||
        e.province.toLowerCase().includes(filter) ||
        e.address.toLowerCase().includes(filter) ||
        e.postalCode.includes(filter)
    )
}
