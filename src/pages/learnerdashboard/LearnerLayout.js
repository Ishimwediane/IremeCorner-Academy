import React from 'react';
import { Box } from '@mui/material';
import LearnerNavbar from '../../components/LearnerNavbar';
import Footer from '../../components/Footer';
import ChatWidget from '../../components/ChatWidget';

const LearnerLayout = ({ children }) => {
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