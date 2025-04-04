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
