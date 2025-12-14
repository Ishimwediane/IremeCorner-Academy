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
              <FilterGroup
                title="Subject"
                items={CATEGORIES}
                selectedItems={filters.categories}
                counts={counts.categories}
                onFilterChange={(item) => handleFilterChange('categories', item)}
              />

              {/* Level Filter */}
              <FilterGroup
                title="Level"
                items={LEVELS}
                selectedItems={filters.levels}
                counts={counts.levels}
                onFilterChange={(item) => handleFilterChange('levels', item)}
                showInfoIcon
                initialVisible={3}
              />

              {/* Language Filter */}
              <FilterGroup
                title="Language"
                items={LANGUAGES}
                selectedItems={filters.languages}
                counts={counts.languages}
                onFilterChange={(item) => handleFilterChange('languages', item)}
                showInfoIcon
              />

              {/* Price Filter */}
              <FilterGroup
                title="Price"
                items={PRICES}
                selectedItems={filters.prices}
                counts={counts.prices}
                onFilterChange={(item) => handleFilterChange('prices', item)}
                initialVisible={2}
              />

              {/* Duration Filter */}
              <FilterGroup
                title="Duration"
                items={DURATIONS}
                selectedItems={filters.durations}
                counts={counts.durations}
                onFilterChange={(item) => handleFilterChange('durations', item)}
                initialVisible={3}
              />

              {/* Rating Filter */}
              <FilterGroup
                title="Rating"
                items={RATINGS}
                selectedItems={filters.ratings}
                counts={counts.ratings}
                onFilterChange={(item) => handleFilterChange('ratings', item)}
                initialVisible={2}
              />

              {/* Format Filter */}
              <FilterGroup
                title="Format"
                items={FORMATS}
                selectedItems={filters.formats}
                counts={counts.formats}
                onFilterChange={(item) => handleFilterChange('formats', item)}
              />

              {/* Certification Filter */}
              <FilterGroup
                title="Certification"
                items={CERTIFICATIONS}
                selectedItems={filters.certifications}
                counts={counts.certifications}
                onFilterChange={(item) => handleFilterChange('certifications', item)}
                initialVisible={2}
              />

              {/* Clear Button */}
              {(filters.categories.length > 0 || filters.levels.length > 0 || filters.languages.length > 0 || 
                filters.prices.length > 0 || filters.durations.length > 0 || filters.ratings.length > 0 || 
                filters.formats.length > 0 || filters.certifications.length > 0 || filters.search) && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
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
                  <CourseCard course={course} />
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
