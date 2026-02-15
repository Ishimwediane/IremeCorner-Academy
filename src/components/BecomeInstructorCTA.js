import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const BecomeInstructorCTA = () => {
  const benefits = [
    'Reach a Global Audience',
    'Expand Your Professional Network',
    'Flexible Teaching',
    'Gain Recognition',
    'Earn Competitive Compensation',
    'Ongoing Professional Development',
    'Supportive Platform',
    'Flexible Course Creation',
  ];

  return (
    <Box sx={{ bgcolor: '#FAF1E6', py: { xs: 8, md: 10 }, mt: 4 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 4, md: 12, lg: 16 } }}> {/* Maximized Padding */}
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: '#1A1A1A',
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2.25rem' }, // Aggressively reduced
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Become a Teacher at <br />
                <Box component="span" sx={{ color: '#FD7E14' }}>
                  IremeHub
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: '#666',
                  fontSize: '1rem',
                  mb: 4,
                  maxWidth: '550px',
                  lineHeight: 1.6,
                }}
              >
                At IremeHub, we believe in empowering learners with expert knowledge, and that starts with exceptional
                teachers. If you're an industry professional, educator, or thought leader with a passion for teaching,
                you can make a global impact by sharing your skills and insights with students worldwide.
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: '#1A1A1A',
                  fontWeight: 700,
                  mb: 3,
                  fontSize: '1.25rem', // Added usage of reduced size via manual override if needed or just relying on h5 default
                }}
              >
                Why Teach at IremeHub?
              </Typography>

              <Grid container spacing={1}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <AddIcon sx={{ color: '#FD7E14', mr: 1, fontSize: '1.2rem' }} />
                      <Typography
                        sx={{
                          color: '#1A1A1A',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="contained"
                component={Link}
                to="/drop-information"
                sx={{
                  mt: 5,
                  background: '#FD7E14 !important',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 20px rgba(253, 126, 20, 0.3)',
                  '&:hover': {
                    background: '#FD7E14 !important',
                    boxShadow: '0 15px 30px rgba(253, 126, 20, 0.4)',
                  },
                }}
              >
                Become An Instructor
              </Button>
            </Box>
          </Grid>

          {/* Right Content - Image with Frame */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Dashed Frame */}
              <Box
                sx={{
                  width: { xs: '280px', sm: '350px' },
                  height: { xs: '320px', sm: '400px' },
                  border: '2px dashed #FD7E14',
                  position: 'absolute',
                  top: -20,
                  right: { xs: 'auto', md: 0 },
                  borderRadius: '20px 20px 20px 20px',
                  zIndex: 0,
                  opacity: 0.3,
                }}
              />

              {/* Image Container with Styled Background/Shape */}
              <Box
                sx={{
                  width: { xs: '280px', sm: '350px' },
                  height: { xs: '320px', sm: '400px' },
                  bgcolor: '#FD7E14',
                  borderRadius: '0 0 175px 175px', // Semicircle bottom
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/learn.jpg"
                  alt="Instructor"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BecomeInstructorCTA;


