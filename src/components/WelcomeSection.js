import React from 'react';
import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const WelcomeSection = () => {
  return (
    <Box sx={{ bgcolor: 'rgba(168,72,54,0.06)', py: { xs: 8, md: 10 } }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          {/* Left visuals */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 520 }}>
              {/* background dotted blob */}
              <Box sx={{ position: 'absolute', left: -30, top: -30, width: 160, height: 160, bgcolor: 'rgba(32,47,50,0.08)', borderRadius: '36% 64% 60% 40% / 38% 29% 71% 62%', filter: 'blur(1px)' }} />

              {/* main image */}
              <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: '16px' }}>
                <Box component="img" src="/hero.gif" alt="Welcome Student" sx={{ width: '100%', height: 340, objectFit: 'cover' }} />
              </Paper>

              {/* mini video card overlay */}
              <Paper elevation={3} sx={{ position: 'absolute', right: -20, top: 30, borderRadius: '14px', p: 1.5, bgcolor: 'white' }}>
                <Box sx={{ width: 180, height: 100, borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                  <Box component="img" src="/testimonies.png" alt="Preview" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: 34, height: 34, bgcolor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>
                      <Box sx={{ width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid #A84836', ml: 0.5 }} />
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* awards badge */}
              <Paper elevation={2} sx={{ position: 'absolute', left: 24, bottom: -16, px: 2.5, py: 1.25, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 28, height: 28, bgcolor: 'rgba(46,125,50,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 14, height: 14, bgcolor: '#2E7D32', borderRadius: '50%' }} />
                </Box>
                <Typography sx={{ color: '#202F32', fontWeight: 700 }}>29+ Awards</Typography>
              </Paper>
            </Box>
          </Grid>

          {/* Right content */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: '#202F32', fontWeight: 700, letterSpacing: 1, mb: 1 }}>ABOUT US</Typography>
            <Typography variant="h3" sx={{ color: '#202F32', fontWeight: 800, mb: 2 }}>
              Learn & Grow Your Skills
              <br />
              From <Box component="span" sx={{ color: '#A84836' }}>Anywhere</Box>
            </Typography>
            <Box sx={{ width: 90, height: 6, bgcolor: '#2E7D32', borderRadius: 3, mb: 2 }} />
            <Typography sx={{ color: '#202F32', opacity: 0.85, mb: 3, lineHeight: 1.8 }}>
              Welcome! Build practical skills with industry-ready courses designed for impact. Join thousands of learners advancing their careers with flexible, engaging lessons.
            </Typography>
            <Stack spacing={1.5}>
              {[ 'Expert Trainers', 'Online Remote Learning', 'Lifetime Access' ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#2E7D32' }} />
                  <Typography sx={{ color: '#202F32', fontWeight: 600 }}>{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeSection;


