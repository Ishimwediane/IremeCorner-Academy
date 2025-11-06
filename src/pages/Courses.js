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
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search,
  School,
  TrendingUp,
  PersonAdd,
  ArrowForward,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Courses = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
  });

  const { data: coursesData, isLoading } = useQuery(
    ['courses', filters],
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);

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
  const totalCourses = coursesData?.count || courses.length;

  const categories = [
    'Digital Tools',
    'Marketing',
    'Financial Literacy',
    'Business Management',
    'Technical Skills',
    'Other',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'rgba(168,72,54,0.08)',
          background: 'linear-gradient(135deg, rgba(168,72,54,0.1) 0%, rgba(32,47,50,0.05) 100%)',
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#202F32',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Explore Our Courses
          </Typography>
          <Typography
            sx={{
              color: '#202F32',
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '1.1rem',
              mb: 4,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Start your learning journey today. Discover expert-led courses designed to help you grow your skills and advance your career.
          </Typography>

          {/* CTA Buttons */}
          {!user && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#A84836',
                  '&:hover': { bgcolor: '#8f3b2d' },
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 700,
                }}
              >
                Create Free Account
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#A84836',
                  color: '#A84836',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#8f3b2d',
                    bgcolor: 'rgba(168,72,54,0.05)',
                  },
                }}
              >
                Sign In to Continue Learning
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Container sx={{ pb: 8 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
              {totalCourses} Courses Available
            </Typography>
            <Button
              component={Link}
              to="/drop-information"
              variant="outlined"
              startIcon={<PersonAdd />}
              sx={{
                borderColor: '#2E7D32',
                color: '#2E7D32',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#256b2a',
                  bgcolor: 'rgba(46,125,50,0.05)',
                },
              }}
            >
              Become a Tutor
            </Button>
          </Box>
        </Box>

        {/* Main Content: Filters Sidebar + Courses Grid */}
        <Grid container spacing={4}>
          {/* Filters Sidebar (Left) */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'rgba(32,47,50,0.03)',
                borderRadius: '16px',
                position: { md: 'sticky' },
                top: { md: 90 },
                maxHeight: { md: 'calc(100vh - 100px)' },
                overflowY: { md: 'auto' },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#202F32',
                  mb: 3,
                  pb: 2,
                  borderBottom: '2px solid rgba(168,72,54,0.2)',
                }}
              >
                Filter Courses
              </Typography>

              <Stack spacing={3}>
                {/* Search */}
                <Box>
                  <Typography
                    sx={{
                      color: '#202F32',
                      fontWeight: 600,
                      mb: 1.5,
                      fontSize: '0.95rem',
                    }}
                  >
                    Search
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search courses..."
                    variant="outlined"
                    size="small"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'rgba(32,47,50,0.5)' }} />,
                    }}
                  />
                </Box>

                {/* Category Filter */}
                <Box>
                  <Typography
                    sx={{
                      color: '#202F32',
                      fontWeight: 600,
                      mb: 1.5,
                      fontSize: '0.95rem',
                    }}
                  >
                    Category
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      displayEmpty
                      sx={{
                        bgcolor: 'white',
                      }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Level Filter */}
                <Box>
                  <Typography
                    sx={{
                      color: '#202F32',
                      fontWeight: 600,
                      mb: 1.5,
                      fontSize: '0.95rem',
                    }}
                  >
                    Level
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                      displayEmpty
                      sx={{
                        bgcolor: 'white',
                      }}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {levels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Clear Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setFilters({ search: '', category: '', level: '' })}
                  sx={{
                    borderColor: '#202F32',
                    color: '#202F32',
                    mt: 2,
                    '&:hover': {
                      borderColor: '#A84836',
                      bgcolor: 'rgba(168,72,54,0.05)',
                    },
                  }}
                >
                  Clear Filters
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* Courses Grid (Right) */}
          <Grid item xs={12} md={9}>
            {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#202F32', opacity: 0.7 }}>Loading courses...</Typography>
          </Box>
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <School sx={{ fontSize: 64, color: 'rgba(32,47,50,0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#202F32', mb: 2 }}>
              No courses found
            </Typography>
            <Typography sx={{ color: '#202F32', opacity: 0.7, mb: 3 }}>
              Try adjusting your filters or check back later for new courses.
            </Typography>
            {!user && (
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: '#A84836',
                  '&:hover': { bgcolor: '#8f3b2d' },
                }}
              >
                Create Account to Get Started
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#202F32',
                        mb: 1.5,
                        minHeight: 56,
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(168,72,54,0.1)',
                          color: '#A84836',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={course.level}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(46,125,50,0.1)',
                          color: '#2E7D32',
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#202F32',
                        opacity: 0.75,
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.description}
                    </Typography>
                    {course.trainer && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#202F32',
                          opacity: 0.7,
                          mb: 1,
                          fontSize: '0.85rem',
                        }}
                      >
                        By {course.trainer.name}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#2E7D32',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        {course.enrolledStudents?.length || 0} enrolled
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to={`/courses/${course._id}`}
                      sx={{
                        bgcolor: '#A84836',
                        '&:hover': { bgcolor: '#8f3b2d' },
                        fontWeight: 600,
                        borderRadius: '8px',
                      }}
                    >
                      Start Learning
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
          </Grid>
        </Grid>

        {/* Become Tutor CTA Section */}
        {!user && (
          <Box
            sx={{
              mt: 8,
              bgcolor: '#202F32',
              borderRadius: '16px',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                bgcolor: 'rgba(168,72,54,0.1)',
                borderRadius: '50%',
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <School sx={{ fontSize: 64, color: '#A84836', mb: 2 }} />
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Share Your Knowledge
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: '1.1rem',
                }}
              >
                Become a tutor and help others learn. Create courses, share your expertise, and build your teaching career with IremeCorner Academy.
              </Typography>
              <Button
                component={Link}
                to="/drop-information"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#A84836',
                  '&:hover': { bgcolor: '#8f3b2d' },
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 700,
                }}
              >
                Become a Tutor
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Courses;


