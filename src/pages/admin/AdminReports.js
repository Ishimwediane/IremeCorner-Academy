import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../utils/api';

const AdminReports = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'admin-dashboard-reports',
    async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    }
  );

  const stats = dashboardData?.data?.statistics || {};

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const reportCards = [
    {
      title: 'User Report',
      description: 'Detailed report on user registration, roles, and activity.',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#2196f3' }} />,
      action: () => alert('Generating user report... (Not implemented)'),
    },
    {
      title: 'Course Report',
      description: 'Analytics on course creation, enrollment, and completion rates.',
      icon: <SchoolIcon sx={{ fontSize: 48, color: '#4caf50' }} />,
      action: () => alert('Generating course report... (Not implemented)'),
    },
    {
      title: 'Financial Report',
      description: 'Overview of revenue from paid courses and instructor earnings.',
      icon: <MoneyIcon sx={{ fontSize: 48, color: '#ff9800' }} />,
      action: () => alert('Generating financial report... (Not implemented)'),
    },
    {
      title: 'Full Platform Export',
      description: 'Download all platform data as CSV files.',
      icon: <DownloadIcon sx={{ fontSize: 48, color: '#f44336' }} />,
      action: () => alert('Exporting data... (Not implemented)'),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Summary Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
              <Typography variant="h4" fontWeight="700">{stats.users?.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Courses</Typography>
              <Typography variant="h4" fontWeight="700">{stats.courses?.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Enrollments</Typography>
              <Typography variant="h4" fontWeight="700">{stats.enrollments?.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 3 }}>
          Generate Reports
        </Typography>
        <Grid container spacing={3}>
          {reportCards.map((card, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 0 }}>
                <Box sx={{ mr: 2 }}>{card.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600">{card.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{card.description}</Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={card.action}
                  sx={{
                    borderRadius: 0,
                    borderColor: '#FD7E14',
                    color: '#FD7E14',
                    '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' },
                    textTransform: 'none'
                  }}
                >
                  Generate
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminReports;