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
      <div className="header">
        <h1>Medical Booking</h1>
      </div>

      <div className="steps" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <span className={`step ${currentStep === 0 ? 'active' : ''}`} style={{ fontWeight: currentStep === 0 ? 'bold' : 'normal', color: currentStep === 0 ? 'white' : '#666' }}>Step 1</span>
        <span className={`step ${currentStep === 1 ? 'active' : ''}`} style={{ fontWeight: currentStep === 1 ? 'bold' : 'normal', color: currentStep === 1 ? 'white' : '#666' }}>Step 2</span>
        <span className={`step ${currentStep === 2 ? 'active' : ''}`} style={{ fontWeight: currentStep === 2 ? 'bold' : 'normal', color: currentStep === 2 ? 'white' : '#666' }}>Step 3</span>
      </div>

      {currentStep === 0 && (
        <div>
          <input 
            type="text" 
            placeholder="Search..." 
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
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleBack}>Back</button>
          <h2>{selectedDoctor.name}</h2>
          <DatePicker selectedDate={selectedDate} onSelectDate={setDate} />
          <SlotSelector slots={selectedDoctor.availableSlots} selectedSlot={selectedSlot} onSelectSlot={setSlot} />
          <button disabled={!selectedDate || !selectedSlot} onClick={handleNext}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form">
          <button onClick={handleBack}>Back</button>
          <h2>Patient Info</h2>
          <div className="group">
            <label>Name</label>
            <input value={patientDetails.name} onChange={(e) => setPatientDetails({ name: e.target.value })} />
          </div>
          <div className="group">
            <label>Email</label>
            <input value={patientDetails.email} onChange={(e) => setPatientDetails({ email: e.target.value })} />
          </div>
          <div className="group">
            <label>Phone</label>
            <input value={patientDetails.phone} onChange={(e) => setPatientDetails({ phone: e.target.value })} />
          </div>
          <button onClick={() => toggleConfirmation(true)}>Submit</button>
        </div>
      )}

      {selectedDoctor && (
        <div className="summary">
          <h3>Summary</h3>
          <p>Doctor: {selectedDoctor.name}</p>
          {selectedDate && <p>Date: {selectedDate.toDateString()}</p>}
          {selectedSlot && <p>Time: {selectedSlot.time}</p>}
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
