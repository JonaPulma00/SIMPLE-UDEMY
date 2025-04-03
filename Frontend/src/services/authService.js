import axios from "axios";
import { saveTokens } from "./tokenService";

export const registerUser = {
  register: (formData) => {
    return axios
      .post(`http://127.0.0.1:8000/api/v1/auth/register`, formData, {
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
      .post(`http://127.0.0.1:8000/api/v1/auth/login`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.access_token) {
          saveTokens(response.data.access_token);
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
      .post(`http://127.0.0.1:8000/api/v1/auth/google-login`, googleData, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data && response.data.access_token) {
          saveTokens(response.data.access_token);
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
