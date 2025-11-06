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
import { 
  PlayArrow, 
  Person, 
  Schedule, 
  School, 
  CheckCircle,
  Star,
  Language,
  Description,
  Assignment,
  VerifiedUser
} from '@mui/icons-material';
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
        // Invalidate and refetch all related queries
        queryClient.invalidateQueries(['course', id]);
        queryClient.invalidateQueries('my-enrollments');
        queryClient.invalidateQueries('featured-courses');
        queryClient.invalidateQueries(['courses']);
        queryClient.invalidateQueries('notifications');
        
        toast.success('Enrolled successfully! You can now access the course content.');
        
        // Navigate to first lesson if available
        if (lessons.length > 0) {
          setTimeout(() => {
            navigate(`/courses/${id}/lessons/${lessons[0]._id}`);
          }, 1000);
        }
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

  // Check enrollment status - check both enrolledStudents array and actual enrollment record
  const { data: enrollmentData } = useQuery(
    ['enrollment-check', id, user?.id],
    async () => {
      if (!user) return null;
      const response = await api.get('/enrollments');
      const enrollments = response.data.data || [];
      return enrollments.find(e => 
        e.course._id === id || e.course === id
      );
    },
    {
      enabled: !!user,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const isEnrolled = enrollmentData || (user && course?.enrolledStudents?.some(
    (student) => student._id === user.id || student?._id?.toString() === user.id || student?.toString() === user.id
  ));

  // Get completed lessons for enrolled users
  const completedLessons = enrollmentData?.completedLessons || [];

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
    <Box>
      {/* Header section with brand gradient and meta */}
      <Box
        sx={{
          bgcolor: 'rgba(168,72,54,0.08)',
          background: 'linear-gradient(180deg, rgba(168,72,54,0.08) 0%, rgba(32,47,50,0.04) 100%)',
          py: 6,
          mb: 2,
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, color: '#202F32', mb: 2 }}>
            {course.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', color: '#202F32' }}>
            {course.averageRating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Star sx={{ color: '#2E7D32' }} />
                <Typography sx={{ fontWeight: 700 }}>{course.averageRating.toFixed(1)}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>({course.totalRatings || 0} rating)</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">{course.enrolledStudents?.length || 0} students</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Last updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Language sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">{course.language || 'English'}</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            {course.thumbnail && (
              <Box sx={{ position: 'relative', mb: 2 }}>
                {/* framing line */}
                <Box sx={{ position: 'absolute', inset: 16, border: '3px solid rgba(255,255,255,0.6)', borderRadius: 2, zIndex: 2, pointerEvents: 'none' }} />
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  sx={{
                    width: '100%',
                    height: 420,
                    objectFit: 'cover',
                    borderRadius: 2,
                    display: 'block',
                    backgroundColor: '#e9ecef',
                  }}
                />
                {/* play overlay icon style */}
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 64, height: 64, bgcolor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    <Box sx={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid #A84836', ml: 0.5 }} />
                  </Box>
                </Box>
              </Box>
            )}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#202F32' }}>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={course.category} />
              <Chip label={course.level} color="primary" />
              {course.isFree && <Chip label="Free" color="secondary" />}
            </Box>
            <Typography variant="body1" paragraph>
              {course.description}
            </Typography>
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
              <Tab label="About" />
              <Tab label={`Lessons (${lessons.length})`} />
              <Tab label="What You'll Learn" />
              <Tab label="Instructor" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    About This Course
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                    {course.description || course.shortDescription || 'No description available.'}
                  </Typography>
                  
                  {course.courseOutcome && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VerifiedUser color="primary" />
                        Course Outcome
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {course.courseOutcome}
                      </Typography>
                    </Box>
                  )}

                  {course.learningObjectives && course.learningObjectives.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment color="primary" />
                        Learning Objectives
                      </Typography>
                      <List>
                        {course.learningObjectives.map((objective, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <CheckCircle color="secondary" sx={{ mr: 1, fontSize: 20 }} />
                            <ListItemText primary={objective} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Prerequisites
                      </Typography>
                      <List>
                        {course.prerequisites.map((prereq, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              • {prereq}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
              {tab === 1 && (
                <List>
                  {lessons.length === 0 ? (
                    <Typography>No lessons available yet.</Typography>
                  ) : (
                    lessons.map((lesson, index) => {
                      const isCompleted = isEnrolled && completedLessons.some(
                        (id) => id === lesson._id || id._id === lesson._id || id.toString() === lesson._id
                      );
                      
                      return (
                        <ListItem
                          key={lesson._id}
                          sx={{
                            bgcolor: isCompleted ? 'secondary.light' : 'transparent',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {isCompleted ? (
                              <CheckCircle
                                color="secondary"
                                sx={{ mr: 2, fontSize: 24 }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: 'text.secondary',
                                  mr: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  {index + 1}
                                </Typography>
                              </Box>
                            )}
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: isCompleted ? 'bold' : 'normal',
                                    color: isCompleted ? 'secondary.dark' : 'text.primary',
                                  }}
                                >
                                  Chapter {index + 1}: {lesson.title}
                                  {isCompleted && (
                                    <Chip
                                      label="Completed"
                                      size="small"
                                      color="secondary"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Typography>
                              }
                              secondary={lesson.description || `${lesson.duration || 0} min`}
                            />
                          </Box>
                        </ListItem>
                      );
                    })
                  )}
                  {isEnrolled && lessons.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress: {enrollmentData?.progress || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {completedLessons.length} of {lessons.length} chapters completed
                      </Typography>
                    </Box>
                  )}
                </List>
              )}
              {tab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School color="primary" />
                    What You'll Learn
                  </Typography>
                  {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
                    <Grid container spacing={2}>
                      {course.whatYouWillLearn.map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                            <CheckCircle color="secondary" sx={{ mt: 0.5, fontSize: 20 }} />
                            <Typography variant="body1">{item}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No learning outcomes specified yet.
                    </Typography>
                  )}
                </Box>
              )}
              {tab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    About the Instructor
                  </Typography>
                  {course.trainer && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {course.trainer.name?.charAt(0) || 'T'}
                        </Box>
                        <Box>
                          <Typography variant="h6">{course.trainer.name || 'Trainer'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.trainer.email || 'trainer@iremecorner.com'}
                          </Typography>
                        </Box>
                      </Box>
                      {course.instructorBio ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {course.instructorBio}
                        </Typography>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          Experienced instructor passionate about sharing knowledge and helping students achieve their goals.
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
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
                {course.averageRating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: 1 }}>
                    <Star sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {course.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({course.totalRatings || 0} ratings)
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Instructor: {course.trainer?.name || 'N/A'}
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
                    {course.totalLessons || lessons.length} lessons
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Language sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Language: {course.language || 'English'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {course.enrolledStudents?.length || 0} students enrolled
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="body2" color="secondary.main">
                    Certificate of Completion
                  </Typography>
                </Box>
              </Box>
              {user && isEnrolled ? (
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to={`/courses/${id}/lessons/${lessons[0]?._id || ''}`}
                  startIcon={<PlayArrow />}
                  disabled={!lessons || lessons.length === 0}
                >
                  {lessons && lessons.length > 0 ? 'Continue Learning' : 'Course Content Coming Soon'}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleEnroll}
                  disabled={enrollmentMutation.isLoading || course.status !== 'approved' || !user}
                  startIcon={<PlayArrow />}
                >
                  {!user
                    ? 'Login to Enroll'
                    : enrollmentMutation.isLoading
                    ? 'Enrolling...'
                    : course.status !== 'approved'
                    ? 'Course Not Available'
                    : 'Enroll Now'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default CourseDetail;


