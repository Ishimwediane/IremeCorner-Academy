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
  MoreVert,
  Edit,
  Share,
  Email,
  Phone,
  CalendarToday,
  Folder,
  Add,
  Visibility,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Calendar from '../components/Calendar';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
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

  const enrollments = enrollmentsData?.data || [];
  const notifications = notificationsData?.data || [];
  const inProgressCourses = enrollments.filter((e) => e.status === 'in-progress');
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

  // Get user's first and last name
  const userName = user?.name || 'User';
  const nameParts = userName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

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
                  Course Progress
                </Typography>
                <Button
                  component={Link}
                  to="/courses"
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
                  See All Courses
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
                  const colorScheme = cardColors[index % cardColors.length];
                  const progress = enrollment.progress || 0;
                  const courseTitle = enrollment.course?.title || 'Untitled Course';
                  const enrolledDate = enrollment.createdAt
                    ? format(new Date(enrollment.createdAt), 'MMM d')
                    : 'Recent';

                  return (
                    <Card
                      key={enrollment._id}
                      sx={{
                        borderRadius: '12px',
                        bgcolor: colorScheme.bg,
                        color: colorScheme.text,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                            {enrolledDate}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              color: colorScheme.text,
                              opacity: 0.8,
                              '&:hover': { opacity: 1 },
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            fontSize: '0.9rem',
                            lineHeight: 1.3,
                            minHeight: 36,
                          }}
                        >
                          {courseTitle.length > 40 ? `${courseTitle.substring(0, 40)}...` : courseTitle}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                            fontSize: '1.1rem',
                          }}
                        >
                          {progress}%
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center',
                          }}
                        >
                          {[1, 2, 3].map((i) => (
                            <Avatar
                              key={i}
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: 'rgba(255,255,255,0.3)',
                                fontSize: '0.7rem',
                                border: `1px solid ${colorScheme.text}`,
                              }}
                            >
                              {i}
                            </Avatar>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
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
                    <Typography>No courses in progress</Typography>
                    <Button
                      component={Link}
                      to="/courses"
                      variant="contained"
                      sx={{ mt: 2, bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
                    >
                      Browse Courses
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
                      Learning Progress
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#202F32' }}>
                        <MoreVert fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#202F32' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
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
                          In Progress
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
                          Completed
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
                          Certificates
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
                        My Courses
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
                        Completed
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
                        In Progress
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
                        Certificates
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                    <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ color: '#202F32' }}>
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#202F32' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <Email fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <Phone fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <Add fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <CalendarToday fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', color: '#202F32' }}>
                        <Folder fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Detailed Information */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>
                      Detailed Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                          First Name:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                            {firstName}
                          </Typography>
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <Edit fontSize="small" sx={{ fontSize: 14, color: 'rgba(32,47,50,0.5)' }} />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                          Last Name:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                            {lastName}
                          </Typography>
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <Edit fontSize="small" sx={{ fontSize: 14, color: 'rgba(32,47,50,0.5)' }} />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                          Email:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                            {user?.email || 'N/A'}
                          </Typography>
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <Edit fontSize="small" sx={{ fontSize: 14, color: 'rgba(32,47,50,0.5)' }} />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                          Phone Number:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32' }}>
                            {user?.phone || 'N/A'}
                          </Typography>
                          <IconButton size="small" sx={{ p: 0.5 }}>
                            <Edit fontSize="small" sx={{ fontSize: 14, color: 'rgba(32,47,50,0.5)' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
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
