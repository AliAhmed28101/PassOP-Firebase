import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not verified
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Fully authenticated + verified
  return children;
};

export default ProtectedRoute;
