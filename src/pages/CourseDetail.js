import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import { PlayArrow, Person, Schedule, School } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);

  const { data: courseData, isLoading } = useQuery(
    ['course', id],
    async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    }
  );

  const course = courseData?.data;

  const { data: lessonsData } = useQuery(
    ['lessons', id],
    async () => {
      const response = await api.get(`/lessons/course/${id}`);
      return response.data;
    },
    { enabled: !!course }
  );

  const lessons = lessonsData?.data || [];

  const enrollmentMutation = useMutation(
    async () => {
      const response = await api.post('/enrollments', { courseId: id });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', id]);
        toast.success('Enrolled successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Enrollment failed');
      },
    }
  );

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    enrollmentMutation.mutate();
  };

  const isEnrolled = user && course?.enrolledStudents?.some(
    (student) => student._id === user.id || student.toString() === user.id
  );

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            {course.thumbnail && (
              <Box
                component="img"
                src={course.thumbnail}
                alt={course.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={course.category} />
              <Chip label={course.level} color="primary" />
              {course.isFree && <Chip label="Free" color="success" />}
            </Box>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
              <Tab label="Description" />
              <Tab label={`Lessons (${lessons.length})`} />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {course.description}
                </Typography>
              )}
              {tab === 1 && (
                <List>
                  {lessons.length === 0 ? (
                    <Typography>No lessons available yet.</Typography>
                  ) : (
                    lessons.map((lesson, index) => (
                      <ListItem key={lesson._id}>
                        <ListItemText
                          primary={`${index + 1}. ${lesson.title}`}
                          secondary={lesson.description}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Trainer: {course.trainer?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Duration: {course.duration || 0} hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {course.enrolledStudents?.length || 0} students enrolled
                  </Typography>
                </Box>
              </Box>
              {user && isEnrolled ? (
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to={`/courses/${id}/lessons/${lessons[0]?._id}`}
                  startIcon={<PlayArrow />}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleEnroll}
                  disabled={enrollmentMutation.isLoading || course.status !== 'approved'}
                  startIcon={<PlayArrow />}
                >
                  {enrollmentMutation.isLoading
                    ? 'Enrolling...'
                    : isEnrolled
                    ? 'Continue Learning'
                    : 'Enroll Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;


