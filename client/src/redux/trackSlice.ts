import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Flight from '../app/models/Flight.model';

export interface TrackState {
    legs: (Flight | null)[];
}

const initialState: TrackState = {
    legs: [
        { flightID: 1, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
        null,
        { flightID: 2, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
        null,
        { flightID: 3, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
        null,
        null,
        { flightID: 4, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
    ],
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setLegs: (state, action: PayloadAction<Flight[]>) => {
            state.legs = action.payload;
            console.log('setLegs', state.legs);
        },
    },
});

export const { setLegs } = trackSlice.actions;

export default trackSlice.reducer;
