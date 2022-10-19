import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import config from './config.json';
import ControlTower from './logic/ControlTower';
import createFlight from './logic/createFlight';
import FlightFromSocket from './models/FlightFromSocket.type';

const socketServer = new Server(config.PORT, { cors: { origin: '*', methods: ['GET'] } });

const control = new ControlTower(socketServer);

const serverUrl = `http://localhost:${config.SERVER_PORT}`;
const socketClient = io(serverUrl);

socketClient.on('flightCreated', (data: FlightFromSocket) => {
    control.getFlight(createFlight(data));
});
