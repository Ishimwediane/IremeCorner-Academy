import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const StepCard = ({ icon, title, description, corner }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: 'rgba(32,47,50,0.06)',
      borderRadius: '16px',
      p: { xs: 3, md: 5 },
      position: 'relative',
      minHeight: 240,
    }}
  >
    {/* corner sprinkles */}
    {corner === 'tl' && (
      <Box sx={{ position: 'absolute', left: 14, top: 14, display: 'flex', gap: 1 }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#A84836', borderRadius: '6px', opacity: 0.35, transform: `rotate(${20 + i * 10}deg)` }} />
        ))}
      </Box>
    )}
    {corner === 'br' && (
      <Box sx={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', gap: 1 }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ width: 8, height: 18, bgcolor: '#A84836', borderRadius: '6px', opacity: 0.35, transform: `rotate(${20 + i * 10}deg)` }} />
        ))}
      </Box>
    )}

    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '12px',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h5" sx={{ color: '#202F32', fontWeight: 700, mb: 1.5 }}>
      {title}
    </Typography>
    <Typography sx={{ color: '#202F32', opacity: 0.75 }}>
      {description}
    </Typography>
  </Paper>
);

const Arrow = (props) => (
  <Box
    {...props}
    sx={{
      width: 80,
      height: 80,
      borderRight: '4px solid #2E7D32',
      borderBottom: '4px solid #2E7D32',
      borderTop: '4px solid transparent',
      borderLeft: '4px solid transparent',
      borderRadius: '0 0 80px 0',
      transform: 'rotate(-45deg)',
      opacity: 0.7,
      mx: { xs: 'auto', md: 2 },
      my: { xs: 2, md: 0 },
      ...props.sx,
    }}
  />
);

const HowItWorks = ({ totalCourses = 0 }) => {
  return (
    <Box id="how-it-works" sx={{ py: 10 }}>
      <Container>
        <Typography sx={{ color: '#2E7D32', fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Over {new Intl.NumberFormat().format(totalCourses)}+ Course
        </Typography>
        <Typography variant="h3" textAlign="center" sx={{ color: '#202F32', fontWeight: 800, mb: 6 }}>
          How It <Box component="span" sx={{ color: '#2E7D32' }}>Work?</Box>
        </Typography>

        <Box sx={{ position: 'relative' }}>
        <Grid container spacing={3} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} md={4}>
            <StepCard
              icon={<SearchIcon sx={{ color: '#2E7D32' }} />}
              title="Find Your Course"
              description="It has survived not only centuries also leap into electronic."
              corner="tl"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StepCard
              icon={<EventSeatIcon sx={{ color: '#2E7D32' }} />}
              title="Book A Seat"
              description="It has survived not only centuries also leap into electronic."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StepCard
              icon={<EmojiEventsIcon sx={{ color: '#2E7D32' }} />}
              title="Get Certificate"
              description="It has survived not only centuries also leap into electronic."
              corner="br"
            />
          </Grid>
        </Grid>
        {/* connector arrows (only on md+) */}
        <Arrow sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '33.3%', top: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)' }} />
        <Arrow sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '66.6%', top: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;


