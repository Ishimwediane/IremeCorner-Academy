import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  BarChart as AnalyticsIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerQuizzes = () => {
  // TODO: Fetch quizzes from API
  const quizzes = [];

  return (
    <TrainerLayout title="Quiz Management">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202F32' }}>
          Quizzes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#C39766',
            '&:hover': { bgcolor: '#A67A52' },
            textTransform: 'none',
            px: 3,
          }}
        >
          Create Quiz
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Quizzes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {quizzes.length}
                  </Typography>
                </Box>
                <QuizIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Questions</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Attempts</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No quizzes found. Create your first quiz!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz._id} hover>
                    <TableCell>{quiz.title}</TableCell>
                    <TableCell>{quiz.course}</TableCell>
                    <TableCell>{quiz.questions?.length || 0}</TableCell>
                    <TableCell>{quiz.attempts || 0}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#2196f3' }}>
                          <AnalyticsIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#C39766' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#f44336' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerQuizzes;

