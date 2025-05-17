import { useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import "../../../styles/dashboard/user/UserProfile.css";

export const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>User Profile</h1>
          <button 
            className="edit-profile-btn"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section profile-picture-section">
            <div className="profile-picture-container">
              <img 
                src="https://via.placeholder.com/150" 
                alt="Profile" 
                className="profile-picture" 
              />
              {editMode && (
                <div className="upload-overlay">
                  <i className="fas fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section user-info-section">
            {!editMode ? (
              <div className="user-info">
                <div className="info-group">
                  <h3>Username</h3>
                  <p>johndoe123</p>
                </div>
                <div className="info-group">
                  <h3>Email</h3>
                  <p>john.doe@example.com</p>
                </div>
                <div className="info-group">
                  <h3>Role</h3>
                  <p>Instructor</p>
                </div>
                <div className="info-group">
                  <h3>Bio</h3>
                  <p className="user-bio">
                    Passionate educator with over 5 years of experience in teaching web development.
                    Specializing in frontend technologies including React, Angular, and Vue.
                  </p>
                </div>
              </div>
            ) : (
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    defaultValue="johndoe123" 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue="john.doe@example.com" 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    rows="5" 
                    defaultValue="Passionate educator with over 5 years of experience in teaching web development. Specializing in frontend technologies including React, Angular, and Vue."
                  />
                </div>
                <button type="submit" className="save-profile-btn">
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
