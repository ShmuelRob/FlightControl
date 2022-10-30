import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import config from './custom-environment-variables.json';
import ControlTower from './logic/ControlTower';
import createFlight from './logic/createFlight';
import FlightFromSocket from './models/FlightFromSocket.type';

const socketServer = new Server(config.SERVER_PORT, { cors: { origin: '*', methods: ['GET'] } });
const control = new ControlTower(socketServer);

const serverUrl = `http://${process.env.FLIGHT_MAKER_HOST || config.FLIGHT_MAKER_HOST}:${config.FLIGHT_MAKER_PORT}`;
const socketClient = io(serverUrl);

socketClient.on('flightCreated', (data: FlightFromSocket) => {
    control.getFlight(createFlight(data));
});
