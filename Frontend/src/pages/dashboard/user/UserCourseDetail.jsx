import { useParams } from "react-router-dom"
import { getCourseById } from "../../../services/courseService"
import { Sidebar } from "../../../components/Sidebar"
import { toast } from "react-toastify"
import useAsync from "../../../hooks/useAsync"
export const UserCourseDetail = () => {
  const { courseId } = useParams()


  const { loading, error, value: course } = useAsync(() => getCourseById(courseId), [courseId])

  return (
    <>
      {loading ? (
        <div className="loading-container-detail">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <i className="fas fa-exclamation-circle error-icon"></i>
          <p className="error-message">Failed to load course. Try again</p>
        </div>
      ) : (
        <div className="dashboard-container">
          <Sidebar />
        </div>
      )}
    </>
  )
}
