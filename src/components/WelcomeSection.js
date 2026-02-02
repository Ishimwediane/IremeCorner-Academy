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
        bgcolor: '#202F32',
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
            bgcolor: 'rgba(32, 47, 50, 0.75)', // Dark overlay
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: '600px' }}>
          <Typography
            variant="overline"
            sx={{
              color: '#C39766',
              fontWeight: 800,
              fontSize: '1rem',
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
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Empower Your Future Through <Box component="span" sx={{ color: '#C39766' }}>Learning</Box>
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
              bgcolor: '#C39766',
              color: 'white',
              px: 5,
              py: 2,
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(195, 151, 102, 0.4)',
              '&:hover': {
                bgcolor: '#A67D52',
              },
            }}
          >
            Join our Community
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeSection;


