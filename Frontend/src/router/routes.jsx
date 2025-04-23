import { Navigate, Routes, Route } from "react-router-dom"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { About } from "../pages/About"
import { Register } from "../pages/Register"
import { WelcomePage } from "../pages/dashboard/WelcomePage"
import { Reviews } from "../pages/Reviews"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { Explore } from "../pages/dashboard/Explore"
import { Teach } from "../pages/dashboard/Teach"
import { InstructorCourses } from "../pages/dashboard/InstructorCourses"
import { CourseDetail } from "../pages/dashboard/CourseDetail"
import { UserEnrollments } from "../pages/dashboard/user/UserEnrollments"
import { UserCourseDetail } from "../pages/dashboard/user/UserCourseDetail"
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

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />

      <Route
        path="/teach"
        element={
          <ProtectedRoute>
            <Teach />
          </ProtectedRoute>
        } />

      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute>
            <InstructorCourses />
          </ProtectedRoute>
        } />

      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

      <Route
        path="/explore/course/:courseId"
        element={
          <ProtectedRoute>
            <UserCourseDetail />
          </ProtectedRoute>
        } />

      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <UserEnrollments />
          </ProtectedRoute>
        } />

      <Route path="/*" element={<Navigate to='/' />}></Route>
    </Routes>
  )
}
