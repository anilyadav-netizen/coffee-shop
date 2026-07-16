import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Rider accessing admin-only page → redirect to rider dashboard
    if (user?.role === "rider") {
      return <Navigate to="/admin" replace />;
    }
    // Admin accessing rider-only page → redirect to admin dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // Any other role (e.g., "user") → home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;