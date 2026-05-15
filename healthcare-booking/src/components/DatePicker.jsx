import '../styles/DatePicker.css'

export default function DatePicker({ selectedDate, onSelectDate }) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push(d)
  }

  return (
    <div className="picker">
      <h4>Date</h4>
      <div className="grid">
        {dates.map((date, i) => (
          <button 
            key={i} 
            className={`day ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
            onClick={() => onSelectDate(date)}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  )
}
