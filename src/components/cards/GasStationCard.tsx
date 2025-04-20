'use client'

import { GasStation } from "@/api/carburantesApi";
import { MapPin } from "lucide-react";
import Image from "next/image";

interface GasStationCardProps {
    station: GasStation
}

const GasStationCard = ({ station }: GasStationCardProps) => {
    const {
        "Rótulo": name,
        "Dirección": address,
        "Municipio": city,
        "C.P.": postalCode,
        "Precio Gasolina 95 E5": price95,
        "Precio Gasolina 98 E5": price98,
        "Precio Gasóleo A": priceDiesel,
        "Horario": schedule,
        "Latitud": latitude,
        "Longitud (WGS84)": longitude,
    } = station;

    const formattedLat = latitude.replace(",", ".");
    const formattedLon = longitude.replace(",", ".");

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.02] overflow-hidden">
            <Image
                src="/gasolinera.jpg"
                alt="Gasolinera"
                width={500}
                height={300}
                className="w-full h-48 object-cover"
            />

            <div className="p-5">
                <h3 className="text-xl font-semibold text-[var(--color-primary)]">{name}</h3>
                <p className="text-base text-[var(--color-foreground)] mt-1">{address}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{city}, {postalCode}</p>

                {/* Horario */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    <strong>Horario:</strong> {schedule || "No disponible"}
                </p>

                {/* Precios */}
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Gasolina 95:</span>
                        <span className="font-semibold text-[var(--color-accent)]">{price95 || "No disponible"} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Gasolina 98:</span>
                        <span className="font-semibold text-[var(--color-accent)]">{price98 || "No disponible"} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Gasóleo A:</span>
                        <span className="font-semibold text-[var(--color-accent)]">{priceDiesel || "No disponible"} €</span>
                    </div>
                </div>

                {/* Coordenadas y mapa */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{formattedLat}, {formattedLon}</span>
                    </div>
                    <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${formattedLat},${formattedLon}`, "_blank")}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Ver en mapa
                    </button>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {price95 && (
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs px-3 py-1 rounded-full">
                            Gasolina 95
                        </span>
                    )}
                    {price98 && (
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 text-xs px-3 py-1 rounded-full">
                            Gasolina 98
                        </span>
                    )}
                    {priceDiesel && (
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 text-xs px-3 py-1 rounded-full">
                            Diésel
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GasStationCard