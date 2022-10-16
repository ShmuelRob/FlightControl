import io from 'socket.io-client';
import Flight from '../models/Flight.model';

const socket = io('http://localhost:5000');

export const getData = () => {
    return new Promise((resolve, reject) => {
        socket.on('data', (data: Flight[]) => {
        resolve(data);
        });
    });
    }