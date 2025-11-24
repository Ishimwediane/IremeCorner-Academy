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
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/learnerdashboard/Dashboard';
import Course from './pages/learnerdashboard/Course';
import Notifications from './pages/learnerdashboard/Notifications';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import LessonView from './pages/LessonView';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminLayout from './pages/admin/AdminLayout'; // Corrected Path
import TrainerCourses from './pages/trainer/TrainerCourses';
import TrainerStudents from './pages/trainer/TrainerStudents';
import TrainerAssignments from './pages/trainer/TrainerAssignments';
import TrainerQuizzes from './pages/trainer/TrainerQuizzes';
import TrainerEarnings from './pages/trainer/TrainerEarnings';
import TrainerMessages from './pages/trainer/TrainerMessages';
import TrainerReports from './pages/trainer/TrainerReports';
import TrainerSettings from './pages/trainer/TrainerSettings';
import TrainerCertifications from './pages/trainer/TrainerCertifications';
import TrainerLiveSessions from './pages/trainer/TrainerLiveSessions';
import AIAssistant from './pages/AIAssistant';
import DropInformation from './pages/DropInformation';
import TermsAndConditions from './pages/TermsAndConditions';
import Contact from './pages/Contact';
import About from './pages/About';
import TrainerCourseContent from './pages/trainer/TrainerCourseContent';


import AllUsers from './pages/admin/AllUsers';
import AllTrainers from './pages/admin/AllTrainers';
import AllStudents from './pages/admin/AllStudents';


function AppContent() {
  const location = useLocation();
  const learnerPages = ['/dashboard', '/profile', '/my-courses', '/learner/courses', '/learner/notifications'];
  const adminPages = ['/admin'];
  const trainerPages = [
    '/trainer/dashboard',
    '/trainer/courses',
    '/trainer/course-content',
    '/trainer/students',
    '/trainer/assignments',
    '/trainer/quizzes',
    '/trainer/earnings',
    '/trainer/messages',
    '/trainer/reports',
    '/trainer/settings',
    '/trainer/certifications',
    '/trainer/live-sessions'
  ];
  const isLearnerPage = learnerPages.some(path => location.pathname.startsWith(path)) || 
                     location.pathname.includes('/lessons/');
  const isAdminPage = adminPages.some(path => location.pathname.startsWith(path));
  const isTrainerPage = trainerPages.some(path => location.pathname.startsWith(path));
  const showDashboardNavbar = isLearnerPage && !isTrainerPage;
  const showNavbar = !isLearnerPage && !isTrainerPage && !isAdminPage;

  return (
    <div className="App">
      {showDashboardNavbar && <DashboardNavbar />}
      {showNavbar && <Navbar />}
      <Box sx={{ pt: showDashboardNavbar ? '80px' : showNavbar ? '70px' : 0 }}>
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
            path="/learner/notifications"
            element={
              <PrivateRoute>
                <Notifications />
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
                <AdminLayout> {/* Wrap AdminDashboard with AdminLayout */}
                  <AdminDashboard />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="User Management">
                  <AllUsers />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Trainer Management">
                  <AllTrainers />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Student Management">
                  <AllStudents />
                </AdminLayout>
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
          <Route
            path="/trainer/dashboard"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/courses"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerCourses />
              </PrivateRoute>
            }
          />
          <Route 
          path="/trainer/course-content/:courseId" 
          element={
            <PrivateRoute requiredRole={['trainer', 'admin']}>
              <TrainerCourseContent />
            </PrivateRoute>    
          } />

          <Route
            path="/trainer/students"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/assignments"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerAssignments />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/quizzes"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerQuizzes />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/earnings"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerEarnings />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/messages"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/reports"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/settings"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerSettings />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/certifications"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerCertifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainer/live-sessions"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <TrainerLiveSessions />
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
        {!isTrainerPage && !isAdminPage && <Footer />}
        {!isTrainerPage && !isAdminPage && <ChatWidget />}
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
