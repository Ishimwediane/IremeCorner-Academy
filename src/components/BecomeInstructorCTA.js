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
    <Box sx={{ bgcolor: '#F0F4F5', py: { xs: 8, md: 12 }, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: '#202F32',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Become a Teacher at <br />
                <Box component="span" sx={{ color: '#C39766' }}>
                  IremeCorner
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(32, 47, 50, 0.8)',
                  fontSize: '1rem',
                  mb: 4,
                  maxWidth: '550px',
                  lineHeight: 1.6,
                }}
              >
                At IremeCorner, we believe in empowering learners with expert knowledge, and that starts with exceptional
                teachers. If you're an industry professional, educator, or thought leader with a passion for teaching,
                you can make a global impact by sharing your skills and insights with students worldwide.
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: '#202F32',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Why Teach at IremeCorner?
              </Typography>

              <Grid container spacing={1}>
                {benefits.map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <AddIcon sx={{ color: '#C39766', mr: 1, fontSize: '1.2rem' }} />
                      <Typography
                        sx={{
                          color: '#202F32',
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
                  bgcolor: '#C39766',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(195, 151, 102, 0.39)',
                  '&:hover': {
                    bgcolor: '#A67D52',
                    boxShadow: '0 6px 20px rgba(195, 151, 102, 0.23)',
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
                  border: '2px dashed #202F32',
                  position: 'absolute',
                  top: -20,
                  right: { xs: 'auto', md: 0 },
                  borderRadius: '20px 20px 20px 20px',
                  zIndex: 0,
                  opacity: 0.2,
                }}
              />

              {/* Image Container with Styled Background/Shape */}
              <Box
                sx={{
                  width: { xs: '280px', sm: '350px' },
                  height: { xs: '320px', sm: '400px' },
                  bgcolor: '#C39766',
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


