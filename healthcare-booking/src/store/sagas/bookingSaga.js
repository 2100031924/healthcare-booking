import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  bookAppointmentRequest, bookAppointmentSuccess, bookAppointmentFailure,
  checkInRequest, checkInSuccess, checkInFailure,
  generatePrescriptionRequest, generatePrescriptionSuccess, generatePrescriptionFailure,
  processPaymentRequest, processPaymentSuccess, processPaymentFailure
} from '../slices/bookingSlice';

function* handleBookAppointment(action) {
  try {
    yield put(bookAppointmentSuccess({ ...action.payload, id: Date.now(), status: 'confirmed' }));
  } catch (error) {
    yield put(bookAppointmentFailure(error.message));
  }
}

function* handleCheckIn(action) {
  try {
    yield put(checkInSuccess({ ...action.payload, id: Date.now(), status: 'checked-in' }));
  } catch (error) {
    yield put(checkInFailure(error.message));
  }
}

function* handleGeneratePrescription(action) {
  try {
    yield put(generatePrescriptionSuccess({ ...action.payload, id: Date.now(), status: 'generated' }));
  } catch (error) {
    yield put(generatePrescriptionFailure(error.message));
  }
}

function* handleProcessPayment(action) {
  try {
    yield put(processPaymentSuccess({ ...action.payload, id: Date.now(), status: 'paid', transactionId: 'TXN-' + Date.now() }));
  } catch (error) {
    yield put(processPaymentFailure(error.message));
  }
}

export default function* bookingSaga() {
  yield takeLatest(bookAppointmentRequest.type, handleBookAppointment);
  yield takeLatest(checkInRequest.type, handleCheckIn);
  yield takeLatest(generatePrescriptionRequest.type, handleGeneratePrescription);
  yield takeLatest(processPaymentRequest.type, handleProcessPayment);
}
