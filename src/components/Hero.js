import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

const Hero = ({ user, totalCourses = 0 }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Split */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex' }}>
        {/* Left Side - Light Cream */}
        <Box sx={{ width: '55%', height: '100%', bgcolor: '#FAF1E6' }} />
        {/* Right Side - Peach/Orange */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            bgcolor: '#FFDFC8',
            borderBottomLeftRadius: { xs: '0', md: '50%' }, // Curve on desktop
            position: 'absolute',
            right: 0,
          }}
        />
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          pt: 12, // Account for absolute navbar
        }}
      >
        <Grid container alignItems="center" spacing={4}>
          {/* Left Text Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 600, pl: { md: 10, lg: 16 } }}> {/* Increased Padding */}
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' }, // Minimized: 4.5 -> 3.5rem max
                  color: '#1A1A1A',
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                A Classical<br />
                Education for<br />
                the{' '}
                <Box component="span" sx={{ color: '#FD7E14 !important', position: 'relative', display: 'inline-block' }}>
                  Future
                  <Box
                    component="svg"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      left: 0,
                      width: '100%',
                      height: '10px',
                      zIndex: -1,
                    }}
                  >
                    <path d="M0 5 Q 50 10 100 5" stroke="#FD7E14" strokeWidth="3" fill="none" />
                  </Box>
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  mb: 4, // Reduced margin
                  fontWeight: 400,
                  fontSize: '0.95rem', // Minimized: 1.05 -> 0.95rem
                  maxWidth: '450px',
                  lineHeight: 1.6,
                }}
              >
                We prepare you to engage in the world that is and to help bring about a world that ought to be
              </Typography>

              <Button
                component={Link}
                to={user ? '/courses' : '/register'}
                sx={{
                  background: '#FD7E14 !important', // Using background to override any gradients
                  color: 'white',
                  px: 6,
                  py: 2,
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 10px 25px rgba(253, 126, 20, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    background: '#FD7E14 !important', // Using background to override any gradients
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(253, 126, 20, 0.4)',
                  },
                }}
              >
                Get started
              </Button>
            </Box>
          </Grid>

          {/* Right Image Content */}
          <Grid item xs={12} md={6} sx={{ position: 'relative', height: '100%' }}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: '50vh', md: '85vh' },
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                mt: { xs: 5, md: 0 }
              }}
            >


              {/* Main Student Image */}
              <Box
                component="img"
                src="/learn.jpg"
                alt="Student with headphones"
                sx={{
                  height: '90%',
                  maxHeight: '800px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                }}
              />

              {/* Circle Background behind student (Clip path) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  centerX: true,
                  width: '500px',
                  height: '500px',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  zIndex: 0,
                  transform: 'scale(1.2) translateY(10%)',
                }}
              />

              {/* Scroll Up Arrow Button */}
              <Box sx={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 3 }}>
                <IconButton
                  sx={{
                    bgcolor: '#FD7E14',
                    color: 'white',
                    width: 60,
                    height: 60,
                    '&:hover': { bgcolor: '#FD7E14' }
                  }}
                >
                  <ArrowUpward />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
