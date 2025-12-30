import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Only enforce email verification for email/password users
  if (user.providerData.some(p => p.providerId === "password") && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Fully authenticated or OAuth user
  return children;
};

export default ProtectedRoute;
