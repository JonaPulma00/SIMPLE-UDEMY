import { Route } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { UserEnrollments } from "../pages/dashboard/user/UserEnrollments"
import { UserCourseDetail } from "../pages/dashboard/user/UserCourseDetail"
import { Stream } from "../pages/dashboard/Stream"
import { Whiteboard } from "../components/Whiteboard"
export const UserRoutes = [
  <>
    <Route key="courses-deatil" path="/explore/course/:courseId" element={<ProtectedRoute><UserCourseDetail /></ProtectedRoute>} />
    <Route key="user-courses" path="/my-courses" element={<ProtectedRoute><UserEnrollments /></ProtectedRoute>} />
    <Route key="streaming" path="/stream" element={<ProtectedRoute><Stream /></ProtectedRoute>} />
  </>
]