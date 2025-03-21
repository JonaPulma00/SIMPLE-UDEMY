import { Navigate, useLocation } from "react-router-dom";
import { isAuth } from "../services/tokenService";

export const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  let authenticated = isAuth();
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};
