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
  Chip,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Grading as GradingIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerAssignments = () => {
  // TODO: Fetch assignments from API
  const assignments = [];

  return (
    <TrainerLayout title="Assignment Management">
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202F32' }}>
          Assignments
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
          Create Assignment
        </Button>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Assignments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {assignments.length}
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Pending Grading
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    0
                  </Typography>
                </Box>
                <GradingIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assignments Table */}
      <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Submissions</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No assignments found. Create your first assignment!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment._id} hover>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.submissions || 0}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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

export default TrainerAssignments;


