import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { Routes, Route } from "react-router-dom"
import { About } from "../pages/About"
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
