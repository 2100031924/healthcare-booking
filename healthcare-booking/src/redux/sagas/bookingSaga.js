import { call, put, takeLatest } from 'redux-saga/effects';
import {
  bookAppointmentRequest,
  bookAppointmentSuccess,
  bookAppointmentFailure,
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  rescheduleAppointmentRequest,
  rescheduleAppointmentSuccess,
  rescheduleAppointmentFailure,
  checkInRequest,
  checkInSuccess,
  checkInFailure,
  generatePrescriptionRequest,
  generatePrescriptionSuccess,
  generatePrescriptionFailure,
  processPaymentRequest,
  processPaymentSuccess,
  processPaymentFailure,
} from '../slices/bookingSlice';

function* handleBookAppointment(action) {
  try {
    const appointment = {
      ...action.payload,
      id: Date.now(),
      status: 'confirmed',
    };
    yield put(bookAppointmentSuccess(appointment));
  } catch (error) {
    yield put(bookAppointmentFailure(error.message));
  }
}

function* handleCancelAppointment(action) {
  try {
    const appointmentId = action.payload;
    yield put(cancelAppointmentSuccess(appointmentId));
  } catch (error) {
    yield put(cancelAppointmentFailure(error.message));
  }
}

function* handleRescheduleAppointment(action) {
  try {
    const { id, newDate, newTimeSlot } = action.payload;
    yield put(
      rescheduleAppointmentSuccess({
        id,
        appointmentDate: newDate,
        timeSlot: newTimeSlot,
        status: 'rescheduled',
      })
    );
  } catch (error) {
    yield put(rescheduleAppointmentFailure(error.message));
  }
}

function* handleCheckIn(action) {
  try {
    const checkIn = {
      ...action.payload,
      id: Date.now(),
      status: 'checked-in',
    };
    yield put(checkInSuccess(checkIn));
  } catch (error) {
    yield put(checkInFailure(error.message));
  }
}

function* handleGeneratePrescription(action) {
  try {
    const prescription = {
      ...action.payload,
      id: Date.now(),
      status: 'generated',
    };
    yield put(generatePrescriptionSuccess(prescription));
  } catch (error) {
    yield put(generatePrescriptionFailure(error.message));
  }
}

function* handleProcessPayment(action) {
  try {
    const payment = {
      ...action.payload,
      id: Date.now(),
      status: 'paid',
      transactionId: 'TXN-' + Date.now(),
    };
    yield put(processPaymentSuccess(payment));
  } catch (error) {
    yield put(processPaymentFailure(error.message));
  }
}

export default function* bookingSaga() {
  yield takeLatest(bookAppointmentRequest.type, handleBookAppointment);
  yield takeLatest(cancelAppointmentRequest.type, handleCancelAppointment);
  yield takeLatest(rescheduleAppointmentRequest.type, handleRescheduleAppointment);
  yield takeLatest(checkInRequest.type, handleCheckIn);
  yield takeLatest(generatePrescriptionRequest.type, handleGeneratePrescription);
  yield takeLatest(processPaymentRequest.type, handleProcessPayment);
}
