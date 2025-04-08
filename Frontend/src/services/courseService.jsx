import api from "../interceptor/authInterceptor";
import { useUser } from "../context/UserContext";


const { user } = useUser()
export const courseService = {
  async getCourses(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/courses/get-general-courses?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/courses/create", {
      title: courseData.title,
      description: courseData.description,
      category_id: courseData.category_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories/get-categories");
    return response.data;
  } catch (error) {
    console.error("Error getting categories", error);
    throw error;
  }
};

export const getInstructorCourses = async () => {
  try {
    const response = api.get(`/courses/instructor/${user.uuid}`);
    return (await response).data;
  } catch (error) {
    console.error("Error while getting instructor courses", error);
    throw error;
  }
};
