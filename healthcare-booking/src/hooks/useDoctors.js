import { useState, useMemo } from 'react'
import { doctors } from '../data/doctors'

export function useDoctors(initialSpecialization = '') {
  const [specialization, setSpecialization] = useState(initialSpecialization)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSpec = !specialization || doctor.specialization === specialization
      const matchesSearch = !searchQuery || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.about.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSpec && matchesSearch
    })
  }, [specialization, searchQuery])

  return {
    doctors: filteredDoctors,
    specialization,
    setSpecialization,
    searchQuery,
    setSearchQuery,
    totalCount: filteredDoctors.length,
  }
}
