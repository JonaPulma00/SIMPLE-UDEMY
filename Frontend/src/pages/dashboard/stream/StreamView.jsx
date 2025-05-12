import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socketService } from '../../../services/socketService';
import { Sidebar } from '../../../components/Sidebar';
import { StreamChat } from '../../../components/StreamChat';
import { useUser } from '../../../context/UserContext';
import '../../../styles/dashboard/stream/StreamView.css';

export const StreamView = () => {
  const { courseId } = useParams();
  const { user } = useUser();
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    socketService.connectSocket();
    socketService.joinRoom(courseId, user.uuid);
    socketService.startWatcher(courseId);

    socketService.onOffer(({ offer, from }) => {
      if (to === courseId) {
        const pc = new RTCPeerConnection(servers);
        peerConnectionRef.current = pc;
     
        console.log("")
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socketService.sendIceCandidate(courseId, e.candidate);
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play().catch((err) => {
              console.error("Error playing video:", err);
            });
          }
        };
        
        pc.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => pc.createAnswer())
        .then((answer) => pc.setLocalDescription(answer))
        .then(() => {
          socketService.sendAnswer(from, pc.localDescription);
        })
        .catch((err) => {
          console.error("Error handling offer", err);
        });
      }
    });

    socketService.onIceCandidate(({ candidate, from }) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
          .catch((err) => {
            console.error("Error adding ICE candidate", err);
          });
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketService.leaveRoom(courseId);
    };
  }, [courseId]);

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
                ref={remoteVideoRef} 
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
      <StreamChat />
    </div>
  );
};
