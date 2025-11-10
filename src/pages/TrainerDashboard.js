import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  VideoLibrary as LessonsIcon,
  Phone as PhoneIcon,
  Description as DocumentIcon,
  Message as ChatIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import TrainerSidebar from '../components/TrainerSidebar';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch trainer's courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    ['trainer-courses', user?._id || user?.id],
    async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/courses?trainer=${userId}`);
      return response.data;
    },
    { enabled: !!(user?._id || user?.id) }
  );

  const courses = coursesData?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = new Set();
    let totalIncome = 0;
    const totalCourses = courses.length;
    let totalLessons = 0;

    courses.forEach((course) => {
      // Count unique students across all courses
      if (course.enrolledStudents) {
        course.enrolledStudents.forEach((student) => {
          const studentId = typeof student === 'object' ? (student._id || student.id) : student;
          if (studentId) {
            totalStudents.add(studentId);
          }
        });
      }
      // Calculate income (assuming all paid courses)
      if (!course.isFree && course.price) {
        const enrolledCount = course.enrolledStudents?.length || 0;
        totalIncome += course.price * enrolledCount;
      }
      // Count lessons - use totalLessons field if available, otherwise count lessons array
      if (course.totalLessons !== undefined) {
        totalLessons += course.totalLessons;
      } else if (course.lessons && Array.isArray(course.lessons)) {
        totalLessons += course.lessons.length;
      }
    });

    return {
      students: totalStudents.size,
      income: totalIncome,
      courses: totalCourses,
      lessons: totalLessons,
    };
  }, [courses]);

  // Get today's activities (recent enrollments or course activities)
  const todayActivities = useMemo(() => {
    // For now, we'll use recent enrollments as "today's classes"
    // In a real app, this would be based on scheduled sessions or live classes
    const activities = [];
    courses.forEach((course) => {
      if (course.enrolledStudents && course.enrolledStudents.length > 0) {
        course.enrolledStudents.slice(0, 4).forEach((student, index) => {
          activities.push({
            id: `${course._id}-${index}`,
            student: student.name || student.email || 'Student',
            course: course.title,
            time: index === 0 ? '12:00' : index === 1 ? '14:00' : index === 2 ? '16:00' : '18:00',
            status: index === 0 ? 'On Going' : null,
            avatar: student.avatar || student.name?.charAt(0) || 'S',
          });
        });
      }
    });
    return activities.slice(0, 4);
  }, [courses]);

  // Get next student details (first student from first course)
  const nextStudent = useMemo(() => {
    if (courses.length > 0 && courses[0].enrolledStudents?.length > 0) {
      const student = courses[0].enrolledStudents[0];
      const course = courses[0];
      return {
        name: student.name || student.email || 'Student',
        email: student.email || 'student@example.com',
        avatar: student.avatar || student.name?.charAt(0) || 'S',
        course: course.title,
        enrolledDate: course.createdAt || new Date(),
        progress: Math.floor(Math.random() * 100), // Mock progress
      };
    }
    return null;
  }, [courses]);

  // Mock student requests (pending enrollments or course requests)
  const studentRequests = useMemo(() => {
    const requests = [];
    courses.slice(0, 3).forEach((course, courseIndex) => {
      if (course.enrolledStudents && course.enrolledStudents.length > 0) {
        course.enrolledStudents.slice(0, 1).forEach((student, index) => {
          requests.push({
            id: `request-${courseIndex}-${index}`,
            student: student.name || student.email || 'Student',
            course: course.title,
            date: format(new Date(), 'dd MMMM - HH:mm'),
            avatar: student.avatar || student.name?.charAt(0) || 'S',
          });
        });
      }
    });
    return requests;
  }, [courses]);

  if (coursesLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <TrainerSidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: '280px' },
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header Bar - Fixed */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: { xs: 0, md: '280px' },
            right: 0,
            height: 70,
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { xs: 'block', md: 'none' },
              mr: 2,
              color: '#202F32',
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Dashboard Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#202F32',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Dashboard
          </Typography>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Notifications"
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Help"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Settings"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content - Below Header */}
        <Box
          sx={{
            flex: 1,
            mt: '70px',
            p: { xs: 2, md: 3 },
            overflow: 'auto',
          }}
        >

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(156,39,176,0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <PeopleIcon sx={{ color: '#9c27b0', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', fontSize: '0.875rem' }}
                    >
                      Students
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: '#202F32' }}
                    >
                      {stats.students}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(76,175,80,0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <MoneyIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', fontSize: '0.875rem' }}
                    >
                      Income
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: '#202F32' }}
                    >
                      ${stats.income.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(139,195,74,0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <SchoolIcon sx={{ color: '#8bc34a', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', fontSize: '0.875rem' }}
                    >
                      Courses
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: '#202F32' }}
                    >
                      {stats.courses}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(233,30,99,0.1)',
                      borderRadius: '12px',
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <LessonsIcon sx={{ color: '#e91e63', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', fontSize: '0.875rem' }}
                    >
                      Lessons
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: '#202F32' }}
                    >
                      {stats.lessons}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Today's Classes */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#202F32', mb: 2 }}
              >
                Today's Classes
              </Typography>
              <List>
                {todayActivities.length > 0 ? (
                  todayActivities.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#C39766',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              color: '#202F32',
                            }}
                          >
                            {activity.student}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: '#666', fontSize: '0.875rem' }}
                          >
                            {activity.course}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {activity.status && (
                          <Chip
                            label={activity.status}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(195,151,102,0.1)',
                              color: '#C39766',
                              fontWeight: 500,
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#202F32',
                            minWidth: 50,
                            textAlign: 'right',
                          }}
                        >
                          {activity.time}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: '#666', textAlign: 'center', py: 4 }}
                  >
                    No classes scheduled for today
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Next Student Details */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#202F32', mb: 2 }}
              >
                Next Student Details
              </Typography>
              {nextStudent ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#C39766',
                        width: 56,
                        height: 56,
                        fontSize: '1.5rem',
                      }}
                    >
                      {nextStudent.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: '#202F32' }}
                      >
                        {nextStudent.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', fontSize: '0.875rem' }}
                      >
                        {nextStudent.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', fontSize: '0.75rem', mb: 0.5 }}
                      >
                        Course
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: '#202F32' }}
                      >
                        {nextStudent.course}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', fontSize: '0.75rem', mb: 0.5 }}
                      >
                        Progress
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: '#202F32' }}
                      >
                        {nextStudent.progress}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', fontSize: '0.75rem', mb: 0.5 }}
                      >
                        Enrolled
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: '#202F32' }}
                      >
                        {format(new Date(nextStudent.enrolledDate), 'dd MMM yyyy')}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PhoneIcon />}
                      sx={{
                        bgcolor: '#202F32',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '8px',
                        flex: 1,
                        '&:hover': { bgcolor: '#1a2527' },
                      }}
                    >
                      Call
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DocumentIcon />}
                      sx={{
                        borderColor: '#C39766',
                        color: '#C39766',
                        textTransform: 'none',
                        borderRadius: '8px',
                        flex: 1,
                        '&:hover': {
                          borderColor: '#A67A52',
                          bgcolor: 'rgba(195,151,102,0.05)',
                        },
                      }}
                    >
                      Documents
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      sx={{
                        borderColor: '#C39766',
                        color: '#C39766',
                        textTransform: 'none',
                        borderRadius: '8px',
                        flex: 1,
                        '&:hover': {
                          borderColor: '#A67A52',
                          bgcolor: 'rgba(195,151,102,0.05)',
                        },
                      }}
                    >
                      Chat
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: '#666', textAlign: 'center', py: 4 }}
                >
                  No student data available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Student Requests */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#202F32' }}
                >
                  Student Requests
                </Typography>
                <Button
                  size="small"
                  sx={{
                    color: '#C39766',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  See All
                </Button>
              </Box>
              <List>
                {studentRequests.length > 0 ? (
                  studentRequests.map((request) => (
                    <ListItem
                      key={request.id}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#C39766',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {request.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              color: '#202F32',
                            }}
                          >
                            {request.student}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: '#666', fontSize: '0.875rem' }}
                            >
                              {request.course}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5 }}
                            >
                              {request.date}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(76,175,80,0.1)',
                            color: '#4caf50',
                            '&:hover': { bgcolor: 'rgba(76,175,80,0.2)' },
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: 'rgba(244,67,54,0.1)',
                            color: '#f44336',
                            '&:hover': { bgcolor: 'rgba(244,67,54,0.2)' },
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: '#666', textAlign: 'center', py: 4 }}
                  >
                    No pending requests
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Analytics Chart Placeholder */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}
                >
                  Course Analytics
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#666', mb: 3 }}
                >
                  Enrollment and completion statistics
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    bgcolor: 'rgba(195,151,102,0.05)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Chart visualization coming soon
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default TrainerDashboard;

