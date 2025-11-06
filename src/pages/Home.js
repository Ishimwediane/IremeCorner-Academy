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
  Chip,
} from '@mui/material';
import { 
  School, 
  TrendingUp, 
  Group, 
  CheckCircle,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import AllCoursesSection from '../components/AllCoursesSection';

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
  const totalApprovedCourses = coursesData?.count || courses.length || 0;

  return (
    <Box>
      <Hero user={user} totalCourses={totalApprovedCourses} />

      {/* About Us Section */}
      <Box sx={{ bgcolor: 'white', py: 12 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Tagline Badge */}
            <Chip
              label="About Us"
              sx={{
                bgcolor: '#202F32',
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 2,
                height: '36px',
                fontSize: '0.9rem',
              }}
            />

            {/* Main Heading */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#202F32',
                mb: 4,
                maxWidth: '900px',
                mx: 'auto',
                lineHeight: 1.5,
              }}
            >
              We are passionate about empowering learners Worldwide with high-quality, 
              accessible & engaging education. Our mission offering a diverse range of courses.
            </Typography>

            {/* Statistics */}
            <Grid container spacing={4} sx={{ mt: 6 }}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 900,
                    color: '#202F32',
                    mb: 1,
                  }}
                >
                  25+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#202F32',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Years of eLearning Education Experience
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 900,
                    color: '#202F32',
                    mb: 1,
                  }}
                >
                  56k
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#202F32',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Students Enrolled in LMSZONE Courses
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    fontWeight: 900,
                    color: '#202F32',
                    mb: 1,
                  }}
                >
                  170+
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#202F32',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  Experienced Teacher's service
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 12 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <School sx={{ fontSize: 60, color: '#202F32', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#202F32', fontWeight: 600 }}>
                Expert Courses
              </Typography>
              <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7 }}>
                Learn from experienced trainers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <TrendingUp sx={{ fontSize: 60, color: '#202F32', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#202F32', fontWeight: 600 }}>
                Track Progress
              </Typography>
              <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7 }}>
                Monitor your learning journey
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Group sx={{ fontSize: 60, color: '#202F32', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#202F32', fontWeight: 600 }}>
                Community Learning
              </Typography>
              <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7 }}>
                Connect with fellow learners
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <CheckCircle sx={{ fontSize: 60, color: '#202F32', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#202F32', fontWeight: 600 }}>
                Get Certified
              </Typography>
              <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7 }}>
                Earn certificates upon completion
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Courses */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 12 }}>
        <Container>
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center"
            sx={{ 
              color: '#202F32',
              fontWeight: 700,
              mb: 6,
            }}
          >
            Featured Courses
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {courses.slice(0, 6).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
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
                    <Typography variant="h6" gutterBottom sx={{ color: '#202F32', fontWeight: 600 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7, mb: 1 }}>
                      {course.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.8 }}>
                      {course.description?.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/courses/${course._id}`}
                      sx={{
                        color: '#A84836',
                        fontWeight: 600,
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box textAlign="center" sx={{ mt: 6 }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/courses"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
              }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* All Courses Section */}
      <AllCoursesSection />
    </Box>
  );
};

export default Home;



