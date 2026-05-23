import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import bookingReducer from '../slices/bookingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

export default rootReducer;
