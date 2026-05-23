// Booking Selectors
export const selectBookingState = (state) => state.booking;

export const selectAppointments = (state) => state.booking.appointments;

export const selectBookingLoading = (state) => state.booking.loading;

export const selectBookingError = (state) => state.booking.error;

export const selectCheckIns = (state) => state.booking.checkIns;

export const selectPrescriptions = (state) => state.booking.prescriptions;

export const selectInvoices = (state) => state.booking.invoices;

// Derived Selectors
export const selectTodaysAppointments = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.booking.appointments.filter((apt) => apt.appointmentDate === today);
};

export const selectUpcomingAppointments = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.booking.appointments.filter(
    (apt) => apt.appointmentDate >= today && apt.status?.toLowerCase() !== 'cancelled'
  );
};

export const selectCancelledAppointments = (state) =>
  state.booking.appointments.filter((apt) => apt.status?.toLowerCase() === 'cancelled');

export const selectOnlineConsultations = (state) =>
  state.booking.appointments.filter(
    (apt) => apt.consultationMode === 'Online' || apt.type === 'video'
  );

export const selectConfirmedAppointments = (state) =>
  state.booking.appointments.filter((apt) => apt.status?.toLowerCase() === 'confirmed');

export const selectPendingAppointments = (state) =>
  state.booking.appointments.filter((apt) => apt.status?.toLowerCase() === 'pending');

export const selectTotalAppointments = (state) => state.booking.appointments.length;

export const selectUniquePatients = (state) =>
  new Set(state.booking.appointments.map((apt) => apt.patientName)).size;

export const selectAppointmentById = (id) => (state) =>
  state.booking.appointments.find((apt) => apt.id === id);

export const selectAppointmentsByDoctor = (doctorName) => (state) =>
  state.booking.appointments.filter((apt) => apt.doctorName === doctorName);

export const selectAppointmentsByDate = (date) => (state) =>
  state.booking.appointments.filter((apt) => apt.appointmentDate === date);
