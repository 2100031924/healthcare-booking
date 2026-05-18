import '../styles/DoctorCard.css'

export default function DoctorCard({ doctor, isSelected, onSelect }) {
  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
    >
      <img src={doctor.image} alt={doctor.name} />
      <h4>{doctor.name}</h4>
      <p>{doctor.title}</p>
      <div className="card-btn">
        {isSelected ? 'Selected' : 'Select'}
      </div>
    </div>
  )
}
