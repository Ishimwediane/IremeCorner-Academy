import React, { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';

const dayCols = 13;

const PlannerHeader = ({ startDate, onCreate }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Button startIcon={<FilterIcon />} sx={{ textTransform: 'none' }}>Filter Settings</Button>
    <Box sx={{ flex: 1 }} />
    <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600 }}>
      {format(startDate, 'MMMM yyyy')} – {format(addDays(startDate, dayCols - 1), 'MMMM yyyy')}
    </Typography>
    <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate} sx={{ ml: 2, bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Create</Button>
  </Paper>
);

const ScheduleGrid = ({ startDate, items }) => {
  const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, dayCols - 1) });
  return (
    <Paper sx={{ p: 2, borderRadius: '16px' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${dayCols}, 1fr)`, gap: 0.5 }}>
        <Box />
        {days.map((d) => (
          <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{format(d, 'dd EEE')}</Typography>
          </Box>
        ))}
        {items.map((row) => (
          <>
            <Box key={`${row.id}-label`} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <Chip size="small" label={row.courseTag} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
              <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600 }}>{row.title}</Typography>
            </Box>
            {days.map((d, idx) => (
              <Box key={`${row.id}-${idx}`} sx={{ position: 'relative', minHeight: 56, bgcolor: idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderRadius: 1 }}>
                {format(d, 'yyyy-MM-dd') === format(row.start, 'yyyy-MM-dd') && (
                  <Box sx={{ position: 'absolute', left: 4, right: `${(row.span - 1) * -100}%`, top: 8, height: 40, bgcolor: row.color, border: `2px solid ${row.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', px: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.name}</Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                      <Chip label={`${row.questions} Qs`} size="small" sx={{ bgcolor: 'white' }} />
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </>
        ))}
      </Box>
    </Paper>
  );
};

const CreateQuizDialog = ({ open, onClose, onSave, courses = [] }) => {
  const [form, setForm] = useState({ title: '', course: '', availableOn: '' });
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Quiz</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Course" select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              {courses.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Available On" InputLabelProps={{ shrink: true }} value={form.availableOn} onChange={(e) => setForm({ ...form, availableOn: e.target.value })} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)} variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const TrainerQuizzes = () => {
  const [startDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);

  const items = useMemo(() => ([
    { id: 'q1', title: 'Module 1 Quiz', courseTag: 'EN', name: 'Module 1 Quiz', questions: 10, start: addDays(new Date(), 1), span: 2, color: 'rgba(124, 77, 255, 0.08)', border: '#7b68ee' },
    { id: 'q2', title: 'Midterm Quiz', courseTag: 'EN', name: 'Midterm Quiz', questions: 20, start: addDays(new Date(), 4), span: 3, color: 'rgba(33,150,243,0.08)', border: '#2196f3' },
  ]), []);

  return (
    <TrainerLayout title="Quiz Management">
      <PlannerHeader startDate={startDate} onCreate={() => setOpenCreate(true)} />
      <ScheduleGrid startDate={startDate} items={items} />
      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700, color: '#202F32' }}>Workload Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card><CardContent><Typography variant="caption" sx={{ color: '#7b68ee', fontWeight: 700 }}>QUIZ RELEASES</Typography><Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Upcoming quiz releases by course</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card><CardContent><Typography variant="caption" sx={{ color: '#2196f3', fontWeight: 700 }}>QUIZ ATTEMPTS</Typography><Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Recent attempts and performance</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card><CardContent><Typography variant="caption" sx={{ color: '#e91e63', fontWeight: 700 }}>RETAKES</Typography><Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Retake workload and thresholds</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <CreateQuizDialog open={openCreate} onClose={() => setOpenCreate(false)} onSave={() => setOpenCreate(false)} courses={[ 'Course A', 'Course B', 'Course C' ]} />
    </TrainerLayout>
  );
};

export default TrainerQuizzes;


