import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import './styles/App.css'

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <div className="wrap">
          <Routes>
            <Route path="/" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App
