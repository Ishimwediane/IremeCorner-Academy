import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  Shield,
  Lightbulb,
  Settings,
  GpsFixed,
  Visibility,
  TrackChanges,
  ShoppingBag,
  School,
  Home,
} from '@mui/icons-material';

const About = () => {
  const coreValues = [
    {
      icon: <Shield sx={{ fontSize: 56, color: 'white' }} />,
      label: 'Safety',
    },
    {
      icon: <Lightbulb sx={{ fontSize: 56, color: 'white' }} />,
      label: 'Innovation',
    },
    {
      icon: <Settings sx={{ fontSize: 56, color: 'white' }} />,
      label: 'Efficient',
    },
    {
      icon: <GpsFixed sx={{ fontSize: 56, color: 'white' }} />,
      label: 'Precision',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        bgcolor: '#FDFBF6',
      }}
    >
      {/* Hero Section with Introduction */}
      <Box
        sx={{
          bgcolor: '#202F32',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
              <Home sx={{ fontSize: 40, color: '#C39766' }} />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Introduction
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#C39766',
                mb: 4,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
              }}
            >
              Learn. Create. Sell.
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                lineHeight: 1.9,
                mb: 3,
              }}
            >
              IremeCorner Academy empowers artisans to gain practical skills in digital tools, marketing, and business.
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                lineHeight: 1.9,
              }}
            >
              While learning, artisans can showcase and sell their handmade products directly on the IremeCorner Market, reaching real customers locally and beyond.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Core Values Box */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#2E7D32',
            borderRadius: '32px',
            p: { xs: 5, md: 8 },
            mb: { xs: 8, md: 10 },
          }}
        >
          <Grid container spacing={4}>
            {coreValues.map((value, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {value.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'white',
                      letterSpacing: 0.5,
                    }}
                  >
                    {value.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Vision and Mission Sections */}
        <Grid container spacing={{ xs: 4, md: 8 }} sx={{ mb: { xs: 8, md: 10 } }}>
          {/* Vision Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Visibility sx={{ fontSize: 36, color: '#2E7D32' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#2E7D32',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Our Vision
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.9,
                opacity: 0.85,
              }}
            >
              A thriving artisan community where learning, creativity, and market opportunities come together to grow businesses and preserve cultural crafts.
            </Typography>
          </Grid>

          {/* Mission Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrackChanges sx={{ fontSize: 36, color: '#2E7D32' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#2E7D32',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Our Mission
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.9,
                opacity: 0.85,
              }}
            >
              To empower artisans with skills and opportunities, enabling them to turn creativity into sustainable income while promoting Rwandan craftsmanship globally.
            </Typography>
          </Grid>
        </Grid>

        {/* Showcase Your Work Section */}
        <Box
          sx={{
            bgcolor: 'rgba(195,151,102,0.08)',
            borderRadius: '24px',
            p: { xs: 5, md: 7 },
            mb: { xs: 8, md: 10 },
            textAlign: 'center',
          }}
        >
          <ShoppingBag sx={{ fontSize: 64, color: '#C39766', mb: 3 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 4,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Showcase Your Work
          </Typography>
          <Box sx={{ maxWidth: 850, mx: 'auto' }}>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.9,
                mb: 3,
                opacity: 0.85,
              }}
            >
              The Academy is more than learning — it's your gateway to the IremeCorner Market.
            </Typography>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.9,
                opacity: 0.85,
              }}
            >
              Sell your handmade products online, gain visibility, and connect with customers who value authentic artisan goods.
            </Typography>
          </Box>
        </Box>

        {/* Join the Academy Section */}
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: '#202F32',
            borderRadius: '24px',
            p: { xs: 5, md: 7 },
            color: 'white',
          }}
        >
          <School sx={{ fontSize: 64, color: '#C39766', mb: 3 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            Join the Academy
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1rem', md: '1.15rem' },
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.9,
              mb: 5,
            }}
          >
            Ready to grow your skills and start selling your crafts?
            <br />
            Join IremeCorner Academy today!
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/courses"
              variant="contained"
              size="large"
              startIcon={<School />}
              sx={{
                bgcolor: '#C39766',
                color: 'white',
                px: 5,
                py: 1.75,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.05rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(195,151,102,0.3)',
                '&:hover': {
                  bgcolor: '#A67A52',
                  boxShadow: '0 6px 20px rgba(195,151,102,0.4)',
                },
              }}
            >
              Start Learning
            </Button>
            <Button
              component={Link}
              to="/market"
              variant="outlined"
              size="large"
              startIcon={<ShoppingBag />}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                borderWidth: 2,
                color: 'white',
                px: 5,
                py: 1.75,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1.05rem',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#C39766',
                  bgcolor: 'rgba(195,151,102,0.15)',
                  borderWidth: 2,
                },
              }}
            >
              Visit the Market
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
