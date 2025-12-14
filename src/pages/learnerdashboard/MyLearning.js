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
  Tabs,
  Tab,
} from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../utils/api';

const CourseListCard = ({ enrollment }) => {
  const course = enrollment.course;
  if (!course) return null; // Don't render if course data is missing

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
        {course.thumbnail && (
          <Box
            component="img"
            src={course.thumbnail}
            alt={course.title}
            sx={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {course.title}
          </Typography>
          <Chip
            label={enrollment.status}
            size="small"
            color={enrollment.status === 'completed' ? 'success' : 'primary'}
            sx={{ mb: 2, textTransform: 'capitalize' }}
          />
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress: {enrollment.progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={enrollment.progress}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2 }}>
          <Button
            size="small"
            variant="contained"
            component={Link}
            to={`/learner/course/${course._id}`}
            startIcon={enrollment.status === 'completed' ? <CheckCircle /> : <PlayArrow />}
          >
            {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

const MyLearning = () => {
  const [tab, setTab] = React.useState(0);
  const { data: enrollmentsData, isLoading } = useQuery('my-enrollments', async () => {
    const response = await api.get('/enrollments');
    return response.data;
  });

  const enrollments = (enrollmentsData?.data || []).filter(e => e.course);
  const inProgress = enrollments.filter(e => e.status === 'in-progress');
  const completed = enrollments.filter(e => e.status === 'completed');

  const coursesToShow = tab === 0 ? inProgress : completed;

  if (isLoading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>My Learning</Typography>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={`In Progress (${inProgress.length})`} />
        <Tab label={`Completed (${completed.length})`} />
      </Tabs>

      {coursesToShow.length === 0 ? (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {tab === 0 ? "You have no courses in progress." : "You haven't completed any courses yet."}
          </Typography>
          <Button variant="contained" component={Link} to="/learner/courses" sx={{ mt: 2 }}>
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {coursesToShow.map((enrollment) => (
            <CourseListCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyLearning;