import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Flight from "../models/Flight.model";
import FlightFromSocket from "../models/FlightFromSocket";
import ControlTower from '../businessLogic/ControlTower';

class FlightGetterService {
    control: ControlTower;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    constructor(control: ControlTower) {
        this.control = control;
        
        this.socket = io('http://localhost:6000');
        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('flightCreated', (data: FlightFromSocket) => {
            control.getFlight(this.createFlight(data));
        });

    }

    createFlight(flight: FlightFromSocket): Flight {
        return new Flight(flight.flightID, flight.passengersCount, flight.isCritical, flight.brand, flight.isDeparture);
    }
}
export default FlightGetterService;
