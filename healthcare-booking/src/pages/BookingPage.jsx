import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Chip, 
  Box, 
  Stack, 
  InputAdornment, 
  Avatar,
  useTheme, 
  alpha, 
  IconButton 
} from '@mui/material'
import { Search, Filter, Calendar, User, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

import { SPECIALIZATIONS, BOOKING_STEPS } from '../constants'
import { formatDisplayDate, formatTime, isValidEmail, isValidPhone } from '../utils/helpers'
import { useBooking } from '../context/BookingContext'
import { useDoctors } from '../hooks/useDoctors'

import DoctorCard from '../components/DoctorCard'
import DatePicker from '../components/DatePicker'
import SlotSelector from '../components/SlotSelector'
import ConfirmationPopup from '../components/ConfirmationPopup'
import ChatAssistant from '../components/ChatAssistant'

export default function BookingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  
  const { 
    selectedDoctor, 
    selectedDate, 
    selectedSlot, 
    patientDetails,
    currentStep,
    isConfirming,
    setDoctor,
    setDate,
    setSlot,
    setPatientDetails,
    setStep,
    toggleConfirmation
  } = useBooking()

  const { 
    doctors: filteredDoctors, 
    specialization, 
    setSpecialization, 
    searchQuery, 
    setSearchQuery 
  } = useDoctors()

  const [errors, setErrors] = useState({})

  const handleNext = () => setStep(currentStep + 1)
  const handleBack = () => setStep(currentStep - 1)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const validateStep2 = () => {
    const newErrors = {}
    if (!patientDetails.name.trim()) newErrors.name = 'Full name is required'
    if (!patientDetails.email.trim()) newErrors.email = 'Email address is required'
    else if (!isValidEmail(patientDetails.email)) newErrors.email = 'Please enter a valid email'
    if (!patientDetails.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!isValidPhone(patientDetails.phone)) newErrors.phone = 'Please enter at least 10 digits'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReviewBooking = () => {
    if (validateStep2()) {
      toggleConfirmation(true)
    }
  }

  const handleFinalConfirm = () => {
    toggleConfirmation(false)
    const query = new URLSearchParams({
      doc: selectedDoctor.name,
      date: selectedDate.toISOString(),
      time: selectedSlot.time,
      name: patientDetails.name
    }).toString()
    
    navigate(`/confirmation?${query}`)
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          pt: 6, 
          pb: 12, 
          px: 2,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -50, 
            right: -50, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            bgcolor: alpha('#fff', 0.05) 
          }} 
        />
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Healthcare Booking
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 600 }}>
            Book appointments with the best doctors in your area. Quick, easy, and reliable.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: theme.shadows[1] }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {BOOKING_STEPS.map((step) => (
                  <Step key={step.id}>
                    <StepLabel>
                      <Typography variant="caption" fontWeight={600}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            <Box sx={{ minHeight: 400 }}>
              {currentStep === 0 && (
                <Box className="fade-in">
                  <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <TextField
                        fullWidth
                        placeholder="Search by doctor name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search size={20} color={theme.palette.text.secondary} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Filter size={16} /> Filter by Specialty
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label="All Specialties"
                          onClick={() => setSpecialization('')}
                          variant={specialization === '' ? 'filled' : 'outlined'}
                          color={specialization === '' ? 'primary' : 'default'}
                          sx={{ fontWeight: 600 }}
                        />
                        {SPECIALIZATIONS.map((spec) => (
                          <Chip
                            key={spec.id}
                            label={spec.name}
                            onClick={() => setSpecialization(spec.id)}
                            variant={specialization === spec.id ? 'filled' : 'outlined'}
                            color={specialization === spec.id ? 'primary' : 'default'}
                            sx={{ fontWeight: 600 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                    Available Doctors ({filteredDoctors.length})
                  </Typography>

                  <Grid container spacing={3}>
                    {filteredDoctors.map((doc) => (
                      <Grid item xs={12} sm={6} md={4} key={doc.id}>
                        <DoctorCard
                          doctor={doc}
                          isSelected={selectedDoctor?.id === doc.id}
                          onSelect={() => setDoctor(doc)}
                        />
                      </Grid>
                    ))}
                    {filteredDoctors.length === 0 && (
                      <Grid item xs={12}>
                        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                          <Search size={48} color={theme.palette.text.disabled} style={{ margin: '0 auto 16px' }} />
                          <Typography variant="h6" color="text.secondary">No doctors found</Typography>
                          <Typography variant="body2" color="text.disabled">Try adjusting your filters or search query</Typography>
                          <Button 
                            variant="text" 
                            onClick={() => { setSearchQuery(''); setSpecialization(''); }}
                            sx={{ mt: 2 }}
                          >
                            Clear all filters
                          </Button>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}

              {currentStep === 1 && (
                <Box className="fade-in">
                  <Button 
                    startIcon={<ArrowLeft size={18} />} 
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                  >
                    Back to doctors
                  </Button>
                  
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Avatar src={selectedDoctor?.image} sx={{ width: 64, height: 64, borderRadius: 2 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{selectedDoctor?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedDoctor?.title}</Typography>
                    </Box>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                      <DatePicker 
                        selectedDate={selectedDate} 
                        onSelectDate={setDate} 
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <SlotSelector 
                        slots={selectedDoctor?.availableSlots || []} 
                        selectedSlot={selectedSlot} 
                        onSelectSlot={setSlot} 
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={!selectedDate || !selectedSlot}
                      onClick={handleNext}
                      endIcon={<ArrowRight size={20} />}
                      sx={{ px: 6, borderRadius: 3 }}
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              )}

              {currentStep === 2 && (
                <Box className="fade-in">
                  <Button 
                    startIcon={<ArrowLeft size={18} />} 
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                  >
                    Back to date & time
                  </Button>

                  <Paper sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                      Patient Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={patientDetails.name}
                          onChange={(e) => setPatientDetails({ name: e.target.value })}
                          error={!!errors.name}
                          helperText={errors.name}
                          placeholder="Enter your full name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          value={patientDetails.email}
                          onChange={(e) => setPatientDetails({ email: e.target.value })}
                          error={!!errors.email}
                          helperText={errors.email}
                          placeholder="yourname@example.com"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={patientDetails.phone}
                          onChange={(e) => setPatientDetails({ phone: e.target.value })}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          placeholder="+1 (555) 000-0000"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Reason for Visit (Optional)"
                          value={patientDetails.reason}
                          onChange={(e) => setPatientDetails({ reason: e.target.value })}
                          placeholder="Briefly describe your symptoms or reason for the appointment"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 5 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleReviewBooking}
                        sx={{ py: 2, borderRadius: 3, fontWeight: 700, fontSize: '1.1rem' }}
                      >
                        Review & Book Appointment
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {selectedDoctor && (
                <Box className="fade-in">
                  <Paper sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Booking Summary</Typography>
                    
                    <Stack spacing={2}>
                      <SummaryItem icon={<User size={16} />} label="Doctor" value={selectedDoctor.name} />
                      {selectedDate && (
                        <SummaryItem icon={<Calendar size={16} />} label="Date" value={formatDisplayDate(selectedDate.toISOString())} />
                      )}
                      {selectedSlot && (
                        <SummaryItem icon={<CheckCircle2 size={16} />} label="Time" value={formatTime(selectedSlot.time)} />
                      )}
                    </Stack>
                  </Paper>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <ChatAssistant />

      <ConfirmationPopup
        open={isConfirming}
        onClose={() => toggleConfirmation(false)}
        doctor={selectedDoctor}
        date={selectedDate}
        slot={selectedSlot}
        patientDetails={patientDetails}
        onConfirm={handleFinalConfirm}
      />
    </Box>
  )
}

function SummaryItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ mt: 0.5, color: 'primary.main' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: -0.25 }}>{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value}</Typography>
      </Box>
    </Stack>
  )
}
