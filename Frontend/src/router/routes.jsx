import { Navigate, Routes, Route } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { About } from "../pages/About"
import { Register } from "../pages/Register"
import { WelcomePage } from "../pages/WelcomePage"
import { Reviews } from "../pages/Reviews"
import { ProtectedRoute } from "../components/ProtectedRoutes"



export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        } />

      <Route path="/*" element={<Navigate to='/' />}></Route>
    </Routes>
  )
}
