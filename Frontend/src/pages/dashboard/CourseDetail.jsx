import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import { Sidebar } from "../../components/Sidebar";
import useAsync from "../../hooks/useAsync";
import { Modal } from "../../components/modals/Modal";
import { useState } from "react";
import '../../styles/dashboard/CourseDetail.css';

export const CourseDetail = () => {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const { loading, error, value: course } = useAsync(() => getCourseById(courseId), [courseId]);

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
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          <div>
            <button onClick={openModal}>Open the modal</button>
          </div>
        </div>
      )}
    </>
  );
};