import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import DashboardNavbar from './components/DashboardNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/learnerdashboard/Dashboard';
import Course from './pages/learnerdashboard/Course';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import LessonView from './pages/LessonView';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import AIAssistant from './pages/AIAssistant';
import DropInformation from './pages/DropInformation';
import TermsAndConditions from './pages/TermsAndConditions';
import Contact from './pages/Contact';
import About from './pages/About';

function AppContent() {
  const location = useLocation();
  const learnerPages = ['/dashboard', '/profile', '/my-courses', '/learner/courses'];
  const isLearnerPage = learnerPages.some(path => location.pathname.startsWith(path)) || 
                     location.pathname.includes('/lessons/');
  const showDashboardNavbar = isLearnerPage;

  return (
    <div className="App">
      {showDashboardNavbar ? <DashboardNavbar /> : <Navbar />}
      <Box sx={{ pt: showDashboardNavbar ? '80px' : '70px' }}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/courses"
            element={
              <PrivateRoute>
                <Course />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <PrivateRoute>
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <PrivateRoute>
                <LessonView />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-course"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route path="/drop-information" element={<DropInformation />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/ai-assistant"
            element={
              <PrivateRoute>
                <AIAssistant />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;






