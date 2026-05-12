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
  IconButton
} from '@mui/material'
import { CheckCircle, Calendar, Clock, User, ArrowLeft, Download, Share2, MapPin } from 'lucide-react'
import { formatTime, formatDisplayDate } from '../utils/helpers'
import { useBooking } from '../context/BookingContext'

export default function ConfirmationPage() {
  const theme = useTheme()
  const location = useLocation()
  const { resetBooking } = useBooking()
  
  const params = new URLSearchParams(location.search)
  const doctorName = params.get('doc') || 'Doctor'
  const appointmentDate = params.get('date') ? new Date(params.get('date')) : new Date()
  const appointmentTime = params.get('time') || '10:00'
  const patientName = params.get('name') || 'Patient'

  useEffect(() => {
  }, [resetBooking])

  const handlePrint = () => window.print()

  return (
    <Box 
      sx={{ 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -100, 
          left: -100, 
          width: 400, 
          height: 400, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette.success.main, 0.03) 
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -150, 
          right: -100, 
          width: 500, 
          height: 500, 
          borderRadius: '50%', 
          bgcolor: alpha(theme.palette.primary.main, 0.03) 
        }} 
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            textAlign: 'center', 
            borderRadius: 6,
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: alpha(theme.palette.success.main, 0.1), 
                color: 'success.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <CheckCircle size={40} strokeWidth={3} />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your appointment has been successfully scheduled. We've sent a confirmation to your email.
            </Typography>
          </Box>

          <Paper 
            variant="outlined"
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 4, 
              textAlign: 'left', 
              mb: 4,
              overflow: 'hidden',
              position: 'relative',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#f8fafc',
                border: '1px solid',
                borderColor: 'divider',
                marginTop: -10,
                zIndex: 2
              },
              '&::before': { left: -11 },
              '&::after': { right: -11 }
            }}
          >
            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.1em' }}>
                APPOINTMENT DETAILS
              </Typography>
              <Stack spacing={2.5} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Doctor</Typography>
                  <Typography variant="h6" fontWeight={700}>{doctorName}</Typography>
                </Box>
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Date</Typography>
                    <Typography variant="body1" fontWeight={700}>{formatDisplayDate(appointmentDate)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Time</Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main">{formatTime(appointmentTime)}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
            
            <Divider sx={{ borderStyle: 'dashed' }} />
            
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Patient</Typography>
                  <Typography variant="body2" fontWeight={700}>{patientName}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Appointment ID</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>#HC-{Math.random().toString(36).substring(2, 9).toUpperCase()}</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mt: 1 }}>
                  <MapPin size={16} color={theme.palette.text.secondary} />
                  <Typography variant="body2" color="text.secondary">
                    City Health Center, 123 Wellness Ave, Medical District
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Paper>

          <Stack spacing={2}>
            <Button
              component={Link}
              to="/"
              onClick={() => resetBooking()}
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
            >
              Done
            </Button>
            
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download size={18} />}
                onClick={handlePrint}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Save
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Share2 size={18} />}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Share
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Need to reschedule? <Link to="/" style={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'none' }}>Click here</Link>
          </Typography>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<ArrowLeft size={18} />}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
