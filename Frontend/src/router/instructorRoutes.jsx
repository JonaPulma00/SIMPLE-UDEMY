import { Route } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { InstructorCourses } from "../pages/dashboard/InstructorCourses"
import { CourseDetail } from "../pages/dashboard/CourseDetail"
import { Teach } from "../pages/dashboard/Teach"
export const InstructorRoutes = [
  <>
    <Route path="/instructor/courses" element={<ProtectedRoute><InstructorCourses /></ProtectedRoute>} />
    <Route path="/course/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
    <Route path="/teach" element={<ProtectedRoute><Teach /></ProtectedRoute>} />
  </>
]