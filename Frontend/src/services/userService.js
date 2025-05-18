import api from "../interceptor/authInterceptor";
import { getToken, deleteToken } from "./tokenService";

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    if (response.status === 200) {
      deleteToken();
    }
    return response;
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

export const enrollUser = async (courseId) => {
  try {
    const response = await api.post(`/enrollments/enroll-user/${courseId}`);
    return response;
  } catch (error) {
    console.error("Error enrolling user: ", error);
    throw error;
  }
};

export const getUserEnrollments = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `/enrollments/get-enrollments?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting user enrollments: ", error);
    throw error;
  }
};

export const getProfilePicture = async (userId) => {
  try {
    const response = await api.get(`/user/profile-picture/${userId}`);
    return response.data.url;
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    throw error;
  }
};

export const updateUserData = async (bioText, profilePicture) => {
  try {
    const formData = new FormData();

    if (bioText !== undefined) {
      formData.append("bio", bioText);
    }

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    const response = await api.patch("/user/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating user data", error);
    throw error;
  }
};
