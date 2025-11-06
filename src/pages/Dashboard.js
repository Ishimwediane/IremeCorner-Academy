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
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  School,
  CheckCircle,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';

const Dashboard = () => {
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

  const { data: notificationsData } = useQuery(
    'notifications',
    async () => {
      const response = await api.get('/notifications?limit=5');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );

  const enrollments = enrollmentsData?.data || [];
  const notifications = notificationsData?.data || [];
  const inProgressCourses = enrollments.filter((e) => e.status === 'in-progress');
  const completedCourses = enrollments.filter((e) => e.status === 'completed');

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {isLoading ? (
        <Box textAlign="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Statistics */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">My Courses</Typography>
                </Box>
                <Typography variant="h4">{enrollments.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">In Progress</Typography>
                </Box>
                <Typography variant="h4">{inProgressCourses.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Completed</Typography>
                </Box>
                <Typography variant="h4">{completedCourses.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Assignment color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Certificates</Typography>
                </Box>
                <Typography variant="h4">
                  {completedCourses.filter((e) => e.certificateIssued).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* In Progress Courses */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  In Progress Courses
                </Typography>
                {inProgressCourses.length === 0 ? (
                  <Typography color="text.secondary">
                    No courses in progress
                  </Typography>
                ) : (
                  <List>
                    {inProgressCourses.slice(0, 5).map((enrollment) => (
                      <ListItem
                        key={enrollment._id}
                        component={Link}
                        to={`/courses/${enrollment.course._id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemText
                          primary={enrollment.course.title}
                          secondary={`${enrollment.progress}% complete`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                {inProgressCourses.length > 5 && (
                  <Button component={Link} to="/my-courses">
                    View All
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Notifications
                </Typography>
                {notifications.length === 0 ? (
                  <Typography color="text.secondary">
                    No notifications
                  </Typography>
                ) : (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem key={notification._id}>
                        <ListItemText
                          primary={notification.title}
                          secondary={notification.message}
                        />
                        {!notification.isRead && (
                          <Chip label="New" size="small" color="primary" />
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;



