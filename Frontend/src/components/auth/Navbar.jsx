import { NavLink } from "react-router-dom"
import { useState } from "react"
import '../../styles/Navbar.css'

export const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive)

    setIsDropdownOpen(false)
  }

  const toggleDropdown = (e) => {
    e.preventDefault()
    setIsDropdownOpen(!isDropdownOpen)
  }
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink>MyEd</NavLink>
      </div>
      <div className={`nav-links ${isMenuActive ? 'active' : ''}`}>
        <ul>
          <li><NavLink className="active">Overview</NavLink></li>
          <li><NavLink>Technologies</NavLink></li>
          <li className="dropdown">
            <NavLink
              className="dropdown-toggle"
              onClick={toggleDropdown}
            >
              Testimonials <span className={`arrow ${isDropdownOpen ? 'rotated' : ''}`}>▼</span>
            </NavLink>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><NavLink>Client Stories</NavLink></li>
                <li><NavLink>Case Studies</NavLink></li>
                <li><NavLink>Reviews</NavLink></li>
              </ul>
            )}
          </li>
          <li><NavLink>Resources</NavLink></li>
        </ul>
      </div>
      <div className="auth-buttons">
        <NavLink to='/login' className="btn-login">Log In</NavLink>
        <NavLink className="btn btn-get-started">Get Started</NavLink>
      </div>
      <div
        className={`hamburger ${isMenuActive ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  )
}