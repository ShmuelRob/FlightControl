import ControlTower from "./ControlTower";
import Flight from "./models/Flight.model";

const control = new ControlTower();

control.getFlight(new Flight(1, 5, false, 'El-Al', true));
control.getFlight(new Flight(2, 5, false, 'El-Al', false));
control.getFlight(new Flight(3, 5, false, 'El-Al', true));
control.getFlight(new Flight(4, 5, false, 'El-Al', true));
control.getFlight(new Flight(5, 5, false, 'El-Al', false));
control.getFlight(new Flight(6, 5, false, 'El-Al', true));
control.getFlight(new Flight(7, 5, false, 'El-Al', false));
control.getFlight(new Flight(8, 5, false, 'El-Al', true));
control.getFlight(new Flight(9, 5, false, 'El-Al', true));
control.getFlight(new Flight(10, 5, false, 'El-Al', true));

control.theLog()
