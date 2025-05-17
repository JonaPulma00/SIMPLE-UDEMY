import { Sidebar } from "../../components/Sidebar"
import { useUser } from "../../context/UserContext"
import { getUserEnrollments } from "../../services/userService"
import useAsync from "../../hooks/useAsync"
import {courseService} from "../../services/courseService"
import "../../styles/dashboard/WelcomePage.css"
import { useNavigate } from "react-router-dom"

export const WelcomePage = () => {
  const { user } = useUser()
  const navigate = useNavigate()


  const { loading: coursesLoading, value: recommendedCoursesData } = useAsync(
    () => courseService.getCourses(1, 3),
    [user]
  )

  const { loading: statsLoading, value: statsData } = useAsync(
    () => {
      if (!user) return Promise.resolve(null)
      
      if (user.isInstructor) {
        return user.uuid ? courseService.getInstructorCourses(user.uuid) : Promise.resolve(null)
      } else {
        return getUserEnrollments()
      }
    },
    [user]
  )

  const handleViewCourses = () => {
    navigate("/instructor/courses")
  }


  const coursesCount = user?.isInstructor ? (statsData?.total_courses || 0) : 0
  const enrollmentsCount = !user?.isInstructor ? (statsData?.total_enrollments || 0) : 0
  const recommendedCourses = recommendedCoursesData?.courses || []

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome {user?.username || 'User'}!</h1>
          {user?.isInstructor ?
            <p>Here's an overview of your teaching progress</p> :
            <p>Here's an overview of your learning progress</p>
          }
        </div>

        <div className="dashboard-overview">
          {user?.isInstructor ? (
            <div className="stats-container">
              <div className="stat-card">
                <i className="fa-solid fa-chalkboard"></i>
                <div className="stat-info">
                  <h3>Courses made</h3>
                  <p className="stat-number">{statsLoading ? "..." : coursesCount}</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fas fa-graduation-cap"></i>
                <div className="stat-info">
                  <h3>Total Students</h3>
                  <p className="stat-number">--</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fas fa-certificate"></i>
                <div className="stat-info">
                  <h3>Certificates</h3>
                  <p className="stat-number">--</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="stats-container">
              <div className="stat-card">
                <i className="fa-solid fa-book-open"></i>
                <div className="stat-info">
                  <h3>Courses Enrolled</h3>
                  <p className="stat-number">{statsLoading ? "..." : enrollmentsCount}</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fa-solid fa-circle-check"></i>
                <div className="stat-info">
                  <h3>Completed Courses</h3>
                  <p className="stat-number">--</p>
                </div>
              </div>

              <div className="stat-card">
                <i className="fa-solid fa-stamp"></i>
                <div className="stat-info">
                  <h3>Certificates</h3>
                  <p className="stat-number">--</p>
                </div>
              </div>
            </div>
          )}

          {user?.isInstructor && (
            <div className="instructor-actions">
              <button className="view-courses-btn" onClick={handleViewCourses}>
                Explore My Courses
              </button>
            </div>
          )}

          <div className="recommended-courses">
            {user?.isInstructor ? (
              <h2>Your best courses</h2>
            ) : (
              <h2>Recommended For You</h2>
            )}
            <div className="courses-grid">
              {coursesLoading ? (
                <p>Loading courses...</p>
              ) : recommendedCourses.length > 0 ? (
                recommendedCourses.map(course => (
                  <div 
                    key={course.course_id} 
                    className="course-card" 
                    onClick={() => navigate(`/explore/${course.course_id}`)}
                  >
                    <div className="course-image"></div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description?.substring(0, 80) || "No description available"}...</p>
                      <div className="course-meta">
                        <span><i className="fas fa-calendar-alt"></i> {new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses available at the moment</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
