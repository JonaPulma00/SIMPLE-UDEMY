import React from "react";
import { useUser } from "../../../context/UserContext";
import { Sidebar } from "../../../components/Sidebar";
import "../../../styles/dashboard/WatchStream.css";
export const WatchStream = () => {
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
            <span>No one is live right now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
