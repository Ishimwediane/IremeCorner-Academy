import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import LearnerNavbar from '../../components/LearnerNavbar';
import Footer from '../../components/Footer';
import ChatWidget from '../../components/ChatWidget';
import LearnerDashboardLayout from '../../components/LearnerDashboardLayout';

const LearnerLayout = ({ children }) => {
  const location = useLocation();

  // Use sidebar layout for all learner pages
  const useSidebarLayout = location.pathname.startsWith('/learner');

  if (useSidebarLayout) {
    return (
      <>
        <LearnerDashboardLayout>{children}</LearnerDashboardLayout>
        <ChatWidget />
      </>
    );
  }

  return (
    <div className="App">
      <LearnerNavbar />
      <Box sx={{ pt: '80px' }}>
        {children}
      </Box>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default LearnerLayout;