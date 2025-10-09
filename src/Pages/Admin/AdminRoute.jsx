import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function AdminRoute({ children }) {
const { user, loading } = useContext(UserContext);

if (loading) return <p className="mt-20 text-center">Loading...</p>;
if (!user || user.role !== "admin") return <Navigate to="/login" />;

return children;
}
