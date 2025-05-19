import { NavLink, Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/userService";
import { useUser } from "../context/UserContext";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./Avatar";
import { getProfilePicture } from "../services/userService";
import { toast } from "react-toastify";
import useAsync from "../hooks/useAsync";
import '../styles/dashboard/Sidebar.css'
const truncateUsername = (username, maxLength = 12) => {
  if (!username || username.length <= maxLength) return username;
  return `${username.substring(0, maxLength)}...`;
}

export const Sidebar = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  const { loading, error, value: profilePictureUrl } = useAsync(
    () => user?.uuid ? getProfilePicture(user.uuid) : Promise.resolve(null),
    [user?.uuid]
  );
  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate('/')
    } catch (error) {
      console.error('Error on login out: ', error)
      toast.error('Error on login out: ', error)
    }
  }

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className="sidebar-checkbox" />
      <label htmlFor="sidebar-toggle" className="sidebar-toggle-label">
        <span className="sidebar-hamburger"></span>
      </label>

      <div className="dashboard-sidebar">
        <div className="sidebar-header" onClick={() => navigate('/dashboard')}>
          <h2>MyEd</h2>
        </div>
        
        <div className="sidebar-menu">

          <div className="user-profile" onClick={() => navigate('/profile')}>
              <div className="profile-wrapper">
                {loading ? (
                  <div className="loading-indicator-sidebar">...</div>
                ) : profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt={`${user?.username}'s Avatar`} 
                    className="profile-picture"
                  />
                ) : (
                  <Avatar name={user?.username} />
                )}
              </div>

            <div className="profile-info">
              <div className="user-name tooltip" title={user?.username || 'User'}>
                Hello, {user ? truncateUsername(user.username) : 'User'}
                {user?.username && <span className="tooltip-text">{user.username}</span>}
              </div>
            </div>
          </div>

          <div className="menu-item">
            <NavLink to="/dashboard" className="">
              <i className="fas fa-home"></i>
              <span>Overview</span>
            </NavLink>
          </div>

          {user && !user.isInstructor && (
            <div className="menu-item">
              <NavLink to="/my-courses" className="">
                <i className="fas fa-book"></i>
                <span>My Courses </span>
              </NavLink>
            </div>
          )}

          {user?.isInstructor && (
            <div className="menu-item">
              <NavLink to="/instructor/courses">
                <i className="fa-solid fa-brain"></i>
                <span>Created courses</span>
              </NavLink>
            </div>
          )}

          <div className="menu-item">
            <NavLink to="/explore">
              <i className="fas fa-compass"></i>
              <span>Explore</span>
            </NavLink>
          </div>

          {user?.isInstructor && (
            <div className="menu-item">
              <NavLink to="/teach" className="">
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Teach</span>
              </NavLink>
            </div>
          )}

          <div className="menu-item">
            <NavLink to="/stream" className="">
              <i className="fa-solid fa-video"></i>
              <span>Streaming</span>
            </NavLink>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-actions">
            <ThemeToggle />
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <label htmlFor="sidebar-toggle" className="sidebar-overlay"></label>
    </>
  )
}
