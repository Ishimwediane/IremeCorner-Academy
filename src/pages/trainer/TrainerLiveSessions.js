import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerLiveSessions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [sessions] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      date: new Date(),
      time: '10:00 AM',
      duration: 60,
      students: 25,
      status: 'scheduled',
    },
  ]);

  return (
    <TrainerLayout title="Live Sessions">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202F32' }}>
          Live Sessions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            bgcolor: '#C39766',
            '&:hover': { bgcolor: '#A67A52' },
            textTransform: 'none',
            px: 3,
          }}
        >
          Schedule Session
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sessions.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <VideoCallIcon sx={{ fontSize: 60, color: '#C39766', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                No Live Sessions Scheduled
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                Schedule your first live session to interact with students in real-time
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  bgcolor: '#C39766',
                  '&:hover': { bgcolor: '#A67A52' },
                }}
              >
                Schedule Session
              </Button>
            </Paper>
          </Grid>
        ) : (
          sessions.map((session) => (
            <Grid item xs={12} md={6} key={session.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                        {session.title}
                      </Typography>
                      <Chip
                        label={session.status}
                        size="small"
                        color={session.status === 'scheduled' ? 'primary' : 'default'}
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Box>
                      <IconButton size="small" sx={{ color: '#C39766' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      <strong>Date:</strong> {format(session.date, 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      <strong>Time:</strong> {session.time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      <strong>Duration:</strong> {session.duration} minutes
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      <strong>Students:</strong> {session.students} enrolled
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    fullWidth
                    sx={{
                      bgcolor: '#C39766',
                      '&:hover': { bgcolor: '#A67A52' },
                      textTransform: 'none',
                    }}
                  >
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Schedule Session Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Live Session</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Session Title" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Course" select required>
                <MenuItem value="course1">Course 1</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Duration (minutes)" type="number" required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </TrainerLayout>
  );
};

export default TrainerLiveSessions;


