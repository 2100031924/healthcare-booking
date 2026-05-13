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
  IconButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material'
import { Search, Filter, Calendar, User, ArrowLeft, ArrowRight, CheckCircle2, Heart, Award, Shield } from 'lucide-react'

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
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleNext = () => setStep(currentStep + 1)
  const handleBack = () => setStep(currentStep - 1)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const validateStep2 = () => {
    const newErrors = {}
    const name = patientDetails.name?.trim() || ''
    const email = patientDetails.email?.trim() || ''
    const phone = patientDetails.phone?.trim() || ''
    const reason = patientDetails.reason?.trim() || ''

    if (!name) newErrors.name = 'Full name is required'
    else if (name.length < 2) newErrors.name = 'Name must be at least 2 characters long'
    else if (name.length > 50) newErrors.name = 'Name cannot exceed 50 characters'
    else if (!/^[a-zA-Z\s\-']+$/.test(name)) newErrors.name = 'Name contains invalid characters'

    if (!email) newErrors.email = 'Email address is required'
    else if (!isValidEmail(email)) newErrors.email = 'Please enter a valid email address'
    else if (email.length > 100) newErrors.email = 'Email cannot exceed 100 characters'

    if (!phone) newErrors.phone = 'Phone number is required'
    else if (!isValidPhone(phone)) newErrors.phone = 'Please enter exactly 10 digits'

    if (reason && reason.length > 500) newErrors.reason = 'Reason cannot exceed 500 characters'
    else if (reason && /[<>]/g.test(reason)) newErrors.reason = 'Invalid characters in reason (< or >)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleReviewBooking = () => {
    if (validateStep2()) {
      toggleConfirmation(true)
    } else {
      setSnackbarMessage('Please fix the errors in the form before proceeding.')
      setSnackbarOpen(true)
    }
  }

  const handleFinalConfirm = () => {
    try {
      toggleConfirmation(false)
      
      if (!selectedDoctor || !selectedDate || !selectedSlot) {
        setSnackbarMessage('Missing appointment details. Please try again.')
        setSnackbarOpen(true)
        return
      }

      const query = new URLSearchParams({
        doc: selectedDoctor.name || 'Specialist',
        date: selectedDate.toISOString(),
        time: selectedSlot.time || '',
        name: patientDetails.name || 'Patient'
      }).toString()
      
      navigate(`/confirmation?${query}`)
    } catch (error) {
      console.error('Booking error:', error)
      setSnackbarMessage('An error occurred while processing your booking.')
      setSnackbarOpen(true)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Blue Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          pt: { xs: 8, md: 10 }, 
          pb: { xs: 14, md: 18 }, 
          px: 2,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 400, 
            height: 400, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' 
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -50, 
            left: '10%', 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)' 
          }} 
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#fff', 0.1), px: 2, py: 0.75, borderRadius: 10, width: 'fit-content', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Award size={16} />
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Trusted Healthcare Partner
                  </Typography>
                </Box>
                <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.1 }}>
                  Your Health, <br />
                  <span style={{ opacity: 0.7 }}>Our Priority.</span>
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 500, fontSize: '1.1rem' }}>
                  Connect with world-class specialists and book your appointment in seconds. Simplified healthcare at your fingertips.
                </Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <FeatureItem icon={<Heart size={20} />} text="Expert Care" />
                  <FeatureItem icon={<Shield size={20} />} text="Secure Booking" />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, md: 4 }, 
                mb: 4, 
                borderRadius: 4, 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                background: '#ffffff',
                border: '1px solid',
                borderColor: 'grey.100'
              }} 
            >
              <Stepper activeStep={currentStep} alternativeLabel sx={{ '& .MuiStepConnector-line': { borderTopWidth: 2 } }}>
                {BOOKING_STEPS.map((step) => (
                  <Step key={step.id}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          width: 38,
                          height: 38,
                          '& .MuiStepIcon-text': { fontWeight: 700, fontSize: '0.85rem' }
                        }
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 800, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.08em',
                          fontSize: '0.65rem',
                          mt: 1,
                          display: 'block',
                          color: 'text.primary'
                        }}
                      >
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            <Box sx={{ minHeight: 400 }}>
              {currentStep === 0 && (
                <Box className="fade-in">
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 4, 
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'grey.100',
                      background: '#ffffff'
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <TextField
                        fullWidth
                        placeholder="Search for a doctor, clinic or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search size={20} color={theme.palette.primary.main} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>

                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Filter size={18} /> Filter by Specialist
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        <Chip
                          label="All Specialties"
                          onClick={() => setSpecialization('')}
                          variant={specialization === '' ? 'filled' : 'outlined'}
                          color={specialization === '' ? 'primary' : 'default'}
                          sx={{ 
                            px: 1, 
                            height: 36,
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-1px)' }
                          }}
                        />
                        {SPECIALIZATIONS.map((spec) => (
                          <Chip
                            key={spec.id}
                            label={spec.name}
                            onClick={() => setSpecialization(spec.id)}
                            variant={specialization === spec.id ? 'filled' : 'outlined'}
                            color={specialization === spec.id ? 'primary' : 'default'}
                            sx={{ 
                              px: 1, 
                              height: 36,
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'translateY(-1px)' }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Available Specialists
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Showing {filteredDoctors.length} results
                    </Typography>
                  </Stack>

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
                        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4, border: '2px dashed', borderColor: 'grey.200' }}>
                          <Search size={48} color={theme.palette.text.disabled} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>No Doctors Found</Typography>
                          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>Try adjusting your filters or search terms.</Typography>
                          <Button 
                            variant="outlined" 
                            onClick={() => { setSearchQuery(''); setSpecialization(''); }}
                            sx={{ mt: 3, borderRadius: 2 }}
                          >
                            Reset Filters
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
                    sx={{ mb: 4, color: 'text.secondary', fontWeight: 700 }}
                  >
                    Back to Doctors
                  </Button>
                  
                  <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'grey.100' }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar 
                        src={selectedDoctor?.image} 
                        sx={{ width: 80, height: 80, borderRadius: 4, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }} 
                      />
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedDoctor?.name}</Typography>
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>{selectedDoctor?.title}</Typography>
                      </Box>
                    </Stack>
                  </Paper>

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

                  <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={!selectedDate || !selectedSlot}
                      onClick={handleNext}
                      endIcon={<ArrowRight size={20} />}
                      sx={{ px: 8, py: 2, borderRadius: 3, fontSize: '1rem' }}
                    >
                      Confirm Time Slot
                    </Button>
                  </Box>
                </Box>
              )}

              {currentStep === 2 && (
                <Box className="fade-in">
                  <Button 
                    startIcon={<ArrowLeft size={18} />} 
                    onClick={handleBack}
                    sx={{ mb: 4, color: 'text.secondary', fontWeight: 700 }}
                  >
                    Back to Selection
                  </Button>

                  <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.100' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
                      Patient Information
                    </Typography>
                    
                    <Stack spacing={4}>
                      <TextField
                        fullWidth
                        label="Your Full Name"
                        value={patientDetails.name}
                        onChange={(e) => setPatientDetails({ name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                        placeholder="John Doe"
                        inputProps={{ maxLength: 50 }}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={patientDetails.email}
                        onChange={(e) => setPatientDetails({ email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="john@example.com"
                        inputProps={{ maxLength: 100 }}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={patientDetails.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          if (val.length <= 10) {
                            setPatientDetails({ phone: val })
                          }
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone || "Enter 10-digit number"}
                        placeholder="5550000000"
                        inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Reason for Visit (Optional)"
                        value={patientDetails.reason}
                        onChange={(e) => setPatientDetails({ reason: e.target.value })}
                        error={!!errors.reason}
                        helperText={errors.reason || `${patientDetails.reason?.length || 0}/500 characters`}
                        placeholder="Briefly describe why you are booking this appointment..."
                        inputProps={{ maxLength: 500 }}
                      />
                    </Stack>

                    <Box sx={{ mt: 6 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleReviewBooking}
                        sx={{ py: 2.5, borderRadius: 3, fontWeight: 800, fontSize: '1.1rem' }}
                      >
                        Finalize Appointment
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {selectedDoctor && (
                <Box className="fade-in">
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      borderRadius: 4, 
                      bgcolor: alpha(theme.palette.primary.main, 0.03), 
                      border: '2px solid', 
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: -20, right: -20, color: alpha(theme.palette.primary.main, 0.05) }}>
                      <Calendar size={120} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: 'primary.main' }}>Appointment Summary</Typography>
                    
                    <Stack spacing={3}>
                      <SummaryItem icon={<User size={18} />} label="Specialist" value={selectedDoctor.name} />
                      {selectedDate && (
                        <SummaryItem icon={<Calendar size={18} />} label="Appointment Date" value={formatDisplayDate(selectedDate.toISOString())} />
                      )}
                      {selectedSlot && (
                        <SummaryItem icon={<CheckCircle2 size={18} />} label="Selected Time" value={formatTime(selectedSlot.time)} />
                      )}
                    </Stack>
                    
                    <Divider sx={{ my: 3, opacity: 0.5 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.main', color: 'white', display: 'flex' }}>
                        <Shield size={16} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Your data is encrypted and protected.
                      </Typography>
                    </Box>
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

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%', borderRadius: 3 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

function SummaryItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ mt: 0.5, color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.25, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary' }}>{value}</Typography>
      </Box>
    </Stack>
  )
}

function FeatureItem({ icon, text }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box sx={{ color: 'white', opacity: 0.9, display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{text}</Typography>
    </Stack>
  )
}
