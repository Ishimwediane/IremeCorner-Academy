import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  People,
  School,
  TrendingUp,
  Assignment, // This is good for certificates
  PendingActions as PendingIcon,
  NewReleases as NewReleasesIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../utils/api'; // Corrected Path

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'admin-dashboard',
    async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    }
  );

  const stats = dashboardData?.data?.statistics || {};
  const popularCourses = dashboardData?.data?.popularCourses?.slice(0, 5) || [];
  const recentCourses = dashboardData?.data?.recentActivities?.courses?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <> {/* Changed from Container to Fragment */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Welcome back, Admin! Here's an overview of the platform.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(156,39,176,0.1)', borderRadius: '12px', p: 1.5, mr: 2 }}>
                      <People sx={{ color: '#9c27b0', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>{stats.users?.total || 0}</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Users</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(76,175,80,0.1)', borderRadius: '12px', p: 1.5, mr: 2 }}>
                      <School sx={{ color: '#4caf50', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>{stats.courses?.total || 0}</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Total Courses</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(233,30,99,0.1)', borderRadius: '12px', p: 1.5, mr: 2 }}>
                      <TrendingUp sx={{ color: '#e91e63', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>{stats.enrollments?.total || 0}</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Enrollments</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(195,151,102,0.1)', borderRadius: '12px', p: 1.5, mr: 2 }}>
                      <Assignment sx={{ color: '#C39766', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>{stats.certificates?.total || 0}</Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>Certificates Issued</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Courses for Approval */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PendingIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>
                    Pending Approvals
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Title</TableCell>
                        <TableCell>Trainer</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentCourses.filter(c => c.status === 'pending').map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.trainer?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip label={course.status} size="small" color="warning" />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to approve this course?')) {
                                  api.put(`/courses/${course._id}/approve`, { status: 'approved' })
                                    .then(() => window.location.reload()); // Simple refresh to update data
                                }
                              }}
                            >
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {recentCourses.filter(c => c.status === 'pending').length === 0 && (
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: '#666' }}>
                    No courses are currently pending approval.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Popular Courses */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NewReleasesIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>
                    Popular Courses
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell align="right">Enrollments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {popularCourses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell align="right">
                            {course.enrolledStudents?.length || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {popularCourses.length === 0 && (
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: '#666' }}>
                    No popular courses to show yet.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminDashboard;
