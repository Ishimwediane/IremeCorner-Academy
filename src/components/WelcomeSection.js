import React from 'react';
import { Box, Container, Grid, Typography, Stack, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const WelcomeSection = () => {
  return (
    <Box sx={{ bgcolor: '#202F32', py: { xs: 8, md: 10 } }}>
      <Container>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* Content only (no images) */}
          <Grid item xs={12} md={10} lg={8}>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: 1, mb: 1 }}>ABOUT US</Typography>
            <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 800, mb: 2 }}>
              Learn & Grow Your Skills
              <br />
              From <Box component="span" sx={{ color: '#A84836' }}>Anywhere</Box>
            </Typography>
            <Box sx={{ width: 90, height: 6, bgcolor: '#2E7D32', borderRadius: 3, mb: 2 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.8 }}>
              Welcome! Build practical skills with industry-ready courses designed for impact. Join thousands of learners advancing their careers with flexible, engaging lessons.
            </Typography>
            <Stack spacing={1.5}>
              {[ 'Expert Trainers', 'Online Remote Learning', 'Lifetime Access' ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#2E7D32' }} />
                  <Typography sx={{ color: '#ffffff', fontWeight: 600 }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
            <Button
              variant="contained"
              sx={{ mt: 3, px: 3.5, py: 1.25, borderRadius: '10px', fontWeight: 700, bgcolor: '#A84836', '&:hover': { bgcolor: '#8f3b2d' } }}
              href="/register"
            >
              Join Now
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeSection;


