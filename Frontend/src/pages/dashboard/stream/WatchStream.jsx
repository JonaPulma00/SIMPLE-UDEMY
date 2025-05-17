import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { socketService } from "../../../services/socketService";
import { streamService } from "../../../services/streamService";
import { useNavigate } from "react-router-dom";
import useAsync from "../../../hooks/useAsync";
import "../../../styles/dashboard/stream/WatchStream.css";

export const WatchStream = () => {
  const { user } = useUser();
  const [activeStreams, setActiveStreams] = useState([]);
  const [streamDetails, setStreamDetails] = useState([]);
  const navigate = useNavigate();
  
  const { loading } = useAsync(() => {
    return new Promise((resolve) => {
      socketService.connectSocket();
      socketService.getActiveStreams(async (streams) => {
        setActiveStreams(streams);
        

        if (streams.length > 0) {
          const details = await streamService.getActiveStreamDetails(streams);
          setStreamDetails(details);
        }
        
        resolve(streams);
      });
    });
  }, []);

  useEffect(() => {
    socketService.onStreamStarted(async (courseId) => {
      setActiveStreams((prev) => {
        if (!prev.includes(courseId)) {

          const newStreams = [...prev, courseId];
          

          streamService.getActiveStreamDetails([courseId])
            .then(([details]) => {
              if (details) {
                setStreamDetails(prevDetails => [...prevDetails, details]);
              }
            });
          
          return newStreams;
        }
        return prev;
      });
    });
    
    socketService.onStreamEnded((courseId) => {
      setActiveStreams((prev) => prev.filter((id) => id !== courseId));
      setStreamDetails((prev) => prev.filter((stream) => stream.courseId !== courseId));
    });
    
    return() => {
      socketService.offStreamStarted();
      socketService.offStreamEnded();
    };
  }, []);

  const handleJoinStream = (courseId) => {
    socketService.startWatcher(courseId, user.uuid);
    navigate(`/stream/view/${courseId}`);
  };
  
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="stream-content">
        <div className="stream-header">
          <h2>Live Streams</h2>
        </div>
        <div className="stream-video-area">
          {loading ? (
            <div className="stream-connecting">
              <span>Connecting to server...</span>
            </div>
          ) : streamDetails && streamDetails.length > 0 ? (
            streamDetails.map((stream) => (
              <div key={stream.courseId} className="stream-item">
                <span>{stream.title}</span>
                <button onClick={() => handleJoinStream(stream.courseId)}>Join Stream</button>
              </div>
            ))
          ) : (
            <div className="stream-placeholder">
              <span>No one is live right now</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
