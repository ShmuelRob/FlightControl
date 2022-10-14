import { io } from 'socket.io-client';
import ControlTower from "./logic/ControlTower";
import createFlight from './logic/createFlight';
import Flight from "./models/Flight.interface";
import FlightFromSocket from './models/FlightFromSocket.type';

const control = new ControlTower();


// const createFlight = (flight: FlightFromSocket): Flight => {
//     return new Flight(flight.flightID, flight.passengersCount, flight.isCritical, flight.brand, flight.isDeparture);
// }

// const socket = io('http://localhost:6000');
// socket.on('connect', () => {
//     console.log('connected');
// });

// socket.on('flightCreated', (data: FlightFromSocket) => {
//     control.getFlight(createFlight(data));
// });



control.getFlight(createFlight({ flightID: 1, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 2, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: false }));
control.getFlight(createFlight({ flightID: 3, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 4, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 5, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: false }));
control.getFlight(createFlight({ flightID: 6, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 7, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: false }));
control.getFlight(createFlight({ flightID: 8, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 9, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
control.getFlight(createFlight({ flightID: 10, passengersCount: 0, isCritical: false, brand: 'El-Al', isDeparture: true }));
// control.getFlight(new Flight(11, 0, false, 'El-Al', true));
// control.getFlight(new Flight(12, 0, false, 'El-Al', false));
// control.getFlight(new Flight(13, 0, false, 'El-Al', true));
// control.getFlight(new Flight(14, 0, false, 'El-Al', true));
// control.getFlight(new Flight(15, 0, false, 'El-Al', false));
// control.getFlight(new Flight(16, 0, false, 'El-Al', true));
// control.getFlight(new Flight(17, 0, false, 'El-Al', false));
// control.getFlight(new Flight(18, 0, false, 'El-Al', true));
// control.getFlight(new Flight(19, 0, false, 'El-Al', true));
// control.getFlight(new Flight(20, 0, false, 'El-Al', true));

