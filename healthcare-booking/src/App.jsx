import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BookingProvider } from './context/BookingContext'
import { themeConfig } from './constants/theme'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'

const theme = createTheme(themeConfig)

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </ThemeProvider>
  )
}

export default App
