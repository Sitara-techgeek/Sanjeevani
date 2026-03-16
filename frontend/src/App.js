import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AmbulancePage from './pages/AmbulancePage';

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:14,color:'#888'}}>Loading...</div>;
  if (!user) return <LoginPage />;
  if (user.role === 'admin') return <AdminPage />;
  return <AmbulancePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}