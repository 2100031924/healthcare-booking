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
  alpha,
  Avatar
} from '@mui/material'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export default function ChatAssistant() {
  const theme = useTheme()
  const chatEndRef = useRef(null)
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your MediBook AI assistant. How can I help you today?", isBot: true }
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
        botResponse = "You can select a date in Step 2. Just click on any day in the calendar to see available times!"
      } else if (lowerText.includes("cancel")) {
        botResponse = "Cancellation is easy! You can find a cancel link in your confirmation email or contact our support."
      } else if (lowerText.includes("support")) {
        botResponse = "Our team is here 24/7. Email us at care@medibook.com or call our hotline."
      } else if (lowerText.includes("doctor")) {
        botResponse = "We have top-rated specialists across all fields. Use the filters to find one that fits your needs."
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }])
    }, 800)
  }

  return (
    <Box sx={{ position: 'fixed', bottom: { xs: 20, sm: 32 }, right: { xs: 20, sm: 32 }, zIndex: 1000 }}>
      <Zoom in={true}>
        <Tooltip title={showChat ? "Close Chat" : "Talk to AI"} placement="left">
          <Fab 
            color="primary" 
            onClick={() => setShowChat(!showChat)}
            sx={{ 
              width: 64, 
              height: 64,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: '0 12px 24px -6px rgba(79, 70, 229, 0.4)',
              '&:hover': {
                transform: 'scale(1.05) rotate(5deg)',
              }
            }}
          >
            {showChat ? <X size={28} /> : <MessageCircle size={28} />}
          </Fab>
        </Tooltip>
      </Zoom>

      <Zoom in={showChat}>
        <Paper 
          sx={{ 
            position: 'absolute', 
            bottom: 80, 
            right: 0, 
            width: { xs: 'calc(100vw - 40px)', sm: 380 }, 
            height: 520, 
            borderRadius: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'grey.100',
            background: '#ffffff'
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
              color: 'white' 
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 44, height: 44 }}>
                <Bot size={24} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>MediBook AI</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600 }}>Always here to help</Typography>
              </Box>
            </Stack>
          </Box>
          
          <Box sx={{ flex: 1, p: 3, bgcolor: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg) => (
              <Box 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.isBot ? 'flex-start' : 'flex-end' 
                }}
              >
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: msg.isBot ? 'white' : 'primary.main', 
                    color: msg.isBot ? 'text.primary' : 'white',
                    borderRadius: msg.isBot ? '20px 20px 20px 4px' : '20px 20px 4px 20px', 
                    boxShadow: msg.isBot ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 10px 15px -3px rgba(79, 70, 229, 0.2)', 
                    maxWidth: '85%' 
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{msg.text}</Typography>
                </Box>
                <Typography variant="caption" sx={{ mt: 0.5, px: 1, color: 'text.disabled', fontWeight: 600, fontSize: '0.65rem' }}>
                  {msg.isBot ? 'AI Assistant' : 'You'}
                </Typography>
              </Box>
            ))}
            
            {messages.length < 4 && (
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.25 }}>
                <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Questions
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <QuickChip label="How to book?" onClick={() => handleSendMessage("How to select a date?")} />
                  <QuickChip label="Support" onClick={() => handleSendMessage("Contact Support")} />
                  <QuickChip label="Cancellation" onClick={() => handleSendMessage("Can I cancel later?")} />
                </Stack>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          <Box sx={{ p: 2.5, bgcolor: 'white', borderTop: '1px solid', borderColor: 'grey.100' }}>
            <Stack direction="row" spacing={1.5}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Ask me anything..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3,
                    bgcolor: 'grey.50',
                    '&:hover': { bgcolor: 'grey.100' }
                  } 
                }}
              />
              <IconButton 
                onClick={() => handleSendMessage(chatInput)}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  borderRadius: 3,
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: 'primary.dark', transform: 'scale(1.05)' }
                }}
              >
                <Send size={18} />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Zoom>
    </Box>
  )
}

function QuickChip({ label, onClick }) {
  return (
    <Chip 
      label={label} 
      size="small" 
      onClick={onClick} 
      sx={{ 
        cursor: 'pointer', 
        bgcolor: 'white', 
        border: '1px solid',
        borderColor: 'grey.200',
        fontWeight: 600,
        fontSize: '0.75rem',
        '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
      }} 
    />
  )
}
