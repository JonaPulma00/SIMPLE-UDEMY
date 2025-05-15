import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socketService } from "../../../services/socketService";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { StreamChat } from "../../../components/StreamChat";
import { Whiteboard } from "../../../components/Whiteboard";
import { Modal } from "../../../components/modals/Modal";
import { toast } from "react-toastify";
import "../../../styles/dashboard/stream/StartStream.css";

export const StartStream = () => {
  const { user } = useUser();
  const { courseId } = useParams();
  const [isStreaming, setIsStreaming] = useState(true)
  const [watchers, setWatchers] = useState(new Set());
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

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

    
    console.log("room: ", courseId, "user: ", user.uuid)

    socketService.onWatcher((watcherId) => {
      console.log("New watcher connected", watcherId);
      setWatchers((prev) => new Set(prev).add(watcherId));

      if(peerConnectionRef.current && isStreaming){
        createOfferForPeer(watcherId);
      }
    });

    //crear la conexio
    const pc = new RTCPeerConnection(servers);
    peerConnectionRef.current = pc;

        //enviar ice candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketService.sendIceCandidate(courseId, e.candidate);
      }
    };

    socketService.onAnswer(({ answer, from }) => {
      if (watchers.has(from)) {
        pc.setRemoteDescription(new RTCSessionDescription(answer))
        .catch((err) => {
          console.error("Error setting remote description", err);
        });
      }
    });

    socketService.onIceCandidate(({ candidate, from }) => {
      console.log("Received ICE candidate from:", from);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
          .catch((err) => {
            console.error("Error adding ICE candidate", err);
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

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      })

     socketService.startStream(courseId);
     setIsStreaming(true);

      //crear offer despres d'obtenir els permisos
      await createOffer();
    } catch (err) {
      toast.error("Error accessing webcam");
      console.error("Error accessing webcam:", err);
    }
  };

  const createOfferForPeer = async (peerId) => {
    try {
      const pc = peerConnectionRef.current;
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socketService.sendOffer(peerId, offer);
      console.log("Offer sent to peer:", peerId);
    } catch (err) {
        console.error("Error creating offer for peer:", peerId, err);
    }
  }

  const createOffer = async () => {
    try {
      console.log("Stream started, waiting for watchers...");
    } catch (err) {
      console.error("Error setting up stream", err);
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
            <>
              <button className="end-stream-btn" onClick={endStream}>
                End Stream
              </button>
              <button 
                className="whiteboard-btn"
                onClick={() => setIsWhiteboardOpen(true)}
              >
                <i className="fa-solid fa-chalkboard"></i> Whiteboard
              </button>
            </>
          )}
        </div>
      </div>
      <StreamChat />

      <Modal 
        isOpen={isWhiteboardOpen} 
        onClose={() => setIsWhiteboardOpen(false)} 
        title="Whiteboard"
      >
        <div className="whiteboard-modal-container">
          <Whiteboard courseId={courseId} />
        </div>
      </Modal>
    </div>
  );
};
