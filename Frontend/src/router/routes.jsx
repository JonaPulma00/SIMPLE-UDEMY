import { Navigate, Routes, Route } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { About } from "../pages/About"
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/*" element={<Navigate to='/' />}></Route>
    </Routes>
  )
}
