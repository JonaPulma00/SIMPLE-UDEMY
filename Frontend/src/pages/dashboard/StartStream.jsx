import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom";
import { socketService } from "../../services/socketService";
export const StartStream = () => {
  const { courseId } = useParams()
  //My webcam
  const localVideoRef = useRef(null)
  //Other people webcam
  const remoteVideoRef = useRef(null)

  const remoteStreamRef = useRef(new MediaStream())
  const peerConnectionRef = useRef(null)

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    if (!courseId) return;

    //crear la conexio
    const pc = new RTCPeerConnection(servers);
    peerConnectionRef.current = pc;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
    //rebre stream remot
    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track);
      })
    }

    pc.onicecandidate = (e) =>{
      if (e.candidate) {
        socketService.sendIceCandidate(courseId, e.candidate);
      }
    }
    return() => {
      pc.close();
      remoteStreamRef.current.getTracks().forEach((track) => {
        track.stop();

      remoteStreamRef.current = new MediaStream();
  

      })
    };
  }, [courseId])

  const handleWebcamPermission = async () => {
    try{
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    })

    //crear offer despres d'obtenir els permisos
    createOffer()
  } catch (err) {
    console.error("Error accessing webcam:", err);
  }
  }

  const createOffer = async () => {
    try {
      const pc = peerConnectionRef.current;
      const offer = await pc.createOffer();
      //aket objecte te un valor de stp
      await pc.setLocalDescription(offer);
      socketService.sendOffer(courseId, offer); 
    } catch (error) {
      console.error("Error creating offer", err)
      
    }
  }
  return (
    <>
    <div>
      <button id="webcam-btn" onClick={handleWebcamPermission}>Start Stream</button>
      <h2>Streaming in course - Course: {courseId}</h2>
      <video ref={localVideoRef} autoPlay playsInline muted style={{with: "300px"}}></video>
    </div>

    <div>
      <h3>Remote Stream</h3>
      <video ref={remoteVideoRef} autoPlay playsInline style={{with: "300px"}}></video>
    </div>
    </>
    
  )
}
