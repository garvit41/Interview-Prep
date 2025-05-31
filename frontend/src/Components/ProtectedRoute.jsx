import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Ensure Correct Import

const ProtectedRoute = () => {
    const { token } = useAuth(); // ✅ Get Token from Context

    if (token === undefined) {
        console.error("AuthContext token is undefined! Check if AuthProvider is wrapped properly.");
        return <Navigate to="/login" replace />;
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
