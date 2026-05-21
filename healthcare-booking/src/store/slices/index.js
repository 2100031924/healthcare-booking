import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

export default rootReducer;
