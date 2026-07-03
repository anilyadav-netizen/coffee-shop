import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default RoleRoute;