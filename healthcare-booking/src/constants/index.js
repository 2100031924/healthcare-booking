export const SPECIALIZATIONS = [
  {
    id: 'general',
    name: 'General Physician',
    icon: 'stethoscope',
    description: 'Primary care for common illnesses',
    color: '#4caf50',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'heart',
    description: 'Heart and cardiovascular system',
    color: '#e91e63',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: 'smile',
    description: 'Skin, hair, and nail conditions',
    color: '#ff9800',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: 'brain',
    description: 'Brain and nervous system',
    color: '#9c27b0',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: 'baby',
    description: 'Healthcare for children',
    color: '#2196f3',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    icon: 'bone',
    description: 'Bones, joints, and muscles',
    color: '#795548',
  },
]

export const TIME_SLOTS = [
  { time: '08:00', available: false },
  { time: '08:30', available: false },
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: false },
  { time: '11:30', available: true },
  { time: '12:00', available: false },
  { time: '12:30', available: false },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: false },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: false },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: false },
]

export const BOOKING_STEPS = [
  { id: 0, label: 'Select Doctor', description: 'Choose your preferred specialist' },
  { id: 1, label: 'Date & Time', description: 'Pick appointment slot' },
  { id: 2, label: 'Your Details', description: 'Complete booking form' },
]

export const MAX_WEEKS_AHEAD = 5
export const MIN_BOOKING_LEAD_HOURS = 2

export const APPOINTMENT_DURATION = 30
