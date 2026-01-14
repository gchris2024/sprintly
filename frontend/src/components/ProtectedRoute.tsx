import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>; // TODO: Replace with a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};