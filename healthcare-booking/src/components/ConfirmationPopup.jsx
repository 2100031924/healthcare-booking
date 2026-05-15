import '../styles/ConfirmationPopup.css'

export default function ConfirmationPopup({ open, onClose, onConfirm, doctor, date, slot, patientDetails }) {
  if (!open) return null

  return (
    <div className="overlay">
      <div className="modal">
        <h3>Confirm?</h3>
        <p>Doc: {doctor?.name}</p>
        <p>Date: {date?.toDateString()}</p>
        <p>Time: {slot?.time}</p>
        <p>Patient: {patientDetails?.name}</p>
        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
