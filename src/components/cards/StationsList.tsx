'use client'

import { Gasolinera } from "@/utils/transformData"
import GasStationCard from "./GasStationCard"

interface StationsListProps {
    estaciones: Gasolinera[]
}

export default function StationsList({ estaciones }: StationsListProps) {
    if (estaciones.length === 0) {
        return <p className="text-gray-500">No hay estaciones disponibles.</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estaciones.map((estacion, index) => (
                <GasStationCard 
                    key={estacion.id || index} 
                    gasolinera={estacion} 
                />
            ))}
        </div>
    )
}