import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            toast.error("Log in to access this page.");
        }
    }, [user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return user
        ? <Outlet />
        : <Navigate to="/login" replace />;
}