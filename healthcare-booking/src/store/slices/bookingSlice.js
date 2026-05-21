import { createSlice } from '@reduxjs/toolkit';

const initialAppointments = [
  { id: 1, patientName: 'Kiran Kumar', doctorName: 'Dr. Venkat Reddy', timeSlot: '10:00 AM', appointmentDate: '2026-05-20', status: 'confirmed', type: 'video', consultationMode: 'Online' },
  { id: 2, patientName: 'Anusha Chowdhary', doctorName: 'Dr. Srinivas Rao', timeSlot: '11:30 AM', appointmentDate: '2026-05-20', status: 'pending', type: 'clinic', consultationMode: 'Offline' },
  { id: 3, patientName: 'Vishnu Vardhan', doctorName: 'Dr. Harika Naidu', timeSlot: '14:00', appointmentDate: '2026-05-21', status: 'confirmed', type: 'video', consultationMode: 'Online' },
  { id: 4, patientName: 'Swathi Naidu', doctorName: 'Dr. Venkat Reddy', timeSlot: '15:30', appointmentDate: '2026-05-21', status: 'cancelled', type: 'clinic', consultationMode: 'Offline' },
];

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    appointments: initialAppointments,
    doctors: [],
    checkIns: [],
    prescriptions: [],
    invoices: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchAppointmentsRequest: (state) => {
      state.loading = true;
    },
    fetchAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    },
    fetchAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    bookAppointmentRequest: (state) => {
      state.loading = true;
    },
    bookAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.appointments.push(action.payload);
    },
    bookAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    checkInRequest: (state) => {
      state.loading = true;
    },
    checkInSuccess: (state, action) => {
      state.loading = false;
      state.checkIns.push(action.payload);
    },
    checkInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    generatePrescriptionRequest: (state) => {
      state.loading = true;
    },
    generatePrescriptionSuccess: (state, action) => {
      state.loading = false;
      state.prescriptions.push(action.payload);
    },
    generatePrescriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    processPaymentRequest: (state) => {
      state.loading = true;
    },
    processPaymentSuccess: (state, action) => {
      state.loading = false;
      state.invoices.push(action.payload);
    },
    processPaymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  fetchAppointmentsRequest, fetchAppointmentsSuccess, fetchAppointmentsFailure,
  bookAppointmentRequest, bookAppointmentSuccess, bookAppointmentFailure,
  checkInRequest, checkInSuccess, checkInFailure,
  generatePrescriptionRequest, generatePrescriptionSuccess, generatePrescriptionFailure,
  processPaymentRequest, processPaymentSuccess, processPaymentFailure
} = bookingSlice.actions;
export default bookingSlice.reducer;
