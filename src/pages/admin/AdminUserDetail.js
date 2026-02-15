import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { ArrowBack, School, Person, Edit } from '@mui/icons-material';
import api from '../../utils/api';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch user details
  const { data: user, isLoading: userLoading, error: userError } = useQuery(
    ['admin-user-detail', id],
    async () => {
      const response = await api.get(`/admin/users/${id}`);
      return response.data.data;
    }
  );

  // Fetch related courses based on role
  const { data: relatedData, isLoading: coursesLoading } = useQuery(
    ['admin-user-courses', id, user?.role],
    async () => {
      if (!user) return null;
      if (user.role === 'student') {
        const response = await api.get(`/enrollments?user=${id}`);
        return response.data.data;
      }
      if (user.role === 'trainer') {
        const response = await api.get(`/courses?trainer=${id}`);
        return response.data.data;
      }
      return [];
    },
    { enabled: !!user }
  );

  if (userLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (userError || !user) {
    return <Alert severity="error">Could not load user details.</Alert>;
  }

  const isStudent = user.role === 'student';
  const courseList = isStudent ? relatedData?.map(enrollment => enrollment.course) : relatedData;

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: '#FD7E14', textTransform: 'none' }}
      >
        Back to User List
      </Button>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <Avatar src={user.avatar} sx={{ width: 100, height: 100, fontSize: '3rem' }}>
              {user.name?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={10}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" fontWeight="700">{user.name}</Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>{user.email}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={user.role} icon={user.role === 'student' ? <Person /> : <School />} color="primary" size="small" />
                  <Chip label={user.isActive ? 'Active' : 'Inactive'} color={user.isActive ? 'success' : 'default'} size="small" />
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                size="small"
                sx={{
                  borderRadius: 0,
                  borderColor: '#FD7E14',
                  color: '#FD7E14',
                  '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' },
                  textTransform: 'none'
                }}
              >
                Edit User
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isStudent ? 'Enrolled Courses' : 'Created Courses'}
        </Typography>
        {coursesLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {courseList && courseList.length > 0 ? (
              courseList.map((course) => (
                <ListItem
                  key={course._id}
                  button
                  component={Link}
                  to={`/admin/courses/${course._id}`}
                  divider
                >
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary={course.title}
                    secondary={`Category: ${course.category} | Status: ${course.status}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography color="text.secondary">
                No courses found for this user.
              </Typography>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default AdminUserDetail;