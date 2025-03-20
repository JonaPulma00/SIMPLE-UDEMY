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

export const loginUser = {
  login: (username, password) => {
    return axios.post(`${config.BASE_API_URL}/auth/login`, {
      username,
      password,
    });
  },
};

export const saveTokens = () => {
  sessionStorage.setItem("auth_token");
  sessionStorage.setItem("refresh_token");
};
export const getToken = () => {
  sessionStorage.getItem("auth_token");
};
getRefreshToken = () => {
  const refreshToken = getRefreshToken();
  return axios.post(`${config.BASE_API_URL}/auth/refresh`, refreshToken);
};
const getRefreshToken = () => {
  sessionStorage.getItem("refresh_token");
};

export const deleteTokens = () => {
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("refresh_token");
};
