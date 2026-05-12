import { Card, CardContent, Typography, Button, Chip, Avatar, Box } from '@mui/material'

export default function DoctorCard({ doctor, isSelected, onSelect }) {
  const slotsAvailable = doctor.availableSlots.filter(s => s.available).length

  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 2,
        transition: 'all 0.15s ease',
        '&:hover': { 
          borderColor: isSelected ? 'primary.main' : 'grey.400',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={doctor.image}
              alt={doctor.name}
              sx={{ width: 60, height: 60 }}
              onError={(e) => { e.target.style.opacity = 0 }}
            />
            {slotsAvailable > 0 && (
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 12,
                height: 12,
                bgcolor: 'success.main',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            )}
          </Box>

          <div style={{ flex: 1 }}>
            <Typography fontWeight="600" sx={{ fontSize: 15, mb: 0.5 }}>{doctor.name}</Typography>
            <Chip
              label={doctor.specialization}
              size="small"
              sx={{
                fontSize: 11,
                height: 22,
                textTransform: 'capitalize',
                mb: 1,
                bgcolor: 'primary.light',
                color: 'white'
              }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                {doctor.experience} years
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#f9a825', fontWeight: 600 }}>
                &#9733; {doctor.rating}
              </Typography>
            </div>
          </div>
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="body2"
            sx={{ fontSize: 12, color: slotsAvailable > 0 ? 'success.main' : 'text.disabled', fontWeight: 500 }}
          >
            {slotsAvailable} slots available
          </Typography>
          <Button
            size="small"
            variant={isSelected ? 'contained' : 'outlined'}
            disableElevation
            onClick={(e) => { e.stopPropagation(); onSelect() }}
            sx={{ borderRadius: 1.5, px: 2, fontSize: 12, fontWeight: 600 }}
          >
            {isSelected ? '✓ Selected' : 'Book'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}