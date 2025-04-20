import api from "../interceptor/authInterceptor";

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

export const getInstructorCourses = async (
  instructorId,
  page = 1,
  limit = 10
) => {
  try {
    const response = await api.get(
      `/courses/instructor/${instructorId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error while getting instructor courses", error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`/courses/get-course-by-id/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error while getting course", error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/courses/delete/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting course", error);
    throw error;
  }
};

export const updateCourse = async (courseId, updatedData) => {
  try {
    const response = await api.put(`/courses/update/${courseId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error while updating course:", error);
    throw error;
  }
};

export const addSectionToCourse = async (courseId, sectionData) => {
  try {
    const response = await api.post(`/courses/${courseId}/sections`, {
      title: sectionData.title,
      position: sectionData.position,
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding section to course:", error);
    throw error;
  }
};

export const addLessonToSection = async (courseId, sectionId, lessonData) => {
  try {
    const response = await api.post(
      `/lessons/create-lesson/${courseId}/sections/${sectionId}`,
      {
        title: lessonData.title,
        position: lessonData.position || 1,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while adding lesson to section:", error);
    throw error;
  }
};

export const uploadLessonVideo = async (
  courseId,
  sectionId,
  lessonId,
  videoFile
) => {
  try {
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await api.post(
      `/lessons/upload-video/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
