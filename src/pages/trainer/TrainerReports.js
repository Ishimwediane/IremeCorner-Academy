import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Download as DownloadIcon,
  BarChart as ChartIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerReports = () => {
  return (
    <TrainerLayout title="Reports & Analytics">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <ChartIcon sx={{ fontSize: 60, color: '#C39766', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                  Course Performance
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  View detailed analytics for your courses
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#C39766',
                    color: '#C39766',
                    '&:hover': { borderColor: '#A67A52', bgcolor: 'rgba(195,151,102,0.05)' },
                  }}
                >
                  View Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <ReportIcon sx={{ fontSize: 60, color: '#2196f3', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                  Student Progress
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Track student engagement and progress
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#2196f3',
                    color: '#2196f3',
                    '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(33,150,243,0.05)' },
                  }}
                >
                  View Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <DownloadIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                  Export Data
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Download reports in PDF or Excel format
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': { borderColor: '#388e3c', bgcolor: 'rgba(76,175,80,0.05)' },
                  }}
                >
                  Export
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: '16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 2 }}>
          Analytics Overview
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Analytics charts and detailed reports coming soon...
          </Typography>
        </Box>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerReports;

