import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#388e3c' },
    error: { main: '#d32f2f' },
    warning: { main: '#f57c00' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#212121', secondary: '#757575' },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500 },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } }
      }
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.12)' } }
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } }
    },
    MuiTextField: {
      defaultProps: { size: 'small' }
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } }
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App