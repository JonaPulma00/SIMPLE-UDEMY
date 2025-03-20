import axios from "axios";
import { config } from "../config/appConfig";

export const registerUser = {
  register: (username, email, password) => {
    return axios.post(`${config.BASE_API_URL}/auth/register`, {
      username,
      email,
      password,
    });
  },
};

export const validateUser = {
  login: (username, password) => {
    return axios.post(`${config.BASE_API_URL}/auth/login`, {
      username,
      password,
    });
  },
};

const getToken = () => {
  sessionStorage.getItem("auth_token");
};

const getRefreshToken = () => {
  sessionStorage.getItem("refresh_token");
};
