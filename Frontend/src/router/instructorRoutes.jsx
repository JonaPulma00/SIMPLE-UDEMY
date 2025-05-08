import { Route } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { InstructorCourses } from "../pages/dashboard/InstructorCourses"
import { CourseDetail } from "../pages/dashboard/CourseDetail"
import { Teach } from "../pages/dashboard/Teach"
import { StartStream } from "../pages/dashboard/stream/StartStream"
export const InstructorRoutes = [
  <>
    <Route key="instructor-courses" path="/instructor/courses" element={<ProtectedRoute><InstructorCourses /></ProtectedRoute>} />
    <Route key="course-detail" path="/course/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
    <Route key="teach" path="/teach" element={<ProtectedRoute><Teach /></ProtectedRoute>} />
    <Route key="start-stream" path="/stream/:courseId" element={<ProtectedRoute><StartStream /></ProtectedRoute>} />
  </>
]