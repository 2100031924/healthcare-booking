import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

// Persist appointments to localStorage on every state change
let prevAppointments = store.getState().booking.appointments;
store.subscribe(() => {
  const currentAppointments = store.getState().booking.appointments;
  if (currentAppointments !== prevAppointments) {
    prevAppointments = currentAppointments;
    try {
      localStorage.setItem('appointments', JSON.stringify(currentAppointments));
    } catch (e) {
      // ignore
    }
  }
});

export default store;
