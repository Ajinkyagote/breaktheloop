
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import AssessmentHub from './pages/AssessmentHub';
import StudentDashboard from './pages/StudentDashboard';
import AssessmentRoom from './pages/AssessmentRoom';
import BenchmarkRoom from './pages/BenchmarkRoom';
import ActionPlan from './pages/ActionPlan';
import ProgressHistory from './pages/ProgressHistory';
import Settings from './pages/Settings';
import MentorDashboard from './pages/MentorDashboard';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected App Routes */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          
          <Route path="/hub" element={<ProtectedRoute><Layout><AssessmentHub /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
          <Route path="/check-in" element={<ProtectedRoute><Layout><AssessmentRoom /></Layout></ProtectedRoute>} />
          <Route path="/benchmark" element={<ProtectedRoute><Layout><BenchmarkRoom /></Layout></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><Layout><ActionPlan /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><ProgressHistory /></Layout></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute><Layout><MentorDashboard /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
