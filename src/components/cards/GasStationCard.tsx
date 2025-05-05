'use client'

import { Gasolinera } from "@/utils/transformData"
import "@/styles/cardList.css"

interface GasStationCardProps {
    gasolinera: Gasolinera
}

export default function GasStationCard({ gasolinera }: GasStationCardProps) {
    return (
        <div className="gas-station-card p-6 border rounded-xl shadow hover:shadow-lg transition transform hover:scale-105 justify-items-start">
            <h2 className="text-xl font-semibold truncate ">
                {gasolinera.nombre}
            </h2>
            <p className="text-sm truncate">{gasolinera.direccion}</p>
            <p className="text-sm">{gasolinera.codigoPostal} - {gasolinera.localidad}</p>
            <p className="text-sm"><strong>Municipio:</strong> {gasolinera.municipio}</p>
            <p className="text-sm"><strong>Horario:</strong> {gasolinera.horario}</p>
            <div className="mt-2 space-y-1 justify-items-start ps-6">
                <p className="text-sm">⛽ <strong>95:</strong> {gasolinera.precios.gasolina95 ?? 'N/D'} €</p>
                <p className="text-sm">⛽ <strong>98:</strong> {gasolinera.precios.gasolina98 ?? 'N/D'} €</p>
                <p className="text-sm">🛢️ <strong>Diésel:</strong> {gasolinera.precios.diesel ?? 'N/D'} €</p>
            </div>
        </div>
    )
}
