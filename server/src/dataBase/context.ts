import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Database, getDatabase, ref, set } from "firebase/database";
import Flight from "../models/Flight.interface";
import LegHistory from '../models/LegHistory.type';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import config from './firebase.json';


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
let isAuth = false;
const auth = getAuth(app);
signInWithEmailAndPassword(auth, config.authProps.mail, config.authProps.password).then(() => {
    isAuth = true;
}).catch((error) => {
    console.log(error);
});


const setFlight = (flight: Flight): Promise<void> => {
    if (isAuth) {
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
    else {
        return Promise.reject('not authorized');
    }
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

const deleteAllData = (): Promise<void> => {
    const refs = [ref(db, 'flights'), ref(db, 'tracks')];
    return Promise.all(refs.map(r => set(r, null))).then(() => { });
}

export { writeData, deleteAllData };
