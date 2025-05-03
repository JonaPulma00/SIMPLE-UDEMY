import { Routes, Route, Navigate } from "react-router-dom"
import { publicRoutes } from "./publicRoutes"
import { DashboardRoutes } from "./dashboardRoutes"
import { InstructorRoutes } from "./instructorRoutes"
import { UserRoutes } from "./userRoutes"

export const AppRoutes = () => (
  <Routes>
    {publicRoutes}
    {DashboardRoutes}
    {InstructorRoutes}
    {UserRoutes}
    <Route path="/*" element={<Navigate to="/" />} />
  </Routes>
)