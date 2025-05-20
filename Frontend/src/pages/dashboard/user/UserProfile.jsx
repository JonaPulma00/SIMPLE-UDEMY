import { useState, useEffect } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { useUser } from "../../../context/UserContext";
import { Avatar } from "../../../components/Avatar";
import { getProfilePicture, updateUserData } from "../../../services/userService";
import useAsync from "../../../hooks/useAsync";
import { useForm } from "../../../hooks/useForm";
import { refreshData } from "../../../utils/refreshUtils";
import { toast } from 'react-toastify';
import "../../../styles/dashboard/user/UserProfile.css";

export const UserProfile = () => {
  const { user, loadUserFromToken, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const refresh = refreshData(setRefreshKey);

  const { formState, onInputChange } = useForm({
    bio: user?.bio || ""
  })
 const { loading, error, value: profilePictureUrl } = useAsync(
    () => user?.uuid ? getProfilePicture(user?.uuid) : Promise.resolve(null),
    [user?.uuid, refreshKey]
  );

  useEffect(() => {
    if (!editMode || user?.bio !== formState.bio){
      onInputChange({ target: { name: 'bio', value: user?.bio || '' } });
    }
  }, [user, editMode])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const response = await updateUserData(formState.bio, profilePictureFile);
      toast.success("Profile updated successfully!");
      if (response) {
        setUser({
          ...user,
          bio: response.bio,
          profilePictureUrl: response.profile_picture
        });
      }
      loadUserFromToken(); 
      refresh(); 
      setEditMode(false);
      setProfilePictureFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to update profile: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  
  const handleCancelEdit = () => {
    setEditMode(false);
    setProfilePictureFile(null);
    setPreviewUrl(null);
    onInputChange({ target: { name: 'bio', value: user?.bio || '' } });
  };
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>User Profile</h1>
          <button 
            className="edit-profile-btn"
            onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        

        <div className="profile-content">
          <div className="profile-section profile-picture-section">
            <div className="profile-picture-container">
              {loading ? (
                <div className="loading-indicator">Loading...</div>
              ) : isUploading ? (
                <div className="loading-indicator">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Uploading...</span>
                </div>
              ) : previewUrl ? (
                <img src={previewUrl} alt={`${user?.username}'s Avatar Preview`} className="profile-picture"/>
              ) : profilePictureUrl ? (
                <img src={profilePictureUrl} alt={`${user?.username}'s Avatar`} className="profile-picture"/>
              ) : (
                <Avatar name={user?.username} className="profile-picture"/>
              )}
              {editMode && !isUploading && (
                <label className="upload-overlay">
                  <i className="fas fa-camera"></i>
                  <span>Change Profile Picture</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="profile-section user-info-section">
            {!editMode ? (
              <div className="user-info">
                <div className="info-group">
                  <h3>Username</h3>
                  <p>{user?.username}</p>
                </div>
                <div className="info-group">
                  <h3>Email</h3>
                  <p>{user?.email}</p>
                </div>
                <div className="info-group">
                  <h3>Role</h3>
                  {user?.isInstructor? 
                  <p>Instructor</p>
                  : <p>Student</p>}
                </div>
                <div className="info-group">
                  <h3>Bio</h3>
                  {user?.bio?(
                  <p className="user-bio">
                    {user?.bio}
                  </p>
                  ):( <p>No bio yet</p>)}
                </div>
              </div>
            ) : (
              <form className="edit-profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    id="username" 
                    defaultValue={user?.username} 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue={user?.email}
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    rows="5" 
                    value={formState.bio}
                    onChange={onInputChange}
                    maxLength={200}
                  />
                </div>
                <button 
                  type="submit" 
                  className="save-profile-btn"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
