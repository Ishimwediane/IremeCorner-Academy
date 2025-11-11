import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Course from '../pages/learnerdashboard/Course';

const HeroCourse = () => {
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'rgba(195,151,102,0.08)',
          background: 'linear-gradient(135deg, rgba(195,151,102,0.1) 0%, rgba(32,47,50,0.05) 100%)',
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Explore Our Courses
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '1.1rem',
              mb: 4,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Start your learning journey today. Discover expert-led courses designed to help you grow your skills and advance your career.
          </Typography>

          {/* CTA Buttons */}
          {!user && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#C39766',
                  '&:hover': { bgcolor: '#A67A52' },
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 700,
                }}
              >
                Create Free Account
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#C39766',
                  color: '#C39766',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#A67A52',
                    bgcolor: 'rgba(195,151,102,0.05)',
                  },
                }}
              >
                Sign In to Continue Learning
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Course Component (without hero) */}
      <Course />
    </Box>
  );
};

export default HeroCourse;






