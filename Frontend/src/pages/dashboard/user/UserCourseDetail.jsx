import { useParams } from "react-router-dom"
import {courseService} from "../../../services/courseService"
import { enrollUser } from "../../../services/userService"
import { Sidebar } from "../../../components/Sidebar"
import { toast } from "react-toastify"
import useAsync from "../../../hooks/useAsync"
import { useState } from "react"
import { Modal } from "../../../components/modals/Modal"
import '../../../styles/dashboard/user/UserCourseDetail.css'

export const UserCourseDetail = () => {
  const { courseId } = useParams()
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { loading, error, value: course } = useAsync(() => courseService.getPublicCourseById(courseId), [courseId])

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await enrollUser(courseId);
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      toast.error("Failed to enroll in the course. Please try again.");
      console.error("Error enrolling:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePlayVideo = async (lessonId, lessonTitle) => {
    try {
      const videoUrl = await courseService.getLessonVideo(lessonId);
      setCurrentVideoUrl(videoUrl);
      setCurrentVideoTitle(lessonTitle);
      setIsVideoModalOpen(true);
    } catch (error) {
      toast.error("Failed to load video");
      console.error("Error loading video:", error);
    }
  };

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
              <button
                className="enroll-button"
                onClick={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling ? "Enrolling..." : "Enroll in Course"}
              </button>
            </div>
            <p>{course.description}</p>

            <div className="sections-container">
              {course.sections?.length > 0 ? (
                course.sections.map((section) => (
                  <div key={section.section_id} className="section-card">
                    <div className="section-header">
                      <h3>{section.title}</h3>
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
                                ></i>
                                <span>{lesson.title}</span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="no-lessons">No lessons in this section</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-sections">
                  <p>No sections available in this course yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
  )
}