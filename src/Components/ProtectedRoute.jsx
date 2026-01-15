import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(UserContext);

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
}
