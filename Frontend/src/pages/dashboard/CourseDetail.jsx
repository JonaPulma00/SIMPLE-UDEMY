import { useParams } from "react-router-dom";
import { courseService} from "../../services/courseService";
import { Sidebar } from "../../components/Sidebar";
import useAsync from "../../hooks/useAsync";
import { Modal } from "../../components/modals/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { refreshData } from "../../utils/refreshUtils";
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/dashboard/CourseDetail.css';
import '../../../src/App.css'

export const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isDeleteLessonModalOpen, setIsDeleteLessonModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

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
      await courseService.addSectionToCourse(courseId, {
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
    
    if (!lessonData.video) {
      toast.error("Video is required");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const newLesson = await courseService.addLessonToSection(courseId, currentSectionId, {
        title: lessonData.title,
        position: 0
      });

      await courseService.uploadLessonVideo(
        courseId,
        currentSectionId,
        newLesson.lesson_id,
        lessonData.video
      );

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
      const videoUrl = await courseService.getLessonVideo(lessonId);
      console.log("Video URL received:", videoUrl);
      setCurrentVideoUrl(videoUrl);
      setCurrentVideoTitle(lessonTitle);
      setIsVideoModalOpen(true);
    } catch (error) {
      toast.error("Failed to load video");
      console.error("Error loading video:", error);
    }
  };

  const handleStartStream = () => {
    navigate(`/stream/${courseId}`, {
      state: {
        courseTitle: course.title,
        courseId: courseId
      }
    });
  };
  const openLessonModal = (sectionId) => {
    setCurrentSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const { loading, error, value: course } = useAsync(() => courseService.getCourseById(courseId), [courseId, refreshKey]);

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  const handleDeleteSection = async (sectionId) => {
    setSectionToDelete(sectionId);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteSection = async () => {
    try {
      await courseService.deleteSection(courseId, sectionToDelete);
      toast.success("Section deleted successfully");
      setIsDeleteConfirmationOpen(false);
      setSectionToDelete(null);
      refreshData(setRefreshKey)();
    } catch (error) {
      toast.error("Failed to delete section");
      console.error("Error:", error);
    }
  };

  const handleDeleteLesson = (lessonId, e) => {
    e.stopPropagation();
    setLessonToDelete(lessonId);
    setIsDeleteLessonModalOpen(true);
  };

  const confirmDeleteLesson = async () => {
    try {
      await courseService.deleteLesson(courseId, lessonToDelete);
      toast.success("Lesson deleted successfully");
      setIsDeleteLessonModalOpen(false);
      setLessonToDelete(null);
      refreshData(setRefreshKey)();
    } catch (error) {
      toast.error("Failed to delete lesson: " + (error.response?.data?.detail || error.message));
    }
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
            <h1>{course.title}</h1>
            <div className="course-header">
              <button className="add-section-btn" onClick={() => setIsModalOpen(true)}>
                Add Section
              </button>
              <button className="start-stream-btn" onClick={handleStartStream}>
                <i className="fa-solid fa-video"></i> Start Stream
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
                        <button
                          className="section-btn delete"
                          onClick={() => handleDeleteSection(section.section_id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="lessons-container">
                      {section.lessons?.length > 0 ? (
                        [...section.lessons]
                          .sort((a, b) => a.position - b.position)
                          .map((lesson) => (
                            <div key={lesson.lesson_id} className="lesson-item" onClick={() => handlePlayVideo(lesson.lesson_id, lesson.title)}>
                              <div className="lesson-info">
                                <i
                                  className="fas fa-play-circle"
                                  style={{ cursor: 'pointer' }}
                                ></i>
                                <span>{lesson.title}</span>
                              </div>
                              <div className="lesson-actions">
                                <button className="lesson-btn edit">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="lesson-btn delete"
                                  onClick={(e) => handleDeleteLesson(lesson.lesson_id, e)}
                                >
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
            <label htmlFor="lessonVideo">Video</label>
            <input
              type="file"
              id="lessonVideo"
              className="form-control"
              accept="video/*"
              onChange={(e) => setLessonData({ ...lessonData, video: e.target.files[0] })}
              required
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

      <Modal
        isOpen={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setSectionToDelete(null);
        }}
        title="Delete Section"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this section?</p>
          <p className="warning-text">This will permanently delete all lessons within it.</p>
          <div className="confirmation-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setIsDeleteConfirmationOpen(false);
                setSectionToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="delete-btn"
              onClick={confirmDeleteSection}
            >
              Delete Section
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteLessonModalOpen}
        onClose={() => {
          setIsDeleteLessonModalOpen(false);
          setLessonToDelete(null);
        }}
        title="Delete Lesson"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this lesson?</p>
          <p className="warning-text">This action cannot be undone.</p>
          <div className="confirmation-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setIsDeleteLessonModalOpen(false);
                setLessonToDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="delete-btn"
              onClick={confirmDeleteLesson}
            >
              Delete Lesson
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};