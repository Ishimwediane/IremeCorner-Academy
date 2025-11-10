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
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';

const dayCols = 13; // show ~2 weeks

const PlannerHeader = ({ startDate, setStartDate, onCreate }) => {
  const endDate = addDays(startDate, dayCols - 1);
  return (
    <Paper sx={{ p: 2, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button startIcon={<FilterIcon />} sx={{ textTransform: 'none' }}>Filter Settings</Button>
      <Box sx={{ flex: 1 }} />
      <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600 }}>
        {format(startDate, 'MMMM yyyy')} – {format(endDate, 'MMMM yyyy')}
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate} sx={{ ml: 2, bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Create</Button>
      <Button variant="outlined" sx={{ ml: 1, borderColor: '#C39766', color: '#C39766', '&:hover': { borderColor: '#A67A52' } }}>Delete</Button>
    </Paper>
  );
};

const ScheduleGrid = ({ startDate, items }) => {
  const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, dayCols - 1) });
  return (
    <Paper sx={{ p: 2, borderRadius: '16px' }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${dayCols}, 1fr)`, gap: 0.5 }}>
            {/* Header row */}
            <Box />
            {days.map((d) => (
              <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1, color: '#202F32' }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{format(d, 'dd EEE')}</Typography>
              </Box>
            ))}
            {/* Rows */}
            {items.map((row) => (
              <>
                <Box key={`${row.id}-label`} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                  <Chip size="small" label={row.courseTag} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
                  <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600 }}>{row.title}</Typography>
                </Box>
                {days.map((d, idx) => (
                  <Box key={`${row.id}-${idx}`} sx={{ position: 'relative', minHeight: 56, bgcolor: idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderRadius: 1 }}>
                    {format(d, 'yyyy-MM-dd') === format(row.start, 'yyyy-MM-dd') && (
                      <Box sx={{
                        position: 'absolute',
                        left: 4,
                        right: `${(row.span - 1) * -100}%`,
                        top: 8,
                        height: 40,
                        bgcolor: row.color,
                        color: '#202F32',
                        borderRadius: 2,
                        border: `2px solid ${row.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        px: 1.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.name}</Typography>
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                          <Chip label={row.status} color="default" size="small" sx={{ bgcolor: 'white' }} />
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const CreateAssignmentDialog = ({ open, onClose, onSave, courses = [] }) => {
  const [form, setForm] = useState({ title: '', course: '', dueDate: '', type: 'Assignment' });
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Assignment</DialogTitle>
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
            <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
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

const SummaryCards = ({ stats }) => (
  <Grid container spacing={3} sx={{ mt: 3 }}>
    {stats.map((s) => (
      <Grid item xs={12} sm={6} md={4} key={s.title}>
        <Card>
          <CardContent>
            <Typography variant="caption" sx={{ color: s.color, fontWeight: 700 }}>
              {s.title.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>{s.subtitle}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const TrainerAssignments = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);

  // Mock items for the planner
  const items = useMemo(() => ([
    { id: 'a1', title: 'API Descriptions', courseTag: 'EN', name: 'API Descriptions', status: 'REVIEW', start: addDays(startDate, 2), span: 5, color: 'rgba(156,39,176,0.08)', border: '#9c27b0' },
    { id: 'a2', title: 'FAQ Section', courseTag: 'EN', name: 'FAQ Section', status: 'TRANSLATION', start: addDays(startDate, 3), span: 3, color: 'rgba(33,150,243,0.08)', border: '#2196f3' },
    { id: 'a3', title: 'Mars Travel Manual', courseTag: 'EN', name: 'Mars Travel Manual', status: 'CONTRIBUTION', start: addDays(startDate, 5), span: 4, color: 'rgba(233,30,99,0.08)', border: '#e91e63' },
  ]), [startDate]);

  return (
    <TrainerLayout title="Assignment Management">
      <PlannerHeader startDate={startDate} setStartDate={setStartDate} onCreate={() => setOpenCreate(true)} />
      <ScheduleGrid startDate={startDate} items={items} />
      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700, color: '#202F32' }}>Workload Summary</Typography>
      <SummaryCards
        stats={[
          { title: 'Translation Assignments', subtitle: 'User workload with translation assignments', color: '#2196f3' },
          { title: 'Review Assignments', subtitle: 'User workload with review assignments', color: '#7b68ee' },
          { title: 'Contribution Assignments', subtitle: 'User workload with contribution assignments', color: '#e91e63' },
        ]}
      />

      <CreateAssignmentDialog open={openCreate} onClose={() => setOpenCreate(false)} onSave={() => setOpenCreate(false)} courses={[ 'Course A', 'Course B', 'Course C' ]} />
    </TrainerLayout>
  );
};

export default TrainerAssignments;


