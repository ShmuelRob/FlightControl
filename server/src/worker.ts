import { workerData } from 'worker_threads';
import Flight from "./models/Flight.interface";



onmessage = (event) => {
    const legs = workerData.legs as Flight[] | null[];
    // console.log(event.data);
    // postMessage(event.data);
    legs.forEach(leg => {
        if (leg) {
            postMessage(`${leg.flightID} entered worker`);
        }
    })
};

