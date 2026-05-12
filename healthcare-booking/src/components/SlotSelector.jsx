import { useMemo } from 'react'
import { 
  Paper, 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Stack,
  alpha,
  useTheme,
  Divider
} from '@mui/material'
import { Clock, Sun, CloudSun, Moon } from 'lucide-react'
import { formatTime } from '../utils/helpers'

export default function SlotSelector({ slots, selectedSlot, onSelectSlot }) {
  const theme = useTheme()
  const availableSlotsCount = slots.filter(s => s.available).length

  const groupedSlots = useMemo(() => {
    const morning = []
    const afternoon = []
    const evening = []

    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0], 10)
      if (hour < 12) morning.push(slot)
      else if (hour < 17) afternoon.push(slot)
      else evening.push(slot)
    })

    return { morning, afternoon, evening }
  }, [slots])

  if (!slots.length || availableSlotsCount === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Clock size={40} color={theme.palette.text.disabled} style={{ margin: '0 auto 16px' }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No slots available
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Please try selecting another date or doctor.
        </Typography>
      </Paper>
    )
  }

  const renderSlotGroup = (title, icon, groupSlots) => {
    if (groupSlots.length === 0) return null

    return (
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          {icon}
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
        </Stack>
        <Grid container spacing={1}>
          {groupSlots.map((slot, i) => {
            const isSelected = selectedSlot?.time === slot.time
            return (
              <Grid item xs={4} sm={3} md={4} key={i}>
                <Button
                  fullWidth
                  variant={isSelected ? 'contained' : 'outlined'}
                  disabled={!slot.available}
                  onClick={() => onSelectSlot(slot)}
                  sx={{
                    py: 1,
                    px: 0.5,
                    fontSize: '0.8rem',
                    borderRadius: 2,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.main' : 'background.paper',
                    color: isSelected ? 'white' : slot.available ? 'text.primary' : 'text.disabled',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.main' : alpha(theme.palette.primary.main, 0.05),
                      borderColor: 'primary.main',
                    },
                    '&.Mui-disabled': {
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                      borderColor: 'divider',
                      color: 'text.disabled',
                      textDecoration: 'line-through',
                    }
                  }}
                >
                  {formatTime(slot.time)}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
              display: 'flex',
            }}
          >
            <Clock size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
              Available Time Slots
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {availableSlotsCount} slots found
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ mt: 2 }}>
        {renderSlotGroup('Morning', <Sun size={14} color="#f59e0b" />, groupedSlots.morning)}
        {renderSlotGroup('Afternoon', <CloudSun size={14} color="#f59e0b" />, groupedSlots.afternoon)}
        {renderSlotGroup('Evening', <Moon size={14} color="#6366f1" />, groupedSlots.evening)}
      </Box>

      {selectedSlot && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.05),
            border: '1px dashed',
            borderColor: alpha(theme.palette.success.main, 0.2),
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box sx={{ color: 'success.main' }}>
            <Clock size={18} />
          </Box>
          <Box>
            <Typography variant="caption" color="success.main" fontWeight={700} sx={{ display: 'block', textTransform: 'uppercase' }}>
              Selected Time
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatTime(selectedSlot.time)}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
