import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle, Bot, User } from 'lucide-react'
import './ChatAssistant.scss'

const AI_RESPONSES = {
  greeting: [
    "Hello! I'm your AI healthcare assistant. How can I help you today?",
    "Hi there! I can help you with booking appointments, doctor info, or general health questions.",
  ],
  booking: [
    "To book an appointment:\n1. Select a doctor from the list\n2. Choose your preferred date and time\n3. Fill in your details and confirm\n\nWould you like help finding a specific specialist?",
  ],
  doctor: [
    "We have doctors in these specialties:\n• Cardiology - Dr. Rajesh Sharma\n• Dermatology - Dr. Priya Patel\n• General - Dr. Ankit Verma\n• Neurology - Dr. Sachin Gupta\n• Pediatrics - Dr. William Singh\n\nWhich specialist would you like to see?",
  ],
  cardiology: [
    "Dr. Rajesh Sharma is our Senior Cardiologist with 12 years of experience. He specializes in interventional cardiology and heart failure management. Rating: 4.8/5 (124 reviews).",
  ],
  dermatology: [
    "Dr. Priya Patel is our Consultant Dermatologist with 8 years of experience. She specializes in clinical dermatology and aesthetic procedures. Rating: 4.7/5 (89 reviews).",
  ],
  general: [
    "Dr. Ankit Verma is our Family Physician with 10 years of experience. He provides comprehensive primary care. Rating: 4.9/5 (156 reviews).",
  ],
  neurology: [
    "Dr. Sachin Gupta is our Neurologist with 15 years of experience. He's an expert in treating complex neurological disorders. Rating: 4.6/5 (210 reviews).",
  ],
  pediatrics: [
    "Dr. William Singh is our Pediatric Specialist with 14 years of experience. He's dedicated to compassionate care for children. Rating: 4.9/5 (312 reviews).",
  ],
  timing: [
    "Our consultation hours are 8:00 AM to 6:00 PM. Each appointment slot is 30 minutes. Available slots are shown when you select a doctor and date.",
  ],
  cancel: [
    "To cancel or reschedule an appointment, please contact our support team or use the 'Book Another Appointment' link on your confirmation page.",
  ],
  emergency: [
    "⚠️ If this is a medical emergency, please call emergency services immediately (108 or 112). This booking system is for non-emergency appointments only.",
  ],
  fees: [
    "Consultation fees vary by specialist. Please check the doctor's profile card for details, or contact our support for exact pricing.",
  ],
  thanks: [
    "You're welcome! Is there anything else I can help you with?",
    "Happy to help! Feel free to ask if you have more questions.",
  ],
  default: [
    "I'm not sure about that. I can help with:\n• Booking appointments\n• Doctor information\n• Available timings\n• Cancellations\n\nWhat would you like to know?",
    "Could you rephrase that? I can assist with doctor bookings, specialties, and appointment details.",
  ],
}

function getAIResponse(message) {
  const msg = message.toLowerCase()

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste')) {
    return AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)]
  }
  if (msg.includes('emergenc') || msg.includes('urgent') || msg.includes('ambulance') || msg.includes('911') || msg.includes('108')) {
    return AI_RESPONSES.emergency[0]
  }
  if (msg.includes('book') || msg.includes('appointment') || msg.includes('schedule') || msg.includes('how to')) {
    return AI_RESPONSES.booking[0]
  }
  if (msg.includes('doctor') || msg.includes('specialist') || msg.includes('specialty') || msg.includes('list')) {
    return AI_RESPONSES.doctor[0]
  }
  if (msg.includes('cardio') || msg.includes('heart')) {
    return AI_RESPONSES.cardiology[0]
  }
  if (msg.includes('derma') || msg.includes('skin')) {
    return AI_RESPONSES.dermatology[0]
  }
  if (msg.includes('general') || msg.includes('physician') || msg.includes('family')) {
    return AI_RESPONSES.general[0]
  }
  if (msg.includes('neuro') || msg.includes('brain') || msg.includes('nerve')) {
    return AI_RESPONSES.neurology[0]
  }
  if (msg.includes('pediatric') || msg.includes('child') || msg.includes('kid') || msg.includes('baby')) {
    return AI_RESPONSES.pediatrics[0]
  }
  if (msg.includes('time') || msg.includes('hour') || msg.includes('slot') || msg.includes('when') || msg.includes('available')) {
    return AI_RESPONSES.timing[0]
  }
  if (msg.includes('cancel') || msg.includes('reschedule') || msg.includes('change')) {
    return AI_RESPONSES.cancel[0]
  }
  if (msg.includes('fee') || msg.includes('cost') || msg.includes('price') || msg.includes('charge') || msg.includes('pay')) {
    return AI_RESPONSES.fees[0]
  }
  if (msg.includes('thank') || msg.includes('thanks')) {
    return AI_RESPONSES.thanks[Math.floor(Math.random() * AI_RESPONSES.thanks.length)]
  }

  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)]
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI healthcare assistant. How can I help you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), text: input.trim(), sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getAIResponse(userMsg.text)
      const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { label: 'Book Appointment', query: 'How do I book an appointment?' },
    { label: 'Find Doctor', query: 'Show me the list of doctors' },
    { label: 'Timings', query: 'What are the available timings?' },
    { label: 'Emergency', query: 'This is an emergency' },
  ]

  return (
    <div className="chat-assistant">
      {!open && (
        <button className="chat-toggle" onClick={() => setOpen(true)}>
          <MessageCircle size={24} />
          <span className="pulse-dot" />
        </button>
      )}

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={14} />
                </div>
                <div className="message-bubble typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="quick-actions">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="quick-btn"
                  onClick={() => {
                    setInput(action.query)
                    setTimeout(() => {
                      const userMsg = { id: Date.now(), text: action.query, sender: 'user' }
                      setMessages(prev => [...prev, userMsg])
                      setInput('')
                      setIsTyping(true)
                      setTimeout(() => {
                        const response = getAIResponse(action.query)
                        const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' }
                        setMessages(prev => [...prev, botMsg])
                        setIsTyping(false)
                      }, 800 + Math.random() * 700)
                    }, 100)
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
