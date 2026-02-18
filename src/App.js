import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages Import
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateIncident from './pages/CreateIncident';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import UserManagement from './pages/UserManagement';
import StudentUpload from './pages/StudentUpload';

// ✅ New Student Pages
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Student Public Login */}
            <Route path="/student-login" element={<StudentLogin />} />

            {/* ================= PROTECTED ROUTES ================= */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* ✅ Student Dashboard (Protected) */}
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <IncidentList />
                </PrivateRoute>
              }
            />

            <Route
              path="/incidents/:id"
              element={
                <PrivateRoute>
                  <IncidentDetail />
                </PrivateRoute>
              }
            />

            <Route
              path="/create-incident"
              element={
                <PrivateRoute>
                  <CreateIncident />
                </PrivateRoute>
              }
            />

            {/* Admin Side: User Management */}
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />

            {/* Admin Side: Student Database Excel Upload */}
            <Route
              path="/upload-students"
              element={
                <PrivateRoute>
                  <StudentUpload />
                </PrivateRoute>
              }
            />

            {/* ================= DEFAULT REDIRECTS ================= */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
