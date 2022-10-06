import Flight from './models/Flight.model'
import config from './config.json'

class ControlTower {

    isWorking: boolean = false;
    legs: Flight[] | null[] = [];
    queues: Flight[][] = []

    constructor() {
        this.legs.length = config.trackDesign.numOfLegs;
        this.queues.length = config.trackDesign.numOfLegs;
        for (let i = 0; i < this.queues.length; i++) {
            this.queues[i] = [];
        }
    }

    //TODO this only for testing, remove when api is ready
    theLog() {
        console.log('legs:');
        console.table(this.legs);
        console.log('queues:');
        console.log(this.queues);
    }

    waitFlightTime(flight: Flight) {
        return new Promise((resolve, reject) => {
            if (flight.currentLeg == -1) {
                resolve(true);
            } else {
                setTimeout(() => {
                    resolve(true);
                }, config.trackDesign.timeInLeg[flight.currentLeg]);
            }
        })
    }
 
    getNextLeg(flight: Flight) {
        switch (flight.currentLeg) {
            case config.trackDesign.wayToTerminal:
                return config.trackDesign.landingTerminal;
            case config.trackDesign.landingTerminal:
                return Number.NaN;
            case config.trackDesign.departureTerminal:
                return config.trackDesign.wayToTrack;
            case config.trackDesign.wayToTrack:
                return config.trackDesign.track;
            case config.trackDesign.track:
                if (flight.isDeparture) {
                    return Number.NaN;
                }
            default:
                return flight.currentLeg + 1;
        }

        // if (flight.currentLeg === config.trackDesign.track && flight.isDeparture) {
        //     return Number.NaN;
        // } else if (flight.currentLeg === config.trackDesign.wayToTerminal) {
        //     return config.trackDesign.landingTerminal;
        // } else if (flight.currentLeg === config.trackDesign.landingTerminal) {
        //     return Number.NaN;
        // } else if (flight.currentLeg === config.trackDesign.departureTerminal) {
        //     return config.trackDesign.wayToTrack;
        // } else if (flight.currentLeg === config.trackDesign.wayToTrack) {
        //     return config.trackDesign.track;
        // } else {
        //     return flight.currentLeg + 1;
        // }
    }

    async moveFlight(flight: Flight, nextLeg: number) {
        let isWaited = await this.waitFlightTime(flight);
        if (!isWaited) {
            return;
        };
        console.log(`${flight.flightID} entered move to ${nextLeg} after async`);
        if (Number.isNaN(nextLeg)) {
            this.legs[flight.currentLeg] = null;
            flight.currentLeg = nextLeg;
        } else {
            if (!this.legs[nextLeg]) {
                if (0 <= flight.currentLeg && flight.currentLeg <= config.trackDesign.numOfLegs - 1) {
                    this.legs[flight.currentLeg] = null
                }
                this.legs[nextLeg] = flight;
                flight.currentLeg = nextLeg
            }
            if (!this.queues[nextLeg].find(f => f.flightID === flight.flightID)) {
                this.queues[nextLeg].push(flight);
            }
        }
    }

    moveFlights() {
        for (let i = 0; i < this.legs.length; i++) {
            if (this.legs[i]) {
                this.moveFlight(this.legs[i]!, this.getNextLeg(this.legs[i]!));
            } else if (this.queues[i].length) {
                let flight = this.queues[i].shift() as Flight;
                if (flight.currentLeg >= 0) {
                    this.legs[flight.currentLeg] = null;
                }
                this.legs[i] = flight;
                flight.currentLeg = i
            }
        }
    }

    async manage() {
        const interval = setInterval(() => {
            if (!this.isWorking) {
                clearInterval(interval);
            }
            if (this.legs.some(l => l) || this.queues.some(q => q.some(f => f))) {
                this.moveFlights()
                this.theLog();
            } else {
                this.isWorking = false;
                return;
            }
        }, 300);
    }

    getFlight(flight: Flight) {
        if (!this.isWorking) {
            this.isWorking = true;
            this.manage();
        }
        if (flight.isDeparture) {
            if (!this.legs[config.trackDesign.departureTerminal]) {
                this.legs[config.trackDesign.departureTerminal] = flight;
                flight.currentLeg = config.trackDesign.departureTerminal;
            } else {
                this.queues[config.trackDesign.departureTerminal].push(flight);
            }
        } else {
            if (!this.legs[config.trackDesign.lendingQueue[0]]) {
                this.legs[config.trackDesign.lendingQueue[0]] = flight;
                flight.currentLeg = config.trackDesign.lendingQueue[0];
            } else {
                this.queues[config.trackDesign.lendingQueue[0]].push(flight);
            }
        }
    }
}

export default ControlTower
