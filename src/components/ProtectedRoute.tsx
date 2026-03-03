import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "contributor" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {

  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center" }}>
      Checking session...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/my-space" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;