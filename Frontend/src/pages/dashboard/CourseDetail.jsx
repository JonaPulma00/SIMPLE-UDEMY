import { useParams } from "react-router-dom";
import { getCourseById, addSectionToCourse } from "../../services/courseService";
import { Sidebar } from "../../components/Sidebar";
import useAsync from "../../hooks/useAsync";
import { Modal } from "../../components/modals/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { refreshData } from "../../utils/refreshUtils";
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/dashboard/CourseDetail.css';

export const CourseDetail = () => {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleAddSection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addSectionToCourse(courseId, {
        title: sectionTitle,
        position: course.sections ? course.sections.length + 1 : 1
      });
      toast.success("Section added successfully");
      setIsModalOpen(false);
      setSectionTitle("");
      refreshData(setRefreshKey)();
    } catch (error) {
      toast.error("Failed to add section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { loading, error, value: course } = useAsync(() => getCourseById(courseId), [courseId, refreshKey]);

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
          <div className="course-detail-content">
            <div className="course-header">
              <h1>{course.title}</h1>
              <button className="add-section-btn" onClick={() => setIsModalOpen(true)}>
                Add Section
              </button>
            </div>
            <p>{course.description}</p>
            
            <div className="sections-container">
              {course.sections?.length > 0 ? (
                course.sections.map((section) => (
                  <div key={section.id} className="section-card">
                    <h3>{section.title}</h3>
                    <div className="section-actions">
                      <button className="section-btn edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="section-btn delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-sections">
                  <p>No sections yet</p>
                  <button className="add-section-btn" onClick={() => setIsModalOpen(true)}>
                    Create First Section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Section">
        <form onSubmit={handleAddSection} className="modal-form">
          <div className="form-group">
            <label htmlFor="sectionTitle">Section Title</label>
            <input
              type="text"
              id="sectionTitle"
              className="form-control"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter section title"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="action-btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Section"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};