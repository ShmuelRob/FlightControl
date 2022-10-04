import Flight from './models/Flight.model'
import config from './config.json'


class ControlTower {

    isWorking = false;
    legs: Flight[] | null[] = [];
    queues: Flight[][] = []

    constructor() {
        // TODO: make it initialize legs and queues by himself
        this.legs.length = config.trackDesign.numOfLegs;
        this.queues.length = config.trackDesign.numOfLegs;
        for (let i = 0; i < this.queues.length; i++) {
            this.queues[i] = [];
        }
    }

    
    // async manage() { //TODO
    //     console.log('entered interval');

    //     const interval = setInterval(() => {
    //         if (!this.isWorking) {
    //             console.log('out of interval');
    //             clearInterval(interval);
    //         }
    //         if (this.legs.some(l => !l)) {
    //             this.moveFlights();
    //         } else {
    //             this.isWorking = false;
    //             return;
    //         }
    //     }, 300);

    // }

    moveFlight(flight: Flight) { // TODO
        // let prevIndex = flight.currentLeg;
        flight.timeChanged = new Date();
        this.legs[flight.currentLeg] = null;
        if (flight.currentLeg === config.trackDesign.track && flight.isDeparture) {
            flight.currentLeg = Number.NaN;
        } else if (flight.currentLeg === config.trackDesign.wayToTerminal) {
            
        } else if (flight.currentLeg === 0 ) {
            //in terminal, if landing number.nan, if 
        }
        // this.legs[++flight.currentLeg] = flight;
    }

    //TODO this only for testing, remove when api is ready
    theLog() {
        console.log('legs:');
        console.table(this.legs);
        console.log('queues:');
        console.log(this.queues);
    }

    moveToTerminal(flight: Flight) {
        let availableTerminal = config.trackDesign.terminals.find(t => {
            if (!this.legs[t])
                return t;
        });
        if (availableTerminal) {
            this.legs[availableTerminal] = flight;
            flight.currentLeg = availableTerminal;
            flight.timeChanged = new Date();
            console.log(`flight ${flight.flightID} moved to leg ${flight.currentLeg}`);

        } else {
            let mostAvailableSlot = config.trackDesign.terminals.map(t => this.queues[t].length).sort()[0];
            let index = config.trackDesign.terminals.find(t => this.queues[t].length === mostAvailableSlot) || config.trackDesign.terminals[0];
            this.queues[index].push(flight);
        }
    }

    landTrack(flight: Flight) {
        if (!this.legs[0]) {
            this.legs[0] = flight;
            flight.currentLeg = 0;
            flight.timeChanged = new Date();
            console.log(`flight ${flight.flightID} moved to leg ${flight.currentLeg}`);

        } else {
            this.queues[0].push(flight);
        }
    }

    getFlight(flight: Flight) {
        //TODO
        // if (!this.isWorking) {
        // this.isWorking = true;
        // this.manage();
        // }
        if (flight.isDeparture) {
            this.moveToTerminal(flight);
        } else {
            this.landTrack(flight);
        }
    }
}

export default ControlTower
