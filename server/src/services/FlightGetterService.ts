import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Flight from "../models/Flight.interface";
import FlightFromSocket from "../models/FlightFromSocket.type";
import ControlTower from '../logic/ControlTower';

class FlightGetterService {
    control: ControlTower;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    constructor(control: ControlTower, url: string) {
        this.control = control;

        // this.socket = io('http://localhost:6000');
        this.socket = io(`${url ?? 'http://localhost:6000'}`);
        this.socket.on('connect', () => {
            console.log('connected');
        });

        this.socket.on('flightCreated', (data: FlightFromSocket) => {
            control.getFlight(this.createFlight(data));
        });

    }

    createFlight(flight: FlightFromSocket): Flight {
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
        }
    }
}
export default FlightGetterService;
