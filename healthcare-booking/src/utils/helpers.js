export function formatTime(time) {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

export function formatDisplayDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatCompactDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getDatesForWeek(start) {
  const dates = []
  const startDate = new Date(start)
  startDate.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }

  return dates
}

export function isToday(date) {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function isPastDate(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export const DAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getMonthYearLabel(date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length === 10
}

export function formatPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function generateBookingId() {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `HC${timestamp}${randomPart}`.toUpperCase()
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
