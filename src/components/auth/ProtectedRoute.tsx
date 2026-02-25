import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
    children: JSX.Element;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to access so we can drop them off there after they sign in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        // If route requires admin but user is customer, kick them to home or account
        return <Navigate to="/account" replace />;
    }

    return children;
};
