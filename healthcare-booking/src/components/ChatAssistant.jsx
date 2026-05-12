import { useState, useEffect, useRef } from 'react'
import { 
  Typography, 
  TextField, 
  Paper, 
  Stack, 
  Box, 
  IconButton, 
  Fab, 
  Zoom, 
  Tooltip, 
  Chip, 
  useTheme, 
  alpha 
} from '@mui/material'
import { MessageCircle, X, Send } from 'lucide-react'

export default function ChatAssistant() {
  const theme = useTheme()
  const chatEndRef = useRef(null)
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your MediBook assistant. How can I help you with your booking today?", isBot: true }
  ])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showChat])

  const handleSendMessage = (text) => {
    if (!text.trim()) return

    const userMsg = { id: Date.now(), text, isBot: false }
    setMessages(prev => [...prev, userMsg])
    setChatInput('')

    setTimeout(() => {
      let botResponse = "I'm processing your request. Please hold on a moment."
      const lowerText = text.toLowerCase()
      
      if (lowerText.includes("date")) {
        botResponse = "In Step 2, you can select any date from the weekly calendar. Click the arrows to see future weeks!"
      } else if (lowerText.includes("cancel")) {
        botResponse = "Yes, you can cancel your appointment anytime through the link in your confirmation email."
      } else if (lowerText.includes("support")) {
        botResponse = "You can reach our support team at support@medibook.com or call +1-800-MED-BOOK."
      } else if (lowerText.includes("doctor")) {
        botResponse = "We have experts in Cardiology, Dermatology, Pediatrics, and more. Use the filters to find the right specialist."
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }])
    }, 600)
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
      <Zoom in={true}>
        <Tooltip title={showChat ? "Close Assistant" : "Help Assistant"} placement="left">
          <Fab 
            color="primary" 
            onClick={() => setShowChat(!showChat)}
            sx={{ boxShadow: theme.shadows[10] }}
          >
            {showChat ? <X /> : <MessageCircle />}
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom in={showChat}>
        <Paper 
          sx={{ 
            position: 'absolute', 
            bottom: 80, 
            right: 0, 
            width: { xs: 300, sm: 350 }, 
            height: 450, 
            borderRadius: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            boxShadow: theme.shadows[20],
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle1" fontWeight={700}>MediBook AI Assistant</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Online • Available 24/7</Typography>
          </Box>
          
          <Box sx={{ flex: 1, p: 2, bgcolor: 'grey.50', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ mb: 2, display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: msg.isBot ? 'white' : 'primary.main', 
                    color: msg.isBot ? 'text.primary' : 'white',
                    borderRadius: msg.isBot ? '12px 12px 12px 0' : '12px 12px 0 12px', 
                    boxShadow: theme.shadows[1], 
                    maxWidth: '85%' 
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </Box>
            ))}
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Quick actions:</Typography>
              <Chip 
                label="How to select a date?" 
                size="small" 
                onClick={() => handleSendMessage("How to select a date?")} 
                sx={{ cursor: 'pointer', bgcolor: 'white' }} 
              />
              <Chip 
                label="Can I cancel later?" 
                size="small" 
                onClick={() => handleSendMessage("Can I cancel later?")} 
                sx={{ cursor: 'pointer', bgcolor: 'white' }} 
              />
              <Chip 
                label="Contact Support" 
                size="small" 
                onClick={() => handleSendMessage("Contact Support")} 
                sx={{ cursor: 'pointer', bgcolor: 'white' }} 
              />
            </Box>
            <div ref={chatEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Type your message..." 
                variant="outlined"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
              />
              <IconButton color="primary" onClick={() => handleSendMessage(chatInput)}>
                <Send size={20} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Zoom>
    </Box>
  )
}
