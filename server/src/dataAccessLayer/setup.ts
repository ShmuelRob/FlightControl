import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Database, getDatabase, ref, set } from "firebase/database";
import Flight from "../models/Flight.model";
import LegHistory from '../models/LegHistory.type';

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDgdt7I_tzzWMqCvhhod7sTIpxvAGPfv98",
    authDomain: "flight-control-v1.firebaseapp.com",
    projectId: "flight-control-v1",
    storageBucket: "flight-control-v1.appspot.com",
    messagingSenderId: "45581375686",
    appId: "1:45581375686:web:3c840dd9181ae5ff389fc7"
};

const url = 'https://flight-control-v1-default-rtdb.europe-west1.firebasedatabase.app/';

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Database = getDatabase(app, url);


const setFlight = (flight: Flight): Promise<void> => {
    const reference = ref(db, `flights/${flight.flightID}`);
    if (Number.isNaN(flight.currentLeg)) {
        flight.currentLeg = Number.MAX_SAFE_INTEGER;
    }
    return set(reference, {
        flightID: flight.flightID,
        passengersCount: flight.passengersCount,
        isCritical: flight.isCritical,
        brand: flight.brand,
        isDeparture: flight.isDeparture,
    })
}

const setTracks = (flightID: number, legsHistory: LegHistory[]): Promise<void> => {
    const trackRef = ref(db, `tracks/${flightID}`);
    const serializableHistory = legsHistory.map(l => {
        if (Number.isNaN(l.to)) {
            l.to = Number.MAX_SAFE_INTEGER;
        }
        return { ...l, timeChanged: l.timeChanged.toString() };
    })
    return set(trackRef, serializableHistory)
}

const writeData = (flight: Flight): Promise<void[]> => {
    const a = setFlight(flight);
    const b = setTracks(flight.flightID, flight.legsHistory);
    return Promise.all([a, b]);
}

export { writeData }
