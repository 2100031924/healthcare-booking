import './SlotSelector.scss'

export default function SlotSelector({ slots, selectedSlot, onSelectSlot }) {
  return (
    <div className="selector">
      <h4>Select Available Time</h4>
      <div className="slot-grid">
        {slots.map((slot, i) => (
          <button 
            key={i} 
            disabled={!slot.available}
            className={`slot ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
            onClick={() => onSelectSlot(slot)}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}
