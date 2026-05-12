import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Avatar, 
  Box, 
  Rating,
  Stack,
  Divider,
  alpha,
  useTheme
} from '@mui/material'
import { 
  Clock, 
  GraduationCap, 
  Languages, 
  Star,
  CheckCircle2,
  Calendar
} from 'lucide-react'

export default function DoctorCard({ doctor, isSelected, onSelect }) {
  const theme = useTheme()
  const availableSlotsCount = doctor.availableSlots.filter(s => s.available).length

  return (
    <Card
      onClick={onSelect}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.02) : 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[3],
        },
      }}
    >
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            color: 'primary.main',
          }}
        >
          <CheckCircle2 size={24} fill={theme.palette.primary.main} color="white" />
        </Box>
      )}

      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Stack direction="row" spacing={2.5} alignItems="flex-start">
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={doctor.image}
              alt={doctor.name}
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
            {availableSlotsCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: 'success.main',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.25 }}>
                  {doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
                  {doctor.title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <Chip
                label={doctor.specialization}
                size="small"
                sx={{
                  textTransform: 'capitalize',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" />
                <Typography variant="caption" fontWeight={700}>
                  {doctor.rating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({doctor.reviews} reviews)
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ mt: 2.5 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Clock size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                <strong>{doctor.experience} years</strong> professional experience
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <GraduationCap size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {doctor.education}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Languages size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="text.secondary">
                {doctor.languages.join(', ')}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </CardContent>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, bgcolor: isSelected ? 'transparent' : alpha(theme.palette.grey[50], 0.5) }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Calendar size={14} color={availableSlotsCount > 0 ? theme.palette.success.main : theme.palette.text.disabled} />
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: availableSlotsCount > 0 ? 'success.main' : 'text.disabled' }}
            >
              {availableSlotsCount} slots available today
            </Typography>
          </Stack>
          <Button
            variant={isSelected ? 'contained' : 'outlined'}
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            sx={{
              minWidth: 100,
              borderRadius: 2,
            }}
          >
            {isSelected ? 'Selected' : 'Book Now'}
          </Button>
        </Stack>
      </Box>
    </Card>
  )
}
