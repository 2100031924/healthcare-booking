import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  Stack,
  Divider,
  alpha,
  useTheme,
  IconButton,
  Avatar,
  Grid
} from '@mui/material'
import { CheckCircle, Calendar, Clock, User, ArrowLeft, MapPin, Printer, ExternalLink } from 'lucide-react'
import { formatTime, formatDisplayDate } from '../utils/helpers'
import { useBooking } from '../context/BookingContext'

export default function ConfirmationPage() {
  const theme = useTheme()
  const location = useLocation()
  const { resetBooking } = useBooking()
  
  const params = new URLSearchParams(location.search)
  const doctorName = params.get('doc') || 'Specialist'
  const dateParam = params.get('date')
  const timeParam = params.get('time') || '10:00 AM'
  const patientName = params.get('name') || 'Patient'

  const appointmentDate = dateParam ? new Date(dateParam) : new Date()
  const appointmentTime = timeParam

  const handlePrint = () => window.print()

  return (
    <Box 
      sx={{ 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -200, 
          left: -200, 
          width: 600, 
          height: 600, 
          borderRadius: '50%', 
          background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.05)} 0%, rgba(255,255,255,0) 70%)` 
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -300, 
          right: -200, 
          width: 800, 
          height: 800, 
          borderRadius: '50%', 
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, rgba(255,255,255,0) 70%)` 
        }} 
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            textAlign: 'center', 
            borderRadius: 8,
            boxShadow: '0 40px 100px -15px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'grey.100',
            background: '#ffffff'
          }}
        >
          <Box sx={{ mb: 6 }}>
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: 'success.light', 
                color: 'success.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px',
                animation: 'bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 12px 24px -6px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle size={56} strokeWidth={2.5} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em' }}>
              Confirmed!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1.1rem' }}>
              Your appointment is successfully scheduled.
            </Typography>
          </Box>

          <Paper 
            variant="outlined"
            sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 5, 
              textAlign: 'left', 
              mb: 6,
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid',
              borderColor: 'grey.200',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '58%',
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: '#f8fafc',
                border: '1px solid',
                borderColor: 'grey.200',
                marginTop: -12,
                zIndex: 2
              },
              '&::before': { left: -13 },
              '&::after': { right: -13 }
            }}
          >
            <Box sx={{ p: 4, background: '#ffffff' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Appointment Ticket
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>{doctorName}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <User size={24} />
                </Avatar>
              </Stack>
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Date</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>{formatDisplayDate(appointmentDate)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main' }}>{formatTime(appointmentTime)}</Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ borderStyle: 'dashed', my: 0, opacity: 0.8 }} />
            
            <Box sx={{ p: 4 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Patient Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{patientName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Booking ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>#HC-{Math.random().toString(36).substring(2, 9).toUpperCase()}</Typography>
                </Stack>
                <Box sx={{ pt: 1, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <MapPin size={18} color={theme.palette.grey[400]} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.5 }}>
                    MediBook Wellness Hub<br />
                    123 Medical Plaza, Wellness District
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>

          <Stack spacing={2.5}>
            <Button
              component={Link}
              to="/"
              onClick={() => resetBooking()}
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 2.25, borderRadius: 4, fontWeight: 800, fontSize: '1rem', boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)' }}
            >
              Done & Return Home
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Printer size={18} />}
              onClick={handlePrint}
              sx={{ borderRadius: 3, py: 1.75, fontWeight: 700, borderColor: 'grey.200', color: 'text.secondary' }}
            >
              Print Ticket
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ mt: 5, color: 'text.disabled', fontWeight: 500 }}>
            A copy of this ticket has been sent to your email.
          </Typography>
        </Paper>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<ExternalLink size={18} />}
            sx={{ color: 'text.secondary', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
          >
            Need to book for someone else?
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
