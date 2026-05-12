import { Link } from 'react-router-dom'
import { Container, Typography, Paper, Button, Box } from '@mui/material'
import { CheckCircle } from 'lucide-react'

export default function ConfirmationPage() {
  const params = new URLSearchParams(window.location.search)
  const doctorName = decodeURIComponent(params.get('doctor') || 'Doctor')
  const appointmentDate = params.get('date') || 'Date'
  const appointmentTime = params.get('time') || 'Time'

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 5 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          {/* Success Icon */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <CheckCircle size={52} color="success.main" />
            <Box sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              bgcolor: 'success.main',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              animation: 'bounceIn 0.3s ease'
            }}>
              <Typography sx={{ color: 'white', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
                &#10003;
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" fontWeight="600" gutterBottom sx={{ fontSize: { xs: 22, sm: 26 } }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: 14 }}>
            Your appointment has been scheduled successfully
          </Typography>

          {/* Details Card */}
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1.5, textAlign: 'left', mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, fontWeight: 700, display: 'block', mb: 1.5 }}>
              APPOINTMENT DETAILS
            </Typography>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>Doctor</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: 13 }}>{doctorName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>Date</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: 13 }}>{appointmentDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>Time</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: 13, color: 'success.main' }}>{appointmentTime}</Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
            Please arrive 15 minutes early with your ID proof
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            fullWidth
            size="large"
            disableElevation
            sx={{ borderRadius: 1.5, py: 1.5, fontWeight: 600, transition: 'all 0.15s ease' }}
          >
            Book Another Appointment
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}