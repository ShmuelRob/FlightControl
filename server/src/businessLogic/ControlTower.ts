import Flight from '../models/Flight.model'
import config from '../config.json'
import fs from 'fs'
import { Worker, workerData } from 'worker_threads';
import { writeData } from '../dataAccessLayer/setup';

class ControlTower {

    //#region Definitions
    private isWorking: boolean = false;
    legs: Flight[] | null[] = [];
    queues: Flight[][] = []
    // workers: Worker[] = [];

    //#endregion


    constructor() {
        this.legs.length = config.trackDesign.numOfLegs;
        this.queues.length = config.trackDesign.numOfLegs;
        // this.queues.fill([]);
        // console.log(this.queues);

        for (let i = 0; i < this.queues.length; i++) {
            this.queues[i] = [];
        }


        // this.workers.length = config.trackDesign.numOfLegs;
        // this.workers.fill(new Worker('./worker.ts', { workerData: { /*legs: this.legs,*/ type: module } }));
    }

    //TODO this only for testing, remove when api is ready
    theLog() {
        // console.log('legs:');
        console.table(this.legs);
        // console.log('queues:');
        console.log(this.queues);
    }

    waitFlightTime2(flight: Flight): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (flight.currentLeg == -1) {
                resolve(true);
            } else {
                const timeLeft = config.trackDesign.timeInLeg[flight.currentLeg] * 1000 -
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

    waitFlightTime(flight: Flight): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (flight.currentLeg == -1) {
                resolve(true);
            } else {
                const timeLeft = config.trackDesign.timeInLeg[flight.currentLeg] * 1000 -
                    (new Date().getTime() - flight.timeChanged.getTime());
                // if (timeLeft <= 0) {
                //     resolve(true);
                // }
                setTimeout(() => {
                    resolve(true);
                }, 2000); //TODO change to timeLeft
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

    documentFlight(flight: Flight, nextLeg: number) {
        if (!flight.legsHistory.some(l => Number.isNaN(l.to)) && !flight.legsHistory.some(l => l.from === flight.currentLeg)) {
            flight.legsHistory.push({
                from: flight.currentLeg,
                to: nextLeg,
                timeChanged: flight.timeChanged
            })
        }
        if (Number.isNaN(nextLeg)) {
            writeData(flight);
        }
    }

    async moveFlight(flight: Flight, nextLeg: number) {
        // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to ${nextLeg}`);
        flight.timeChanged = new Date();
        if (Number.isNaN(nextLeg)) {
            this.legs[flight.currentLeg] = null;
            this.documentFlight(flight, nextLeg);
            flight.currentLeg = nextLeg;
        } else {
            this.legs[nextLeg] = flight;
            if (0 <= flight.currentLeg && flight.currentLeg <= config.trackDesign.numOfLegs - 1) {
                this.legs[flight.currentLeg] = null
            }
            this.documentFlight(flight, nextLeg);
            flight.currentLeg = nextLeg
            flight.isWaited = false;
            flight.isWaited = await this.waitFlightTime(flight);
        }
    }

    moveFlights() {
        // console.table(this.legs);
        for (let i = 0; i < this.legs.length; i++) {
            // console.log(`leg ${i} is ${this.legs[i] ? 'busy' : 'free'}`);

            if (this.legs[i]) {
                // const flight: Flight = { ...this.legs[i]! };
                const flight: Flight = this.legs[i]!;
                const nextLeg = this.getNextLeg(flight);
                if (Number.isNaN(nextLeg) && flight.isWaited /*|| !this.legs[nextLeg]*/) {
                    // this.waitFlightTime(flight).then(res => {
                    // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to nan `);
                    this.moveFlight(flight, nextLeg)
                    // });
                } else if (flight.isWaited && !this.queues[nextLeg].some(f => f.flightID === flight.flightID)) {
                    this.queues[nextLeg].push(flight);
                    // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to queue for ${nextLeg} `);
                }
            } else if (this.queues[i].length) {
                const flight = this.queues[i].shift() as Flight;
                // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to  ${i} from the queue `);
                // this.waitFlightTime(flight).then(res => {
                // this.queues[i].shift();
                this.moveFlight(flight, i);
                // })
            }
        }
    }

    async manage() {
        const interval = setInterval(() => {
            if (!this.isWorking) {
                clearInterval(interval);
            }
            if (this.legs.some(l => l) || this.queues.some(q => q.length)) {
                this.moveFlights()
                this.theLog();
            } else {
                this.isWorking = false;
                return;
            }
        }, 300);
    }

    getFlight(flight: Flight) {
        if (flight.isDeparture) {
            // if (!this.legs[config.trackDesign.departureTerminal]) {
            // this.moveFlight(flight, config.trackDesign.departureTerminal)
            // } else {

            this.queues[config.trackDesign.departureTerminal].push(flight);
            // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to queue for ${config.trackDesign.departureTerminal} `);
            // console.log(this.queues[config.trackDesign.departureTerminal]);


            // }
        } else {
            // if (!this.legs[config.trackDesign.lendingQueue[0]]) {
            // this.moveFlight(flight, config.trackDesign.lendingQueue[0])
            // } else {
            this.queues[config.trackDesign.lendingQueue[0]].push(flight);
            // console.log(`flight ${flight.flightID} moved from ${flight.currentLeg} to queue for ${config.trackDesign.lendingQueue[0]} `);
            // console.log(this.queues[config.trackDesign.lendingQueue[0]]);
            // }
        }
        if (!this.isWorking) {
            this.isWorking = true;
            this.manage();
        }
    }
}

export default ControlTower;
