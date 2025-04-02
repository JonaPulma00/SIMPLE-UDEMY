import api from "../interceptor/authInterceptor";
import { getToken, deleteTokens } from "./tokenService";

export const logoutUser = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await api.post(
      `/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      deleteTokens();
    }
    return response;
  } catch (error) {
    console.log("Error on login out: ", error);
  }
};
