import { useAuth } from "@shared/frontend";
import { Navigate, createFileRoute } from "@tanstack/react-router";

const IndexComponent = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  return <Navigate to="/admin/auth/login" />;
};

export const Route = createFileRoute("/")({
  component: IndexComponent,
});