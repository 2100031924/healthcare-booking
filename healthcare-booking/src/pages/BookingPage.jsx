import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Button, TextField, Grid, Paper, Stepper, Step, StepLabel, Chip, Box } from '@mui/material'
import { specializations, doctors, formatDisplayDate } from '../data/doctors'
import DoctorCard from '../components/DoctorCard'
import DatePicker from '../components/DatePicker'
import SlotSelector from '../components/SlotSelector'
import ConfirmationPopup from '../components/ConfirmationPopup'

function validateFields(data) {
  const errors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Enter a valid email'
  if (!data.phone.trim()) errors.phone = 'Phone is required'
  else if (data.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter 10 digit phone'
  return errors
}

function formatTime(time) {
  const [h, m] = time.split(':')
  return `${parseInt(h) % 12 || 12}:${m} ${parseInt(h) >= 12 ? 'PM' : 'AM'}`
}

export default function BookingPage() {
  const navigate = useNavigate()
  const [specFilter, setSpecFilter] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)

  const filteredDoctors = specFilter
    ? doctors.filter(d => d.specialization === specFilter)
    : doctors

  const currentStep = selectedDoctor
    ? (selectedDate && selectedSlot ? 2 : 1)
    : 0

  function handleDoctorSelect(doctor) {
    setSelectedDoctor(doctor)
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  function handleBook() {
    const errors = validateFields({ name: patientName, email: patientEmail, phone: patientPhone })
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      setShowConfirm(true)
    }
  }

  function handleConfirm() {
    setShowConfirm(false)
    navigate(`/confirmation?doctor=${encodeURIComponent(selectedDoctor.name)}&date=${encodeURIComponent(formatDisplayDate(selectedDate.toISOString().split('T')[0]))}&time=${encodeURIComponent(formatTime(selectedSlot.time))}`)
  }

  function handleReset() {
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setPatientName('')
    setPatientEmail('')
    setPatientPhone('')
    setFormErrors({})
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, px: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: 22, sm: 26 } }}>
            Book Appointment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: 14, mt: 0.5 }}>
            Find a doctor and schedule your visit
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -3, pb: 8 }}>
        {/* Progress Stepper */}
        <Paper sx={{ p: 2, mb: 2.5 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            <Step><StepLabel>Choose Doctor</StepLabel></Step>
            <Step><StepLabel>Pick Date & Time</StepLabel></Step>
            <Step><StepLabel>Your Details</StepLabel></Step>
          </Stepper>
        </Paper>

        {/* Specialization Filter */}
        <Paper sx={{ p: 2, mb: 2.5 }}>
          <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: 13, mb: 1.5, color: 'text.secondary' }}>
            Filter by Specialty
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="All Doctors"
              onClick={() => setSpecFilter('')}
              color={specFilter === '' ? 'primary' : 'default'}
              size="small"
              sx={{ transition: 'all 0.15s ease' }}
            />
            {specializations.map(s => (
              <Chip
                key={s.id}
                label={s.name}
                onClick={() => setSpecFilter(s.id)}
                color={specFilter === s.id ? 'primary' : 'default'}
                size="small"
                sx={{ transition: 'all 0.15s ease' }}
              />
            ))}
          </Box>
        </Paper>

        {/* Doctor Cards */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Typography variant="h6" fontWeight="600" sx={{ fontSize: 17 }}>
              Available Doctors
            </Typography>
            <Chip label={filteredDoctors.length} size="small" sx={{ bgcolor: 'grey.200', fontWeight: 600 }} />
          </Box>
          <Grid container spacing={2}>
            {filteredDoctors.map(doc => (
              <Grid item xs={12} sm={6} lg={4} key={doc.id}>
                <DoctorCard
                  doctor={doc}
                  isSelected={selectedDoctor?.id === doc.id}
                  onSelect={() => handleDoctorSelect(doc)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Date & Time Selection */}
        {selectedDoctor && (
          <Box sx={{ mb: 4, animation: 'fadeIn 0.25s ease' }}>
            <Typography variant="h6" fontWeight="600" sx={{ fontSize: 17, mb: 2 }}>
              Pick Date & Time
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </Grid>
              <Grid item xs={12} md={6}>
                <SlotSelector
                  slots={selectedDoctor.availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Patient Form */}
        {selectedDoctor && selectedDate && selectedSlot && (
          <Paper sx={{ p: 2.5, mb: 2, animation: 'fadeIn 0.25s ease' }}>
            <Typography variant="h6" fontWeight="600" sx={{ fontSize: 16, mb: 2 }}>
              Your Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={patientEmail}
                  onChange={e => setPatientEmail(e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={patientPhone}
                  onChange={e => setPatientPhone(e.target.value)}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  placeholder="+91 98765 43210"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={handleReset} 
                sx={{ borderRadius: 1, transition: 'all 0.15s ease' }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                onClick={handleBook} 
                disableElevation 
                sx={{ borderRadius: 1, transition: 'all 0.15s ease' }}
              >
                Review & Confirm
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      <ConfirmationPopup
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        doctor={selectedDoctor}
        date={selectedDate}
        slot={selectedSlot}
        patientName={patientName}
        onConfirm={handleConfirm}
      />
    </Box>
  )
}