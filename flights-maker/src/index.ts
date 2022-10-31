import { Server } from 'socket.io';
import config from './custom-environment-variables.json';
//import dotenv from 'dotenv';

// dotenv.config({
    // path: `./env.${process.env.NODE_ENV? process.env.NODE_ENV : ''}`,
// });

let idCounter = 0;
const socket = new Server(config.FLIGHT_MAKER_PORT, { cors: { origin: '*', methods: ['GET'] } });
// const socket = new Server(parseInt(process.env.FLIGHT_MAKER_PORT || '7000'), { cors: { origin: '*', methods: ['GET'] } });
// const socket = new Server(parseInt(process.env.FLIGHT_MAKER_PORT!), { cors: { origin: '*', methods: ['GET'] } });


socket.on('connection', () => {
    console.log('connected');
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
