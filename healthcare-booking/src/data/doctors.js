export const specializations = [
  { id: 'general', name: 'General Physician' },
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'orthopedics', name: 'Orthopedics' },
]

export const doctors = [
  {
    id: '1',
    name: 'Dr. Rajesh Sharma',
    specialization: 'cardiology',
    experience: 12,
    rating: 4.8,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    availableSlots: [
      { time: '09:00', available: true },
      { time: '09:30', available: false },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true },
      { time: '14:30', available: true },
      { time: '15:00', available: false },
    ],
  },
  {
    id: '2',
    name: 'Dr. Priya Patel',
    specialization: 'dermatology',
    experience: 8,
    rating: 4.7,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    availableSlots: [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '11:30', available: false },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '15:30', available: false },
      { time: '16:00', available: true },
    ],
  },
  {
    id: '3',
    name: 'Dr. Amit Kumar',
    specialization: 'general',
    experience: 15,
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/men/68.jpg',
    availableSlots: [
      { time: '08:00', available: false },
      { time: '08:30', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '14:00', available: false },
      { time: '14:30', available: true },
      { time: '15:00', available: true },
    ],
  },
  {
    id: '4',
    name: 'Dr. Sneha Gupta',
    specialization: 'neurology',
    experience: 10,
    rating: 4.6,
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    availableSlots: [
      { time: '09:00', available: false },
      { time: '09:30', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: true },
      { time: '16:00', available: false },
    ],
  },
  {
    id: '5',
    name: 'Dr. Vikram Singh',
    specialization: 'pediatrics',
    experience: 14,
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
    availableSlots: [
      { time: '08:30', available: true },
      { time: '09:00', available: true },
      { time: '09:30', available: false },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '14:00', available: true },
      { time: '14:30', available: false },
      { time: '15:00', available: true },
    ],
  },
  {
    id: '6',
    name: 'Dr. Meera Reddy',
    specialization: 'orthopedics',
    experience: 11,
    rating: 4.5,
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    availableSlots: [
      { time: '09:00', available: true },
      { time: '09:30', available: false },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: false },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '15:30', available: true },
    ],
  },
]

export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export function getDatesForWeek(start) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}