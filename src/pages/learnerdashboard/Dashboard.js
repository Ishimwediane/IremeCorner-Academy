import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import {
  School,
  CheckCircle,
  Assignment,
  TrendingUp,
  Quiz,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Calendar from '../../components/Calendar';
import { format } from 'date-fns';
import CourseProgressCard from './CourseProgressCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: enrollmentsData, isLoading } = useQuery(
    'my-enrollments',
    async () => {
      const response = await api.get('/enrollments');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 2 * 60 * 1000,
    }
  );

  const { data: notificationsData } = useQuery(
    'notifications',
    async () => {
      const response = await api.get('/notifications?limit=5');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1 * 60 * 1000,
    }
  );

  const { data: assessmentsData } = useQuery(
    ['my-assessments', user?._id],
    async () => {
      const response = await api.get(`/assessments/student/${user._id}`);
      return response.data.data;
    },
    {
      enabled: !!user?._id,
      staleTime: 5 * 60 * 1000,
    }
  );

  const upcomingTasks = (assessmentsData?.assignments || []).concat(assessmentsData?.quizzes || []);

  const enrollments = enrollmentsData?.data || [];
  const notifications = notificationsData?.data || [];
  const inProgressCourses = React.useMemo(() => enrollments.filter(
    (e) => e.status === 'in-progress' || e.status === 'enrolled'
  ), [enrollments]);
  const completedCourses = enrollments.filter((e) => e.status === 'completed');
  const certificatesCount = completedCourses.filter((e) => e.certificateIssued).length;

  // Calculate total progress value
  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  // Generate calendar events from enrollments
  const calendarEvents = React.useMemo(() => {
    const events = [];
    inProgressCourses.forEach((enrollment) => {
      // Add some sample dates for demonstration
      const colors = ['#4A90E2', '#50C878', '#202F32', '#FFD700'];
      const color = colors[enrollment._id % colors.length];
      events.push({
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        color,
        initials: enrollment.course?.title?.charAt(0) || 'C',
        title: enrollment.course?.title,
      });
    });
    return events;
  }, [inProgressCourses]);

  // Get user's name
  const userName = user?.name || 'User';

  // Color scheme for course cards
  const cardColors = [
    { bg: '#4A90E2', text: 'white' },
    { bg: '#50C878', text: 'white' },
    { bg: '#202F32', text: 'white' },
    { bg: '#FFD700', text: '#202F32' },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={2.5}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2.5}>
            {/* Hero Banner */}
            <Grid item xs={12}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #FD7E14 0%, #E56D0F 100%)',
                  borderRadius: '16px',
                  p: { xs: 3, md: 4 },
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 600,
                    mb: 1,
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  ONLINE COURSE
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                  }}
                >
                  Sharpen Your Skills With
                  <br />
                  Professional Online Courses
                </Typography>
                <Button
                  component={Link}
                  to="/learner/courses"
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: 'white',
                    color: '#FD7E14',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    px: 3,
                    py: 0.75,
                    '&:hover': {
                      bgcolor: '#FAF1E6',
                    },
                  }}
                >
                  Join Now
                </Button>
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </Box>
            </Grid>

            {/* Course Progress Cards */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1rem' }}>
                  Continue Watching
                </Typography>
                <Button
                  component={Link}
                  to="/learner/courses"
                  size="small"
                  sx={{
                    color: '#FD7E14',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(253, 126, 20, 0.05)',
                    },
                  }}
                >
                  See All
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                  mb: 2,
                }}
              >
                {inProgressCourses.slice(0, 6).map((enrollment, index) => {
                  return (
                    <CourseProgressCard key={enrollment._id} enrollment={enrollment} colorScheme={cardColors[index % cardColors.length]} />
                  );
                })}
                {inProgressCourses.length === 0 && (
                  <Box
                    sx={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      py: 3,
                      color: '#666',
                    }}
                  >
                    <School sx={{ fontSize: 40, mb: 1.5, opacity: 0.3, color: '#FD7E14' }} />
                    <Typography variant="body2" sx={{ mb: 1.5 }}>{t('dashboard.noCourses')}</Typography>
                    <Button
                      component={Link}
                      to="/learner/courses"
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#FD7E14', '&:hover': { bgcolor: '#E56D0F' } }}
                    >
                      {t('dashboard.exploreCourses')}
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Statistics Overview */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 2, fontSize: '0.95rem' }}>
                    {t('dashboard.overview')}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#FD7E14', mb: 0.5 }}>
                      {totalProgress}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                      Overall Completion Rate
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {t('dashboard.inProgress')}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {inProgressCourses.length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          bgcolor: 'rgba(253, 126, 20, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(inProgressCourses.length / Math.max(enrollments.length, 1)) * 100}%`,
                            bgcolor: '#FD7E14',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {t('dashboard.completed')}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {completedCourses.length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          bgcolor: 'rgba(46,125,50,0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(completedCourses.length / Math.max(enrollments.length, 1)) * 100}%`,
                            bgcolor: '#2E7D32',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {t('dashboard.certificates')}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.8rem' }}>
                          {certificatesCount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          bgcolor: 'rgba(255,215,0,0.15)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(certificatesCount / Math.max(completedCourses.length, 1)) * 100}%`,
                            bgcolor: '#FFD700',
                            borderRadius: '3px',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(253, 126, 20, 0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                      <School sx={{ fontSize: 28, color: '#FD7E14', mb: 0.5 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1.25rem' }}>
                        {enrollments.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                        {t('common.myLearning')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(46,125,50,0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 28, color: '#2E7D32', mb: 0.5 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1.25rem' }}>
                        {completedCourses.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                        {t('dashboard.completed')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(253, 126, 20, 0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 28, color: '#FD7E14', mb: 0.5 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1.25rem' }}>
                        {inProgressCourses.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                        {t('dashboard.inProgress')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '10px',
                      bgcolor: 'rgba(255,215,0,0.15)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 28, color: '#FFD700', mb: 0.5 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '1.25rem' }}>
                        {certificatesCount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                        {t('dashboard.certificates')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* My Tasks */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.95rem' }}>
                      My Tasks
                    </Typography>
                    <Button size="small" sx={{ color: '#FD7E14', fontSize: '0.875rem', textTransform: 'none' }}>View All</Button>
                  </Box>
                  {upcomingTasks.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {upcomingTasks.slice(0, 4).map((task) => (
                        <Paper
                          key={task.id}
                          variant="outlined"
                          sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '10px', borderColor: 'rgba(0,0,0,0.08)' }}
                        >
                          <Avatar sx={{ bgcolor: task.type === 'assignment' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(80, 200, 120, 0.1)', width: 36, height: 36 }}>
                            {task.type === 'assignment' ? (
                              <Assignment sx={{ color: '#4A90E2', fontSize: 20 }} />
                            ) : (
                              <Quiz sx={{ color: '#50C878', fontSize: 20 }} />
                            )}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.875rem' }}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                              {task.course}
                            </Typography>
                          </Box>
                          <Chip
                            label={task.dueDate ? `Due ${format(new Date(task.dueDate), 'MMM dd')}` : 'No Due Date'}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '24px' }}
                          />
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2.5 }}>
                      <Assignment sx={{ fontSize: 40, color: 'rgba(0,0,0,0.15)', mb: 1 }} />
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.875rem' }}>
                        No upcoming tasks.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2.5}>
            {/* User Profile Card */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Profile Header */}
                  <Box
                    sx={{
                      bgcolor: 'rgba(253, 126, 20, 0.08)',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: '#FD7E14',
                        fontSize: '1.5rem',
                        mb: 1.5,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 0.5, fontSize: '1.1rem' }}>
                      {userName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                      {user?.role === 'student' ? 'Learner' : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Calendar - Bottom Right */}
            <Grid item xs={12}>
              <Calendar events={calendarEvents} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
