import React, { useState, useEffect, useMemo } from 'react';
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
  Tabs,
  Tab,
  Select,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import api from '../../utils/api';

const PlannerHeader = ({ startDate, setStartDate, viewMode, setViewMode, days }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Assignment Planner</Typography>
    <Box sx={{ flex: 1 }} />
    <ButtonGroup size="small" sx={{ mr: 1 }}>
      <Button onClick={() => setStartDate(viewMode === 'month' ? subMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? -7 : -1))}>Prev</Button>
      <Button onClick={() => setStartDate(new Date())}>Today</Button>
      <Button onClick={() => setStartDate(viewMode === 'month' ? addMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? 7 : 1))}>Next</Button>
    </ButtonGroup>
    <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, mr: 1 }}>
      {viewMode === 'month' ? format(startDate, 'MMMM yyyy') : `${format(days[0], 'MMM dd')} – ${format(days[days.length - 1], 'MMM dd')}`}
    </Typography>
    <ButtonGroup size="small">
      <Button variant={viewMode === 'day' ? 'contained' : 'outlined'} onClick={() => setViewMode('day')}>Day</Button>
      <Button variant={viewMode === 'week' ? 'contained' : 'outlined'} onClick={() => setViewMode('week')}>Week</Button>
      <Button variant={viewMode === 'month' ? 'contained' : 'outlined'} onClick={() => setViewMode('month')}>Month</Button>
    </ButtonGroup>
  </Paper>
);

const ScheduleGrid = ({ days, items, viewMode }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', overflowX: 'auto' }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${days.length}, 1fr)`, gap: 0.5, minWidth: '800px' }}>
      <Box />
      {days.map((d) => (
        <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {viewMode === 'month' ? format(d, 'dd') : format(d, 'dd EEE')}
          </Typography>
        </Box>
      ))}
      {items.map((row) => (
        <React.Fragment key={row.id}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            <Chip size="small" label={row.courseTag} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
            <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</Typography>
          </Box>
          {days.map((d, idx) => (
            <Box key={`${row.id}-${idx}`} sx={{ position: 'relative', minHeight: 56, bgcolor: idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderRadius: 1 }}>
              {format(d, 'yyyy-MM-dd') === format(row.start, 'yyyy-MM-dd') && (
                <Box sx={{ position: 'absolute', left: 4, right: `${(row.span - 1) * -100}%`, top: 8, height: 40, bgcolor: row.color, border: `2px solid ${row.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', px: 1.5, zIndex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.name}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </React.Fragment>
      ))}
    </Box>
  </Paper>
);

const CreateAssignmentDialog = ({ open, onClose, onSaved, lessons = [] }) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', lesson: '' });
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Assignment</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}><TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Instructions" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Link to Lesson (Optional)" value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })}>
              <MenuItem value=""><em>None</em></MenuItem>
              {lessons.map(lesson => (
                <MenuItem key={lesson._id} value={lesson._id}>{lesson.title}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSaved(form)} variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignmentTab = ({ courseId, assignments, setAssignments, course }) => {
  const [assignmentTab, setAssignmentTab] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [openCreateAssignment, setOpenCreateAssignment] = useState(false);

  const handleSaveAssignment = async (form) => {
    if (!form.title || !courseId) {
      alert('Title and course are required.');
      return;
    }
    try {
      await api.post('/assignments', {
        ...form,
        course: courseId, // Ensure assignment is linked to the current course
      });
      setOpenCreateAssignment(false);
      // After saving, fetch the updated assignments
      const res = await api.get(`/assignments/course/${courseId}`);
      setAssignments(res.data?.data || []);
    } catch (e) {
      console.error("Failed to save assignment", e);
      alert("Failed to save assignment");
      setOpenCreateAssignment(false);
    }
  };

  const assignmentPlannerItems = React.useMemo(() => assignments.map((a, idx) => ({
    id: a._id || `a-${idx}`,
    title: 'Course', // You might want to pass the course title as a prop
    courseTag: 'EN', // You might want to pass the course level as a prop
    name: a.title || 'Assignment',
    status: a.status || 'DUE',
    start: a.dueDate ? new Date(a.dueDate) : addDays(new Date(), (idx % 5) + 1),
    span: 1,
    color: 'rgba(124,77,255,0.08)',
    border: '#7b68ee',
  })), [assignments, startDate]);

  const plannerDays = React.useMemo(() => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'month') {
      const s = startOfMonth(startDate);
      const e = endOfMonth(startDate);
      return eachDayOfInterval({ start: s, end: e });
    }
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });
  }, [startDate, viewMode]);

  return (
    <Box>
      <Tabs value={assignmentTab} onChange={(_, v) => setAssignmentTab(v)} sx={{ mb: 2 }}>
        <Tab label="Planner" />
        <Tab label="All Assignments" />
        <Tab label="Submissions" />
      </Tabs>

      {assignmentTab === 0 && (
        <PlannerHeader days={plannerDays} startDate={startDate} setStartDate={setStartDate} viewMode={viewMode} setViewMode={setViewMode} />
      )}

      {assignmentTab === 0 && <ScheduleGrid days={plannerDays} items={assignmentPlannerItems} viewMode={viewMode} />}

      {assignmentTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>All Assignments</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateAssignment(true)} sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Create Assignment</Button>
          </Box>
          {assignments.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#666' }}>No assignments found for this course.</Typography>
          ) : (
            <Grid container spacing={2}>
              {assignments.map((a) => (
                <Grid key={a._id} item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>{a.title}</Typography>
                      <Box>
                        <Chip size="small" label={a.status || 'DUE'} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766', mr: 1 }} />
                        {a.dueDate && <Chip size="small" label={`Due ${format(new Date(a.dueDate), 'MMM dd')}`} sx={{ mr: 1 }} />}
                        {a.lesson && <Chip size="small" label={`Lesson: ${a.lesson.title}`} variant="outlined" />}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <CreateAssignmentDialog open={openCreateAssignment} onClose={() => setOpenCreateAssignment(false)} onSaved={handleSaveAssignment} lessons={course?.lessons} />
    </Box>
  );
};

export default AssignmentTab;