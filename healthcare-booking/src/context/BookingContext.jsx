import { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isConfirming, setIsConfirming] = useState(false)
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
  })

  const updateDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedSlot(null)
    setCurrentStep(1)
  }

  const updatePatientDetails = (details) => {
    setPatientDetails({ ...patientDetails, ...details })
  }

  const resetBooking = () => {
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setCurrentStep(0)
    setIsConfirming(false)
    setPatientDetails({ name: '', email: '', phone: '', reason: '' })
  }

  const value = {
    selectedDoctor,
    selectedDate,
    selectedSlot,
    patientDetails,
    currentStep,
    isConfirming,
    setDoctor: updateDoctor,
    setDate: setSelectedDate,
    setSlot: setSelectedSlot,
    setPatientDetails: updatePatientDetails,
    setStep: setCurrentStep,
    toggleConfirmation: setIsConfirming,
    resetBooking,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  return useContext(BookingContext)
}
