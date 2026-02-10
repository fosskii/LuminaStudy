
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
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Syncing your workspace...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Global Error Boundary Fallback
const ErrorFallback = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6 text-center">
    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">⚠️</span>
    </div>
    <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
    <p className="text-gray-500 mb-6 max-w-xs">The application encountered an unexpected error. Please refresh the page.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl"
    >
      Refresh App
    </button>
  </div>
);

// Fix: Added explicit constructor to resolve 'props' visibility issues for the TS compiler
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }

  render() {
    if (this.state.hasError) return <ErrorFallback />;
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
