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
} from '@mui/material';
import {
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../utils/api';

const LiveSessionTab = ({ courseId, liveSessions, setLiveSessions }) => {
  const [openDialog, setOpenDialog] = useState(false);

  // This would be replaced with API call logic
  const handleScheduleSession = async (form) => {
    // Example: await api.post('/live-sessions', { ...form, course: courseId });
    setOpenDialog(false);
    // Refetch sessions:
    // const res = await api.get(`/live-sessions/course/${courseId}`);
    // setLiveSessions(res.data?.data || []);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>
          Live Sessions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
        >
          Schedule Session
        </Button>
      </Box>

      <Grid container spacing={3}>
        {liveSessions.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
              <VideoCallIcon sx={{ fontSize: 60, color: '#C39766', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 1 }}>
                No Live Sessions Scheduled
              </Typography>
            </Paper>
          </Grid>
        ) : (
          liveSessions.map((session) => (
            <Grid item xs={12} md={6} key={session._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{session.title}</Typography>
                  {/* Add more session details here */}
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
          <Button onClick={handleScheduleSession} variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveSessionTab;