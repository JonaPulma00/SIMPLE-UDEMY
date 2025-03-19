import "../../styles/Footer.css"
import { Link, NavLink } from "react-router-dom"
export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <ul className="social-icon">
          <li className="icon-elem">
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? "icon active-icon" : "icon"}
            >
              <ion-icon name="logo-youtube"></ion-icon>
            </NavLink>

          </li>
          <li className="icon-elem">
            <NavLink to='' className="icon">
              <ion-icon name="logo-instagram"></ion-icon>
            </NavLink>
          </li>
          <li className="icon-elem">
            <NavLink to='' className="icon">
              <ion-icon name="logo-whatsapp"></ion-icon>
            </NavLink>
          </li>
          <li className="icon-elem">
            <NavLink to='' className="icon">
              <ion-icon name="logo-facebook"></ion-icon>
            </NavLink>
          </li>
          <li className="icon-elem">
            <NavLink to='' className="icon">
              <ion-icon name="mail-outline"></ion-icon>
            </NavLink>
          </li>
        </ul>
        <ul className="menu">
          <li className="menu-elem">
            <NavLink to='' className="menu-icon"> Home </NavLink>
          </li>
          <li className="menu-elem">
            <NavLink to='' className="menu-icon"> Team </NavLink>
          </li>
          <li className="menu-elem">
            <NavLink to='' className="menu-icon"> Contact </NavLink>
          </li>
          <li className="menu-elem">
            <NavLink to='' className="menu-icon"> Courses </NavLink>
          </li>
          <li className="menu-elem">
            <NavLink to='' className="menu-icon"> About us </NavLink>
          </li>
        </ul>
        <p className="text"> Copyright © 2024-2025| MyEd All rights reserved</p>
      </footer>
    </>
  )
}