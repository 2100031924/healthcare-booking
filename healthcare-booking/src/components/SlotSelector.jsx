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
} from '@mui/material'
import { Clock, Sun, CloudSun, Moon, Sparkles } from 'lucide-react'
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
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'grey.100',
          borderRadius: 4,
          bgcolor: 'grey.50'
        }}
      >
        <Clock size={48} color={theme.palette.text.disabled} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>
          No Slots Available
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 200, mx: 'auto', mt: 1 }}>
          Please try another date or doctor for more options.
        </Typography>
      </Paper>
    )
  }

  const renderSlotGroup = (title, icon, groupSlots) => {
    if (groupSlots.length === 0) return null

    return (
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ color: 'text.secondary', display: 'flex', p: 0.75, borderRadius: '8px', bgcolor: 'grey.50' }}>{icon}</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
            {title}
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
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
                    py: 1.25,
                    borderRadius: '12px',
                    borderColor: isSelected ? 'transparent' : 'grey.200',
                    background: isSelected 
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` 
                      : '#ffffff',
                    color: isSelected ? 'white' : slot.available ? 'text.primary' : 'text.disabled',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none',
                    '&:hover': {
                      background: isSelected 
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` 
                        : alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'grey.50',
                      borderColor: 'grey.100',
                      textDecoration: 'line-through',
                      opacity: 0.6
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
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%', 
        border: '1px solid', 
        borderColor: 'grey.100',
        borderRadius: 4,
        background: '#ffffff'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box
          sx={{
            p: 1.25,
            borderRadius: '12px',
            bgcolor: alpha(theme.palette.success.main, 0.08),
            color: 'success.main',
            display: 'flex',
          }}
        >
          <Clock size={20} />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
            Available Slots
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {availableSlotsCount} Times Found
          </Typography>
        </Box>
      </Stack>

      <Box>
        {renderSlotGroup('Morning', <Sun size={16} color="#f59e0b" />, groupedSlots.morning)}
        {renderSlotGroup('Afternoon', <CloudSun size={16} color="#f59e0b" />, groupedSlots.afternoon)}
        {renderSlotGroup('Evening', <Moon size={16} color="#6366f1" />, groupedSlots.evening)}
      </Box>

      {selectedSlot && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: '1px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            animation: 'fadeIn 0.4s ease-out'
          }}
        >
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <Sparkles size={20} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Confirmed Selection
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {formatTime(selectedSlot.time)} Appointment
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
