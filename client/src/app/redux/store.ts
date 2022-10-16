import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import flightReducer from './flightSlice';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    flight: flightReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
