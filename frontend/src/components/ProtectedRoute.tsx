import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user in state, check localStorage as a fallback to avoid race conditions during login
  if (!user && !localStorage.getItem('auth_token')) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    // User exists in localStorage but state hasn't updated yet.
    // Return a loading state instead of redirecting back to login.
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
