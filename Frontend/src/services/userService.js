import api from "../interceptor/authInterceptor";
import { getToken, deleteToken } from "./tokenService";

export const logoutUser = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await api.post(
      `http://127.0.0.1:8000/api/v1/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      deleteToken();
    }
    return response;
  } catch (error) {
    console.log("Error on login out: ", error);
  }
};
