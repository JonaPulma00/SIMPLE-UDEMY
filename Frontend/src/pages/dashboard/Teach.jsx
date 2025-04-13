import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../context/UserContext";
import { createCourse, getCategories } from "../../services/courseService";
import "../../styles/dashboard/Teach.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

export const Teach = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const { formState, onInputChange } = useForm({
    title: "",
    description: "",
    category_id: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newCourse = await createCourse(formState);
      toast.success("Course created successfully!");

      setTimeout(() => {
        navigate('/instructor/courses', {
          state: { newCourseId: newCourse.course_id }
        });
      }, 1000);
      e.target.reset();
    } catch (err) {
      toast.error("Failed to create course");
    }
  };

  if (!user?.isInstructor) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="teach-content">
          <div className="unauthorized-message">
            <i className="fas fa-lock"></i>
            <h2>Instructor Access Only</h2>
            <p>You need to be an instructor to create courses.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="teach-content">
        <div className="teach-header">
          <h1>Create a New Course</h1>
          <p>Share your knowledge with the world</p>
        </div>

        <form className="course-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter course title"
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Course Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter course description"
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              onChange={onInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="create-course-button">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};