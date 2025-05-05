'use client'

import { Gasolinera } from "@/utils/transformData"
import GasStationCard from "./GasStationCard"

interface StationsListProps {
    estaciones: Gasolinera[]
}

export default function StationsList({ estaciones }: StationsListProps) {
    if (estaciones.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">No hay estaciones disponibles.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {estaciones.map((estacion, index) => (
                <GasStationCard 
                    key={estacion.id || index} 
                    gasolinera={estacion} 
                />
            ))}
        </div>
    )
}