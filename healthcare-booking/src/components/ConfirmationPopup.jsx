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
import { X, Calendar, Clock, User, ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react'
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
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            px: 4, 
            py: 4, 
            position: 'relative',
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Confirm Booking
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, mt: 0.5 }}>
            Verify your appointment details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 4 }}>
        <Stack spacing={4}>
          <Box 
            sx={{ 
              p: 2.5, 
              borderRadius: 4, 
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Avatar
                src={doctor?.image}
                alt={doctor?.name}
                sx={{ width: 64, height: 64, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {doctor?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                  {doctor?.title}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack spacing={3}>
            <DetailItem 
              icon={<Calendar size={20} color={theme.palette.primary.main} />} 
              label="Date" 
              value={date ? formatCompactDate(date) : ''} 
            />
            <DetailItem 
              icon={<Clock size={20} color={theme.palette.primary.main} />} 
              label="Time Slot" 
              value={slot ? formatTime(slot.time) : ''} 
            />
            <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />
            <DetailItem 
              icon={<User size={20} color={theme.palette.primary.main} />} 
              label="Patient" 
              value={patientDetails.name} 
            />
            <DetailItem 
              icon={<Mail size={20} color={theme.palette.primary.main} />} 
              label="Email" 
              value={patientDetails.email} 
            />
            <DetailItem 
              icon={<Phone size={20} color={theme.palette.primary.main} />} 
              label="Phone" 
              value={patientDetails.phone} 
            />
          </Stack>

          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              bgcolor: 'success.light',
              color: 'success.dark',
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}
          >
            <ShieldCheck size={24} />
            <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
              Your session is protected. No payment is required for this confirmation.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 0, gap: 2 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={onClose}
          sx={{ borderRadius: 3, py: 1.75, fontWeight: 700, borderColor: 'grey.200', color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={onConfirm}
          endIcon={<ArrowRight size={18} />}
          sx={{ borderRadius: 3, py: 1.75, fontWeight: 800 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={2.5} alignItems="center">
      <Box 
        sx={{ 
          width: 44, 
          height: 44, 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.100',
          color: 'primary.main'
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.25, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Stack>
  )
}
