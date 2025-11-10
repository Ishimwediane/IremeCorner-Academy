import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  People,
  School,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../utils/api';

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'admin-dashboard',
    async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    }
  );

  const stats = dashboardData?.data?.statistics || {};
  const popularCourses = dashboardData?.data?.popularCourses || [];
  const recentCourses = dashboardData?.data?.recentActivities?.courses || [];

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
        Admin Dashboard
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h4">{stats.users?.total || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.users?.students || 0} students, {stats.users?.trainers || 0} trainers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Courses</Typography>
              </Box>
              <Typography variant="h4">{stats.courses?.total || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.courses?.approved || 0} approved, {stats.courses?.pending || 0} pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Enrollments</Typography>
              </Box>
              <Typography variant="h4">
                {stats.enrollments?.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.enrollments?.completed || 0} completed
              </Typography>
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
                {stats.certificates?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Popular Courses */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Popular Courses
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell align="right">Enrollments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {popularCourses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    <Chip label={course.category} size="small" />
                  </TableCell>
                  <TableCell>{course.trainer?.name || 'N/A'}</TableCell>
                  <TableCell align="right">
                    {course.enrolledStudents?.length || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Courses */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Courses
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Title</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentCourses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.trainer?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      size="small"
                      color={
                        course.status === 'approved'
                          ? 'success'
                          : course.status === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {course.status === 'pending' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={async () => {
                          await api.put(`/courses/${course._id}/approve`, {
                            status: 'approved',
                          });
                          window.location.reload();
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;













