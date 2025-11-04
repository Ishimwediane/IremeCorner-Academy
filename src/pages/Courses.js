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
} from '@mui/material';
import { useQuery } from 'react-query';
import api from '../utils/api';

const Courses = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
  });

  const { data: coursesData, isLoading } = useQuery(
    ['courses', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/courses?${params.toString()}`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const courses = coursesData?.data || [];

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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Courses
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ flexGrow: 1, minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            label="Level"
          >
            <MenuItem value="">All Levels</MenuItem>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => setFilters({ search: '', category: '', level: '' })}
        >
          Clear
        </Button>
      </Box>

      {/* Courses Grid */}
      {isLoading ? (
        <Typography>Loading courses...</Typography>
      ) : courses.length === 0 ? (
        <Typography>No courses found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                {course.thumbnail && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnail}
                    alt={course.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={course.category}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip label={course.level} size="small" color="primary" />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
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
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Trainer: {course.trainer.name}
                    </Typography>
                  )}
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    {course.enrolledStudents?.length || 0} students enrolled
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/courses/${course._id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Courses;
