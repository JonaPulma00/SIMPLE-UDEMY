import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { getInstructorCourses } from "../../services/courseService";
import useAsync from "../../hooks/useAsync";
import { Sidebar } from "../../components/Sidebar";
import "../../styles/dashboard/InstructorCourses.css";
import { useLocation } from "react-router-dom";

export const InstructorCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();
  const location = useLocation();
  const [highlightedCourse, setHighlightedCourse] = useState(null);

  const {
    loading,
    error,
    value: coursesData
  } = useAsync(() => getInstructorCourses(user?.uuid, currentPage, 6), [currentPage, user?.uuid]);

  useEffect(() => {
    if (location.state?.newCourseId) {
      setHighlightedCourse(location.state.newCourseId);
      setTimeout(() => {
        setHighlightedCourse(null);
      }, 5000);
    }
  }, [location]);

  if (!user?.isInstructor) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="instructor-content">
          <div className="unauthorized-message">
            <i className="fas fa-lock"></i>
            <h2>Instructor Access Only</h2>
            <p>You need to be an instructor to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="instructor-content">
        <div className="instructor-header">
          <h1>Courses you've made</h1>
          <p>Manage and track your courses</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <p>Failed to load courses. Try again</p>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {coursesData?.courses?.length > 0 ? (
                coursesData.courses.map((course) => (
                  <div
                    key={course.course_id}
                    className={`course-card ${course.course_id === highlightedCourse ? 'highlight-new' : ''}`}
                  >
                    <div className="course-image"></div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description && course.description.length > 100
                        ? course.description.substring(0, 100) + '...'
                        : course.description || 'No description'}
                      </p>
                      <div className="course-footer">
                        <div className="course-meta">
                          <span>
                            <i className="fas fa-calendar-alt"></i>
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="course-actions">
                          <button className="edit-button">
                            <i className="fas fa-edit"></i> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses-message">
                  <i className="fas fa-book"></i>
                  <p>You haven't created any courses yet.</p>
                </div>
              )}
            </div>

            {coursesData && coursesData.total_pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {Array.from({ length: coursesData.total_pages }, (_, i) => i + 1)
                  .filter(page => (
                    page === 1 ||
                    page === coursesData.total_pages ||
                    Math.abs(page - currentPage) <= 1
                  ))
                  .map((page, index, array) => (
                    <>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span key={`ellipsis-${page}`} className="pagination-ellipsis">...</span>
                      )}
                      <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </>
                  ))}

                <button
                  className="pagination-button"
                  disabled={currentPage === coursesData.total_pages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, coursesData.total_pages))}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
