import { useParams } from "react-router-dom";
import { getCourseById, addSectionToCourse, addLessonToSection, uploadLessonVideo, getLessonVideo } from "../../services/courseService";
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
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
const [currentVideoTitle, setCurrentVideoTitle] = useState("");

  const [lessonData, setLessonData] = useState({
    title: "",
    video: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleAddSection = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addSectionToCourse(courseId, {
        title: sectionTitle,
        position: 0
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

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newLesson = await addLessonToSection(courseId, currentSectionId, {
        title: lessonData.title,
        position: 0
      });

      if (lessonData.video) {
        await uploadLessonVideo(
          courseId,
          currentSectionId,
          newLesson.lesson_id,
          lessonData.video
        );
      }

      toast.success("Lesson added successfully");
      setIsLessonModalOpen(false);
      setLessonData({ title: "", video: null });
      refreshData(setRefreshKey)();
    } catch (error) {
      toast.error("Failed to add lesson");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayVideo = async (lessonId, lessonTitle) => {
    try {
      const videoUrl = await getLessonVideo(lessonId);
      console.log("Video URL received:", videoUrl);
      setCurrentVideoUrl(videoUrl);
      setCurrentVideoTitle(lessonTitle);
      setIsVideoModalOpen(true);
    } catch (error) {
      toast.error("Failed to load video");
      console.error("Error loading video:", error);
    }
  };
  const openLessonModal = (sectionId) => {
    setCurrentSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const { loading, error, value: course } = useAsync(() => getCourseById(courseId), [courseId, refreshKey]);

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };
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
                  <div key={section.section_id} className="section-card">
                    <div className="section-header">
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

                    <div className="lessons-container">
                      {section.lessons?.length > 0 ? (
                        [...section.lessons]
                          .sort((a, b) => a.position - b.position)
                          .map((lesson) => (
                            <div key={lesson.lesson_id} className="lesson-item">
                              <div className="lesson-info">
                              <i 
                                className="fas fa-play-circle"
                                onClick={() => handlePlayVideo(lesson.lesson_id, lesson.title)}
                                style={{ cursor: 'pointer' }}
                              ></i>
                              <span>{lesson.title}</span>
                            </div>
                              <div className="lesson-actions">
                                <button className="lesson-btn edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="lesson-btn delete">
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="no-lessons">No lessons in this section</p>
                      )}
                    </div>

                    <button
                      className="add-lesson-btn"
                      onClick={() => openLessonModal(section.section_id)}
                    >
                      <i className="fas fa-plus"></i> Add Lesson
                    </button>
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

      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title="Add New Lesson"
      >
        <form onSubmit={handleAddLesson} className="modal-form">
          <div className="form-group">
            <label htmlFor="lessonTitle">Lesson Title</label>
            <input
              type="text"
              id="lessonTitle"
              className="form-control"
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              placeholder="Enter lesson title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lessonVideo">Video (Optional)</label>
            <input
              type="file"
              id="lessonVideo"
              className="form-control"
              accept="video/*"
              onChange={(e) => setLessonData({ ...lessonData, video: e.target.files[0] })}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsLessonModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Lesson"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        title={currentVideoTitle}
      >
        <div className="video-player-container">
          {currentVideoUrl ? (
            <video
              controls
              autoPlay
              style={{ width: '100%', maxHeight: '70vh' }}
              onError={(e) => {
                console.error("Video error:", e);
                toast.error("Error playing video. Please try again.");
              }}
            >
              <source 
                src={currentVideoUrl} 
                type="video/mp4"
                onError={(e) => console.error("Source error:", e)}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-loading">Loading video...</div>
          )}
        </div>
      </Modal>
    </>
  );
};