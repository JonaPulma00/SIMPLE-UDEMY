import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import { Sidebar } from "../../components/Sidebar";
import useAsync from "../../hooks/useAsync";
import '../../styles/dashboard/CourseDetail.css'

export const CourseDetail = () => {
  const { courseId } = useParams();

  const { loading, error, value: course } = useAsync(() => getCourseById(courseId), [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load course details</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="course-detail-content">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>
    </div>
  );
}
