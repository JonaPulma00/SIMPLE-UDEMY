import axios from "axios";
// import { config } from "../config/appConfig";

export const registerUser = {
  register: (formData) => {
    return axios.post(`http://127.0.0.1:8000/api/v1/auth/register`, formData);
  },
};

export const loginUser = {
  login: (formData) => {
    return axios.post(`http://127.0.0.1:8000/api/v1/auth/login`, formData);
  },
};
