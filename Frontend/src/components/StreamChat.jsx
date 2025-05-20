import { useState, useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/global/StreamChat.css'

export const StreamChat = () => {
  const [chatMessage, setChatMessage] = useState('');
  const { courseId } = useParams();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(()=> {
    scrollToBottom();
  }, [messages])

  useEffect(()=> {

    if(!courseId || !user.uuid) return;
    socketService.connectSocket();
    socketService.joinRoom(courseId, user.uuid);
    socketService.onMessage((message) => {
      setMessages(prev => [...prev, message])
    });

    return () => {
      socketService.offMessage();
      socketService.leaveRoom(courseId);
    }
  }, [courseId], [user.uuid]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = chatMessage.trim();
    if (!trimmedMessage || trimmedMessage.length > 200) return;



    const messageId = Date.now();
    const messageStructure = {
      id: messageId,
      text: chatMessage,
      username: user.username,
    }

    setMessages(prev => [...prev, messageStructure]);
    socketService.sendMessage(courseId, chatMessage, messageId, user.username);
    setChatMessage('');

  };
  return (
    <div className="stream-view-chat">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <button className="chat-toggle">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <span className="chat-username">{msg.username}</span>
            <span className="chat-text">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          maxLength={200}
        />
        <button type="submit">
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  )
}
