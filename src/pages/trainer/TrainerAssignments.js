import React, { useEffect, useMemo, useState } from 'react';
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
  Tabs,
  Tab,
  Select,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';



const PlannerHeader = ({ startDate, setStartDate, courseOptions, selectedCourse, setSelectedCourse, viewMode, setViewMode, days }) => {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 0, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Assignment Planner</Typography>
      <Select
        size="small"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        displayEmpty
        sx={{ ml: 1, minWidth: 200, fontSize: '0.8rem' }}
      >
        <MenuItem value="all">All Courses</MenuItem>
        {courseOptions.map((c) => (
          <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
        ))}
      </Select>
      <Box sx={{ flex: 1 }} />
      <ButtonGroup size="small" sx={{ mr: 1, '& .MuiButton-root': { borderRadius: 0, py: 0.25, px: 1, fontSize: '0.75rem' } }}>
        <Button onClick={() => setStartDate(viewMode === 'month' ? subMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? -7 : -1))}>Prev</Button>
        <Button onClick={() => setStartDate(new Date())}>Today</Button>
        <Button onClick={() => setStartDate(viewMode === 'month' ? addMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? 7 : 1))}>Next</Button>
      </ButtonGroup>
      <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, mr: 1 }}>
        {viewMode === 'month' ? format(startDate, 'MMMM yyyy') : `${format(days[0], 'MMM dd')} – ${format(days[days.length - 1], 'MMM dd')}`}
      </Typography>
      <ButtonGroup size="small" sx={{ '& .MuiButton-root': { borderRadius: 0, py: 0.25, px: 1, fontSize: '0.75rem' } }}>
        <Button variant={viewMode === 'day' ? 'contained' : 'outlined'} onClick={() => setViewMode('day')}>Day</Button>
        <Button variant={viewMode === 'week' ? 'contained' : 'outlined'} onClick={() => setViewMode('week')}>Week</Button>
        <Button variant={viewMode === 'month' ? 'contained' : 'outlined'} onClick={() => setViewMode('month')}>Month</Button>
      </ButtonGroup>
    </Paper>
  );
};

const ScheduleGrid = ({ days, items, viewMode }) => {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 0, overflowX: 'auto' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${days.length}, 1fr)`, gap: 0.5, minWidth: '800px' }}>
        {/* Header row */}
        <Box />
        {days.map((d) => (
          <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1, color: '#202F32' }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {viewMode === 'month' ? format(d, 'dd') : format(d, 'dd EEE')}
            </Typography>
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
    </Paper>
  );
};

const AssignmentDialog = ({ open, onClose, onSaved, courses = [], defaultCourseId, editMode = false, initialData = null }) => {
  const [form, setForm] = useState({ title: '', description: '', course: defaultCourseId || '', dueDate: '' });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (editMode && initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        course: initialData.course?._id || initialData.course || defaultCourseId || '',
        dueDate: initialData.dueDate ? format(new Date(initialData.dueDate), 'yyyy-MM-dd') : '',
      });
    } else {
      setForm({ title: '', description: '', course: defaultCourseId || '', dueDate: '' });
    }
  }, [editMode, initialData, defaultCourseId, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Assignment' : 'Create Assignment'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Course" select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              {courses.map((c) => <MenuItem key={c._id || c} value={c._id || c}>{c.title || c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button onClick={() => onSaved(form)} variant="contained" size="small" sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};



const TrainerAssignments = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [tab, setTab] = useState(0);
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [assignments, setAssignments] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // 'day' | 'week' | 'month'
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch trainer courses
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    api.get(`/courses?trainer=${userId}`).then((res) => setCourses(res.data?.data || [])).catch(() => { });
  }, [user]);

  // Fetch assignments for selected course
  useEffect(() => {
    const load = async () => {
      try {
        if (selectedCourse === 'all') {
          // Aggregate from all courses
          const lists = await Promise.all(
            courses.map((c) => api.get(`/assignments/course/${c._id}`).then((r) => ({ course: c, items: r.data?.data || [] })).catch(() => ({ course: c, items: [] })))
          );
          const merged = lists.flatMap(({ course, items }) => items.map((a) => ({ ...a, _course: course })));
          setAssignments(merged);
        } else {
          const r = await api.get(`/assignments/course/${selectedCourse}`);
          const course = courses.find((c) => c._id === selectedCourse);
          setAssignments((r.data?.data || []).map((a) => ({ ...a, _course: course })));
        }
      } catch (e) {
        setAssignments([]);
      }
    };
    load();
  }, [selectedCourse, courses, refreshKey]);

  // Mock items for the planner
  const items = useMemo(() => {
    // Map assignments to planner bars by dueDate (1-day span)
    return assignments.map((a, idx) => ({
      id: a._id || `a-${idx}`,
      title: a._course?.title || 'Course',
      courseTag: a._course?.level || 'EN',
      name: a.title || 'Assignment',
      status: a.status || 'DUE',
      start: a.dueDate ? new Date(a.dueDate) : addDays(startDate, (idx % 5) + 1),
      span: 1,
      color: 'rgba(124,77,255,0.08)',
      border: '#7b68ee',
    }));
  }, [assignments, startDate]);

  const days = useMemo(() => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'month') {
      const s = startOfMonth(startDate);
      const e = endOfMonth(startDate);
      return eachDayOfInterval({ start: s, end: e });
    }
    // week
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });
  }, [startDate, viewMode]);

  return (
    <TrainerLayout title="Assignment Management">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Planner (Schedule)" />
        <Tab label="Submissions" />
        <Tab label="All Assignments" />
      </Tabs>

      {tab === 0 && (
        <>
          <PlannerHeader
            startDate={startDate}
            setStartDate={setStartDate}
            courseOptions={courses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            viewMode={viewMode}
            setViewMode={setViewMode}
            days={days}
          />
          <ScheduleGrid days={days} items={items} viewMode={viewMode} />
        </>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>Submissions</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>No submissions yet. This section will list submissions per assignment with grading status once wired to the API.</Typography>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>All Assignments</Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>Create Assignment</Button>
          </Box>
          {assignments.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#666' }}>No assignments found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {assignments.map((a) => (
                <Grid key={a._id} item xs={12} md={6} lg={4}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32' }}>{a.title}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => setEditingAssignment(a)}
                          sx={{ color: '#FD7E14', '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.1)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>{a._course?.title}</Typography>
                      <Chip size="small" label={a.status || 'DUE'} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766', mr: 1 }} />
                      {a.dueDate && (
                        <Chip size="small" label={`Due ${format(new Date(a.dueDate), 'MMM dd')}`} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* Create Assignment Dialog */}
      <AssignmentDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        defaultCourseId={selectedCourse !== 'all' ? selectedCourse : ''}
        courses={courses}
        editMode={false}
        onSaved={async (form) => {
          try {
            await api.post('/assignments', {
              title: form.title,
              description: form.description,
              course: form.course,
              dueDate: form.dueDate,
            });
            setOpenCreate(false);
            setRefreshKey((k) => k + 1);
          } catch (e) {
            setOpenCreate(false);
          }
        }}
      />

      {/* Edit Assignment Dialog */}
      <AssignmentDialog
        open={!!editingAssignment}
        onClose={() => setEditingAssignment(null)}
        defaultCourseId={selectedCourse !== 'all' ? selectedCourse : ''}
        courses={courses}
        editMode={true}
        initialData={editingAssignment}
        onSaved={async (form) => {
          try {
            await api.put(`/assignments/${editingAssignment._id}`, {
              title: form.title,
              description: form.description,
              course: form.course,
              dueDate: form.dueDate,
            });
            setEditingAssignment(null);
            setRefreshKey((k) => k + 1);
          } catch (e) {
            setEditingAssignment(null);
          }
        }}
      />
    </TrainerLayout>
  );
};

export default TrainerAssignments;


