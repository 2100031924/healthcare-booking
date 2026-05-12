import { useState, useMemo } from 'react'
import { 
  Paper, 
  Typography, 
  IconButton, 
  Box, 
  Stack, 
  Button,
  alpha,
  useTheme 
} from '@mui/material'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { 
  getDatesForWeek, 
  isToday, 
  isPastDate, 
  isSameDay, 
  DAY_ABBREVIATIONS, 
  getMonthYearLabel 
} from '../utils/helpers'
import { MAX_WEEKS_AHEAD } from '../constants'

export default function DatePicker({ selectedDate, onSelectDate }) {
  const theme = useTheme()
  const [offset, setOffset] = useState(0)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const weekDates = useMemo(() => {
    const start = new Date(today)
    start.setDate(today.getDate() + offset * 7)
    return getDatesForWeek(start)
  }, [offset, today])

  const monthLabel = useMemo(() => getMonthYearLabel(weekDates[0]), [weekDates])

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              p: 1.25,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <CalendarIcon size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
              Pick a Date
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {monthLabel}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => setOffset(Math.max(0, offset - 1))}
            disabled={offset === 0}
            sx={{ 
              border: '1px solid', 
              borderColor: 'grey.200',
              bgcolor: 'grey.50',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setOffset(Math.min(MAX_WEEKS_AHEAD, offset + 1))}
            disabled={offset >= MAX_WEEKS_AHEAD}
            sx={{ 
              border: '1px solid', 
              borderColor: 'grey.200',
              bgcolor: 'grey.50',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.5 }}>
        {DAY_ABBREVIATIONS.map((day) => (
          <Typography
            key={day}
            variant="caption"
            align="center"
            sx={{ 
              mb: 1, 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              color: 'text.secondary', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em' 
            }}
          >
            {day}
          </Typography>
        ))}

        {weekDates.map((date, idx) => {
          const past = isPastDate(date)
          const current = isToday(date)
          const selected = isSameDay(date, selectedDate)

          return (
            <Button
              key={idx}
              disabled={past}
              onClick={() => onSelectDate(date)}
              sx={{
                minWidth: 0,
                aspectRatio: '1/1',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                p: 0,
                background: selected 
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` 
                  : 'transparent',
                color: selected ? 'white' : past ? 'text.disabled' : 'text.primary',
                border: '1px solid',
                borderColor: selected ? 'transparent' : current ? alpha(theme.palette.primary.main, 0.4) : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: selected 
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` 
                    : alpha(theme.palette.primary.main, 0.05),
                  borderColor: selected ? 'transparent' : theme.palette.primary.main,
                  transform: 'scale(1.05)',
                },
                '&.Mui-disabled': { color: 'text.disabled' }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: selected || current ? 800 : 500, fontSize: '0.9rem' }}>
                {date.getDate()}
              </Typography>
              {current && !selected && (
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.25 }} />
              )}
            </Button>
          )
        })}
      </Box>

      {selectedDate && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.success.main, 0.05),
            border: '1px dashed',
            borderColor: alpha(theme.palette.success.main, 0.2),
            animation: 'fadeIn 0.4s ease-out'
          }}
        >
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Selected Date
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
