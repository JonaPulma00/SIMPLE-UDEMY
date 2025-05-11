import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../../services/socketService';
import { Sidebar } from '../../../components/Sidebar';
import { useUser } from '../../../context/UserContext';
import '../../../styles/dashboard/stream/StreamView.css';

export const StreamView = () => {
  const { courseId } = useParams();
  const { user } = useUser();
  const videoRef = useRef(null);
  const [chatMessage, setChatMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    console.log("Message sent:", chatMessage);
    setChatMessage("");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="stream-view-content">
        <div className="stream-view-header">
          <h2>Live Stream</h2>
          <div className="stream-info">
            <span className="stream-course-id">Course: {courseId}</span>
            <span className="stream-status">LIVE</span>
          </div>
        </div>
        
        <div className="stream-view-layout">
          <div className="stream-view-main">
            <div className="stream-video-container">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="remote-video"
              />
              <div className="video-controls">
                <button className="control-btn mute-btn">
                  <i className="fas fa-volume-up"></i>
                </button>
                <button className="control-btn fullscreen-btn">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};