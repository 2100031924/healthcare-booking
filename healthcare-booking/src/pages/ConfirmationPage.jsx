import { Link, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import '../styles/ConfirmationPage.css'

export default function ConfirmationPage() {
  const location = useLocation()
  const { resetBooking } = useBooking()
  const params = new URLSearchParams(location.search)

  return (
    <div className="view">
      <div className="success-icon">
        <Check size={48} strokeWidth={3} />
      </div>
      <h1>Booking Confirmed!</h1>
      <p className="subtitle">Your appointment has been successfully scheduled.</p>
      
      <div className="ticket">
        <p>
          <span>Doctor</span>
          <span>{params.get('doc')}</span>
        </p>
        <p>
          <span>Date</span>
          <span>{new Date(params.get('date')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </p>
        <p>
          <span>Time</span>
          <span>{params.get('time')}</span>
        </p>
        <p>
          <span>Patient</span>
          <span>{params.get('name')}</span>
        </p>
      </div>

      <Link to="/" className="home-link" onClick={resetBooking}>
        Book Another Appointment
      </Link>
    </div>
  )
}
