import { Sidebar } from "../../components/Sidebar"
import { useUser } from "../../context/UserContext"
import iconTeacher from '../../assets/home/teacher.png'
import { getUserEnrollments } from "../../services/userService"
import useAsync from "../../hooks/useAsync"
import "../../styles/dashboard/WelcomePage.css"

export const WelcomePage = () => {
  const { user } = useUser()

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome {user?.username || 'User'}!</h1>
          {user.isInstructor?
          <p>Here's an overview of your teaching progress</p>
          :<p>Here's an overview of your learning progress</p>
          }
        </div>

        <div className="dashboard-overview">
          {user.isInstructor?(
          <div className="stats-container">
            <div className="stat-card">
              <i class="fa-solid fa-chalkboard"></i>
              <div className="stat-info">
                <h3>Courses made</h3>
                <p className="stat-number">3</p>
              </div>
            </div>

            <div className="stat-card">
              <i className="fas fa-graduation-cap"></i>
              <div className="stat-info">
                <h3>Total Stundents</h3>
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
          ): (
          <div className="stats-container">
            <div className="stat-card">
              <i class="fa-solid fa-book-open"></i>
              <div className="stat-info">
                <h3>Courses Enrolled</h3>
                <p className="stat-number">3</p>
              </div>
            </div>

            <div className="stat-card">
              <i class="fa-solid fa-circle-check"></i>
              <div className="stat-info">
                <h3>Completed Courses</h3>
                <p className="stat-number">--</p>
              </div>
            </div>

            <div className="stat-card">
             <i class="fa-solid fa-stamp"></i>
              <div className="stat-info">
                <h3>Certificates</h3>
                <p className="stat-number">--</p>
              </div>
            </div>
          </div>)}

        

          <div className="recommended-courses">
            <h2>Recommended For You</h2>
            <div className="courses-grid">
              <div className="course-card">
                <div className="course-image"></div>
                <div className="course-content">
                  <h3>TypeScript Masterclass</h3>
                  <p>Learn advanced TypeScript concepts</p>
                  <div className="course-meta">
                    <span><i className="fas fa-clock"></i> 6.5 hours</span>
                    <span><i className="fas fa-star"></i> 4.8</span>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-image"></div>
                <div className="course-content">
                  <h3>Python for Data Science</h3>
                  <p>Analyze data with Python</p>
                  <div className="course-meta">
                    <span><i className="fas fa-clock"></i> 8 hours</span>
                    <span><i className="fas fa-star"></i> 4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
