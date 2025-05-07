import { useEffect, useRef } from "react"
import { socketService } from "../../services/socketService";
import useAsync from "../../hooks/useAsync";
export const StartStream = () => {
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
