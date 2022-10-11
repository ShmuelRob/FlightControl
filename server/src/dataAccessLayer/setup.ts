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
        // currentLeg: flight.currentLeg,
        isDeparture: flight.isDeparture,
        // timeChanged: flight.timeChanged.toString(),
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
    console.log(`save in db ${flight.flightID}`);
    const a = setFlight(flight);
    const b = setTracks(flight.flightID, flight.legsHistory);
    return Promise.all([a, b]);
}

// const getFlight = (flightID: number): Promise<Flight> => {
//     const flightRef = ref(db, `flights/${flightID}`);
//     return new Promise((resolve, reject) => {
//         onValue(flightRef, snapshot => {
//             if (!snapshot.hasChildren()) {
//                 reject(new FirebaseError('404', "not found"))
//             }
//             let date = new Date(snapshot.child('timeChanged').val());
//             let flight: Flight = { ...snapshot.val(), timeChanged: date };
//             resolve(flight)
//         }, err => {
//             if (err) {
//                 reject(err);
//                 // reject(new FirebaseError('404', "not found"));
//             }
//         })
//     })
// }


export { writeData/*, getFlight*/ }

/* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */ //- from database.rules.json
