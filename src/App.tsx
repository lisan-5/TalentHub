import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { Layout } from './components/layout/Layout';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { Toast } from './components/ui/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { EditJobPage } from './pages/EditJobPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ApplicantDashboard } from './pages/dashboards/ApplicantDashboard';
import { EmployerDashboard } from './pages/dashboards/EmployerDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

// Toast context for global notifications
interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

function App() {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <DarkModeProvider>
      <ToastContext.Provider value={{ showToast }}>
        <AuthProvider>
          <JobProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/jobs/:id" element={<JobDetailPage />} />
                  <Route path="/jobs/create" element={<CreateJobPage />} />
                  <Route path="/jobs/:id/edit" element={<EditJobPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard/applicant" element={<ApplicantDashboard />} />
                  <Route path="/dashboard/employer" element={<EmployerDashboard />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
              <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
              />
            </Router>
          </JobProvider>
        </AuthProvider>
      </ToastContext.Provider>
    </DarkModeProvider>
  );
}

export default App;