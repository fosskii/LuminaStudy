
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlannerPage from './pages/PlannerPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ModeratorPage from './pages/ModeratorPage';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* User + Moderator + Admin Routes */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Moderator + Admin Routes */}
              <Route path="moderator" element={
                <ProtectedRoute allowedRoles={[UserRole.MODERATOR, UserRole.ADMIN]}>
                  <ModeratorPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
