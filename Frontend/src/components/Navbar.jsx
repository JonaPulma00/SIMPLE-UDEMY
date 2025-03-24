import { NavLink } from "react-router-dom"
import { useState } from "react"

import '../styles/global/Navbar.css'

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
        <NavLink to="/">MyEd</NavLink>
      </div>
      <div className={`nav-links ${isMenuActive ? 'active' : ''}`}>
        <ul>
          <li><NavLink className="active">Home</NavLink></li>
          <li><NavLink>Popular technologies</NavLink></li>
          <li className="dropdown">
            <NavLink
              className="dropdown-toggle"
              onClick={toggleDropdown}
            >
              Testimonials <span className={`arrow ${isDropdownOpen ? 'rotated' : ''}`}>▼</span>
            </NavLink>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><NavLink>Reviews</NavLink></li>
              </ul>
            )}
          </li>
          <li><NavLink>Courses</NavLink></li>
        </ul>
      </div>
      <div className="auth-buttons">
        <NavLink to='/login' className="btn-login">Log In</NavLink>
        <NavLink to='/register' className="btn btn-get-started">Get Started</NavLink>
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