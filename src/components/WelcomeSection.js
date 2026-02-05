import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const WelcomeSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '500px' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: '#1A1A1A',
        py: { xs: 10, md: 0 },
      }}
    >
      {/* Background Image with Parallax-like effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/learn.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(26, 26, 26, 0.75)', // Dark overlay using Theme Grey
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 4, md: 12, lg: 16 } }}> {/* Maximized Padding */}
        <Box sx={{ maxWidth: '600px' }}>
          <Typography
            variant="overline"
            sx={{
              color: '#FD7E14',
              fontWeight: 800,
              fontSize: '0.9rem',
              letterSpacing: '2px',
              mb: 1,
              display: 'block',
            }}
          >
            START YOUR JOURNEY
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: { xs: '1.75rem', md: '2.75rem' }, // Aggressively reduced
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Empower Your Future Through <Box component="span" sx={{ color: '#FD7E14' }}>Learning</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 5,
            }}
          >
            Join IremeCorner to access premium courses, connects with expert trainers, and build the skills that matter. Your growth starts here, today.
          </Typography>
          <Button
            variant="contained"
            href="/register"
            sx={{
              background: '#FD7E14 !important',
              color: 'white',
              px: 5,
              py: 2,
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 10px 25px rgba(253, 126, 20, 0.4)',
              '&:hover': {
                background: '#FD7E14 !important',
              },
            }}
          >
            Join our Community
          </Button>
        </Box>
      </Container >
    </Box >
  );
};

export default WelcomeSection;


