import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { useQuery } from 'react-query';
import api from '../utils/api';

const CATEGORIES = [
  'All',
  'Digital Tools',
  'Marketing',
  'Financial Literacy',
  'Business Management',
  'Technical Skills',
];

const AllCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: coursesData } = useQuery(
    ['home-all-courses', activeCategory],
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (activeCategory !== 'All') params.append('category', activeCategory);
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
    <Box sx={{ bgcolor: '#f8f9fa', py: 10 }}>
      <Container>
        <Typography 
          variant="h3" 
          textAlign="center" 
          sx={{ color: '#202F32', fontWeight: 700, mb: 4 }}
        >
          All Courses
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1.5}
          sx={{
            bgcolor: 'rgba(32,47,50,0.05)',
            borderRadius: '12px',
            p: 1.5,
            mb: 5,
            overflowX: 'auto',
          }}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              color={activeCategory === cat ? 'default' : 'default'}
              sx={{
                bgcolor: activeCategory === cat ? 'rgba(168,72,54,0.15)' : 'white',
                color: '#202F32',
                fontWeight: 600,
                px: 1,
                height: 36,
                border: activeCategory === cat ? '1px solid #A84836' : '1px solid rgba(32,47,50,0.12)',
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {course.thumbnail && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#202F32', fontWeight: 600, mr: 1 }} noWrap>
                      {course.title}
                    </Typography>
                    {course.category && (
                      <Chip size="small" label={course.category} sx={{ bgcolor: 'rgba(32,47,50,0.08)', color: '#202F32' }} />
                    )}
                  </Box>
                  {course.description && (
                    <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.75 }}>
                      {course.description.substring(0, 100)}...
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    component={Link}
                    to={`/courses/${course._id}`}
                    sx={{ color: '#A84836', fontWeight: 600 }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllCoursesSection;


