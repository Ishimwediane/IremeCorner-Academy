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
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

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
const prices = ['Free', 'Paid'];
const durations = ['Short (< 2 hours)', 'Medium (2-10 hours)', 'Long (> 10 hours)'];
const ratings = ['4+ Stars', '5 Stars'];
const formats = ['Video', 'Text', 'Interactive', 'Mixed'];
const certifications = ['With Certificate', 'No Certificate'];

const Course = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    levels: [],
    languages: [],
    prices: [],
    durations: [],
    ratings: [],
    formats: [],
    certifications: [],
  });
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreLevels, setShowMoreLevels] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [showMorePrices, setShowMorePrices] = useState(false);
  const [showMoreDurations, setShowMoreDurations] = useState(false);
  const [showMoreRatings, setShowMoreRatings] = useState(false);
  const [showMoreFormats, setShowMoreFormats] = useState(false);
  const [showMoreCertifications, setShowMoreCertifications] = useState(false);

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

  // Helper function to check duration
  const getDurationCategory = (course) => {
    const totalHours = course.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;
    if (totalHours < 2) return 'Short (< 2 hours)';
    if (totalHours <= 10) return 'Medium (2-10 hours)';
    return 'Long (> 10 hours)';
  };

  // Helper function to check rating
  const getRatingCategory = (course) => {
    const avgRating = course.rating || 0;
    if (avgRating >= 5) return '5 Stars';
    if (avgRating >= 4) return '4+ Stars';
    return null;
  };

  // Helper function to check price
  const getPriceCategory = (course) => {
    const price = course.price || 0;
    return price === 0 ? 'Free' : 'Paid';
  };

  // Filter courses client-side based on all selected filters
  const courses = allCourses.filter((course) => {
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category);
    const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level);
    const matchesLanguage = filters.languages.length === 0 || (course.language && filters.languages.includes(course.language));
    const matchesPrice = filters.prices.length === 0 || filters.prices.includes(getPriceCategory(course));
    const matchesDuration = filters.durations.length === 0 || filters.durations.includes(getDurationCategory(course));
    const courseRating = getRatingCategory(course);
    const matchesRating = filters.ratings.length === 0 || (courseRating && filters.ratings.includes(courseRating));
    const matchesFormat = filters.formats.length === 0 || (course.format && filters.formats.includes(course.format));
    const matchesCertification = filters.certifications.length === 0 || 
      (filters.certifications.includes('With Certificate') && course.certificate) ||
      (filters.certifications.includes('No Certificate') && !course.certificate);
    
    return matchesCategory && matchesLevel && matchesLanguage && matchesPrice && 
           matchesDuration && matchesRating && matchesFormat && matchesCertification;
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

  const priceCounts = prices.reduce((acc, price) => {
    acc[price] = allCourses.filter((c) => getPriceCategory(c) === price).length;
    return acc;
  }, {});

  const durationCounts = durations.reduce((acc, duration) => {
    acc[duration] = allCourses.filter((c) => getDurationCategory(c) === duration).length;
    return acc;
  }, {});

  const ratingCounts = ratings.reduce((acc, rating) => {
    acc[rating] = allCourses.filter((c) => getRatingCategory(c) === rating).length;
    return acc;
  }, {});

  const formatCounts = formats.reduce((acc, format) => {
    acc[format] = allCourses.filter((c) => c.format === format).length;
    return acc;
  }, {});

  const certificationCounts = certifications.reduce((acc, cert) => {
    if (cert === 'With Certificate') {
      acc[cert] = allCourses.filter((c) => c.certificate).length;
    } else {
      acc[cert] = allCourses.filter((c) => !c.certificate).length;
    }
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

  const handlePriceChange = (price) => {
    setFilters((prev) => ({
      ...prev,
      prices: prev.prices.includes(price)
        ? prev.prices.filter((p) => p !== price)
        : [...prev.prices, price],
    }));
  };

  const handleDurationChange = (duration) => {
    setFilters((prev) => ({
      ...prev,
      durations: prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration],
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  };

  const handleFormatChange = (format) => {
    setFilters((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  const handleCertificationChange = (certification) => {
    setFilters((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter((c) => c !== certification)
        : [...prev.certifications, certification],
    }));
  };

  return (
    <Container sx={{ py: 4, pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 ||
            filters.prices.length > 0 || filters.durations.length > 0 || filters.ratings.length > 0 ||
            filters.formats.length > 0 || filters.certifications.length > 0) && (
            <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', fontWeight: 400, ml: 1 }}>
              (of {totalCourses})
            </Box>
          )}
        </Typography>
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
                              color: '#C39766',
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
                      color: '#C39766',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                      mt: 1,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      '&:hover': { color: '#A67A52' },
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
                              color: '#C39766',
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
                      color: '#C39766',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                      mt: 1,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      '&:hover': { color: '#A67A52' },
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
                              color: '#C39766',
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
                      color: '#C39766',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                      mt: 1,
                      cursor: 'pointer',
                      border: 'none',
                      background: 'none',
                      '&:hover': { color: '#A67A52' },
                    }}
                  >
                    {showMoreLanguages ? 'Show less' : 'Show more'}
                  </MuiLink>
                )}
              </Box>

              {/* Price Filter */}
              <Box>
                <Typography
                  sx={{
                    color: '#202F32',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Price
                </Typography>
                <FormGroup>
                  {prices.map((price) => (
                    <FormControlLabel
                      key={price}
                      control={
                        <Checkbox
                          checked={filters.prices.includes(price)}
                          onChange={() => handlePriceChange(price)}
                          sx={{
                            color: '#202F32',
                            '&.Mui-checked': {
                              color: '#C39766',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                          {price} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({priceCounts[price] || 0})</Box>
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Duration Filter */}
              <Box>
                <Typography
                  sx={{
                    color: '#202F32',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Duration
                </Typography>
                <FormGroup>
                  {durations.map((duration) => (
                    <FormControlLabel
                      key={duration}
                      control={
                        <Checkbox
                          checked={filters.durations.includes(duration)}
                          onChange={() => handleDurationChange(duration)}
                          sx={{
                            color: '#202F32',
                            '&.Mui-checked': {
                              color: '#C39766',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                          {duration} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({durationCounts[duration] || 0})</Box>
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Rating Filter */}
              <Box>
                <Typography
                  sx={{
                    color: '#202F32',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Rating
                </Typography>
                <FormGroup>
                  {ratings.map((rating) => (
                    <FormControlLabel
                      key={rating}
                      control={
                        <Checkbox
                          checked={filters.ratings.includes(rating)}
                          onChange={() => handleRatingChange(rating)}
                          sx={{
                            color: '#202F32',
                            '&.Mui-checked': {
                              color: '#C39766',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                          {rating} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({ratingCounts[rating] || 0})</Box>
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Format Filter */}
              <Box>
                <Typography
                  sx={{
                    color: '#202F32',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Format
                </Typography>
                <FormGroup>
                  {formats.map((format) => (
                    <FormControlLabel
                      key={format}
                      control={
                        <Checkbox
                          checked={filters.formats.includes(format)}
                          onChange={() => handleFormatChange(format)}
                          sx={{
                            color: '#202F32',
                            '&.Mui-checked': {
                              color: '#C39766',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                          {format} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({formatCounts[format] || 0})</Box>
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Certification Filter */}
              <Box>
                <Typography
                  sx={{
                    color: '#202F32',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1rem',
                  }}
                >
                  Certification
                </Typography>
                <FormGroup>
                  {certifications.map((cert) => (
                    <FormControlLabel
                      key={cert}
                      control={
                        <Checkbox
                          checked={filters.certifications.includes(cert)}
                          onChange={() => handleCertificationChange(cert)}
                          sx={{
                            color: '#202F32',
                            '&.Mui-checked': {
                              color: '#C39766',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                          {cert} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({certificationCounts[cert] || 0})</Box>
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Clear Button */}
              {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 || 
                filters.prices.length > 0 || filters.durations.length > 0 || filters.ratings.length > 0 || 
                filters.formats.length > 0 || filters.certifications.length > 0 || filters.search) && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setFilters({ 
                    search: '', 
                    categories: [], 
                    levels: [], 
                    languages: [],
                    prices: [],
                    durations: [],
                    ratings: [],
                    formats: [],
                    certifications: [],
                  })}
                  sx={{
                    borderColor: '#202F32',
                    color: '#202F32',
                    mt: 2,
                    '&:hover': {
                      borderColor: '#C39766',
                      bgcolor: 'rgba(195,151,102,0.05)',
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
                            bgcolor: 'rgba(195,151,102,0.1)',
                            color: '#C39766',
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
                          bgcolor: '#C39766',
                          '&:hover': { bgcolor: '#A67A52' },
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
    </Container>
  );
};

export default Course;




