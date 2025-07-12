import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/authStore";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuth, isAdmin } = useAuthStore();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to={`/memberView`} replace />;

  return <Outlet />;
};

export default ProtectedRoute;