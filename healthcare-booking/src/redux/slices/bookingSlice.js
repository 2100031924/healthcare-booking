import { createSlice } from '@reduxjs/toolkit';

const initialAppointments = [
  { id: 1, patientName: 'Kiran Kumar', doctorName: 'Dr. Venkat Reddy', timeSlot: '10:00 AM', appointmentDate: '2026-05-20', status: 'confirmed', type: 'video', consultationMode: 'Online' },
  { id: 2, patientName: 'Anusha Chowdhary', doctorName: 'Dr. Srinivas Rao', timeSlot: '11:30 AM', appointmentDate: '2026-05-20', status: 'pending', type: 'clinic', consultationMode: 'Offline' },
  { id: 3, patientName: 'Vishnu Vardhan', doctorName: 'Dr. Harika Naidu', timeSlot: '14:00', appointmentDate: '2026-05-21', status: 'confirmed', type: 'video', consultationMode: 'Online' },
  { id: 4, patientName: 'Swathi Naidu', doctorName: 'Dr. Venkat Reddy', timeSlot: '15:30', appointmentDate: '2026-05-21', status: 'cancelled', type: 'clinic', consultationMode: 'Offline' },
];

const initialState = {
  appointments: initialAppointments,
  doctors: [],
  checkIns: [],
  prescriptions: [],
  invoices: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    fetchAppointmentsRequest: (state) => { state.loading = true; },
    fetchAppointmentsSuccess: (state, action) => { state.loading = false; state.appointments = action.payload; },
    fetchAppointmentsFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    bookAppointmentRequest: (state, action) => { state.loading = true; },
    bookAppointmentSuccess: (state, action) => { state.loading = false; state.appointments.push(action.payload); },
    bookAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    cancelAppointmentRequest: (state, action) => { state.loading = true; },
    cancelAppointmentSuccess: (state, action) => {
      state.loading = false;
      const apt = state.appointments.find(a => a.id === action.payload);
      if (apt) apt.status = 'cancelled';
    },
    cancelAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    rescheduleAppointmentRequest: (state, action) => { state.loading = true; },
    rescheduleAppointmentSuccess: (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = { ...state.appointments[index], ...action.payload };
      }
    },
    rescheduleAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    checkInRequest: (state, action) => { state.loading = true; },
    checkInSuccess: (state, action) => { state.loading = false; state.checkIns.push(action.payload); },
    checkInFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    generatePrescriptionRequest: (state, action) => { state.loading = true; },
    generatePrescriptionSuccess: (state, action) => { state.loading = false; state.prescriptions.push(action.payload); },
    generatePrescriptionFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    processPaymentRequest: (state, action) => { state.loading = true; },
    processPaymentSuccess: (state, action) => { state.loading = false; state.invoices.push(action.payload); },
    processPaymentFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    clearBookingError: (state) => { state.error = null; },
    setBookingLoading: (state, action) => { state.loading = action.payload; },
    resetBooking: (state) => {
      state.doctors = [];
      state.checkIns = [];
      state.prescriptions = [];
      state.invoices = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
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
  clearBookingError,
  setBookingLoading,
  resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
