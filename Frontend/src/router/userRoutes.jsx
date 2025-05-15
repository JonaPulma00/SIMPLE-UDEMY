import { Route } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { UserEnrollments } from "../pages/dashboard/user/UserEnrollments"
import { UserCourseDetail } from "../pages/dashboard/user/UserCourseDetail"
import { WatchStream } from "../pages/dashboard/stream/WatchStream"
import { StreamView } from "../pages/dashboard/stream/StreamView"
import { Whiteboard } from "../components/Whiteboard"


export const UserRoutes = [
  <>
    <Route key="courses-deatil" path="/explore/course/:courseId" element={<ProtectedRoute><UserCourseDetail /></ProtectedRoute>} />
    <Route key="user-courses" path="/my-courses" element={<ProtectedRoute><UserEnrollments /></ProtectedRoute>} />
    <Route key="streaming" path="/stream" element={<ProtectedRoute><WatchStream /></ProtectedRoute>} />
    <Route key="stream-view" path="/stream/view/:courseId" element={<ProtectedRoute><StreamView /></ProtectedRoute>} />
  </>
]