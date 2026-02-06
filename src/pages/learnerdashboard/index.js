import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Paper,
  Stack,
} from '@mui/material';
import { Search, School } from '@mui/icons-material';
import {
  CATEGORIES,
  LEVELS,
  LANGUAGES,
  PRICES,
  DURATIONS,
  RATINGS,
  FORMATS,
  CERTIFICATIONS,
} from './constants';
import FilterGroup from './FilterGroup';
import CourseCard from './CourseCard';
import { useCourseFilters } from './useCourseFilters';

const Course = () => {
  const {
    isLoading,
    courses,
    totalCourses,
    filters,
    setFilters,
    handleFilterChange,
    counts,
  } = useCourseFilters();

  const clearFilters = () => {
    setFilters({
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
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1.5rem' }}>
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 ||
            filters.prices.length > 0 || filters.durations.length > 0 || filters.ratings.length > 0 ||
            filters.formats.length > 0 || filters.certifications.length > 0) && (
              <Box component="span" sx={{ color: '#666', fontWeight: 400, ml: 1, fontSize: '1rem' }}>
                (of {totalCourses})
              </Box>
            )}
        </Typography>
      </Box>

      {/* Top Filters Bar */}
      <Box sx={{ mb: 3 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search courses..."
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: '#9CA3AF', fontSize: 20 }} />,
            }}
            sx={{
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </Box>

        {/* Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', fontSize: '0.875rem' }}>
            Filters:
          </Typography>

          {/* Category Filter */}
          <Box>
            <Button
              size="small"
              variant={filters.categories.length > 0 ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '0.875rem',
                px: 2,
                bgcolor: filters.categories.length > 0 ? '#FD7E14' : 'transparent',
                borderColor: '#E0E0E0',
                color: filters.categories.length > 0 ? 'white' : '#666',
                '&:hover': {
                  bgcolor: filters.categories.length > 0 ? '#E56D0F' : 'rgba(253, 126, 20, 0.05)',
                  borderColor: '#FD7E14',
                },
              }}
            >
              Subject {filters.categories.length > 0 && `(${filters.categories.length})`}
            </Button>
          </Box>

          {/* Level Filter */}
          <Box>
            <Button
              size="small"
              variant={filters.levels.length > 0 ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '0.875rem',
                px: 2,
                bgcolor: filters.levels.length > 0 ? '#FD7E14' : 'transparent',
                borderColor: '#E0E0E0',
                color: filters.levels.length > 0 ? 'white' : '#666',
                '&:hover': {
                  bgcolor: filters.levels.length > 0 ? '#E56D0F' : 'rgba(253, 126, 20, 0.05)',
                  borderColor: '#FD7E14',
                },
              }}
            >
              Level {filters.levels.length > 0 && `(${filters.levels.length})`}
            </Button>
          </Box>

          {/* Language Filter */}
          <Box>
            <Button
              size="small"
              variant={filters.languages.length > 0 ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '0.875rem',
                px: 2,
                bgcolor: filters.languages.length > 0 ? '#FD7E14' : 'transparent',
                borderColor: '#E0E0E0',
                color: filters.languages.length > 0 ? 'white' : '#666',
                '&:hover': {
                  bgcolor: filters.languages.length > 0 ? '#E56D0F' : 'rgba(253, 126, 20, 0.05)',
                  borderColor: '#FD7E14',
                },
              }}
            >
              Language {filters.languages.length > 0 && `(${filters.languages.length})`}
            </Button>
          </Box>

          {/* Price Filter */}
          <Box>
            <Button
              size="small"
              variant={filters.prices.length > 0 ? 'contained' : 'outlined'}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontSize: '0.875rem',
                px: 2,
                bgcolor: filters.prices.length > 0 ? '#FD7E14' : 'transparent',
                borderColor: '#E0E0E0',
                color: filters.prices.length > 0 ? 'white' : '#666',
                '&:hover': {
                  bgcolor: filters.prices.length > 0 ? '#E56D0F' : 'rgba(253, 126, 20, 0.05)',
                  borderColor: '#FD7E14',
                },
              }}
            >
              Price {filters.prices.length > 0 && `(${filters.prices.length})`}
            </Button>
          </Box>

          {/* Clear Filters Button */}
          {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 ||
            filters.prices.length > 0 || filters.durations.length > 0 || filters.ratings.length > 0 ||
            filters.formats.length > 0 || filters.certifications.length > 0 || filters.search) && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  px: 2,
                  color: '#EF4444',
                  borderColor: '#EF4444',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.05)',
                    borderColor: '#EF4444',
                  },
                }}
                variant="outlined"
              >
                Clear All
              </Button>
            )}
        </Box>
      </Box>

      {/* Courses Grid */}
      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Loading courses...</Typography>
        </Box>
      ) : courses.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <School sx={{ fontSize: 64, color: 'rgba(253, 126, 20, 0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#1A1A1A', mb: 2 }}>
            No courses found
          </Typography>
          <Typography sx={{ color: '#666', mb: 3, fontSize: '0.875rem' }}>
            Try adjusting your filters or check back later for new courses.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Course;
