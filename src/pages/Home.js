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
  PlayArrow,
  ArrowForward,
  Verified,
} from '@mui/icons-material';
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
          position: 'relative',
          bgcolor: '#fef5f0', // Light peach/pinkish background
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          py: 8,
        }}
      >
        {/* Geometric Shapes Background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Large Green/Triangle Shape (Primary Color) */}
          <Box
            sx={{
              position: 'absolute',
              width: '500px',
              height: '600px',
              right: '-100px',
              top: '10%',
              backgroundColor: '#202F32',
              opacity: 0.15,
              transform: 'rotate(25deg)',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              zIndex: 1,
            }}
          />
          
          {/* Orange/Triangle Shape (Secondary Color) */}
          <Box
            sx={{
              position: 'absolute',
              width: '450px',
              height: '550px',
              right: '50px',
              top: '30%',
              backgroundColor: '#A84836',
              opacity: 0.2,
              transform: 'rotate(-15deg)',
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              zIndex: 1,
            }}
          />

          {/* Small Yellow/Light Orange Shape */}
          <Box
            sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              right: '20%',
              top: '15%',
              backgroundColor: '#A84836',
              opacity: 0.25,
              borderRadius: '50%',
              zIndex: 1,
            }}
          />

          {/* "Learn" Text Overlay */}
          <Typography
            sx={{
              position: 'absolute',
              right: '15%',
              top: '25%',
              fontSize: '120px',
              fontWeight: 900,
              color: '#202F32',
              opacity: 0.08,
              transform: 'rotate(-15deg)',
              zIndex: 1,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            LEARN
          </Typography>
        </Box>

        <Container
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left Side - Text Content */}
          <Box sx={{ flex: 1, maxWidth: '600px' }}>
            {/* Tagline Badge */}
            <Chip
              label="eLearning Platform"
              sx={{
                bgcolor: '#A84836',
                color: 'white',
                fontWeight: 600,
                mb: 3,
                px: 1,
                height: '32px',
                fontSize: '0.875rem',
              }}
            />

            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 900,
                color: '#202F32',
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Smart Learning{' '}
              <Box
                component="span"
                sx={{
                  color: '#A84836',
                  display: 'inline-block',
                }}
              >
                Deeper & More
              </Box>
              <br />
              Amazing
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: '#202F32',
                mb: 4,
                opacity: 0.8,
                lineHeight: 1.8,
              }}
            >
              Phosfluorescently deploy unique intellectual capital without enterprise- 
              after bricks & clicks synergy. Enthusiastically revolutionize intuitive 
              learning experiences.
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={user ? '/courses' : '/register'}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              >
                Start Free Trial
              </Button>
              
              <Button
                variant="text"
                size="large"
                component={Link}
                to="/courses"
                startIcon={
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      bgcolor: '#A84836',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <PlayArrow />
                  </Box>
                }
                sx={{
                  color: '#202F32',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                How it Work
              </Button>
            </Box>
          </Box>

          {/* Right Side - Image with Floating Elements */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: { xs: 'none', lg: 'block' },
              zIndex: 2,
            }}
          >
            {/* Main Student Image */}
            <Box
              component="img"
              src="/hero.gif"
              alt="Student"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              sx={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                position: 'relative',
                zIndex: 3,
              }}
            />

            {/* Floating Elements */}
            {/* Google Logo */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '60px',
                height: '60px',
                bgcolor: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                zIndex: 4,
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#4285F4' }}>
                G
              </Typography>
            </Box>

            {/* Checkmark Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '-10%',
                width: '50px',
                height: '50px',
                bgcolor: '#A84836',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 4,
              }}
            >
              <Verified sx={{ color: 'white', fontSize: '1.8rem' }} />
            </Box>

            {/* Small Dots */}
            <Box
              sx={{
                position: 'absolute',
                top: '5%',
                left: '20%',
                width: '12px',
                height: '12px',
                bgcolor: '#A84836',
                borderRadius: '50%',
                zIndex: 4,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '15%',
                right: '25%',
                width: '12px',
                height: '12px',
                bgcolor: '#A84836',
                borderRadius: '50%',
                zIndex: 4,
              }}
            />
          </Box>
        </Container>
      </Box>

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
    </Box>
  );
};

export default Home;



