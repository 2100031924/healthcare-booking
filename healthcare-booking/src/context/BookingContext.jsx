import { createContext, useContext, useReducer, useCallback } from 'react'

const BookingContext = createContext()

const initialState = {
  selectedDoctor: null,
  selectedDate: null,
  selectedSlot: null,
  patientDetails: {
    name: '',
    email: '',
    phone: '',
    reason: '',
  },
  currentStep: 0,
  isConfirming: false,
}

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_DOCTOR':
      return {
        ...state,
        selectedDoctor: action.payload,
        selectedDate: null,
        selectedSlot: null,
        currentStep: 1,
      }
    case 'SET_DATE':
      return {
        ...state,
        selectedDate: action.payload,
        selectedSlot: null,
      }
    case 'SET_SLOT':
      return {
        ...state,
        selectedSlot: action.payload,
      }
    case 'SET_PATIENT_DETAILS':
      return {
        ...state,
        patientDetails: { ...state.patientDetails, ...action.payload },
      }
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      }
    case 'TOGGLE_CONFIRMATION':
      return {
        ...state,
        isConfirming: action.payload !== undefined ? action.payload : !state.isConfirming,
      }
    case 'RESET_BOOKING':
      return initialState
    default:
      return state
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const setDoctor = useCallback((doctor) => {
    dispatch({ type: 'SET_DOCTOR', payload: doctor })
  }, [])

  const setDate = useCallback((date) => {
    dispatch({ type: 'SET_DATE', payload: date })
  }, [])

  const setSlot = useCallback((slot) => {
    dispatch({ type: 'SET_SLOT', payload: slot })
  }, [])

  const setPatientDetails = useCallback((details) => {
    dispatch({ type: 'SET_PATIENT_DETAILS', payload: details })
  }, [])

  const setStep = useCallback((step) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  const toggleConfirmation = useCallback((isOpen) => {
    dispatch({ type: 'TOGGLE_CONFIRMATION', payload: isOpen })
  }, [])

  const resetBooking = useCallback(() => {
    dispatch({ type: 'RESET_BOOKING' })
  }, [])

  const value = {
    ...state,
    setDoctor,
    setDate,
    setSlot,
    setPatientDetails,
    setStep,
    toggleConfirmation,
    resetBooking,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
