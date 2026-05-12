import { Paper, Typography, Button, Grid, Box } from '@mui/material'

function formatTime(time) {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

export default function SlotSelector({ slots, selectedSlot, onSelectSlot }) {
  const openSlots = slots.filter(s => s.available).length

  if (!slots.length || openSlots === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          No slots available
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: 13 }}>Time Slots</Typography>
        <Typography
          variant="caption"
          sx={{ fontSize: 10, fontWeight: 600, color: 'success.dark', bgcolor: 'success.light', px: 1, py: 0.25, borderRadius: 0.5 }}
        >
          {openSlots} open
        </Typography>
      </Box>

      <Grid container spacing={1}>
        {slots.map((slot, i) => {
          const isSelected = selectedSlot?.time === slot.time

          return (
            <Grid item xs={4} key={i}>
              <Button
                fullWidth
                size="small"
                variant={isSelected ? 'contained' : 'outlined'}
                disabled={!slot.available}
                onClick={() => onSelectSlot(slot)}
                disableElevation
                sx={{
                  py: 0.75,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 400,
                  borderRadius: 1,
                  textDecoration: !slot.available ? 'line-through' : 'none',
                  color: !slot.available ? 'text.disabled' : isSelected ? 'white' : 'text.primary',
                  borderColor: !slot.available ? 'grey.300' : 'grey.400',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: !slot.available ? 'transparent' : isSelected ? 'primary.main' : 'grey.100'
                  }
                }}
              >
                {formatTime(slot.time)}
              </Button>
            </Grid>
          )
        })}
      </Grid>

      {selectedSlot && (
        <Box 
          sx={{ 
            mt: 2, 
            p: 1.5, 
            bgcolor: 'success.light', 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'success.dark' }}>
            {formatTime(selectedSlot.time)} selected
          </Typography>
        </Box>
      )}
    </Paper>
  )
}