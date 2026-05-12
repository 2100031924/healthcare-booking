import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Avatar, Box } from '@mui/material'

function formatTime(time) {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

export default function ConfirmationPopup({ open, onClose, doctor, date, slot, patientName, onConfirm }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          animation: 'scaleIn 0.2s ease'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Typography variant="h6" fontWeight="600" sx={{ fontSize: 16 }}>Confirm Booking</Typography>
        <Typography variant="body2" sx={{ fontSize: 12, opacity: 0.85 }}>Review your appointment details</Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1.5, mb: 2 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar
              src={doctor?.image}
              alt={doctor?.name}
              sx={{ width: 50, height: 50 }}
              onError={(e) => { e.target.style.opacity = 0 }}
            />
            <div style={{ flex: 1 }}>
              <Typography fontWeight="600" sx={{ fontSize: 14 }}>{doctor?.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textTransform: 'capitalize' }}>
                {doctor?.specialization}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {doctor?.experience} years exp • &#9733; {doctor?.rating}
              </Typography>
            </div>
          </div>
        </Box>

        <Box sx={{ mb: 1 }}>
          <DetailRow label="Date" value={date ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''} />
          <DetailRow label="Time" value={slot ? formatTime(slot.time) : ''} />
          <DetailRow label="Patient" value={patientName} />
        </Box>

        <Typography variant="body2" sx={{ mt: 2, p: 1.5, bgcolor: 'warning.light', color: 'warning.dark', borderRadius: 1, fontSize: 12 }}>
          A confirmation email will be sent to your email address
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          fullWidth 
          sx={{ borderRadius: 1, transition: 'all 0.15s ease' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          fullWidth 
          disableElevation 
          sx={{ borderRadius: 1, transition: 'all 0.15s ease' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography>
      <Typography variant="body2" fontWeight="600" sx={{ fontSize: 13 }}>{value}</Typography>
    </Box>
  )
}