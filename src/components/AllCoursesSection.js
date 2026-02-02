import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useQuery } from 'react-query';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import api from '../utils/api';

const CATEGORIES = [
  'All',
  'Trending',
  'Popularity',
  'Featured',
  'Art & Design',
];

const AllCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: coursesData } = useQuery(
    ['home-all-courses', activeCategory],
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (activeCategory !== 'All') params.append('category', activeCategory);
      // Mocking different filters if category is just meta
      const response = await api.get(`/courses?${params.toString()}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const courses = coursesData?.data || [];

  return (
    <Box sx={{ bgcolor: 'white', py: 10 }}>
      <Container maxWidth="lg">
        {/* Header and Filters */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#202F32',
              fontWeight: 700,
              position: 'relative',
              mb: { xs: 4, md: 0 },
            }}
          >
            Students are <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>Viewing</Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 0,
                width: '120px',
                height: '8px',
                bgcolor: '#C39766',
                opacity: 0.3,
                borderRadius: '4px',
                zIndex: 0,
              }}
            />
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: 'auto',
              maxWidth: '100%',
              pb: 1,
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  color: activeCategory === cat ? '#202F32' : 'rgba(32,47,50,0.6)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderRadius: '20px',
                  bgcolor: activeCategory === cat ? '#F0F4F5' : 'transparent',
                  '&:hover': {
                    bgcolor: '#F0F4F5',
                    color: '#202F32',
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Courses Grid */}
        <Grid container spacing={3}>
          {courses.map((course, index) => {
            const isFree = course.price === 0 || !course.price;
            const hasDiscount = course.discountPrice && course.discountPrice < course.price;
            const discountPercentage = hasDiscount ? Math.round(((course.price - course.discountPrice) / course.price) * 100) : 0;

            return (
              <Grid item xs={12} sm={6} md={2.4} key={course._id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'transparent',
                    '&:hover img': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', mb: 2 }}>
                    {/* Badges */}
                    <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2, display: 'flex', gap: 0.5 }}>
                      <Chip
                        label="FEATURED"
                        size="small"
                        sx={{
                          bgcolor: '#E67E22',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          height: '20px',
                          borderRadius: '4px',
                        }}
                      />
                      {isFree && (
                        <Chip
                          label="FREE"
                          size="small"
                          sx={{
                            bgcolor: '#2ECC71',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            height: '20px',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                      {hasDiscount && (
                        <Chip
                          label={`-${discountPercentage}%`}
                          size="small"
                          sx={{
                            bgcolor: '#3498DB',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            height: '20px',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                    </Box>

                    <CardMedia
                      component="img"
                      image={course.thumbnail || '/learn.jpg'}
                      alt={course.title}
                      sx={{
                        height: 160,
                        transition: 'transform 0.3s ease',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 0, flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#202F32',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        lineHeight: 1.3,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.6em',
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: '#3498DB', fontWeight: 500, display: 'block', mb: 1 }}
                    >
                      {course.instructor?.name || 'Instructor Name'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography
                        sx={{
                          color: hasDiscount ? '#E74C3C' : '#202F32',
                          fontWeight: 800,
                          fontSize: '1rem',
                          mr: 1,
                        }}
                      >
                        ${hasDiscount ? course.discountPrice : (course.price || 0)}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          sx={{
                            color: 'rgba(32,47,50,0.4)',
                            textDecoration: 'line-through',
                            fontSize: '0.8rem',
                          }}
                        >
                          ${course.price}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(4)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#F1C40F', fontSize: '0.9rem' }} />
                      ))}
                      <StarBorderIcon sx={{ color: '#F1C40F', fontSize: '0.9rem' }} />
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(32,47,50,0.5)', ml: 0.5, fontWeight: 600 }}
                      >
                        (2)
                      </Typography>
                    </Box>
                  </CardContent>

                  <Button
                    component={Link}
                    to={`/courses/${course._id}`}
                    sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>

      </Container>
    </Box>
  );
};

export default AllCoursesSection;





