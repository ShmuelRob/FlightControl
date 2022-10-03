import express, { Request, Response } from 'express'
import Flight from './models/Flight.model';
import ControlTower from './ControlTower';

const router = express.Router();
const baseUrl = '/api';
const control = new ControlTower();

router.get(`${baseUrl}/`, (req: Request, res: Response) => {
    res.send("welcome to home page for API");
});

router.get(`${baseUrl}/test`, (req: Request, res: Response) => {
    control.getFlight(new Flight(1, 5, false, 'El-Al', true));
    control.getFlight(new Flight(2, 5, false, 'El-Al', true));
    control.getFlight(new Flight(3, 5, false, 'El-Al', true));
    res.send("welcome to home page for API");
});



router.get('*', (req: Request, res: Response) => {
    res.send('default');
});

export default router
