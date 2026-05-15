import '../styles/DoctorCard.css'

export default function DoctorCard({ doctor, isSelected, onSelect }) {
  const cardStyle = {
    cursor: 'pointer',
    margin: '10px',
    transition: 'transform 0.2s'
  }

  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`} 
      style={cardStyle} 
      onClick={onSelect}
    >
      <img src={doctor.image} alt={doctor.name} style={{ border: isSelected ? '2px solid #007bff' : 'none' }} />
      <h4>{doctor.name}</h4>
      <p>{doctor.title}</p>
      <button style={{ backgroundColor: isSelected ? '#007bff' : '#eee', color: isSelected ? 'white' : 'black' }}>
        Select
      </button>
    </div>
  )
}
