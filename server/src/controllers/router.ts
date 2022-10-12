import express, { Request, Response } from 'express'
import Flight from '../models/Flight.model';
import ControlTower from '../businessLogic/ControlTower';
import FlightGetterService from '../services/FlightGetterService';

const router = express.Router();
const baseUrl = '/api';

router.get(`${baseUrl}/flights`, (req: Request, res: Response) => {
    const control = new ControlTower();
    const flights = new FlightGetterService(control);
    res.send(control.legs);
});

// router.get(`${baseUrl}/test`, (req: Request, res: Response) => {
//     res.send(control.legs);
// });

router.get(`${baseUrl}/`, (req: Request, res: Response) => {
    res.send("welcome to home page for API");
});

router.get('*', (req: Request, res: Response) => {
    res.send('default');
});

export default router
