import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Paper,
  Popover,
  IconButton,
} from '@mui/material';
import { Search, School, FilterList, MoreVert } from '@mui/icons-material';
import CourseCard from './CourseCard';
import ActiveFilters from './ActiveFilters';
import FilterPanel from './FilterPanel';
import { useCourseFilters } from './useCourseFilters';
import { useTranslation } from 'react-i18next';

const BrowseCourses = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    courses,
    totalCourses,
    filters,
    setFilters,
    handleFilterChange,
    counts,
  } = useCourseFilters();

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

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

  const removeFilter = (category, value) => {
    handleFilterChange(category, value);
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.levels.length +
    filters.languages.length +
    filters.prices.length +
    filters.durations.length +
    filters.ratings.length +
    filters.formats.length +
    filters.certifications.length;

  const handleOpenFilters = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };

  const openFilters = Boolean(filterAnchorEl);

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#202F32', mb: 1 }}>
          {t('courses.browseTitle', 'Browse Courses')}
        </Typography>
        <Typography sx={{ color: 'rgba(32,47,50,0.7)', fontSize: '1.1rem' }}>
          {t('courses.browseSubtitle', 'Explore our wide range of courses and start learning today.')}
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid rgba(32,47,50,0.1)',
          borderRadius: '12px',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder={t('courses.searchPlaceholder', 'Search by order #, name or email...')}
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'rgba(32,47,50,0.5)' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'rgba(32,47,50,0.02)',
                '& fieldset': { borderColor: 'rgba(32,47,50,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(32,47,50,0.2)' },
              },
            }}
          />

          {/* Filters Button */}
          <Button
            variant="outlined"
            size="medium"
            onClick={handleOpenFilters}
            endIcon={<FilterList />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: 'rgba(32,47,50,0.2)',
              color: '#202F32',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              px: 2,
              '&:hover': {
                borderColor: '#202F32',
                bgcolor: 'rgba(32,47,50,0.05)',
              },
            }}
          >
            {t('courses.filterBy', 'Filters')}
            {activeFiltersCount > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 0.75,
                  py: 0.25,
                  bgcolor: '#202F32',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </Button>

          {/* More Options Button */}
          <IconButton
            size="small"
            sx={{
              color: 'rgba(32,47,50,0.6)',
              '&:hover': { bgcolor: 'rgba(32,47,50,0.05)' },
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>

      {/* Active Filters Chips */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAll={clearFilters}
      />

      {/* Filter Popover */}
      <Popover
        open={openFilters}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        <FilterPanel
          filters={filters}
          counts={counts}
          handleFilterChange={handleFilterChange}
        />
      </Popover>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
          {courses.length === 1
            ? t('courses.available', { count: courses.length })
            : t('courses.available_plural', { count: courses.length })}
          {activeFiltersCount > 0 && (
            <Box component="span" sx={{ ml: 1 }}>
              {t('courses.ofTotal', { total: totalCourses })}
            </Box>
          )}
        </Typography>
      </Box>

      {/* Main Content: Courses Grid */}
      <Box>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#202F32', opacity: 0.7 }}>{t('courses.loading')}</Typography>
          </Box>
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <School sx={{ fontSize: 64, color: 'rgba(32,47,50,0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#202F32', mb: 2 }}>
              {t('courses.noCoursesFound')}
            </Typography>
            <Typography sx={{ color: '#202F32', opacity: 0.7, mb: 3 }}>
              {t('courses.noCoursesFoundDesc')}
            </Typography>
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{
                borderColor: 'rgba(32,47,50,0.3)',
                color: '#202F32',
                '&:hover': { borderColor: '#202F32', bgcolor: 'rgba(32,47,50,0.05)' },
              }}
            >
              {t('courses.clearFilters')}
            </Button>
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
      </Box>
    </Container>
  );
};

export default BrowseCourses;
