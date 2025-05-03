import { Route } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { About } from "../pages/About"
import { Register } from "../pages/Register"
import { Reviews } from "../pages/Reviews"

export const publicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="reviews" path="/reviews" element={<Reviews />} />,
]