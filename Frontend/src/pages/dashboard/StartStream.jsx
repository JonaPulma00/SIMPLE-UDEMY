import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom";
import { socketService } from "../../services/socketService";
export const StartStream = () => {
  const { courseId } = useParams()
  const localVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  return (
    <div>StartStream</div>
  )
}
