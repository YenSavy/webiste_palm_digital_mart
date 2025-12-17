import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  component: React.ComponentType<unknown>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading)
  if (!isAuthLoading) if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <Component />;
};

export default ProtectedRoute;