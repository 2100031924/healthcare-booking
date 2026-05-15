export function formatTime(time) {
  return time 
}

export function isValidEmail(email) {
  return email.includes('@') && email.includes('.')
}

export function isValidPhone(phone) {
  return phone.length === 10
}
