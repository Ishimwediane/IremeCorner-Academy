import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import { useQuery } from 'react-query';
import { Star, ChevronLeft, ChevronRight } from '@mui/icons-material';
import api from '../utils/api';

const CATEGORIES = [
  'All Courses',
  'Design',
  'Development',
  'Cyber Security',
];



const AllCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All Courses');

  const { data: coursesData } = useQuery(
    ['home-all-courses', activeCategory],
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (activeCategory !== 'All Courses') params.append('category', activeCategory);
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

  // Limit to 3 for the visual match of the carousel design, or allow wrapping
  const displayCourses = courses.length > 0 ? courses : [];

  return (
    <Box sx={{ py: 8, bgcolor: '#FAF1E6' }}> {/* Reduced py */}
      <Container maxWidth="lg" sx={{ px: { xs: 4, md: 12, lg: 20 } }}> {/* Maximized padding */}
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8, px: { xs: 2, md: 0 } }}>
          <Chip
            label="C O U R S E S   C A T E G O R I E S"
            sx={{
              bgcolor: '#FFF3E0', // Light Orange (Cream-like)
              color: '#FD7E14', // Brand Orange text
              fontWeight: 700,
              letterSpacing: '2px',
              px: 1,
              mb: 3,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 2,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            We Bring The Good Education To Life
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              maxWidth: '550px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '0.925rem',
            }}
          >
            Get latest news in your inbox. Consectetur adipiscing elitadipiscing elitse ddo eiusmod tempor incididunt ut labore et dolore.
          </Typography>
        </Box>

        {/* Categories Tabs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 8,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              p: 0.5,
              borderRadius: '50px',
              display: 'inline-flex',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: activeCategory === cat ? 'white' : '#666',
                  bgcolor: activeCategory === cat ? '#FD7E14' : 'transparent', // Brand Orange active state
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: activeCategory === cat ? '#FD7E14' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Courses Grid with Carousel Style */}
        <Box sx={{ position: 'relative', px: { md: 4 } }}>
          {/* Navigation Arrows (Visual only for now) */}
          <IconButton
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              display: { xs: 'none', md: 'flex' },
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              display: { xs: 'none', md: 'flex' },
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            <ChevronRight />
          </IconButton>

          <Grid container spacing={4} justifyContent="center">
            {displayCourses.map((course) => (
              <Grid item xs={12} md={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '16px', // Rounded corners
                    bgcolor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Image Container */}
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <Box
                      component="img"
                      src={course.thumbnail || '/course-placeholder.jpg'}
                      alt={course.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Category Chip (Top Left) */}
                    <Chip
                      label={course.category || 'General'}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: '#FFF3E0', // Light Cream/Orange
                        color: '#FD7E14', // Brand Orange
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: '24px',
                        backdropFilter: 'blur(4px)',
                      }}
                    />

                    {/* Rating Chip (Top Right) */}
                    <Chip
                      icon={<Star sx={{ color: 'white !important', fontSize: '14px !important' }} />}
                      label={course.averageRating ? course.averageRating.toFixed(1) : '4.5'} // Fallback rating
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: '#FD7E14', // Brand Orange
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: '24px',
                        border: 'none',
                        '& .MuiChip-icon': { ml: 0.5 },
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Title */}
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/courses/${course._id}`}
                      sx={{
                        fontWeight: 700,
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        mb: 2,
                        lineHeight: 1.4,
                        fontSize: '1.1rem',
                        '&:hover': { color: '#FD7E14' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Metadata Row (Classes | Students) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, color: '#666' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" sx={{ fontSize: '1.2rem' }}>📖</Box> {/* Book Icon Placeholder or Material Icon */}
                        <Typography variant="caption" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {course.lessons?.length || 0} Classes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" sx={{ fontSize: '1.2rem' }}>👤</Box>
                        <Typography variant="caption" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {course.enrolledStudents?.length || 0} Students
                        </Typography>
                      </Box>
                    </Box>

                    {/* Divider is visual via padding/margin or border top of footer if needed, but flex gap works well */}

                    {/* Footer Row (Price | Instructor) */}
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Price */}
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#1A1A1A',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}
                      >
                        {course.isFree ? 'Free' : `$${course.price?.toFixed(2) || '0.00'}`}
                      </Typography>

                      {/* Instructor */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={course.trainer?.profilePicture || ''}
                          alt={course.trainer?.name || 'Instructor'}
                          sx={{ width: 30, height: 30, bgcolor: '#FD7E14' }}
                        >
                          {course.trainer?.name?.charAt(0) || 'I'}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{ color: '#666', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          {course.trainer?.name ? course.trainer.name.split(' ')[0] : 'Instructor'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AllCoursesSection;
