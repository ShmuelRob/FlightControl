import Flight from './models/Flight.model'
import config from './config.json'
import { writeData } from './dbFirebase/setup';
import { table, log } from 'console';

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
        // console.log('legs:');
        console.table(this.legs);
        // console.log('queues:');
        // console.log(this.queues);
    }

    waitFlightTime(flight: Flight): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (flight.currentLeg == -1) {
                resolve(true);
            } else {
                let timeLeft = config.trackDesign.timeInLeg[flight.currentLeg] * 1000 -
                    (new Date().getTime() - flight.timeChanged.getTime());
                if (timeLeft <= 0) {
                    resolve(true);
                }
                setTimeout(() => {
                    resolve(true);
                }, timeLeft);
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

    moveFlight(flight: Flight, nextLeg: number) {
        flight.timeChanged = new Date();
        if (Number.isNaN(nextLeg)) {
            this.legs[flight.currentLeg] = null;
            // if (!flight.legHistory.some(l => Number.isNaN(l.to))) {
            //     flight.legHistory.push({
            //         from: flight.currentLeg,
            //         to: nextLeg,
            //         timeChanged: flight.timeChanged
            //     })
            // }
            flight.currentLeg = nextLeg;
        } else {
            if (0 <= flight.currentLeg && flight.currentLeg <= config.trackDesign.numOfLegs - 1) {
                this.legs[flight.currentLeg] = null
            }
            // if (!flight.legHistory.some(l => l.to === nextLeg)) {
            //     flight.legHistory.push({
            //         from: flight.currentLeg,
            //         to: nextLeg,
            //         timeChanged: flight.timeChanged
            //     })
            // }
            this.legs[nextLeg] = flight;
            flight.currentLeg = nextLeg
        }
        // log(flight.flightID)
        // table(flight.legHistory);
    }

    moveFlights() {
        for (let i = 0; i < this.legs.length; i++) {
            if (this.legs[i]) {
                let flight = { ...this.legs[i]! };
                let nextLeg = this.getNextLeg(flight);
                if (Number.isNaN(nextLeg) || !this.legs[nextLeg]) {
                    this.waitFlightTime(flight).then(res => {
                        this.moveFlight(flight, nextLeg)
                    });
                } else if (!this.queues[nextLeg].some(f => f.flightID === this.legs[i]!.flightID)) {
                    this.queues[nextLeg].push(this.legs[i]!);
                }
            } else if (this.queues[i].length) {
                let flight = this.queues[i].shift() as Flight;
                let nextLeg = this.getNextLeg(flight);
                this.waitFlightTime(flight).then(res => {
                    this.moveFlight(flight, nextLeg)
                });
                // if (flight.currentLeg >= 0) {
                //     this.legs[flight.currentLeg] = null;
                // }
                // this.legs[i] = flight;
                // flight.currentLeg = i
            }
        }
    }

    async manage() {
        console.log('entered manage');
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
                this.moveFlight(flight, config.trackDesign.departureTerminal)
                // this.legs[config.trackDesign.departureTerminal] = flight;
                // flight.currentLeg = config.trackDesign.departureTerminal;
            } else {
                this.queues[config.trackDesign.departureTerminal].push(flight);
            }
        } else {
            if (!this.legs[config.trackDesign.lendingQueue[0]]) {
                // this.legs[config.trackDesign.lendingQueue[0]] = flight;
                // flight.currentLeg = config.trackDesign.lendingQueue[0];
                this.moveFlight(flight, config.trackDesign.lendingQueue[0])
            } else {
                this.queues[config.trackDesign.lendingQueue[0]].push(flight);
            }
        }
    }
}

export default ControlTower
