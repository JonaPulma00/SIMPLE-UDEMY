import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { socketService } from "../../../services/socketService";
import { useNavigate } from "react-router-dom";
import "../../../styles/dashboard/stream/WatchStream.css";

export const WatchStream = () => {
  const { user } = useUser();
  const [activeStreams, setActiveStreams] = useState([]);
  const [isConnecting, setIsConnection] = useState(true);
  const navigate = useNavigate()

  useEffect (()=> {
    socketService.connectSocket();

    socketService.getActiveStreams((streams) => {
      setActiveStreams(streams);
      setIsConnection(false);
    });

    socketService.onStreamStarted((courseId) => {
      setActiveStreams((prev) => {
        if (!prev.includes(courseId)) {
          return [...prev, courseId];
        }
        return prev;
      });
    });
    
    socketService.onStreamEnded((courseId) => {
      setActiveStreams((prev) => prev.filter((id) => id !== courseId));
    });
      return() => {
        socketService.offStreamStarted();
      socketService.offStreamEnded();
      };
    }, [])

    const handleJoinStream = (courseId) => {
      socketService.startWatcher(courseId);
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
        {isConnecting ? (
          <div className="stream-connecting">
            <span>Connecting to server...</span>
          </div>
        ) : activeStreams && activeStreams.length > 0 ? (
          activeStreams.map((courseId) => (
            <div key={courseId} className="stream-item">
              <span>Course {courseId.substring(0, 8)}... is live</span>
              <button onClick={() => handleJoinStream(courseId)}>Join Stream</button>
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