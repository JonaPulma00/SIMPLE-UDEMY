import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket, socketService } from "../../../services/socketService";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { StreamChat } from "../../../components/StreamChat";
import "../../../styles/dashboard/stream/StartStream.css";

export const StartStream = () => {
  const { user } = useUser();
  const { courseId } = useParams();
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState(false)
  

  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
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
    if (!courseId) return;

    //asseguar conexió
    socketService.connectSocket();
    
    socketService.joinRoom(courseId, user.uuid); 

    socketService.onWatcher((whatcherId) => {
      console.log("New watcher connected", whatcherId);
    });

    //crear la conexio
    const pc = new RTCPeerConnection(servers);
    peerConnectionRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }
    //enviar ice candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketService.sendIceCandidate(courseId, e.candidate);
      }
    };
  
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        socketService.sendOffer(watcherId, pc.localDescription)
      })
      .catch((err) => {
        console.error("Error creating offer", err);
      });

      socketService.onAnswer(({ answer, from }) => {
        if (from === watcherId) {
          pc.setRemoteDescription(new RTCSessionDescription(answer))
          .catch((err) => {
            console.error("Error setting remote description", err);
          });
        }
      });

    return () => {
      pc.close();
      if (isStreaming) {
        endStream();
      }
      socketService.endStream(courseId);
    socketService.leaveRoom(courseId);
    };
  }, [courseId, user?.uuid]);

  const handleWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      localVideoRef.current.srcObject = stream;
      localStreamRef.current = stream;

     socketService.startStream(courseId);
     setIsStreaming(true);

      //crear offer despres d'obtenir els permisos
      createOffer();
    } catch (err) {
      setStreamError("Error accessing webcam: " + err.message);
      console.error("Error accessing webcam:", err);
    }
  };

  const createOffer = async () => {
    try {
      const pc = peerConnectionRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      //enviar offer
      socketService.sendOffer(courseId, offer);
    } catch (err) {
      console.error("Error creating offer", err);
    }
  };

  const endStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    socketService.endStream(courseId);
    setIsStreaming(false)

  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="stream-container">
        <h2>Streaming</h2>
        <div className="stream-info">
          <span className="stream-course-id">Course: {courseId}</span>
        </div>
        
        {streamError && (
          <div className="stream-error">
            <p>{streamError}</p>
          </div>
        )}
        
        <div className="video-container">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="local-video"
          />
        </div>
        
        <div className="stream-controls">
          {!isStreaming ? (
            <button className="start-stream-btn" onClick={handleWebcamPermission}>
              Start Stream
            </button>
          ) : (
            <button className="end-stream-btn" onClick={endStream}>
              End Stream
            </button>
          )}
        </div>
      </div>
      <StreamChat />
    </div>
  );
};
