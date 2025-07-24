import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/authStore";

const ProtectedRoute = ({ adminOnly = false, memberOnly = false }) => {
  const { isAuth, isAdmin } = useAuthStore();

  if (!isAuth) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/memberView" replace />;

  if (memberOnly && isAdmin) return <Navigate to="/members" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
