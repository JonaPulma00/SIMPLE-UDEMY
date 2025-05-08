import { useState } from "react";
import { Sidebar } from "../../components/Sidebar"
import useAsync from "../../hooks/useAsync";
import { courseService } from "../../services/courseService";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard/Explore.css"
export const Explore = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All Courses");

  const {
    loading,
    error,
    value: coursesData
  } = useAsync(() => courseService.getCourses(currentPage, 9), [currentPage]);

  const categories = [
    "All Courses", "Software Development", "Health", "Business & Finance", "Photography", "Technology"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    setCurrentPage(1);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="explore-content">
        <div className="explore-header">
          <h1>Explore Courses</h1>
          <p>Discover new skills, expand your knowledge</p>
        </div>

        <div className="explore-search-container">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        <div className="categories-filter">
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
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
                  <div key={course.course_id} className="course-card" onClick={() => navigate(`/explore/course/${course.course_id}`)}>
                    <div className="course-image"></div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description && course.description.length > 100 ? course.description.substring(0, 100) + '...' : course.description || 'No description'}</p>
                      <div className="course-footer">
                        <div className="course-meta">
                          <span><i className="fas fa-calendar-alt"></i> {new Date(course.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses-message">
                  <i className="fas fa-search"></i>
                  <p>No courses found. Try a different search or category.</p>
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
  )
}
