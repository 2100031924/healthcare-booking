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

  const handlePrev = () => setOffset((prev) => Math.max(0, prev - 1))
  const handleNext = () => setOffset((prev) => Math.min(MAX_WEEKS_AHEAD, prev + 1))

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <CalendarIcon size={20} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
              Select Appointment Date
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {monthLabel}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={handlePrev}
            disabled={offset === 0}
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleNext}
            disabled={offset >= MAX_WEEKS_AHEAD}
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {DAY_ABBREVIATIONS.map((day) => (
          <Typography
            key={day}
            variant="caption"
            align="center"
            fontWeight={700}
            color="text.secondary"
            sx={{ mb: 1, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
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
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                p: 0,
                bgcolor: selected ? 'primary.main' : 'transparent',
                color: selected ? 'white' : past ? 'text.disabled' : 'text.primary',
                border: '1px solid',
                borderColor: selected ? 'primary.main' : current ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: selected ? 'primary.main' : alpha(theme.palette.primary.main, 0.05),
                  borderColor: selected ? 'primary.main' : 'primary.main',
                },
                '&.Mui-disabled': {
                  color: 'text.disabled',
                }
              }}
            >
              <Typography variant="body2" fontWeight={selected || current ? 700 : 500}>
                {date.getDate()}
              </Typography>
              {current && !selected && (
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.25,
                  }}
                />
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
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: '1px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
            Selected Date
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
