import ControlTower from "./ControlTower";
import Flight from "./models/Flight.model";

const control = new ControlTower();

control.getFlight(new Flight(1, 0, false, 'El-Al', true));
control.getFlight(new Flight(2, 0, false, 'El-Al', false));
control.getFlight(new Flight(3, 0, false, 'El-Al', true));
control.getFlight(new Flight(4, 0, false, 'El-Al', true));
control.getFlight(new Flight(5, 0, false, 'El-Al', false));
control.getFlight(new Flight(6, 0, false, 'El-Al', true));
control.getFlight(new Flight(7, 0, false, 'El-Al', false));
control.getFlight(new Flight(8, 0, false, 'El-Al', true));
control.getFlight(new Flight(9, 0, false, 'El-Al', true));
control.getFlight(new Flight(10,0, false, 'El-Al', true));
control.getFlight(new Flight(11, 0, false, 'El-Al', true));
control.getFlight(new Flight(12, 0, false, 'El-Al', false));
control.getFlight(new Flight(13, 0, false, 'El-Al', true));
control.getFlight(new Flight(14, 0, false, 'El-Al', true));
control.getFlight(new Flight(15, 0, false, 'El-Al', false));
control.getFlight(new Flight(16, 0, false, 'El-Al', true));
control.getFlight(new Flight(17, 0, false, 'El-Al', false));
control.getFlight(new Flight(18, 0, false, 'El-Al', true));
control.getFlight(new Flight(19, 0, false, 'El-Al', true));
control.getFlight(new Flight(20, 0, false, 'El-Al', true));



control.theLog();
