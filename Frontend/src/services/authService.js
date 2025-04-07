import axios from "axios";
import { saveToken } from "./tokenService";

const API_URL = import.meta.env.VITE_APP_API_URL;
export const registerUser = {
  register: (formData) => {
    return axios
      .post(`${API_URL}/auth/register`, formData, {
        withCredentials: true,
      })
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message || "Registration failed");
      });
  },
};

export const loginUser = {
  login: (formData) => {
    return axios
      .post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.access_token) {
          saveToken(response.data.access_token);
        }
        return response;
      })
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message || "Login failed");
      });
  },

  googleLogin: (googleData) => {
    return axios
      .post(`${API_URL}/auth/google-login`, googleData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.access_token) {
          saveToken(response.data.access_token);
        }
        return response;
      })
      .catch((error) => {
        if (error.response) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message || "Google login failed");
      });
  },
};
