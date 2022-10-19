import io from 'socket.io-client';
import Flight from '../models/Flight.model';
import config from '../../config.json';
import { useDispatch } from 'react-redux';
import { setLegs } from '../redux/trackSlice';

const serverUrl = `http://localhost:${config.SERVER_PORT}`;
const socket = io(serverUrl);

export const getData = () => {
    const dispatch = useDispatch();
    socket.on('data', (data: Flight[]) => {
        dispatch(setLegs(data));
    });
}
