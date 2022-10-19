import LegHistory from "./LegHistory.type";

interface Flight {
    flightID: number;
    passengersCount: number;
    isCritical: boolean;
    brand: string;
    currentLeg: number; // before it came: -1, after it left: number.NAN
    isDeparture: boolean;
    timeChanged: Date;
    legsHistory: LegHistory[];
    isWaited: boolean;
}

export default Flight
