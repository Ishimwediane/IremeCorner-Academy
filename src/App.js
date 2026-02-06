import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/learnerdashboard/Dashboard';
import BrowseCourses from './pages/learnerdashboard/BrowseCourses';
import CourseContent from './pages/learnerdashboard/CourseContent';
import Notifications from './pages/learnerdashboard/Notifications';
import Profile from './pages/Profile';
import LearnerLayout from './pages/learnerdashboard/LearnerLayout';
import MyLearning from './pages/learnerdashboard/MyLearning';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
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
import StudentDetailPage from './pages/trainer/StudentDetailPage';
import QuizPage from './pages/learnerdashboard/QuizPage';
import AssignmentPage from './pages/learnerdashboard/AssignmentPage';
import Messages from './pages/learnerdashboard/Messages';
import CertificateView from './pages/learnerdashboard/CertificateView';
import MyCertificates from './pages/learnerdashboard/MyCertificates';
import MyQuizzes from './pages/learnerdashboard/MyQuizzes';
import MyAssignments from './pages/learnerdashboard/MyAssignments';


import AllUsers from './pages/admin/AllUsers';
import AllTrainers from './pages/admin/AllTrainers';
import AllStudents from './pages/admin/AllStudents';
import AllCourses from './pages/admin/AllCourses';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminCourseDetail from './pages/admin/AdminCourseDetail';
import AdminLessonView from './pages/admin/AdminLessonView';
import PendingCourses from './pages/admin/PendingCourses';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';


function AppContent() {
  const location = useLocation();
  const isLearnerPage = location.pathname.startsWith('/learner');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTrainerPage = location.pathname.startsWith('/trainer');

  const showNavbar = !isLearnerPage && !isTrainerPage && !isAdminPage;

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Box sx={{ pt: showNavbar ? '70px' : 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route
            path="/dashboard"
            element={
              <Navigate to="/learner/dashboard" replace />
            }
          />
          <Route
            path="/learner/*"
            element={
              <PrivateRoute requiredRole="student">
                <LearnerLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="courses" element={<BrowseCourses />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="course/:courseId" element={<CourseContent />} />
                    <Route path="course/:courseId/lessons/:lessonId" element={<CourseContent />} />
                    <Route path="my-learning" element={<MyLearning />} />
                    <Route path="my-certificates" element={<MyCertificates />} />
                    <Route path="my-quizzes" element={<MyQuizzes />} />
                    <Route path="my-assignments" element={<MyAssignments />} />
                    <Route path="quiz/:quizId" element={<QuizPage />} />
                    <Route path="assignment/:assignmentId" element={<AssignmentPage />} />
                    <Route path="certificates/:id" element={<CertificateView />} />
                  </Routes>
                </LearnerLayout>
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
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout>
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
            path="/admin/users/:id"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="User Details">
                  <AdminUserDetail />
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
            path="/admin/courses"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Course Management">
                  <AdminCourses />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Course Details">
                  <AdminCourseDetail />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/lessons/:lessonId"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Lesson View">
                  <AdminLessonView />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/pending-courses"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Pending Courses">
                  <PendingCourses />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Reports & Analytics">
                  <AdminReports />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout title="Platform Settings">
                  <AdminSettings />
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
            }
          />
          <Route
            path="/trainer/course-content/:courseId/student/:studentId"
            element={
              <PrivateRoute requiredRole={['trainer', 'admin']}>
                <StudentDetailPage />
              </PrivateRoute>
            }
          />
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
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<About />} />
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
      {!isLearnerPage && !isTrainerPage && !isAdminPage && <Footer />}
      {!isLearnerPage && !isTrainerPage && !isAdminPage && <ChatWidget />}
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
