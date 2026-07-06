import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    // Profile load hone tak wait karo
    if (loading) {
        return null;
    }

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
};

export default PrivateRoute;