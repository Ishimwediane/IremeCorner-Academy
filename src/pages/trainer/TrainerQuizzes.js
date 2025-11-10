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
  Tabs,
  Tab,
  Select,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const dayCols = 13;

const PlannerHeader = ({ startDate, setStartDate, onCreate, courseOptions, selectedCourse, setSelectedCourse, viewMode, setViewMode, days }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Button startIcon={<FilterIcon />} sx={{ textTransform: 'none' }}>Filter Settings</Button>
    <Select size="small" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} displayEmpty sx={{ ml: 1, minWidth: 200, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '10px' }}>
      <MenuItem value="all">All Courses</MenuItem>
      {courseOptions.map((c) => (
        <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
      ))}
    </Select>
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
    <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate} sx={{ ml: 2, bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Create</Button>
  </Paper>
);

const ScheduleGrid = ({ days, items, viewMode }) => {
  return (
    <Paper sx={{ p: 2, borderRadius: '16px' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${days.length}, 1fr)`, gap: 0.5 }}>
        <Box />
        {days.map((d) => (
          <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {viewMode === 'month' ? format(d, 'dd') : format(d, 'dd EEE')}
            </Typography>
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

const CreateQuizDialog = ({ open, onClose, onSaved, courses = [], defaultCourseId }) => {
  const [form, setForm] = useState({ title: '', course: defaultCourseId || '', availableOn: '', question: '', options: '', correctIndex: 0 });
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
              {courses.map((c) => <MenuItem key={c._id || c} value={c._id || c}>{c.title || c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Available On" InputLabelProps={{ shrink: true }} value={form.availableOn} onChange={(e) => setForm({ ...form, availableOn: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="First Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Options (comma separated)" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Correct Option Index (0-based)" value={form.correctIndex} onChange={(e) => setForm({ ...form, correctIndex: Number(e.target.value) })} />
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

const TrainerQuizzes = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);
  const [tab, setTab] = useState(0);
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [quizzes, setQuizzes] = useState([]);
  const [viewMode, setViewMode] = useState('week');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    api.get(`/courses?trainer=${userId}`).then((res) => setCourses(res.data?.data || [])).catch(() => {});
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        if (selectedCourse === 'all') {
          const lists = await Promise.all(
            courses.map((c) => api.get(`/assessments/course/${c._id}`).then((r) => ({ course: c, items: r.data?.data?.quizzes || [] })).catch(() => ({ course: c, items: [] })))
          );
          const merged = lists.flatMap(({ course, items }) => items.map((q) => ({ ...q, _course: course })));
          setQuizzes(merged);
        } else {
          const r = await api.get(`/assessments/course/${selectedCourse}`);
          const course = courses.find((c) => c._id === selectedCourse);
          setQuizzes((r.data?.data?.quizzes || []).map((q) => ({ ...q, _course: course })));
        }
      } catch (e) {
        setQuizzes([]);
      }
    };
    load();
  }, [selectedCourse, courses, refreshKey]);

  const items = useMemo(() => quizzes.map((q, idx) => ({
    id: q._id || `q-${idx}`,
    title: q._course?.title || 'Course',
    courseTag: q._course?.level || 'EN',
    name: q.title || 'Quiz',
    questions: q.questions?.length || 0,
    start: q.availableOn ? new Date(q.availableOn) : addDays(new Date(), (idx % 5) + 1),
    span: 1,
    color: 'rgba(33,150,243,0.08)',
    border: '#2196f3',
  })), [quizzes]);

  const days = useMemo(() => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'month') {
      const s = startOfMonth(startDate);
      const e = endOfMonth(startDate);
      return eachDayOfInterval({ start: s, end: e });
    }
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });
  }, [startDate, viewMode]);

  return (
    <TrainerLayout title="Quiz Management">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Planner" />
        <Tab label="Attempts" />
        <Tab label="All Quizzes" />
      </Tabs>

      {tab === 0 && (
        <>
          <PlannerHeader startDate={startDate} setStartDate={setStartDate} onCreate={() => setOpenCreate(true)} courseOptions={courses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} viewMode={viewMode} setViewMode={setViewMode} days={days} />
          <ScheduleGrid days={days} items={items} viewMode={viewMode} />
        </>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>Attempts</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Attempts view coming soon. We will list attempts by student with score, time, and status.</Typography>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>All Quizzes</Typography>
          {quizzes.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#666' }}>No quizzes found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {quizzes.map((q) => (
                <Grid key={q._id} item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32' }}>{q.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>{q._course?.title}</Typography>
                      <Chip size="small" label={`${q.questions?.length || 0} Questions`} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      <CreateQuizDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        defaultCourseId={selectedCourse !== 'all' ? selectedCourse : ''}
        courses={courses}
        onSaved={async (form) => {
          try {
            const payload = {
              title: form.title,
              course: form.course,
              availableOn: form.availableOn || undefined,
              questions: [
                {
                  question: form.question || 'Sample question',
                  options: form.options ? form.options.split(',').map((s) => s.trim()) : ['Option A', 'Option B'],
                  correctAnswer: Number.isInteger(form.correctIndex) ? form.correctIndex : 0,
                  points: 1,
                },
              ],
            };
            await api.post('/quizzes', payload);
            setOpenCreate(false);
            setRefreshKey((k) => k + 1);
          } catch (e) {
            setOpenCreate(false);
          }
        }}
      />
    </TrainerLayout>
  );
};

export default TrainerQuizzes;


