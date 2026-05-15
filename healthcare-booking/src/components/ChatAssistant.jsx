import { useState } from 'react'
import '../styles/ChatAssistant.css'

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <div className="box">
      <button className="toggle" onClick={() => setOpen(!open)}>
        {open ? 'X' : '?'}
      </button>
      
      {open && (
        <div className="window">
          <div className="body">
            <p>Hello!</p>
          </div>
        </div>
      )}
    </div>
  )
}
