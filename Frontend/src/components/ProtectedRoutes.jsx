import { Navigate, Route } from "react-router-dom";
import { getToken } from "../services/tokenService";

const ProtectedRoute = ({ element, ...rest }) => {
  const token = getToken();
  return token ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};