import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectIfAuthenticated = () => {
    const { token } = useAuth(); //  check kro user login h ya nahi

    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;
