import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { socketService } from "../../../services/socketService";

export const StartStream = () => {
  const { courseId } = useParams();
  //My webcam
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

    //crear la conexio
    const pc = new RTCPeerConnection(servers);
    peerConnectionRef.current = pc;

    //enviar ice candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketService.sendIceCandidate(courseId, e.candidate);
      }
    };

    return () => {
      pc.close();
    };
  }, [courseId]);

  const handleWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;

      //añadir stream local a la conexio
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      //crear offer despres d'obtenir els permisos
      createOffer();
    } catch (err) {
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

  return (
    <>
      <div>
        <button id="webcam-btn" onClick={handleWebcamPermission}>Start Stream</button>
        <h2>Streaming in course - Course: {courseId}</h2>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ height: "300px" }}></video>
      </div>
    </>
  );
};
