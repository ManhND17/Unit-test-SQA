import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { EUserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: EUserRole[];
  requireAuth?: boolean;
  guestOnly?: boolean;
}

function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
  guestOnly = false,
}: ProtectedRouteProps) {
  const { user, accessToken, isAuthenticated } = useSelector(
    (state: IRootState) => state.auth
  );
  const userRole = user?.role?.name;
  if (requireAuth && !accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (guestOnly && isAuthenticated && user && userRole) {
    switch (userRole) {
      case EUserRole.PATIENT:
        return <Navigate to="/" replace />;
      case EUserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case EUserRole.DOCTOR:
        return <Navigate to="/doctor" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case EUserRole.PATIENT:
        return <Navigate to="/" replace />;
      case EUserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case EUserRole.DOCTOR:
        return <Navigate to="/doctor" replace />;
      default:
        return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
