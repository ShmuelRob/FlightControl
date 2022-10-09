import { FirebaseApp, FirebaseError, FirebaseOptions, initializeApp } from "firebase/app";
import { Database, getDatabase, onValue, ref, set } from "firebase/database";
import Flight from "../models/Flight.model";

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

const writeData = async (flight: Flight, from: number, to: number): Promise<void> => {
    console.log(`save in db ${flight.flightID} from ${from} to ${to}`);

    if (await getFlight(flight.flightID)) {
        return setTracks(flight.flightID, from, to, flight.timeChanged);
    }

    console.log(`flight ${flight.flightID} wasn't in the db, adding it...`);
    let a = await setFlight(flight);
    let b = setTracks(flight.flightID, from, to, flight.timeChanged);
    return b;
}

const setTracks = (flightID: number, from: number, to: number, time: Date): Promise<void> => {
    const trackRef = ref(db, `tracks/${flightID}`);
    if (Number.isNaN(to)) {
        to = Number.MAX_SAFE_INTEGER;
    }
    return new Promise((resolve, reject) => {
        onValue(trackRef, snapshot => {
            // if (!snapshot.hasChildren()) {
            //     console.log(`${flightID} crushed in set -> onvalue -> !hasCildren`);

            //     reject(new FirebaseError('404', "not found"))
            // }
            let data = snapshot.val()
            resolve(set(trackRef, {
                ...data,
                from: from,
                to: to,
                timeChanged: time
            }))
        }, err => {
            reject(err)
        })
    })
}

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
        currentLeg: flight.currentLeg,
        isDeparture: flight.isDeparture,
        timeChanged: flight.timeChanged.toString(),
    })
}

const getFlight = (flightID: number): Promise<Flight> => {
    const flightRef = ref(db, `flights/${flightID}`);
    return new Promise((resolve, reject) => {
        onValue(flightRef, snapshot => {
            if (!snapshot.hasChildren()) {
                reject(new FirebaseError('404', "not found"))
            }
            let date = new Date(snapshot.child('timeChanged').val());
            let flight: Flight = { ...snapshot.val(), timeChanged: date };
            resolve(flight)
        }, err => {
            if (err) {
                reject(err);
                // reject(new FirebaseError('404', "not found"));
            }
        })
    })
}


export { writeData, getFlight }

/* Visit https://firebase.google.com/docs/database/security to learn more about security rules. */ //- from database.rules.json
