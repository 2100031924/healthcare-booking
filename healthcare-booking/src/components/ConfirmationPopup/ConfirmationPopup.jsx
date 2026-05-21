import './ConfirmationPopup.scss'

export default function ConfirmationPopup({ open, onClose, onConfirm, doctor, date, slot, patientDetails }) {
  if (!open) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Confirm Appointment</h3>
        
        <div className="confirm-details">
          <div className="confirm-item">
            <span className="confirm-label">Doctor</span>
            <span className="confirm-value">{doctor?.name}</span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">Date</span>
            <span className="confirm-value">{date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">Time</span>
            <span className="confirm-value">{slot?.time}</span>
          </div>
          <div className="confirm-item">
            <span className="confirm-label">Patient</span>
            <span className="confirm-value">{patientDetails?.name}</span>
          </div>
        </div>

        <div className="actions">
          <button className="btn-outline" onClick={onClose}>Edit Details</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm Now</button>
        </div>
      </div>
    </div>
  )
}
