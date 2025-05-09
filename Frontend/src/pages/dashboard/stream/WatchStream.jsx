import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { socketService } from "../../../services/socketService";
import { useNavigate } from "react-router-dom";
import "../../../styles/dashboard/stream/WatchStream.css";

export const WatchStream = () => {
  const { user } = useUser();
  const [activeStreams, setActiveStreams] = useState([]);
  const navigate = useNavigate()
  useEffect (()=> {
    socketService.onStreamStarted((courseId) => {
      setActiveStreams((prev) =>[...prev, courseId]);
    })

    
    socketService.onStreamEnded((courseId) => {
      setActiveStreams((prev) => prev.filter((id) => id !== courseId));
    });
      return() => {
        
      };
    }, [])

    const handleJoinStream = (courseId) => {
      socketService.startWatcher(courseId);
      navigate(`/stream/${courseId}`);

    };
  return (
    <div className="dashboard-container">
    <Sidebar />
    <div className="stream-content">
      <div className="stream-header">
        <h2>Live Streams</h2>
      </div>
      <div className="stream-video-area">
        {activeStreams.length > 0 ? (
          activeStreams.map((courseId) => (
            <div key={courseId} className="stream-item">
              <span>Course {courseId} is live</span>
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