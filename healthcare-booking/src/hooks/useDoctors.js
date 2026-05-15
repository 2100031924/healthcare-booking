import { useState } from 'react'
import { doctors } from '../data/doctors'

export function useDoctors() {
  const [specialization, setSpecialization] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpec = !specialization || doctor.specialization === specialization
    const matchesSearch = !searchQuery || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSpec && matchesSearch
  })

  return {
    doctors: filteredDoctors,
    specialization,
    setSpecialization,
    searchQuery,
    setSearchQuery
  }
}
