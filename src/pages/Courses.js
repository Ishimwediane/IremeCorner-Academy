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
  Chip,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link as MuiLink,
} from '@mui/material';
import { Info } from '@mui/icons-material';
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

const categories = [
  'Digital Tools',
  'Marketing',
  'Financial Literacy',
  'Business Management',
  'Technical Skills',
  'Other',
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const languages = ['English', 'French', 'Spanish', 'Portuguese', 'Arabic', 'Swahili'];

const Courses = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    levels: [],
    languages: [],
  });
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreLevels, setShowMoreLevels] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const { data: coursesData, isLoading } = useQuery(
    ['courses', filters],
    async () => {
      const params = new URLSearchParams();
      params.append('status', 'approved');
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

  const allCourses = coursesData?.data || [];
  const totalCourses = coursesData?.count || allCourses.length;

  // Filter courses client-side based on selected categories, levels, and languages
  const courses = allCourses.filter((course) => {
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category);
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level);
    const matchesLanguage = filters.languages.length === 0 || (course.language && filters.languages.includes(course.language));
    return matchesCategory && matchesLevel && matchesLanguage;
  });

  // Calculate counts for each category, level, and language
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = allCourses.filter((c) => c.category === cat).length;
    return acc;
  }, {});

  const levelCounts = levels.reduce((acc, level) => {
    acc[level] = allCourses.filter((c) => c.level === level).length;
    return acc;
  }, {});

  const languageCounts = languages.reduce((acc, lang) => {
    acc[lang] = allCourses.filter((c) => c.language === lang).length;
    return acc;
  }, {});

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleLevelChange = (level) => {
    setFilters((prev) => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level],
    }));
  };

  const handleLanguageChange = (language) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

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
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
              {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0) && (
                <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', fontWeight: 400, ml: 1 }}>
                  (of {totalCourses})
                </Box>
              )}
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
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#202F32',
                  mb: 4,
                }}
              >
                Filter by
              </Typography>

              <Stack spacing={4}>
                {/* Search */}
                <Box>
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
                    sx={{
                      bgcolor: 'white',
                    }}
                  />
                </Box>

                {/* Category Filter */}
                <Box>
                  <Typography
                    sx={{
                      color: '#202F32',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: '1rem',
                    }}
                  >
                    Subject
                  </Typography>
                  <FormGroup>
                    {(showMoreCategories ? categories : categories.slice(0, 4)).map((cat) => (
                      <FormControlLabel
                        key={cat}
                        control={
                          <Checkbox
                            checked={filters.categories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                            sx={{
                              color: '#202F32',
                              '&.Mui-checked': {
                                color: '#A84836',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                            {cat} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({categoryCounts[cat] || 0})</Box>
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </FormGroup>
                  {categories.length > 4 && (
                    <MuiLink
                      component="button"
                      onClick={() => setShowMoreCategories(!showMoreCategories)}
                      sx={{
                        color: '#A84836',
                        textDecoration: 'underline',
                        fontSize: '0.9rem',
                        mt: 1,
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        '&:hover': { color: '#8f3b2d' },
                      }}
                    >
                      {showMoreCategories ? 'Show less' : 'Show more'}
                    </MuiLink>
                  )}
                </Box>

                {/* Level Filter */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <Typography
                      sx={{
                        color: '#202F32',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      Level
                    </Typography>
                    <Info sx={{ fontSize: 16, color: 'rgba(32,47,50,0.5)' }} />
                  </Box>
                  <FormGroup>
                    {(showMoreLevels ? levels : levels.slice(0, 3)).map((level) => (
                      <FormControlLabel
                        key={level}
                        control={
                          <Checkbox
                            checked={filters.levels.includes(level)}
                            onChange={() => handleLevelChange(level)}
                            sx={{
                              color: '#202F32',
                              '&.Mui-checked': {
                                color: '#A84836',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                            {level} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({levelCounts[level] || 0})</Box>
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </FormGroup>
                  {levels.length > 3 && (
                    <MuiLink
                      component="button"
                      onClick={() => setShowMoreLevels(!showMoreLevels)}
                      sx={{
                        color: '#A84836',
                        textDecoration: 'underline',
                        fontSize: '0.9rem',
                        mt: 1,
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        '&:hover': { color: '#8f3b2d' },
                      }}
                    >
                      {showMoreLevels ? 'Show less' : 'Show more'}
                    </MuiLink>
                  )}
                </Box>

                {/* Language Filter */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <Typography
                      sx={{
                        color: '#202F32',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      Language
                    </Typography>
                    <Info sx={{ fontSize: 16, color: 'rgba(32,47,50,0.5)' }} />
                  </Box>
                  <FormGroup>
                    {(showMoreLanguages ? languages : languages.slice(0, 4)).map((lang) => (
                      <FormControlLabel
                        key={lang}
                        control={
                          <Checkbox
                            checked={filters.languages.includes(lang)}
                            onChange={() => handleLanguageChange(lang)}
                            sx={{
                              color: '#202F32',
                              '&.Mui-checked': {
                                color: '#A84836',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                            {lang} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({languageCounts[lang] || 0})</Box>
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </FormGroup>
                  {languages.length > 4 && (
                    <MuiLink
                      component="button"
                      onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                      sx={{
                        color: '#A84836',
                        textDecoration: 'underline',
                        fontSize: '0.9rem',
                        mt: 1,
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        '&:hover': { color: '#8f3b2d' },
                      }}
                    >
                      {showMoreLanguages ? 'Show less' : 'Show more'}
                    </MuiLink>
                  )}
                </Box>

                {/* Clear Button */}
                {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 || filters.search) && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setFilters({ search: '', categories: [], levels: [], languages: [] })}
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
                )}
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


