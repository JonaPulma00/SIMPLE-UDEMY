import { Route } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoutes"
import { WelcomePage } from "../pages/dashboard/WelcomePage"
import { Explore } from "../pages/dashboard/Explore"

export const DashboardRoutes = [
  <>
    <Route key="dashboard" path="/dashboard" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
    <Route key="explore" path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
  </>
]