import { NavLink } from "react-router-dom";
import '../styles/dashboard/Sidebar.css'

export const Sidebar = () => {

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2>MyEd</h2>
      </div>

      <div className="sidebar-menu">
        <div className="menu-item">
          <NavLink to="/dashboard" className="">
            <i className="fas fa-home"></i>
            <span>Overview</span>
          </NavLink>
        </div>

        <div className="menu-item">
          <NavLink to="/my-courses" className="">
            <i className="fas fa-book"></i>
            <span>My Courses</span>
          </NavLink>
        </div>

        <div className="menu-item">
          <NavLink to="/explore" className="">
            <i className="fas fa-compass"></i>
            <span>Explore</span>
          </NavLink>
        </div>

        <div className="menu-item">
          <NavLink to="/teach" className="">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Teach</span>
          </NavLink>
        </div>


        <div className="menu-item">
          <NavLink to="/settings" className="">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </NavLink>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => {
          // Logout logic here
          navigate("/login");
        }}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
