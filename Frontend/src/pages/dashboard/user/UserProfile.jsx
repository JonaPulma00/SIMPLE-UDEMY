import { useState, useEffect } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { useUser } from "../../../context/UserContext";
import { Avatar } from "../../../components/Avatar";
import { getProfilePicture } from "../../../services/userService";
import useAsync from "../../../hooks/useAsync";
import "../../../styles/dashboard/user/UserProfile.css";

export const UserProfile = () => {
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);

 const { loading, error, value: profilePictureUrl } = useAsync(
    () => user?.uuid ? getProfilePicture(user.uuid) : Promise.resolve(null),
    [user?.uuid]
  );
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
              {loading ? (
                <div className="loading-indicatro">Loading...</div>

              ): profilePictureUrl ? (
                <img src={profilePictureUrl} alt={`${user.username} 's Avatar`} className="profile-picture"/>
              ) : (
                <Avatar name={user.username} className="profile-picture"/>
              )}
              {editMode && (
                <div className="upload-overlay">
                  <i className="fas fa-camera"></i>
                  <span>Change Profile Picture</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section user-info-section">
            {!editMode ? (
              <div className="user-info">
                <div className="info-group">
                  <h3>Username</h3>
                  <p>{user.username}</p>
                </div>
                <div className="info-group">
                  <h3>Email</h3>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <h3>Role</h3>
                  {user.isInstructor? 
                  <p>Instructor</p>
                  : <p>Student</p>}
                </div>
                <div className="info-group">
                  <h3>Bio</h3>
                  {user.bio?(
                  <p className="user-bio">
                    {user.bio}
                  </p>
                  ):( <p>No bio yet</p>)}
                </div>
              </div>
            ) : (
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    defaultValue={user.username} 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue={user.email}
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    rows="5" 
                    defaultValue={user.bio? user.bio : ''}
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
