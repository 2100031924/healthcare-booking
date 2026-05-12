import { useState } from 'react'
import { Paper, Typography, IconButton, Box } from '@mui/material'
import { getDatesForWeek } from '../data/doctors'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function DatePicker({ selectedDate, onSelectDate }) {
  const [offset, setOffset] = useState(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() + offset * 7)
  const dates = getDatesForWeek(weekStart)
  const monthLabel = weekStart.toLocaleString('default', { month: 'long', year: 'numeric' })

  function goBack() {
    if (offset > 0) setOffset(offset - 1)
  }

  function goForward() {
    if (offset < 4) setOffset(offset + 1)
  }

  function handleDateClick(date) {
    if (date >= today) {
      onSelectDate(date)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="600" sx={{ fontSize: 13 }}>Select Date</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>{monthLabel}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton 
            size="small" 
            onClick={goBack} 
            disabled={offset === 0} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              width: 30, 
              height: 30,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: 'primary.light', color: 'white', borderColor: 'primary.light' }
            }}
          >
            &#8249;
          </IconButton>
          <IconButton 
            size="small" 
            onClick={goForward} 
            disabled={offset >= 4} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              width: 30, 
              height: 30,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: 'primary.light', color: 'white', borderColor: 'primary.light' }
            }}
          >
            &#8250;
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex' }}>
        {DAYS.map(d => (
          <Box key={d} sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', fontSize: 11, fontWeight: 600, mb: 1 }}>
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex' }}>
        {dates.map((date, i) => {
          const isPast = date < today
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString()
          const isToday = date.toDateString() === today.toDateString()

          return (
            <Box
              key={i}
              onClick={() => handleDateClick(date)}
              sx={{
                flex: 1,
                py: 1,
                textAlign: 'center',
                cursor: isPast ? 'default' : 'pointer',
                opacity: isPast ? 0.3 : 1,
                bgcolor: isSelected ? 'primary.main' : 'transparent',
                color: isSelected ? 'white' : isToday ? 'primary.main' : 'text.primary',
                borderRadius: 1.5,
                transition: 'all 0.15s ease',
                '&:hover': isPast ? {} : { bgcolor: isSelected ? 'primary.main' : 'grey.100' }
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: isSelected || isToday ? 700 : 400 }}>
                {date.getDate()}
              </Typography>
              {isToday && (
                <Typography sx={{ fontSize: 7, fontWeight: 700, color: isSelected ? 'white' : 'primary.main' }}>
                  TODAY
                </Typography>
              )}
            </Box>
          )
        })}
      </Box>

      {selectedDate && (
        <Box 
          sx={{ 
            mt: 2, 
            p: 1.5, 
            bgcolor: 'grey.100', 
            borderRadius: 1,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, display: 'block' }}>
            Selected
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}