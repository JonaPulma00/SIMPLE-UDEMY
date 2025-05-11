import React from 'react'
import '../styles/global/StreamChat.css'
export const StreamChat = () => {
  return (
    <div className="stream-view-chat">
    <div className="chat-header">
      <h3>Live Chat</h3>
      <button className="chat-toggle">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
    
    <div className="chat-messages">
    </div>
    
    <form className="chat-input" onSubmit={handleSendMessage}>
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      />
      <button type="submit">
        <i className="fas fa-paper-plane"></i>
      </button>
    </form>
  </div>
  )
}
