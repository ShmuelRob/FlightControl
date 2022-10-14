import Flight from "../models/Flight.interface";
import FlightFromSocket from "../models/FlightFromSocket.type";

const createFlight = (flight: FlightFromSocket): Flight => {
    return {
        flightID: flight.flightID,
        passengersCount: flight.passengersCount,
        isCritical: flight.isCritical,
        brand: flight.brand,
        isDeparture: flight.isDeparture,
        currentLeg: -1,
        timeChanged: new Date(),
        legsHistory: [],
        isWaited: false
    };
}

export default createFlight;
