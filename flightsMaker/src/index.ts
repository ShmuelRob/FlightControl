import { Server } from 'socket.io';
import config from './config.json';

let idCounter = 0;
const socket = new Server(config.PORT, { cors: { origin: '*', methods: ['GET'] } });

socket.on('connection', () => {
    createFlights();
});

const setBool = (): boolean => {
    return Math.floor(Math.random() * 100) % 2 === 0;
}

const createFlight = () => {
    const flight = {
        flightID: ++idCounter,
        passengersCount: Math.floor(Math.random() * 1000),
        isCritical: setBool(),
        brand: `flight ${idCounter}`,
        isDeparture: setBool(),
    }
    socket.emit('flightCreated', flight);
}

const createFlights = () => {
    let timer = 1000;
    setInterval(() => {
        createFlight();
        timer = Math.random() * 10000;
    }, timer);
}
