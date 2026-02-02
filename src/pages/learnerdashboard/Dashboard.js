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
  const inProgressCourses = enrollments.filter(
    (e) => e.status === 'in-progress' || e.status === 'enrolled'
  );
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Course Progress Cards - Top Left */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>
                  {t('dashboard.progress')}
                </Typography>
                <Button
                  component={Link}
                  to="/learner/courses"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#C39766',
                    color: '#C39766',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#A67A52',
                      bgcolor: 'rgba(195,151,102,0.05)',
                    },
                  }}
                >
                  {t('dashboard.viewAll')}
                </Button>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                  mb: 3,
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
                      py: 4,
                      color: 'rgba(32,47,50,0.6)',
                    }}
                  >
                    <School sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                    <Typography>{t('dashboard.noCourses')}</Typography>
                    <Button
                      component={Link}
                      to="/learner/courses"
                      variant="contained"
                      sx={{ mt: 2, bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
                    >
                      {t('dashboard.exploreCourses')}
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Statistics/Stage Funnel - Bottom Left */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>
                      {t('dashboard.overview')}</Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#C39766', mb: 1 }}>
                      {totalProgress}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)', mb: 2 }}>
                      Overall Completion Rate
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {t('dashboard.inProgress')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {inProgressCourses.length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'rgba(195,151,102,0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(inProgressCourses.length / Math.max(enrollments.length, 1)) * 100}%`,
                            bgcolor: '#C39766',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {t('dashboard.completed')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {completedCourses.length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'rgba(46,125,50,0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(completedCourses.length / Math.max(enrollments.length, 1)) * 100}%`,
                            bgcolor: '#2E7D32',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {t('dashboard.certificates')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                          {certificatesCount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'rgba(195,151,102,0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(certificatesCount / Math.max(completedCourses.length, 1)) * 100}%`,
                            bgcolor: '#FFD700',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats - Bottom Middle */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      bgcolor: 'rgba(195,151,102,0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <School sx={{ fontSize: 32, color: '#C39766', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
                        {enrollments.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                        {t('common.myLearning')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      bgcolor: 'rgba(46,125,50,0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 32, color: '#2E7D32', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
                        {completedCourses.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                        {t('dashboard.completed')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      bgcolor: 'rgba(195,151,102,0.08)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 32, color: '#C39766', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
                        {inProgressCourses.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                        {t('dashboard.inProgress')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      bgcolor: 'rgba(255,215,0,0.15)',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 32, color: '#FFD700', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32' }}>
                        {certificatesCount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                        {t('dashboard.certificates')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* My Tasks - Bottom Right */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>
                      My Tasks
                    </Typography>
                    <Button size="small" sx={{ color: '#C39766' }}>View All</Button>
                  </Box>
                  {upcomingTasks.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {upcomingTasks.slice(0, 4).map((task) => (
                        <Paper
                          key={task.id}
                          variant="outlined"
                          sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: '12px' }}
                        >
                          <Avatar sx={{ bgcolor: task.type === 'assignment' ? 'rgba(74, 144, 226, 0.1)' : 'rgba(80, 200, 120, 0.1)' }}>
                            {task.type === 'assignment' ? (
                              <Assignment sx={{ color: '#4A90E2' }} />
                            ) : (
                              <Quiz sx={{ color: '#50C878' }} />
                            )}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                              {task.course}
                            </Typography>
                          </Box>
                          <Chip
                            label={task.dueDate ? `Due ${format(new Date(task.dueDate), 'MMM dd')}` : 'No Due Date'}
                            size="small"
                            variant="outlined"
                          />
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Assignment sx={{ fontSize: 48, color: 'rgba(32,47,50,0.2)', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.7)' }}>
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
          <Grid container spacing={3}>
            {/* User Profile Card - Top Right */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Profile Header */}
                  <Box
                    sx={{
                      bgcolor: 'rgba(195,151,102,0.08)',
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#C39766',
                        fontSize: '2rem',
                        mb: 2,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32', mb: 0.5 }}>
                      {userName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)', mb: 2 }}>
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
