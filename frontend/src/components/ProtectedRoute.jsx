import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user)   return <LoginRedirect />;
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin')
    return <div className="access-denied">Access denied.</div>;

  return children;
}

function LoginRedirect() {
  window.location.href = '/';
  return null;
}