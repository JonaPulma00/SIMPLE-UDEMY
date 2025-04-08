import { useState } from "react"
import { courseService } from "../../services/courseService"
import useAsync from "../../hooks/useAsync"
import { Sidebar } from "../../components/Sidebar"

export const IntructorCourses = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const {
    loading,
    error,
    value: courseData
  } = useAsync(() => courseService.getInstructorCourses(currentPage, 6), [currentPage])
  return (
    <div>IntructorCourses</div>
  )
}
