import React from 'react';
import { Box, Container, Grid, Paper, Typography, Avatar, Button, Stack } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const TESTIMONIALS = [
  {
    category: 'Great quality!',
    content: "I wanted to place a review since their support helped me within a day or so, which is nice! Thanks and 5 stars!",
    author: 'Oliver Beddows',
    role: 'Designer, Manchester',
    avatar: 'https://i.pravatar.cc/150?u=oliver',
  },
  {
    category: 'Code Quality',
    content: "ThemeMove deserves 5 star for theme's features, design quality, flexibility, and support service!",
    author: 'Madley Pondor',
    role: 'Reporter, San Diego',
    avatar: 'https://i.pravatar.cc/150?u=madley',
  },
  {
    category: 'Customer Support',
    content: "Very good and fast support during the week. They know what you need, exactly when you need it.",
    author: 'Mina Hollace',
    role: 'Reporter, London',
    avatar: 'https://i.pravatar.cc/150?u=mina',
  },
];

const TestimonialsSection = () => {
  return (
    <Box sx={{ bgcolor: '#F9FAFB', py: 12 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left: Heading and CTA */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: '#202F32',
                  fontWeight: 700,
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                People Say <br />
                About <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>IremeHub</Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 0,
                    width: '100px',
                    height: '8px',
                    bgcolor: '#C39766',
                    opacity: 0.3,
                    borderRadius: '4px',
                    zIndex: 0,
                  }}
                />
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(32, 47, 50, 0.7)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                One-stop solution for any eLearning center, online courses. People love IremeHub because they can create
                their sites with ease here.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  color: '#202F32',
                  borderColor: 'rgba(32, 47, 50, 0.12)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(32, 47, 50, 0.04)',
                    borderColor: '#202F32',
                  },
                }}
              >
                View all
              </Button>
            </Box>
          </Grid>

          {/* Right: Testimonial Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {TESTIMONIALS.map((t, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: '16px',
                      bgcolor: 'white',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#3498DB',
                          fontWeight: 700,
                        }}
                      >
                        {t.category}
                      </Typography>
                      <FormatQuoteIcon
                        sx={{
                          color: '#F3F4F6',
                          fontSize: '3rem',
                          position: 'absolute',
                          top: 20,
                          right: 20,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(32, 47, 50, 0.8)',
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                        mb: 4,
                        flexGrow: 1,
                      }}
                    >
                      {t.content}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={t.avatar}
                        sx={{ width: 44, height: 44, mr: 2 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#202F32', fontWeight: 700 }}
                        >
                          {t.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(32, 47, 50, 0.5)', fontWeight: 500 }}
                        >
                          / {t.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Pager Dots */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ mt: 6 }}
        >
          <Box sx={{ width: 8, height: 8, bgcolor: '#202F32', borderRadius: '50%' }} />
          <Box sx={{ width: 8, height: 8, bgcolor: 'rgba(32, 47, 50, 0.2)', borderRadius: '50%' }} />
        </Stack>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;





