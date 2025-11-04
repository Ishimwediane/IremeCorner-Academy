import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';
import { School, TrendingUp, Group, CheckCircle } from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const { data: coursesData } = useQuery(
    'featured-courses',
    async () => {
      const response = await api.get('/courses?status=approved&limit=6');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const courses = coursesData?.data || [];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to IremeCorner Academy
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Empowering Artisans Through Online Learning
          </Typography>
          {!user && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/register"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={Link}
                to="/courses"
              >
                Browse Courses
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Expert Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn from experienced trainers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your learning journey
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Group sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Community Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with fellow learners
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <CheckCircle sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Get Certified
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Earn certificates upon completion
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Courses */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h4" gutterBottom textAlign="center">
            Featured Courses
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {courses.slice(0, 6).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card>
                  {course.thumbnail && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.thumbnail}
                      alt={course.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.category}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {course.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={Link} to={`/courses/${course._id}`}>
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button variant="contained" component={Link} to="/courses">
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
