import { useState } from 'react';
import { getUserEnrollments } from '../../../services/userService';
import { Sidebar } from '../../../components/Sidebar';
import useAsync from '../../../hooks/useAsync';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import '../../../styles/dashboard/user/UserEnrollments.css';

export const UserEnrollments = () => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { loading, error, value: enrollmentsData } = useAsync(
    () => getUserEnrollments(currentPage, limit),
    [currentPage]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="enrollments-content">
        <h1>{user.username}'s courses</h1>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-circle error-icon"></i>
            <p className="error-message">Failed to load enrollments. Please try again.</p>
          </div>
        ) : (
          <>
            <div className="enrollments-grid">
              {enrollmentsData?.enrollments?.length > 0 ? (
                enrollmentsData.enrollments.map((enrollment) => (
                  <Link
                    to={`/explore/course/${enrollment.course_id}`}
                    key={enrollment.course_id}
                    className="enrollment-card"
                  >
                    <h3>{enrollment.title}</h3>
                    <p>{enrollment.description && enrollment.description.length > 100
                      ? enrollment.description.substring(0, 100) + '...'
                      : enrollment.description}</p>
                    <div className="card-footer">
                      <button className="continue-btn">
                        Continue Learning <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-enrollments">
                  <i className="fas fa-book-reader"></i>
                  <p>You haven't enrolled in any courses yet.</p>
                  <Link to="/explore" className="browse-courses-btn">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {enrollmentsData?.total_pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="page-info">
                  Page {currentPage} of {enrollmentsData.total_pages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === enrollmentsData.total_pages}
                  className="pagination-btn"
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
