import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { getToken } from "../services/tokenService";
import { parseJwt } from "../utils/jwtUtils";
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUserFromToken = () => {
    const token = getToken();
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUser({
          username: payload.username,
          email: payload.email,
          isInstructor: payload.is_instructor,
          bio: payload.bio,
          profilePicture: payload.profile_picture,
          pendingValidation: payload.pending_validation,
          uuid: payload.uuid
        });
      }
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser, loadUserFromToken }}>
      {children}
    </UserContext.Provider>
  );
};
