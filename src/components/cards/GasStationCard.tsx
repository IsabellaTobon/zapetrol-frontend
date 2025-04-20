'use client'

import { Gasolinera } from "@/utils/transformData"

interface GasStationCardProps {
    gasolinera: Gasolinera
}

export default function GasStationCard({ gasolinera }: GasStationCardProps) {
    return (
        <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                {gasolinera.nombre}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{gasolinera.direccion}</p>
            <p className="text-sm">{gasolinera.codigoPostal} - {gasolinera.localidad}</p>
            <p className="text-sm"><strong>Municipio:</strong> {gasolinera.municipio}</p>
            <p className="text-sm"><strong>Horario:</strong> {gasolinera.horario}</p>
            <div className="mt-2 space-y-1">
                <p>⛽ <strong>95:</strong> {gasolinera.precios.gasolina95 ?? 'N/D'} €</p>
                <p>⛽ <strong>98:</strong> {gasolinera.precios.gasolina98 ?? 'N/D'} €</p>
                <p>🛢️ <strong>Diésel:</strong> {gasolinera.precios.diesel ?? 'N/D'} €</p>
            </div>
        </div>
    )
}
