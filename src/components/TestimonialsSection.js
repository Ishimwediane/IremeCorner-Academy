import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';

const TestimonialsSection = () => {
  return (
    <Box sx={{ bgcolor: '#f4f7f9', py: 10 }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Left: Card with text and small dots (pager) */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'white',
                borderRadius: '16px',
                p: { xs: 3, md: 4 },
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              <Typography variant="h6" sx={{ color: '#202F32', fontWeight: 800, mb: 1 }}>
                Success Stories
              </Typography>
              <Typography sx={{ color: '#202F32', opacity: 0.8, mb: 2, lineHeight: 1.8 }}>
                Accelerate innovation with world-class tech teams. Beyond more static than
                along goodness. It has survived not only centuries but also the leap into
                electronic.
              </Typography>
              <Typography sx={{ color: '#202F32', fontWeight: 700, mb: 3 }}>James Smith</Typography>
              {/* Pager dots */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: '#2E7D32', borderRadius: '50%' }} />
                <Box sx={{ width: 10, height: 10, bgcolor: 'rgba(32,47,50,0.3)', borderRadius: '50%' }} />
                <Box sx={{ width: 10, height: 10, bgcolor: 'rgba(32,47,50,0.3)', borderRadius: '50%' }} />
              </Box>

              {/* Decorative sprinkles */}
              <Box sx={{ position: 'absolute', left: 16, top: 16, display: 'flex', gap: 1 }}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#C39766', borderRadius: '6px', opacity: 0.35, transform: `rotate(${20 + i * 10}deg)` }} />
                ))}
              </Box>
              <Box sx={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 1 }}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#C39766', borderRadius: '6px', opacity: 0.35, transform: `rotate(${20 + i * 10}deg)` }} />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Right: Circular image with subtle rings and shapes */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Rings */}
              <Box sx={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: '3px solid rgba(46,125,50,0.35)' }} />
              <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', border: '3px solid rgba(195,151,102,0.25)' }} />

              {/* Image */}
              <Box
                component="img"
                src="/testimonies.png"
                alt="Testimonial"
                sx={{ width: 300, height: 300, objectFit: 'cover', borderRadius: '50%', zIndex: 2 }}
              />

              {/* Small triangle accent */}
              <Box sx={{ position: 'absolute', left: '20%', top: '48%', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #C39766', transform: 'rotate(90deg)' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;





