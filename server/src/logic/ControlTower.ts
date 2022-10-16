import Flight from '../models/Flight.interface'
import config from '../config.json'
import { writeData } from '../dataBase/context';
import { Server } from 'socket.io';

class ControlTower {

    //#region Definitions
    private isWorking: boolean = false;
    legs: Flight[] | null[] = [];
    queues: Flight[][] = []
    socket?: Server;
    //#endregion


    constructor(socket?: Server) {
        this.legs.length = config.trackDesign.numOfLegs;
        this.queues.length = config.trackDesign.numOfLegs;
        for (let i = 0; i < this.queues.length; i++) {
            this.queues[i] = [];
        }
        this.socket = socket ?? undefined;
    }

    waitFlightTime(flight: Flight): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (flight.currentLeg == -1) {
                resolve(true);
            } else {
                const timeLeft = config.trackDesign.timeInLeg[flight.currentLeg] * 1000 -
                    (new Date().getTime() - flight.timeChanged.getTime());
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
        flight.timeChanged = new Date();
        if (Number.isNaN(nextLeg)) {
            this.legs[flight.currentLeg] = null;
            this.documentFlight(flight, nextLeg);
            this.socket?.emit("legs-updated", this.legs);
            flight.currentLeg = nextLeg;
        } else {
            this.legs[nextLeg] = flight;
            if (0 <= flight.currentLeg && flight.currentLeg <= config.trackDesign.numOfLegs - 1) {
                this.legs[flight.currentLeg] = null
            }
            this.documentFlight(flight, nextLeg);
            this.socket?.emit("legs-updated", this.legs);
            flight.currentLeg = nextLeg
            flight.isWaited = false;
            flight.isWaited = await this.waitFlightTime(flight);
        }
    }

    moveFlights() {
        for (let i = 0; i < this.legs.length; i++) {
            if (this.legs[i]) {
                const flight: Flight = this.legs[i]!;
                const nextLeg = this.getNextLeg(flight);
                if (Number.isNaN(nextLeg) && flight.isWaited) {
                    this.moveFlight(flight, nextLeg)
                } else if (flight.isWaited && !this.queues[nextLeg].some(f => f.flightID === flight.flightID)) {
                    this.queues[nextLeg].push(flight);
                }
            } else if (this.queues[i].length) {
                const flight = this.queues[i].shift() as Flight;
                this.moveFlight(flight, i);
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
            } else {
                this.isWorking = false;
                return;
            }
        }, 300);
    }

    getFlight(flight: Flight) {
        if (flight.isDeparture) {
            this.queues[config.trackDesign.departureTerminal].push(flight);
        } else {
            this.queues[config.trackDesign.lendingQueue[0]].push(flight);
        }
        if (!this.isWorking) {
            this.isWorking = true;
            this.manage();
        }
    }
}

export default ControlTower;
