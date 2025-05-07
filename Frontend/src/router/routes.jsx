import { Routes, Route } from "react-router-dom"
import { publicRoutes } from "./publicRoutes"
import { UserRoutes } from "./userRoutes"
import { DashboardRoutes } from "./dashboardRoutes"
import { InstructorRoutes } from "./instructorRoutes"
import { NotFound } from "../components/error/NotFound"

export const AppRoutes = () => (
  <Routes>
    {publicRoutes}
    {DashboardRoutes}
    {InstructorRoutes}
    {UserRoutes}
    <Route key="not-found" path="*" element={<NotFound />} />
  </Routes>
)