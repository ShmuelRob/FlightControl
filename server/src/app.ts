import { Socket, Server } from 'socket.io';

const socket = new Server(3000, { cors: { origin: '*' } });

socket.on('connection', (client: Socket) => {
    console.log(`client: ${client.id} connected`);
});

socket.emit('message', 'hello world');



// const socketServer = new Server(config.PORT, { cors: { origin: '*' } });

// socketServer.on('connection', () => {
//     console.log('new connection');
// });

// socketServer.on('disconnect', () => {
//     console.log('user disconnected');
// });

// const control = new ControlTower(socketServer.emit)


// const socketClient = io('http://localhost:6000');
// socketClient.on('connect', () => {
//     console.log('connected');
// });

// socketClient.on('flightCreated', (data: FlightFromSocket) => {
//     control.getFlight(createFlight(data));
// });

