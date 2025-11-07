import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';

const BecomeInstructorCTA = () => {
  return (
    <Box sx={{ bgcolor: '#f0f7f3', py: 6, mt: 6 }}>
      <Container>
        <Box
          sx={{
            bgcolor: 'rgba(32,47,50,0.05)',
            borderRadius: '16px',
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 6 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Left text */}
          <Box sx={{ zIndex: 2 }}>
            <Typography sx={{ color: '#202F32', fontWeight: 700, mb: 1 }}>
              Become an Instructor
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#202F32',
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              You can join with IremeCorner
              <br />
              as <Box component="span" sx={{ color: '#2E7D32' }}>an instructor?</Box>
            </Typography>
          </Box>

          {/* CTA Button */}
          <Box sx={{ zIndex: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="/drop-information"
              sx={{
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#256b2a' },
                px: 3.5,
                py: 1.25,
                borderRadius: '10px',
                fontWeight: 700,
              }}
            >
              Drop Information
            </Button>
          </Box>

          {/* Decorative arrow */}
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '28%', md: '23%' },
              top: { xs: '34%', md: '28%' },
              width: 140,
              height: 140,
              borderRight: '4px solid #2E7D32',
              borderTop: '4px solid transparent',
              borderBottom: '4px solid #2E7D32',
              borderLeft: '4px solid transparent',
              borderRadius: '0 0 140px 0',
              transform: 'rotate(25deg)',
              opacity: 0.6,
              zIndex: 1,
            }}
          />

          {/* Sprinkles */}
          <Box sx={{ position: 'absolute', left: 20, bottom: 16, display: 'flex', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#C39766', borderRadius: '6px', opacity: 0.4, transform: `rotate(${20 + i * 10}deg)` }} />
            ))}
          </Box>
          <Box sx={{ position: 'absolute', right: 20, top: 16, display: 'flex', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#C39766', borderRadius: '6px', opacity: 0.4, transform: `rotate(${20 + i * 10}deg)` }} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BecomeInstructorCTA;


