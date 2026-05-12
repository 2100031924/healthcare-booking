import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Avatar, 
  Box,
  Stack,
  Divider,
  IconButton,
  alpha,
  useTheme
} from '@mui/material'
import { X, Calendar, Clock, User, ShieldCheck, Mail, Phone } from 'lucide-react'
import { formatTime, formatCompactDate } from '../utils/helpers'

export default function ConfirmationPopup({ 
  open, 
  onClose, 
  doctor, 
  date, 
  slot, 
  patientDetails, 
  onConfirm 
}) {
  const theme = useTheme()

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 3, py: 3, position: 'relative' }}>
          <Typography variant="h6" fontWeight={700}>
            Confirm Appointment
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Please review your booking details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'white',
              '&:hover': { bgcolor: alpha('#fff', 0.1) }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 4 }}>
        <Stack spacing={3}>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={doctor?.image}
                alt={doctor?.name}
                sx={{ width: 56, height: 56, borderRadius: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {doctor?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {doctor?.title}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack spacing={2}>
            <DetailItem 
              icon={<Calendar size={18} color={theme.palette.primary.main} />} 
              label="Date" 
              value={date ? formatCompactDate(date) : ''} 
            />
            <DetailItem 
              icon={<Clock size={18} color={theme.palette.primary.main} />} 
              label="Time Slot" 
              value={slot ? formatTime(slot.time) : ''} 
            />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <DetailItem 
              icon={<User size={18} color={theme.palette.primary.main} />} 
              label="Patient Name" 
              value={patientDetails.name} 
            />
            <DetailItem 
              icon={<Mail size={18} color={theme.palette.primary.main} />} 
              label="Email" 
              value={patientDetails.email} 
            />
            <DetailItem 
              icon={<Phone size={18} color={theme.palette.primary.main} />} 
              label="Phone" 
              value={patientDetails.phone} 
            />
          </Stack>

          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              display: 'flex',
              gap: 1.5
            }}
          >
            <ShieldCheck size={20} color={theme.palette.info.main} />
            <Typography variant="caption" color="info.main" sx={{ lineHeight: 1.4 }}>
              Your appointment is secured. You will receive a confirmation email and SMS shortly after booking.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={onClose}
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          Go Back
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onConfirm}
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box 
        sx={{ 
          width: 36, 
          height: 36, 
          borderRadius: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.100'
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: -0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Stack>
  )
}
