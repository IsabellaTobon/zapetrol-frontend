'use client';

import { GasStation } from "@/api/carburantesApi";
import GasStationCard from "./cards/GasStationCard";

const StationList = ({ stations }: { stations: GasStation[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stations.map((station) => (
                <GasStationCard key={station.Rótulo} station={station} />
            ))}
        </div>
    );
};

export default StationList;
