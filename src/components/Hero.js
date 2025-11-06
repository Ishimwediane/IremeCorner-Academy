import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { ArrowForward, PlayArrow, Verified } from '@mui/icons-material';

const Hero = ({ user }) => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#fef5f0',
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          py: 6,
        }}
      >
        {/* Geometric Shapes Background (kept subtle) */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '420px',
              height: '520px',
              right: '-90px',
              top: '12%',
              backgroundColor: '#202F32',
              opacity: 0.12,
              transform: 'rotate(25deg)',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '380px',
              height: '460px',
              right: '40px',
              top: '32%',
              backgroundColor: '#A84836',
              opacity: 0.18,
              transform: 'rotate(-15deg)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              zIndex: 1,
            }}
          />
          {/* Removed the 'LEARN' watermark */}
        </Box>

        <Container
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left Side - Text Content */}
          <Box sx={{ flex: 1, maxWidth: '560px' }}>
            <Chip
              label="eLearning Platform"
              sx={{
                bgcolor: '#A84836',
                color: 'white',
                fontWeight: 600,
                mb: 2.5,
                px: 1,
                height: '30px',
                fontSize: '0.8rem',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                color: '#202F32',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Smart Learning{' '}
              <Box component="span" sx={{ color: '#A84836', display: 'inline-block' }}>
                Deeper & More
              </Box>
              <br />
              Amazing
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                color: '#202F32',
                mb: 3,
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              Phosfluorescently deploy unique intellectual capital without enterprise-
              after bricks & clicks synergy. Enthusiastically revolutionize intuitive
              learning experiences.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={user ? '/courses' : '/register'}
                endIcon={<ArrowForward />}
                sx={{ px: 3.5, py: 1.25, fontSize: '0.95rem', fontWeight: 600, borderRadius: '8px' }}
              >
                Start Free Trial
              </Button>

              <Button
                variant="text"
                size="large"
                component={Link}
                to="/courses"
                startIcon={
                  <Box
                    sx={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      bgcolor: '#A84836',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <PlayArrow />
                  </Box>
                }
                sx={{ color: '#202F32', fontSize: '0.95rem', fontWeight: 600, textTransform: 'none' }}
              >
                How it Work
              </Button>
            </Box>
          </Box>

          {/* Right Side - Image and floating elements (no 'G' box) */}
          <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', lg: 'block' }, zIndex: 2 }}>
            <Box
              component="img"
              src="/hero.gif"
              alt="Student"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              sx={{
                width: '100%',
                maxWidth: '520px',
                height: 'auto',
                position: 'relative',
                zIndex: 3,
              }}
            />

            {/* Checkmark Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '-10%',
                width: '46px',
                height: '46px',
                bgcolor: '#A84836',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 4,
              }}
            >
              <Verified sx={{ color: 'white', fontSize: '1.6rem' }} />
            </Box>

            {/* Small Dots */}
            <Box sx={{ position: 'absolute', top: '6%', left: '22%', width: '10px', height: '10px', bgcolor: '#A84836', borderRadius: '50%', zIndex: 4 }} />
            <Box sx={{ position: 'absolute', top: '16%', right: '26%', width: '10px', height: '10px', bgcolor: '#A84836', borderRadius: '50%', zIndex: 4 }} />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Hero;


