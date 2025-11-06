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
} from '@mui/icons-material';

const About = () => {
  const coreValues = [
    {
      icon: <Shield sx={{ fontSize: 48 }} />,
      label: 'Safety',
    },
    {
      icon: <Lightbulb sx={{ fontSize: 48 }} />,
      label: 'Innovation',
    },
    {
      icon: <Settings sx={{ fontSize: 48 }} />,
      label: 'Efficient',
    },
    {
      icon: <GpsFixed sx={{ fontSize: 48 }} />,
      label: 'Precision',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        bgcolor: '#FDFBF6',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#202F32',
              textTransform: 'uppercase',
              letterSpacing: 2,
              mb: 2,
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            Unveiling Our Identity, Vision and Values
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              fontSize: '1.1rem',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            We're passionate about empowering artisans. With years of experience in education and e-commerce, we've established ourselves as leaders in providing high-quality learning solutions and market opportunities.
          </Typography>
        </Box>

        {/* Core Values Box */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#2E7D32',
            borderRadius: '24px',
            p: { xs: 4, md: 6 },
            mb: 8,
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
                    color: 'white',
                  }}
                >
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {value.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Introduction Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            🏠 Introduction
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#A84836',
              mb: 3,
            }}
          >
            Learn. Create. Sell.
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              fontSize: '1.1rem',
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 2,
              opacity: 0.9,
            }}
          >
            IremeCorner Academy empowers artisans to gain practical skills in digital tools, marketing, and business.
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              fontSize: '1.1rem',
              maxWidth: 900,
              mx: 'auto',
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            While learning, artisans can showcase and sell their handmade products directly on the IremeCorner Market, reaching real customers locally and beyond.
          </Typography>
        </Box>

        {/* Vision and Mission Sections */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Vision Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Visibility sx={{ fontSize: 32, color: '#2E7D32' }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2E7D32',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                🌍 Our Vision
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              A thriving artisan community where learning, creativity, and market opportunities come together to grow businesses and preserve cultural crafts.
            </Typography>
          </Grid>

          {/* Mission Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TrackChanges sx={{ fontSize: 32, color: '#2E7D32' }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#2E7D32',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                🎯 Our Mission
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#202F32',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                opacity: 0.9,
              }}
            >
              To empower artisans with skills and opportunities, enabling them to turn creativity into sustainable income while promoting Rwandan craftsmanship globally.
            </Typography>
          </Grid>
        </Grid>

        {/* Showcase Your Work Section */}
        <Box
          sx={{
            bgcolor: 'rgba(168,72,54,0.08)',
            borderRadius: '16px',
            p: { xs: 4, md: 6 },
            mb: 8,
            textAlign: 'center',
          }}
        >
          <ShoppingBag sx={{ fontSize: 64, color: '#A84836', mb: 3 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 3,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            🛍️ Showcase Your Work
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              fontSize: '1.1rem',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            The Academy is more than learning — it's your gateway to the IremeCorner Market.
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              fontSize: '1.1rem',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.8,
              opacity: 0.9,
              mt: 2,
            }}
          >
            Sell your handmade products online, gain visibility, and connect with customers who value authentic artisan goods.
          </Typography>
        </Box>

        {/* Join the Academy Section */}
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: '#202F32',
            borderRadius: '16px',
            p: { xs: 4, md: 6 },
            color: 'white',
          }}
        >
          <School sx={{ fontSize: 64, color: '#A84836', mb: 3 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
            }}
          >
            ✨ Join the Academy
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1.1rem',
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 4,
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
                bgcolor: '#A84836',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#8f3b2d',
                },
              }}
            >
              🧠 Start Learning
            </Button>
            <Button
              component={Link}
              to="/market"
              variant="outlined"
              size="large"
              startIcon={<ShoppingBag />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': {
                  borderColor: '#A84836',
                  bgcolor: 'rgba(168,72,54,0.1)',
                },
              }}
            >
              🛍️ Visit the Market
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;

