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
  const [form, setForm] = useState({ title: '', date: '', time: '', duration: 60 });

  const handleOpenDialog = () => {
    setForm({ title: '', date: '', time: '', duration: 60 });
    setOpenDialog(true);
  };

  // This would be replaced with API call logic
  const handleScheduleSession = async () => {
    if (!form.title || !form.date || !form.time) {
      alert('Please fill all required fields.');
      return;
    }
    try {
      const payload = {
        ...form,
        course: courseId,
        scheduledAt: `${form.date}T${form.time}:00`, // Combine date and time for the backend
      };
      await api.post('/live-sessions', payload);
      setOpenDialog(false);
      // Refetch sessions to show the new one
      const res = await api.get(`/live-sessions/course/${courseId}`);
      setLiveSessions(res.data?.data || []);
    } catch (error) {
      console.error("Failed to schedule session:", error);
      alert('Failed to schedule session.');
    }
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
          onClick={handleOpenDialog}
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
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>{session.title}</Typography>
                  <Chip
                    label={session.status || 'Scheduled'}
                    size="small"
                    color={session.status === 'live' ? 'error' : 'primary'}
                    sx={{ my: 1 }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    <strong>Date:</strong> {format(new Date(session.scheduledAt), 'MMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    <strong>Time:</strong> {format(new Date(session.scheduledAt), 'p')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" variant="contained" startIcon={<PlayIcon />} sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Start</Button>
                    <IconButton size="small"><EditIcon /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                  </Box>
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
              <TextField fullWidth label="Session Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Time" type="time" InputLabelProps={{ shrink: true }} value={form.time} onChange={e => setForm({...form, time: e.target.value})} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Duration (minutes)" type="number" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 60})} required />
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