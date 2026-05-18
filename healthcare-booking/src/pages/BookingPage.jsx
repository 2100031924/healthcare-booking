import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { useDoctors } from '../hooks/useDoctors'
import DoctorCard from '../components/DoctorCard'
import DatePicker from '../components/DatePicker'
import SlotSelector from '../components/SlotSelector'
import ConfirmationPopup from '../components/ConfirmationPopup'
import '../styles/BookingPage.css'

export default function BookingPage() {
  const navigate = useNavigate()
  const { 
    selectedDoctor, selectedDate, selectedSlot, patientDetails,
    currentStep, isConfirming, setDoctor, setDate, setSlot,
    setPatientDetails, setStep, toggleConfirmation
  } = useBooking()

  const { doctors: filteredDoctors, searchQuery, setSearchQuery } = useDoctors()

  const handleNext = () => setStep(currentStep + 1)
  const handleBack = () => setStep(currentStep - 1)

  const handleConfirm = () => {
    const query = new URLSearchParams({
      doc: selectedDoctor.name,
      date: selectedDate.toISOString(),
      time: selectedSlot.time,
      name: patientDetails.name
    }).toString()
    navigate(`/confirmation?${query}`)
  }

  return (
    <div>
      <header className="header">
        <h1>Medical Booking</h1>
      </header>

      <div className="steps">
        <span className={`step ${currentStep === 0 ? 'active' : ''}`}>1. Select Doctor</span>
        <span className={`step ${currentStep === 1 ? 'active' : ''}`}>2. Schedule</span>
        <span className={`step ${currentStep === 2 ? 'active' : ''}`}>3. Details</span>
      </div>

      {currentStep === 0 && (
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search doctors by name or specialty..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="list">
            {filteredDoctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} onSelect={() => setDoctor(doc)} isSelected={selectedDoctor?.id === doc.id} />
            ))}
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="form-container">
          <div className="nav-buttons" style={{ marginBottom: '1.5rem' }}>
            <button className="btn-outline" onClick={handleBack}>← Back</button>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{selectedDoctor.name}</h2>
          <DatePicker selectedDate={selectedDate} onSelectDate={setDate} />
          <SlotSelector slots={selectedDoctor.availableSlots} selectedSlot={selectedSlot} onSelectSlot={setSlot} />
          <div className="nav-buttons" style={{ marginTop: '2rem' }}>
            <div />
            <button className="btn-primary" disabled={!selectedDate || !selectedSlot} onClick={handleNext}>Next Step</button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-container">
          <div className="nav-buttons" style={{ marginBottom: '1.5rem' }}>
            <button className="btn-outline" onClick={handleBack}>← Back</button>
          </div>
          <h2 className="form-title">Patient Information</h2>
          <div className="group">
            <label>Full Name</label>
            <input value={patientDetails.name} onChange={(e) => setPatientDetails({ name: e.target.value })} placeholder="John Doe" />
          </div>
          <div className="group">
            <label>Email Address</label>
            <input value={patientDetails.email} onChange={(e) => setPatientDetails({ email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div className="group">
            <label>Phone Number</label>
            <input value={patientDetails.phone} onChange={(e) => setPatientDetails({ phone: e.target.value })} placeholder="+1 (555) 000-0000" />
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => toggleConfirmation(true)}>Confirm Booking</button>
        </div>
      )}

      {selectedDoctor && (
        <div className="summary">
          <h3>Booking Summary</h3>
          <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
          {selectedDate && <p><strong>Date:</strong> {selectedDate.toDateString()}</p>}
          {selectedSlot && <p><strong>Time:</strong> {selectedSlot.time}</p>}
        </div>
      )}

      <ConfirmationPopup 
        open={isConfirming} 
        onClose={() => toggleConfirmation(false)} 
        onConfirm={handleConfirm}
        doctor={selectedDoctor}
        date={selectedDate}
        slot={selectedSlot}
        patientDetails={patientDetails}
      />
    </div>
  )
}
