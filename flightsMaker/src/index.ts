import { Server } from 'socket.io';

let idCounter = 0;
const io = new Server(6000, { cors: { origin: '*', methods: ['GET'] } });
io.on('connection', (socket) => {
    createFlights();
});

const setBool = (): boolean => {
    return Math.floor(Math.random() * 100) % 2 === 0;
}

const createFlight = () => {
    const flight = {
        flightID: idCounter++,
        passengersCount: Math.floor(Math.random() * 1000),
        isCritical: setBool(),
        brand: ` flight ${idCounter}`,
        isDeparture: setBool(),
    }
    io.emit('flightCreated', flight);
}

const createFlights = () => {
    let timer = 1000;
    setInterval(() => {
        createFlight();
        timer = Math.random() * 10000;
    }, timer);
}
