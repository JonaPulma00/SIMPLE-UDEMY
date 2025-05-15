import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { courseService} from "../../services/courseService";
import useAsync from "../../hooks/useAsync";
import { Sidebar } from "../../components/Sidebar";
import { Modal } from "../../components/modals/Modal";
import "../../styles/dashboard/InstructorCourses.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const InstructorCourses = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useUser();
  const location = useLocation();
  const [highlightedCourse, setHighlightedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    loading,
    error,
    value: coursesData
  } = useAsync(() => courseService.getInstructorCourses(user?.uuid, currentPage, 9), [currentPage, user?.uuid, refreshKey]);

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      await courseService.deleteCourse(courseToDelete);
      toast.success("Course deleted successfully");
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
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
                          <button className="edit-button" onClick={() => navigate(`/course/${course.course_id}`)}>
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button 
                            className="delete-button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.course_id);
                            }}
                          >
                            <i className="fas fa-trash"></i> Delete
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        title="Delete Course"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this course?</p>
          <p className="warning-text">This will permanently delete all sections and lessons. This action cannot be undone.</p>
          <div className="confirmation-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCourseToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="delete-btn"
              onClick={confirmDeleteCourse}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
