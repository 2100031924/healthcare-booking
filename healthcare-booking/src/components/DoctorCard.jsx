import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Avatar, 
  Box, 
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
  Calendar,
  ChevronRight
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
        overflow: 'hidden',
        background: isSelected 
          ? `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, #ffffff)` 
          : '#ffffff',
        border: '1px solid',
        borderColor: isSelected ? theme.palette.primary.main : theme.palette.grey[200],
        '&:hover': {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-4px)',
          '& .doctor-image': {
            transform: 'scale(1.05)',
          },
          '& .action-button': {
            background: theme.palette.primary.main,
            color: '#fff',
          }
        },
      }}
    >
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            color: 'primary.main',
            animation: 'scaleIn 0.3s ease-out',
          }}
        >
          <CheckCircle2 size={24} fill={theme.palette.primary.main} color="white" />
        </Box>
      )}

      <CardContent sx={{ p: 3, pb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={2.5} alignItems="flex-start">
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={doctor.image}
              alt={doctor.name}
              className="doctor-image"
              sx={{ 
                width: 72, 
                height: 72, 
                borderRadius: '16px',
                transition: 'transform 0.3s ease',
                boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: availableSlotsCount > 0 ? 'success.main' : 'grey.400',
                border: '3px solid white',
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.25, lineHeight: 1.2, fontWeight: 700 }}>
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ mb: 1, fontSize: '0.8rem' }}>
              {doctor.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" />
                <Typography variant="caption" fontWeight={700} color="text.primary">
                  {doctor.rating}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">•</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {doctor.reviews} Reviews
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ mt: 3, mb: 'auto' }}>
          <Stack spacing={1.5}>
            <InfoRow icon={<Clock size={16} />} label={`${doctor.experience} Years Exp`} />
            <InfoRow icon={<GraduationCap size={16} />} label={doctor.education} />
            <InfoRow icon={<Languages size={16} />} label={doctor.languages.join(', ')} />
          </Stack>
        </Box>

        <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={doctor.specialization}
            size="small"
            sx={{
              textTransform: 'capitalize',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24,
            }}
          />
        </Box>
      </CardContent>

      <Divider sx={{ opacity: 0.6 }} />

      <Box sx={{ p: 3, bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.02) : 'transparent' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box sx={{ minWidth: 'fit-content' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Availability
            </Typography>
            <Typography variant="body2" fontWeight={700} color={availableSlotsCount > 0 ? 'success.main' : 'text.disabled'}>
              {availableSlotsCount} Slots Left
            </Typography>
          </Box>
          <Button
            className="action-button"
            variant={isSelected ? 'contained' : 'outlined'}
            size="small"
            endIcon={!isSelected && <ChevronRight size={14} />}
            sx={{
              borderRadius: '8px',
              px: isSelected ? 3 : 2,
              fontWeight: 700,
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {isSelected ? 'Selected' : 'Book Now'}
          </Button>
        </Stack>
      </Box>
    </Card>
  )
}

function InfoRow({ icon, label }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
        {label}
      </Typography>
    </Stack>
  )
}
