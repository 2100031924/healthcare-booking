import '../styles/DatePicker.css'

export default function DatePicker({ selectedDate, onSelectDate }) {
  const dates = []
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push(d)
  }

  return (
    <div className="picker">
      <h4>Select Appointment Date</h4>
      <div className="date-grid">
        {dates.map((date, i) => (
          <button 
            key={i} 
            className={`day ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
            onClick={() => onSelectDate(date)}
          >
            <span className="weekday">{weekdays[date.getDay()]}</span>
            <span className="date-num">{date.getDate()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
