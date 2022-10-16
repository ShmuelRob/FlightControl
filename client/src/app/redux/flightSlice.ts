import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Flight from '../models/Flight.model';

export interface FlightState {
  value: Flight | null;
}

const initialState: FlightState = {
  value: null,
};

export const FlightSlice = createSlice({
  name: 'Flight',
  initialState,
  reducers: {
    get: (state, action: PayloadAction<Flight>) => {
        state.value = action.payload;
    },
  },
});

export const { get } = FlightSlice.actions;

export default FlightSlice.reducer;
