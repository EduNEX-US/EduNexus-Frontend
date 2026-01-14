import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import type { RootState } from "../../app/store";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactElement;
  role?: "student" | "teacher" | "admin";
}) {
  const location = useLocation();
  const { isAuthenticated, role: userRole, mustChangePassword, loading } =
    useSelector((s: RootState) => s.auth);

  // Optional: while AuthLoader/hydrate is running, don't redirect yet
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  // Not logged in -> go login
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const isChangePasswordRoute = location.pathname === "/change-password";

  // Force change password before allowing anything else
  // (but allow user to access /change-password)
  if (mustChangePassword === true && !isChangePasswordRoute) {
    return <Navigate to="/change-password" replace />;
  }

  // If we are on /change-password, DON'T apply role restriction
  // (otherwise you can accidentally block it)
  if (!isChangePasswordRoute && role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
