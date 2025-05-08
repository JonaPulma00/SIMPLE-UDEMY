import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import { socketService } from "../../../services/socketService";
import useAsync from "../../../hooks/useAsync";
import "../../../styles/dashboard/stream/WatchStream.css";
import { courseService } from "../../../services/courseService";
export const WatchStream = () => {
  const { user } = useUser();
  const [isStreamLive, setisStreamLive] = useState(false) //estat per controlar si hi ha stream actiu

  // const {loading, error, value: courseData} = useAsync(() => courseService.getPublicCourseById(courseId), [courseId]);

  useEffect (()=> {

    socketService.onStreamStarted(() => {
      //Cambiar estat actiu
      setisStreamLive(true)
    })

    socketService.onStreamEnded(() => {
      setisStreamLive(false)
    })
      return() => {
        // socketService.offStreamStarted();
        // socketService.offStreamEnded();
      };
    }, [])

    const handleJoinStream = () => {

    }
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="stream-content">
        <div className="stream-header">
          <h2>Live Streaming</h2>
        </div>
        <div className="stream-video-area">
          {isStreamLive ? (
            <div className="stream-placeholder">
              <button onClick={handleJoinStream}>Join Stream</button>
            </div>
          ): (
            <div className="stream-placeholder">
              <span>No one is live right now</span>
            </div>
          )}
          </div>
        </div>
      </div>
  );

}