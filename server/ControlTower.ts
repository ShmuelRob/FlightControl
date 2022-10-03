import Flight from './models/Flight.model'
import config from './config'

class ControlTower {

    isWorking = false;
    departureTerminals: number[] = [4, 5];
    trackId = 3;

    oldLegs: boolean[] = [
        // departure track: 5/6 -> 7 -> 3
        // landing track: 0 -> 1 -> 2 -> 3 -> 4 -> 5/6

        // if true - leg is available
        true, // - for landing
        true, // - for landing
        true, // - for landing
        true, // - flying track
        true, // - driving track
        true, // - terminal
        true, // - terminal
        true, // - driving track
    ]
    legs: Flight[] | null[] = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ]
    timeInLeg: number[] = [
        /*0*/ 1,
        /*1*/ 1,
        /*2*/ 1,
        /*3*/ 3,
        /*4*/ 2,
        /*5*/ 3,
        /*6*/ 3,
        /*7*/ 2
    ]
    queues: Flight[][] = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]


    // async manage() {
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

    moveFlight(flight: Flight) {
        let prevIndex = flight.currentLeg;
        flight.timeChanged = new Date();
        this.legs[prevIndex] = null;
        if (this.trackId === flight.currentLeg) {
            if (flight.isDeparture) {

            }
        }
        this.legs[flight.currentLeg] = flight;

    }

    theLog() {
        console.log('legs:');
        console.table(this.legs);
        console.log('queues:');
        console.log(this.queues);
    }

    // departureTrack(flight: Flight) {
    //     let availableTerminal = this.departureTerminals.find(t => {
    //         if (this.legs[t])
    //             return t;
    //     });
    //     if (availableTerminal) {
    //         this.legs[availableTerminal] = false;
    //         flight.currentLeg = availableTerminal;
    //         console.log(`flight ${flight.flightID} moved to leg ${flight.currentLeg}`);

    //     } else {
    //         let mostAvailableSlot = this.departureTerminals.map(t => this.queues[t].length).sort()[0];
    //         let index = this.departureTerminals.find(t => this.queues[t].length == mostAvailableSlot) || this.departureTerminals[0];
    //         this.queues[index].push(flight);
    //     }
    // }

    departureTrack(flight: Flight) {
        let availableTerminal = this.departureTerminals.find(t => {
            if (!this.legs[t])
                return t;
        });
        if (availableTerminal) {
            this.legs[availableTerminal] = flight;
            flight.currentLeg = availableTerminal;
            flight.timeChanged = new Date();
            console.log(`flight ${flight.flightID} moved to leg ${flight.currentLeg}`);

        } else {
            let mostAvailableSlot = this.departureTerminals.map(t => this.queues[t].length).sort()[0];
            let index = this.departureTerminals.find(t => this.queues[t].length === mostAvailableSlot) || this.departureTerminals[0];
            this.queues[index].push(flight);
        }
    }

    // landTrack(flight: Flight) {
    //     if (this.legs[0]) {
    //         this.legs[0] = false;
    //         flight.currentLeg = 0;
    //         console.log(`flight ${flight.flightID} moved to leg ${flight.currentLeg}`);

    //     } else {
    //         this.queues[0].push(flight);
    //     }
    // }

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
        // if (!this.isWorking) {
        // this.isWorking = true;
        // this.manage();
        // }
        if (flight.isDeparture) {
            this.departureTrack(flight);
        } else {
            this.landTrack(flight);
        }
    }
}

export default ControlTower
