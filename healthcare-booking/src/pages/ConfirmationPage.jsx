import { Link, useLocation } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import '../styles/ConfirmationPage.css'

export default function ConfirmationPage() {
  const location = useLocation()
  const { resetBooking } = useBooking()
  const params = new URLSearchParams(location.search)

  return (
    <div className="view">
      <h1>Confirmed!</h1>
      <div className="ticket">
        <p>Doctor: {params.get('doc')}</p>
        <p>Date: {new Date(params.get('date')).toDateString()}</p>
        <p>Time: {params.get('time')}</p>
        <p>Patient: {params.get('name')}</p>
      </div>
      <Link to="/" onClick={resetBooking}>Home</Link>
    </div>
  )
}
