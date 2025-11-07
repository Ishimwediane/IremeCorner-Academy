import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';

const MyCourses = () => {
  const { data: enrollmentsData, isLoading } = useQuery(
    'my-enrollments',
    async () => {
      const response = await api.get('/enrollments');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const enrollments = enrollmentsData?.data || [];

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>

      {enrollments.length === 0 ? (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't enrolled in any courses yet
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/courses"
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            return (
              <Grid item xs={12} sm={6} md={4} key={enrollment._id}>
                <Card>
                  {course.thumbnail && (
                    <Box
                      component="img"
                      src={course.thumbnail}
                      alt={course.title}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Chip
                      label={enrollment.status}
                      size="small"
                      color={
                        enrollment.status === 'completed'
                          ? 'success'
                          : enrollment.status === 'in-progress'
                          ? 'primary'
                          : 'default'
                      }
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress: {enrollment.progress}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={enrollment.progress}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                    {enrollment.status === 'completed' && (
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <CheckCircle color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="secondary.main">
                          Course Completed
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      component={Link}
                      to={`/courses/${course._id}`}
                      startIcon={<PlayArrow />}
                    >
                      Continue
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyCourses;


















