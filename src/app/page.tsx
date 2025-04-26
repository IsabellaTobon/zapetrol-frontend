'use client'

import { useState } from "react"
import SearchForm from "@/components/SearchForm"
import StationsList from "@/components/cards/StationsList"
import { Gasolinera, transformarRespuesta } from "@/utils/transformData"
import { fetchGasPrices } from "@/api/carburantesApi"

export default function Home() {
  const [estaciones, setEstaciones] = useState<Gasolinera[]>([])
  const [codigoPostal, setCodigoPostal] = useState('')
  const [loading, setLoading] = useState(false)

  const buscarPorCodigoPostal = async (cp: string) => {
    setCodigoPostal(cp)
    setLoading(true)
    try {
      const datosEstaciones = await fetchGasPrices(cp)

      const estacionesRaw = datosEstaciones.map(estacion => ({
        ...estacion,
        Localidad: estacion.Municipio || "Localidad no disponible", // Agregar propiedad Localidad
        Provincia: "Provincia no disponible", // Agregar propiedad Provincia
      }))

      const transformadas = transformarRespuesta(estacionesRaw)
      setEstaciones(transformadas)
    } catch (error) {
      console.error("Error al buscar gasolineras:", error)
      setEstaciones([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Busca gasolineras por código postal</h1>

      <SearchForm onBuscar={buscarPorCodigoPostal} />

      {loading && (
        <p className="text-gray-500">Buscando datos...</p>
      )}

      {!loading && estaciones.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Resultados en {codigoPostal}
          </h2>
          <StationsList estaciones={estaciones} />
        </>
      ) : (
        !loading &&
        codigoPostal && (
          <p className="text-red-500">No se encontraron resultados para {codigoPostal}</p>
        )
      )}

      {!codigoPostal && (
        <div className="text-gray-500 mt-6">
          <p>🔎 Introduce un código postal para buscar gasolineras cercanas.</p>
        </div>
      )}
    </main>
  )
}