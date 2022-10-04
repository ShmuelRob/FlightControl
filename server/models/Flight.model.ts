class Flight {
    flightID: number;
    passengersCount: number;
    isCritical: boolean;
    brand: string;
    currentLeg: number; // -1: before it came, number.NAN after it left
    isDeparture: boolean;
    timeChanged: Date

    constructor(flightID: number, passengersCount: number, 
        isCritical: boolean, brand: string, isDeparture: boolean) {
        this.flightID = flightID;
        this.passengersCount = passengersCount;
        this.isCritical = isCritical;
        this.brand = brand;
        this.currentLeg = -1;
        this.isDeparture = isDeparture;
        this.timeChanged = new Date();
    }
}

export default Flight
