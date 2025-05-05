import React from "react";
import { useUser } from "../../context/UserContext";
import "../../styles/dashboard/Stream.css";
import { Sidebar } from "../../components/Sidebar";

export const Stream = () => {
  const { user } = useUser();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="stream-content">
        <div className="stream-header">
          <h2>Live Streaming</h2>
        </div>
        <div className="stream-video-area">
          <div className="stream-placeholder">
            <i className="fa-solid fa-video"></i>
            <span>
              {user?.isInstructor
                ? "Click 'Start Stream' to begin streaming."
                : "No one is live right now..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
